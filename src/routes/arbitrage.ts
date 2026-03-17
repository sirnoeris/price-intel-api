import { Hono } from "hono";
import { regionalPricesData } from "../data/regional-prices";
import { tradeRoutes } from "../data/trade-costs";
import { productsData } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";
import { calculateArbitrageConfidence, confidenceForTier } from "../utils/confidence";

interface Env {
  WALLET_ADDRESS: string;
  X402_NETWORK: string;
  USDC_CONTRACT: string;
  FACILITATOR_URL: string;
}

const arbitrage = new Hono<{ Bindings: Env; Variables: { tier: string } }>();

const VALID_REGIONS = ["us", "jp", "sg", "au"] as const;
type Region = (typeof VALID_REGIONS)[number];

function isValidRegion(r: string): r is Region {
  return VALID_REGIONS.includes(r as Region);
}

function getRegionalPrice(asin: string, region: Region) {
  return regionalPricesData.find(
    (rp) => rp.asin === asin && rp.region === region,
  );
}

function getTradeRoute(from: Region, to: Region) {
  return tradeRoutes.find((tr) => tr.from === from && tr.to === to);
}

function calculateProfit(
  buyPrice: number,
  sellPrice: number,
  route: (typeof tradeRoutes)[number],
  platformFeeOverride?: number,
) {
  const shippingUsd = route.shipping_cost_usd;
  const importDutyUsd =
    Math.round(buyPrice * route.import_duty_pct * 100) / 100;
  const salesTaxUsd =
    Math.round(sellPrice * route.sales_tax_pct * 100) / 100;
  const effectivePlatformFeePct = platformFeeOverride !== undefined ? platformFeeOverride : route.platform_fee_pct;
  const platformFeeUsd =
    Math.round(sellPrice * effectivePlatformFeePct * 100) / 100;
  const totalLandedCostUsd =
    Math.round(
      (buyPrice + shippingUsd + importDutyUsd + salesTaxUsd + platformFeeUsd) *
        100,
    ) / 100;
  const netProfitUsd = Math.round((sellPrice - totalLandedCostUsd) * 100) / 100;
  const netMarginPct =
    sellPrice > 0
      ? Math.round((netProfitUsd / sellPrice) * 10000) / 100
      : 0;
  let verdict: "PROFITABLE" | "MARGINAL" | "NOT_PROFITABLE";
  if (netMarginPct >= 10) {
    verdict = "PROFITABLE";
  } else if (netMarginPct >= 0) {
    verdict = "MARGINAL";
  } else {
    verdict = "NOT_PROFITABLE";
  }

  return {
    buy_price_usd: buyPrice,
    shipping_usd: shippingUsd,
    import_duty_usd: importDutyUsd,
    sales_tax_usd: salesTaxUsd,
    platform_fee_usd: platformFeeUsd,
    total_landed_cost_usd: totalLandedCostUsd,
    net_profit_usd: netProfitUsd,
    sell_price_usd: sellPrice,
    net_margin_pct: netMarginPct,
    verdict,
  };
}

function getRiskAssessment(netMarginPct: number, shippingDays: string): string {
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (netMarginPct < 5 || maxDays >= 18) return "high";
  if (netMarginPct < 10 || maxDays >= 14) return "medium";
  return "low";
}

function getExecutionTips(
  buyRegion: string,
  sellRegion: string,
  netMarginPct: number,
  shippingDays: string,
): string[] {
  const tips: string[] = [];
  tips.push(`Buy from Amazon ${buyRegion.toUpperCase()} and list on Amazon ${sellRegion.toUpperCase()}`);
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (maxDays >= 14) {
    tips.push("Consider express shipping to reduce transit time and customer complaints");
  }
  if (netMarginPct > 15) {
    tips.push("Strong margin — consider buying multiple units to amortize shipping");
  }
  if (netMarginPct < 8) {
    tips.push("Thin margin — use platform_fee=0 if selling directly to improve profitability");
  }
  tips.push("Verify current prices before executing — data may lag real-time changes");
  return tips;
}

function getOpportunityScore(
  netMarginPct: number,
  netProfitUsd: number,
  shippingDays: string,
  buyInStock: boolean,
  sellInStock: boolean,
): number {
  let score = 50;
  // Margin factor
  score += Math.min(25, netMarginPct);
  // Profit factor
  if (netProfitUsd > 100) score += 10;
  else if (netProfitUsd > 50) score += 5;
  // Shipping speed
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (maxDays <= 10) score += 10;
  else if (maxDays >= 18) score -= 10;
  // Stock
  if (buyInStock && sellInStock) score += 5;
  return Math.max(0, Math.min(100, Math.round(score)));
}

