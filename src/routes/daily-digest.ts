import { Hono } from "hono";
import { regionalPricesData } from "../data/regional-prices";
import { tradeRoutes } from "../data/trade-costs";
import { productsData } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";
import { calculateArbitrageConfidence } from "../utils/confidence";

interface Env {
  WALLET_ADDRESS: string;
  X402_NETWORK: string;
  USDC_CONTRACT: string;
  FACILITATOR_URL: string;
}

const dailyDigest = new Hono<{ Bindings: Env; Variables: { tier: string } }>();

const VALID_REGIONS = ["us", "jp", "sg", "au"] as const;
type Region = (typeof VALID_REGIONS)[number];

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
) {
  const shippingUsd = route.shipping_cost_usd;
  const importDutyUsd = Math.round(buyPrice * route.import_duty_pct * 100) / 100;
  const salesTaxUsd = Math.round(sellPrice * route.sales_tax_pct * 100) / 100;
  const platformFeeUsd = Math.round(sellPrice * route.platform_fee_pct * 100) / 100;
  const totalLandedCostUsd = Math.round((buyPrice + shippingUsd + importDutyUsd + salesTaxUsd + platformFeeUsd) * 100) / 100;
  const netProfitUsd = Math.round((sellPrice - totalLandedCostUsd) * 100) / 100;
  const netMarginPct = sellPrice > 0 ? Math.round((netProfitUsd / sellPrice) * 10000) / 100 : 0;
  let verdict: "PROFITABLE" | "MARGINAL" | "NOT_PROFITABLE";
  if (netMarginPct >= 10) verdict = "PROFITABLE";
  else if (netMarginPct >= 0) verdict = "MARGINAL";
  else verdict = "NOT_PROFITABLE";

  return { buy_price_usd: buyPrice, sell_price_usd: sellPrice, net_profit_usd: netProfitUsd, net_margin_pct: netMarginPct, total_landed_cost_usd: totalLandedCostUsd, verdict, shipping_usd: shippingUsd };
}

function getRiskAssessment(netMarginPct: number, shippingDays: string): string {
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (netMarginPct < 5 || maxDays >= 18) return "high";
  if (netMarginPct < 10 || maxDays >= 14) return "medium";
  return "low";
}

function getOpportunityScore(netMarginPct: number, netProfitUsd: number, shippingDays: string): number {
  let score = 50;
  score += Math.min(25, netMarginPct);
  if (netProfitUsd > 100) score += 10;
  else if (netProfitUsd > 50) score += 5;
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (maxDays <= 10) score += 10;
  else if (maxDays >= 18) score -= 10;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getExecutionTips(buyRegion: string, sellRegion: string, netMarginPct: number, shippingDays: string): string[] {
  const tips: string[] = [];
  tips.push(`Buy from Amazon ${buyRegion.toUpperCase()} and list on Amazon ${sellRegion.toUpperCase()}`);
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (maxDays >= 14) tips.push("Consider express shipping to reduce transit time");
  if (netMarginPct > 15) tips.push("Strong margin — consider buying multiple units");
  tips.push("Verify current prices before executing");
  return tips;
}

dailyDigest.get("/", (c) => {
  // Daily digest always returns Pro-tier data
  interface DigestEntry {
    rank: number;
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
    opportunity_score: number;
    confidence: { score: number; factors: string[]; data_age_hours: number };
    risk_assessment: string;
    execution_tips: string[];
  }

  const all: DigestEntry[] = [];

  for (const product of productsData) {
    for (const buyFrom of VALID_REGIONS) {
      for (const sellIn of VALID_REGIONS) {
        if (buyFrom === sellIn) continue;
        const buyRegional = getRegionalPrice(product.asin, buyFrom);
        const sellRegional = getRegionalPrice(product.asin, sellIn);
        if (!buyRegional || !sellRegional) continue;
        if (!buyRegional.in_stock || !sellRegional.in_stock) continue;

        const route = getTradeRoute(buyFrom, sellIn);
        if (!route) continue;

        const profit = calculateProfit(buyRegional.usd_price, sellRegional.usd_price, route);
        if (profit.net_margin_pct < 5) continue;

        const conf = calculateArbitrageConfidence(product, profit.net_margin_pct, route.shipping_days, buyRegional.in_stock, sellRegional.in_stock);
        const oppScore = getOpportunityScore(profit.net_margin_pct, profit.net_profit_usd, route.shipping_days);

        all.push({
          rank: 0,
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
          opportunity_score: oppScore,
          confidence: conf,
          risk_assessment: getRiskAssessment(profit.net_margin_pct, route.shipping_days),
          execution_tips: getExecutionTips(buyFrom, sellIn, profit.net_margin_pct, route.shipping_days),
        });
      }
    }
  }

  // Sort by opportunity_score descending
  all.sort((a, b) => b.opportunity_score - a.opportunity_score);
  const top10 = all.slice(0, 10).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return c.json({
    meta: {
      endpoint: "/api/v1/daily-digest",
      tier: "pro",
      price_usd: "0.10",
      date: DATA_LAST_UPDATED,
      total_opportunities_analyzed: all.length,
      returned: top10.length,
      note: "Top 10 arbitrage opportunities ranked by opportunity score. Always includes full Pro-tier analysis.",
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: top10,
  });
});

export default dailyDigest;