// GET /calculate
arbitrage.get("/calculate", (c) => {
  const tier = c.get("tier") || "basic";
  const asin = c.req.query("asin")?.toUpperCase();
  const buyFrom = c.req.query("buy_from")?.toLowerCase();
  const sellIn = c.req.query("sell_in")?.toLowerCase();
  const platformFeeParam = c.req.query("platform_fee");
  const platformFeeOverride = platformFeeParam !== undefined ? parseFloat(platformFeeParam) : undefined;

  if (platformFeeOverride !== undefined && (isNaN(platformFeeOverride) || platformFeeOverride < 0 || platformFeeOverride > 1)) {
    return c.json({ error: "platform_fee must be a number between 0 and 1 (e.g., 0.05 for 5%)" }, 400);
  }

  if (!asin || !buyFrom || !sellIn) {
    return c.json(
      {
        error: "Missing required parameters",
        required: { asin: "Product ASIN", buy_from: "Region: us, jp, sg, au", sell_in: "Region: us, jp, sg, au" },
        example: "/api/v1/arbitrage/calculate?asin=B0DFC3RHZ9&buy_from=us&sell_in=au",
      },
      400,
    );
  }

  if (!isValidRegion(buyFrom) || !isValidRegion(sellIn)) {
    return c.json(
      { error: "Invalid region. Must be one of: us, jp, sg, au", buy_from: buyFrom, sell_in: sellIn },
      400,
    );
  }

  if (buyFrom === sellIn) {
    return c.json(
      { error: "buy_from and sell_in must be different regions", buy_from: buyFrom, sell_in: sellIn },
      400,
    );
  }

  const product = productsData.find((p) => p.asin === asin);
  if (!product) {
    return c.json(
      { error: "Product not found", asin, hint: "Use /api/v1/products to search available products" },
      404,
    );
  }

  const buyRegional = getRegionalPrice(asin, buyFrom);
  const sellRegional = getRegionalPrice(asin, sellIn);

  if (!buyRegional || !sellRegional) {
    return c.json(
      { error: "Regional pricing not available for this product/region combination", asin, buy_from: buyFrom, sell_in: sellIn },
      404,
    );
  }

  if (!buyRegional.in_stock) {
    return c.json(
      { error: "Product out of stock in buy region", asin, region: buyFrom, region_name: buyRegional.region_name },
      400,
    );
  }

  if (!sellRegional.in_stock) {
    return c.json(
      { error: "Product out of stock in sell region — no market to sell into", asin, region: sellIn, region_name: sellRegional.region_name },
      400,
    );
  }

  const route = getTradeRoute(buyFrom, sellIn);
  if (!route) {
    return c.json({ error: "Trade route not found", from: buyFrom, to: sellIn }, 404);
  }

  const profit = calculateProfit(buyRegional.usd_price, sellRegional.usd_price, route, platformFeeOverride);
  const conf = calculateArbitrageConfidence(product, profit.net_margin_pct, route.shipping_days, buyRegional.in_stock, sellRegional.in_stock);

  const data: Record<string, unknown> = {
    product: {
      asin: product.asin,
      title: product.title,
      category: product.category,
    },
    buy: {
      region: buyRegional.region,
      region_name: buyRegional.region_name,
      local_price: buyRegional.local_price,
      currency: buyRegional.currency,
      usd_equivalent: buyRegional.usd_price,
    },
    sell: {
      region: sellRegional.region,
      region_name: sellRegional.region_name,
      local_price: sellRegional.local_price,
      currency: sellRegional.currency,
      usd_equivalent: sellRegional.usd_price,
    },
    costs: {
      buy_price_usd: profit.buy_price_usd,
      shipping_usd: profit.shipping_usd,
      import_duty_usd: profit.import_duty_usd,
      sales_tax_usd: profit.sales_tax_usd,
      platform_fee_usd: profit.platform_fee_usd,
      total_landed_cost_usd: profit.total_landed_cost_usd,
    },
    profit: {
      gross_margin_usd: Math.round((profit.sell_price_usd - profit.buy_price_usd) * 100) / 100,
      sell_price_usd: profit.sell_price_usd,
      total_cost_usd: profit.total_landed_cost_usd,
      net_profit_usd: profit.net_profit_usd,
      net_margin_pct: profit.net_margin_pct,
      verdict: profit.verdict,
    },
    confidence: confidenceForTier(conf, tier),
    trade_route: {
      shipping_days: route.shipping_days,
      notes: route.notes,
    },
  };

  if (tier === "pro") {
    data["risk_assessment"] = getRiskAssessment(profit.net_margin_pct, route.shipping_days);
    data["execution_tips"] = getExecutionTips(buyFrom, sellIn, profit.net_margin_pct, route.shipping_days);
  }

  return c.json({
    meta: {
      endpoint: "/api/v1/arbitrage/calculate",
      tier,
      price_usd: tier === "pro" ? "0.045" : "0.02",
      ...(platformFeeOverride !== undefined && { platform_fee_override: platformFeeOverride }),
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data,
  });
});

// GET /scan
arbitrage.get("/scan", (c) => {
  const tier = c.get("tier") || "basic";
  const buyFromParam = c.req.query("buy_from")?.toLowerCase();
  const sellInParam = c.req.query("sell_in")?.toLowerCase();
  const categoryParam = c.req.query("category")?.toLowerCase();
  const minMargin = parseFloat(c.req.query("min_margin") || "5");
  const limit = Math.min(parseInt(c.req.query("limit") || "10", 10) || 10, 50);
  const sort = c.req.query("sort") === "profit" ? "profit" : "margin";
  const platformFeeParam = c.req.query("platform_fee");
  const platformFeeOverride = platformFeeParam !== undefined ? parseFloat(platformFeeParam) : undefined;

  if (platformFeeOverride !== undefined && (isNaN(platformFeeOverride) || platformFeeOverride < 0 || platformFeeOverride > 1)) {
    return c.json({ error: "platform_fee must be a number between 0 and 1 (e.g., 0.05 for 5%)" }, 400);
  }

  if (buyFromParam && !isValidRegion(buyFromParam)) {
    return c.json({ error: "Invalid buy_from region. Must be one of: us, jp, sg, au" }, 400);
  }
  if (sellInParam && !isValidRegion(sellInParam)) {
    return c.json({ error: "Invalid sell_in region. Must be one of: us, jp, sg, au" }, 400);
  }

  const buyRegions: Region[] = buyFromParam && isValidRegion(buyFromParam)
    ? [buyFromParam]
    : [...VALID_REGIONS];
  const sellRegions: Region[] = sellInParam && isValidRegion(sellInParam)
    ? [sellInParam]
    : [...VALID_REGIONS];

  interface Opportunity {
    asin: string;
    title: string;
    category: string;
    buy_region: string;
    buy_price_usd: number;
    sell_region: string;
    sell_price_usd: number;
    total_cost_usd: number;
    net_profit_usd: number;
    net_margin_pct: number;
    verdict: string;
    shipping_days: string;
    confidence: unknown;
    opportunity_score?: number;
  }

  const opportunities: Opportunity[] = [];

  for (const product of productsData) {
    if (categoryParam && product.category.toLowerCase() !== categoryParam) {
      continue;
    }

    for (const buyFrom of buyRegions) {
      for (const sellIn of sellRegions) {
        if (buyFrom === sellIn) continue;

        const buyRegional = getRegionalPrice(product.asin, buyFrom);
        const sellRegional = getRegionalPrice(product.asin, sellIn);
        if (!buyRegional || !sellRegional) continue;
        if (!buyRegional.in_stock || !sellRegional.in_stock) continue;

        const route = getTradeRoute(buyFrom, sellIn);
        if (!route) continue;

        const profit = calculateProfit(buyRegional.usd_price, sellRegional.usd_price, route, platformFeeOverride);

        if (profit.net_margin_pct >= minMargin) {
          const conf = calculateArbitrageConfidence(product, profit.net_margin_pct, route.shipping_days, buyRegional.in_stock, sellRegional.in_stock);

          const opp: Opportunity = {
            asin: product.asin,
            title: product.title,
            category: product.category,
            buy_region: buyFrom,
            buy_price_usd: profit.buy_price_usd,
            sell_region: sellIn,
            sell_price_usd: profit.sell_price_usd,
            total_cost_usd: profit.total_landed_cost_usd,
            net_profit_usd: profit.net_profit_usd,
            net_margin_pct: profit.net_margin_pct,
            verdict: profit.verdict,
            shipping_days: route.shipping_days,
            confidence: confidenceForTier(conf, tier),
          };

          if (tier === "pro") {
            opp.opportunity_score = getOpportunityScore(
              profit.net_margin_pct,
              profit.net_profit_usd,
              route.shipping_days,
              buyRegional.in_stock,
              sellRegional.in_stock,
            );
          }

          opportunities.push(opp);
        }
      }
    }
  }

  if (sort === "profit") {
    opportunities.sort((a, b) => b.net_profit_usd - a.net_profit_usd);
  } else {
    opportunities.sort((a, b) => b.net_margin_pct - a.net_margin_pct);
  }

  const totalOpportunities = opportunities.length;
  const results = opportunities.slice(0, limit);

  return c.json({
    meta: {
      endpoint: "/api/v1/arbitrage/scan",
      tier,
      price_usd: tier === "pro" ? "0.06" : "0.03",
      total_opportunities: totalOpportunities,
      returned: results.length,
      query_params: {
        ...(buyFromParam && { buy_from: buyFromParam }),
        ...(sellInParam && { sell_in: sellInParam }),
        ...(categoryParam && { category: categoryParam }),
        min_margin: minMargin,
        limit,
        sort,
        ...(platformFeeOverride !== undefined && { platform_fee: platformFeeOverride }),
      },
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: results.map((opp, idx) => ({
      rank: idx + 1,
      ...opp,
    })),
  });
});

export default arbitrage;
