import { Hono } from "hono";
import { cors } from "hono/cors";
import { x402 } from "./middleware/x402";
import productsRoutes from "./routes/products";
import priceHistoryRoutes from "./routes/price-history";
import dealsRoutes from "./routes/deals";
import compareRoutes from "./routes/compare";
import arbitrageRoutes from "./routes/arbitrage";
import dailyDigestRoutes from "./routes/daily-digest";

import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER, TIER_OPTIONS } from "./constants";
import { productsData } from "./data/products";
import { regionalPricesData } from "./data/regional-prices";
import { tradeRoutes } from "./data/trade-costs";

interface Env {
  WALLET_ADDRESS: string;
  X402_NETWORK: string;
  USDC_CONTRACT: string;
  FACILITATOR_URL: string;
}

const app = new Hono<{ Bindings: Env; Variables: { tier: string } }>();

// CORS for all origins
app.use("*", cors());

// ─── Free endpoints ─────────────────────────────────────────────────────────

app.get("/", (c) => {
  return c.json({
    name: "Price Intel API",
    version: API_VERSION,
    description:
      "Real-time e-commerce price intelligence for AI agents — product prices, price history, deal detection, and comparison across Amazon electronics. Pay-per-query via x402 (USDC on Base). Supports Basic and Pro tiers via x-tier header.",
    status: "operational",
    documentation: "/api/v1/endpoints",
    x402_discovery: "/.well-known/x402.json",
    tier_options: TIER_OPTIONS,
    coverage: {
      retailers: ["Amazon US", "Amazon Japan", "Amazon Singapore", "Amazon Australia"],
      category: "Electronics",
      products_tracked: productsData.length,
      regions: 4,
      subcategories: ["laptops", "headphones", "smartphones", "tvs_monitors", "tablets", "wearables", "cameras", "gaming", "storage_networking", "smart_home"],
    },
    disclaimer: DISCLAIMER,
  });
});

app.get("/api/v1/endpoints", (c) => {
  return c.json({
    name: "Price Intel API",
    version: API_VERSION,
    payment: {
      protocol: "x402",
      network: c.env.X402_NETWORK || "base-sepolia",
      token: "USDC",
      discovery: "/.well-known/x402.json",
      tiers: {
        basic: "Default tier. Send requests normally or with x-tier: basic header.",
        pro: "Premium tier with confidence scores, analytics, and actionable insights. Send x-tier: pro header.",
      },
    },
    endpoints: [
      {
        path: "/api/v1/sample/products",
        method: "GET",
        description: "FREE — Sample products (3 per category, limited fields). Try before you buy.",
        price_usd: "0 (free)",
        params: {},
        example: "/api/v1/sample/products",
      },
      {
        path: "/api/v1/sample/arbitrage",
        method: "GET",
        description: "FREE — Preview top arbitrage opportunities (raw price spreads only, no cost analysis).",
        price_usd: "0 (free)",
        params: {},
        example: "/api/v1/sample/arbitrage",
      },
      {
        path: "/api/v1/status",
        method: "GET",
        description: "FREE — API health check and data coverage summary.",
        price_usd: "0 (free)",
        params: {},
        example: "/api/v1/status",
      },
      {
        path: "/api/v1/products",
        method: "GET",
        description: "Search and filter electronics products by ASIN, keyword, category, brand, price range. Pro tier adds market_position and buy_signal.",
        price_usd_basic: { single: "0.005", search: "0.01" },
        price_usd_pro: { single: "0.012", search: "0.025" },
        params: {
          asin: "Exact ASIN lookup (e.g., 'B0DFC3RHZ9')",
          q: "Text search across title, brand, category",
          category: "Filter by category: laptops, headphones, smartphones, tvs_monitors, tablets, wearables, cameras, gaming, storage_networking, smart_home",
          brand: "Filter by brand (e.g., 'Apple', 'Samsung', 'Sony')",
          min_price: "Minimum price in USD",
          max_price: "Maximum price in USD",
          on_sale: "If 'true', only products with active discounts",
          sort: "Sort by: price_asc, price_desc, discount, rating, popular",
          limit: "Max results (default 25, max 100)",
        },
        example: "/api/v1/products?category=headphones&on_sale=true&sort=discount",
      },
      {
        path: "/api/v1/price-history",
        method: "GET",
        description: "Get 6-month price history and analytics for a product. Pro tier adds volatility_score, predicted_direction, optimal_buy_window.",
        price_usd_basic: "0.01",
        price_usd_pro: "0.025",
        params: {
          asin: "Product ASIN (required)",
        },
        example: "/api/v1/price-history?asin=B0DFC3RHZ9",
      },
      {
        path: "/api/v1/deals",
        method: "GET",
        description: "Get current best deals sorted by discount percentage. Pro tier adds deal_quality_score and expires_estimate.",
        price_usd_basic: "0.008",
        price_usd_pro: "0.02",
        params: {
          category: "Optional category filter",
          min_discount: "Minimum discount percentage (default 10)",
          limit: "Max results (default 10)",
        },
        example: "/api/v1/deals?category=headphones&min_discount=20",
      },
      {
        path: "/api/v1/compare",
        method: "GET",
        description: "Side-by-side price comparison for 2-5 products with best value recommendation. Pro tier adds detailed_recommendation.",
        price_usd_basic: "0.015",
        price_usd_pro: "0.035",
        params: {
          asins: "Comma-separated list of 2-5 ASINs to compare",
        },
        example: "/api/v1/compare?asins=B0DFC3RHZ9,B0CX5RTTCG,B0C8PSRWFM",
      },
      {
        path: "/api/v1/arbitrage/calculate",
        method: "GET",
        description: "Calculate cross-border arbitrage profit for a product between two Amazon regions. Pro tier adds risk_assessment and execution_tips.",
        price_usd_basic: "0.02",
        price_usd_pro: "0.045",
        params: {
          asin: "Product ASIN (required)",
          buy_from: "Buy region: us, jp, sg, au (required)",
          sell_in: "Sell region: us, jp, sg, au (required)",
          platform_fee: "Override platform fee (0-1, default 0.15). Use 0 for direct sale, 0.05 for low-fee marketplace",
        },
        example: "/api/v1/arbitrage/calculate?asin=B0DFC3RHZ9&buy_from=us&sell_in=au&platform_fee=0.05",
      },
      {
        path: "/api/v1/arbitrage/scan",
        method: "GET",
        description: "Scan for best cross-border arbitrage opportunities across all products and regions. Pro tier adds opportunity_score per result.",
        price_usd_basic: "0.03",
        price_usd_pro: "0.06",
        params: {
          buy_from: "Specific buy region (optional, checks all if omitted)",
          sell_in: "Specific sell region (optional, checks all if omitted)",
          category: "Filter by category",
          min_margin: "Minimum margin percentage (default 5)",
          limit: "Max results (default 10, max 50)",
          sort: "Sort by: margin (default) or profit",
          platform_fee: "Override platform fee (0-1, default 0.15). Use 0 for direct sale",
        },
        example: "/api/v1/arbitrage/scan?sell_in=au&min_margin=10&sort=profit&platform_fee=0.05",
      },
      {
        path: "/api/v1/daily-digest",
        method: "GET",
        description: "Premium daily digest — top 10 curated arbitrage opportunities with full Pro-tier analysis, confidence scores, risk assessments, and execution tips.",
        price_usd: "0.10",
        params: {},
        example: "/api/v1/daily-digest",
      },
    ],
  });
});

// ─── Status / Health endpoint ────────────────────────────────────────────────

app.get("/api/v1/status", (c) => {
  // Count profitable routes
  const VALID_REGIONS = ["us", "jp", "sg", "au"] as const;
  type Region = (typeof VALID_REGIONS)[number];
  let profitableRoutes = 0;
  for (const product of productsData) {
    for (const buyFrom of VALID_REGIONS) {
      for (const sellIn of VALID_REGIONS) {
        if (buyFrom === sellIn) continue;
        const bp = regionalPricesData.find((rp) => rp.asin === product.asin && rp.region === buyFrom);
        const sp = regionalPricesData.find((rp) => rp.asin === product.asin && rp.region === sellIn);
        if (!bp || !sp || !bp.in_stock || !sp.in_stock) continue;
        const route = tradeRoutes.find((tr) => tr.from === (buyFrom as string) && tr.to === (sellIn as string));
        if (!route) continue;
        const spread = sp.usd_price - bp.usd_price - route.shipping_cost_usd;
        if (spread > 0) profitableRoutes++;
      }
    }
  }

  const categories = [...new Set(productsData.map((p) => p.category))];

  return c.json({
    status: "operational",
    version: API_VERSION,
    data_last_updated: DATA_LAST_UPDATED,
    products_tracked: productsData.length,
    regional_prices: regionalPricesData.length,
    profitable_routes: profitableRoutes,
    categories: categories.length,
    regions: 4,
    endpoints_available: 10,
    uptime: "healthy",
    tier_options: TIER_OPTIONS,
    disclaimer: DISCLAIMER,
  });
});

// ─── MCP Server Card (Smithery discovery) ───────────────────────────────────

app.get("/.well-known/mcp/server-card.json", (c) => {
  return c.json({
    serverInfo: {
      name: "Price Intel API",
      version: API_VERSION,
    },
    authentication: {
      required: false,
    },
    tools: [
      {
        name: "search_products",
        description: "Search and filter electronics products by keyword, category, brand, price range. Supports Basic/Pro tiers via x-tier header — Pro includes market position and buy signals.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Text search query" },
            category: { type: "string", description: "Category: laptops, headphones, smartphones, tvs_monitors, tablets, wearables, cameras, gaming, storage_networking, smart_home" },
            brand: { type: "string", description: "Brand name (e.g., Apple, Samsung, Sony)" },
            min_price: { type: "number", description: "Minimum price in USD" },
            max_price: { type: "number", description: "Maximum price in USD" },
            on_sale: { type: "boolean", description: "Only show products on sale" },
            sort: { type: "string", description: "Sort: price_asc, price_desc, discount, rating, popular" },
          },
        },
      },
      {
        name: "get_product",
        description: "Get details for a specific product by ASIN. Pro tier includes market position and buy signal.",
        inputSchema: {
          type: "object",
          properties: {
            asin: { type: "string", description: "Amazon ASIN (e.g., B0DFC3RHZ9)" },
          },
          required: ["asin"],
        },
      },
      {
        name: "get_price_history",
        description: "Get 6-month price history and analytics for a product. Pro tier includes volatility score, predicted direction, and optimal buy window.",
        inputSchema: {
          type: "object",
          properties: {
            asin: { type: "string", description: "Amazon ASIN" },
          },
          required: ["asin"],
        },
      },
      {
        name: "get_deals",
        description: "Get current best deals on electronics sorted by discount. Pro tier includes deal quality score and expiration estimate.",
        inputSchema: {
          type: "object",
          properties: {
            category: { type: "string", description: "Optional category filter" },
            min_discount: { type: "number", description: "Minimum discount percentage (default 10)" },
          },
        },
      },
      {
        name: "compare_products",
        description: "Compare prices and specs across 2-5 products with best value recommendation. Pro tier includes detailed recommendation with reasoning.",
        inputSchema: {
          type: "object",
          properties: {
            asins: { type: "string", description: "Comma-separated list of 2-5 ASINs" },
          },
          required: ["asins"],
        },
      },
      {
        name: "calculate_arbitrage",
        description: "Calculate cross-border arbitrage profit for a product. Shows buy price, sell price, shipping, duties, taxes, platform fees, and net profit. Pro tier includes risk assessment and execution tips.",
        inputSchema: {
          type: "object",
          properties: {
            asin: { type: "string", description: "Product ASIN" },
            buy_from: { type: "string", description: "Buy region: us, jp, sg, au" },
            sell_in: { type: "string", description: "Sell region: us, jp, sg, au" },
            platform_fee: { type: "number", description: "Override platform fee 0-1 (default 0.15). Use 0 for direct sale, 0.05 for low-fee marketplace" },
          },
          required: ["asin", "buy_from", "sell_in"],
        },
      },
      {
        name: "scan_arbitrage",
        description: "Find the best cross-border arbitrage opportunities across Amazon US, Japan, Singapore, and Australia. Returns profitable flips with full cost breakdown. Pro tier includes opportunity score per result.",
        inputSchema: {
          type: "object",
          properties: {
            buy_from: { type: "string", description: "Buy region: us, jp, sg, au (optional)" },
            sell_in: { type: "string", description: "Sell region: us, jp, sg, au (optional)" },
            category: { type: "string", description: "Category filter (optional)" },
            min_margin: { type: "number", description: "Minimum profit margin % (default 5)" },
            platform_fee: { type: "number", description: "Override platform fee 0-1 (default 0.15). Use 0 for direct sale" },
          },
        },
      },
      {
        name: "get_daily_digest",
        description: "Premium daily digest of top 10 curated arbitrage opportunities with full analysis, confidence scores, risk assessments, and execution tips. Always returns Pro-tier data.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_status",
        description: "Free health check — API status, data coverage, and version info.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
    resources: [],
    prompts: [],
  });
});

// ─── x402 Discovery ─────────────────────────────────────────────────────────

app.get("/.well-known/x402.json", (c) => {
  const network = c.env.X402_NETWORK || "base-sepolia";
  const walletAddress = c.env.WALLET_ADDRESS || "";

  const USDC_CONTRACTS: Record<string, string> = {
    base: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    "base-sepolia": "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  };
  const asset = USDC_CONTRACTS[network] ?? c.env.USDC_CONTRACT;

  interface EndpointConfig {
    path: string;
    method: string;
    description: string;
    basicAmountRequired: string;
    basicAmountUSD: string;
    proAmountRequired: string;
    proAmountUSD: string;
  }

  const endpoints: EndpointConfig[] = [
    { path: "/api/v1/products?asin=*", method: "GET", description: "Single product lookup by ASIN", basicAmountRequired: "5000", basicAmountUSD: "0.005", proAmountRequired: "12000", proAmountUSD: "0.012" },
    { path: "/api/v1/products", method: "GET", description: "Search and filter products", basicAmountRequired: "10000", basicAmountUSD: "0.01", proAmountRequired: "25000", proAmountUSD: "0.025" },
    { path: "/api/v1/price-history?asin=*", method: "GET", description: "Price history and analytics for a product", basicAmountRequired: "10000", basicAmountUSD: "0.01", proAmountRequired: "25000", proAmountUSD: "0.025" },
    { path: "/api/v1/deals", method: "GET", description: "Current best deals", basicAmountRequired: "8000", basicAmountUSD: "0.008", proAmountRequired: "20000", proAmountUSD: "0.02" },
    { path: "/api/v1/compare?asins=*", method: "GET", description: "Price comparison for multiple products", basicAmountRequired: "15000", basicAmountUSD: "0.015", proAmountRequired: "35000", proAmountUSD: "0.035" },
    { path: "/api/v1/arbitrage/calculate", method: "GET", description: "Calculate cross-border arbitrage profit", basicAmountRequired: "20000", basicAmountUSD: "0.02", proAmountRequired: "45000", proAmountUSD: "0.045" },
    { path: "/api/v1/arbitrage/scan", method: "GET", description: "Scan for arbitrage opportunities", basicAmountRequired: "30000", basicAmountUSD: "0.03", proAmountRequired: "60000", proAmountUSD: "0.06" },
    { path: "/api/v1/daily-digest", method: "GET", description: "Premium daily digest — top 10 curated arbitrage opportunities with full analysis", basicAmountRequired: "100000", basicAmountUSD: "0.10", proAmountRequired: "100000", proAmountUSD: "0.10" },
  ];

  return c.json({
    x402Version: 2,
    name: "Price Intel API",
    description: "E-commerce price intelligence — product pricing, price history, deal detection, and comparison across Amazon electronics. Pay-per-query via USDC on Base. Supports Basic and Pro tiers via x-tier header.",
    tiers: {
      basic: "Default tier — core data and confidence scores (number only).",
      pro: "Premium tier — full confidence details, analytics, actionable insights. Send x-tier: pro header.",
    },
    endpoints: endpoints.map((ep) => ({
      path: ep.path,
      method: ep.method,
      description: ep.description,
      payment: {
        basic: {
          scheme: "exact",
          network,
          maxAmountRequired: ep.basicAmountRequired,
          amountUSD: ep.basicAmountUSD,
          asset,
          payTo: walletAddress,
          maxTimeoutSeconds: 60,
          mimeType: "application/json",
        },
        pro: {
          scheme: "exact",
          network,
          maxAmountRequired: ep.proAmountRequired,
          amountUSD: ep.proAmountUSD,
          asset,
          payTo: walletAddress,
          maxTimeoutSeconds: 60,
          mimeType: "application/json",
        },
      },
    })),
  });
});

// ─── Free sample endpoints (no x402 payment required) ────────────────────────

// Sample products — 3 per category, limited fields, no price history
app.get("/api/v1/sample/products", (c) => {
  const categories = [...new Set(productsData.map((p) => p.category))];
  const samples = categories.flatMap((cat) => {
    const catProducts = productsData.filter((p) => p.category === cat);
    return catProducts.slice(0, 3).map((p) => ({
      asin: p.asin,
      title: p.title,
      brand: p.brand,
      category: p.category,
      current_price: p.current_price,
      currency: p.currency,
      in_stock: p.in_stock,
      rating: p.rating,
    }));
  });
  return c.json({
    meta: {
      endpoint: "/api/v1/sample/products",
      price_usd: "FREE",
      note: "Sample data — 3 products per category with limited fields. Use paid /api/v1/products for full data including price history, specs, and deals.",
      total_products_available: productsData.length,
      categories,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: samples,
  });
});

// Sample arbitrage — top 3 opportunities, limited details
app.get("/api/v1/sample/arbitrage", (c) => {
  const VALID_REGIONS = ["us", "jp", "sg", "au"] as const;
  type Region = (typeof VALID_REGIONS)[number];

  function getRP(asin: string, region: Region) {
    return regionalPricesData.find((rp) => rp.asin === asin && rp.region === region);
  }

  interface SampleOpp {
    product: string;
    buy_region: string;
    sell_region: string;
    buy_price_usd: number;
    sell_price_usd: number;
    estimated_margin_pct: number;
    note: string;
  }

  const opps: SampleOpp[] = [];
  for (const product of productsData) {
    for (const buyFrom of VALID_REGIONS) {
      for (const sellIn of VALID_REGIONS) {
        if (buyFrom === sellIn) continue;
        const bp = getRP(product.asin, buyFrom);
        const sp = getRP(product.asin, sellIn);
        if (!bp || !sp || !bp.in_stock || !sp.in_stock) continue;
        const rawSpread = ((sp.usd_price - bp.usd_price) / bp.usd_price) * 100;
        if (rawSpread > 40) {
          opps.push({
            product: product.title.slice(0, 60) + (product.title.length > 60 ? "..." : ""),
            buy_region: buyFrom,
            sell_region: sellIn,
            buy_price_usd: bp.usd_price,
            sell_price_usd: sp.usd_price,
            estimated_margin_pct: Math.round(rawSpread * 10) / 10,
            note: "Raw price spread only. Use paid /api/v1/arbitrage/calculate for full cost breakdown including shipping, duties, taxes, and platform fees.",
          });
        }
      }
    }
  }
  opps.sort((a, b) => b.estimated_margin_pct - a.estimated_margin_pct);

  return c.json({
    meta: {
      endpoint: "/api/v1/sample/arbitrage",
      price_usd: "FREE",
      note: "Preview of arbitrage opportunities — raw price spreads only (no cost analysis). Use paid endpoints for full P&L with shipping, duties, taxes.",
      total_opportunities_available: opps.length,
      showing: Math.min(3, opps.length),
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: opps.slice(0, 3),
  });
});

// ─── Paid endpoints ─────────────────────────────────────────────────────────

// Products — dynamic pricing based on ASIN lookup vs search
app.use("/api/v1/products", (c, next) => {
  const asin = c.req.query("asin");
  const basicPrice = asin ? "0.005" : "0.01";
  const proPrice = asin ? "0.012" : "0.025";
  const desc = asin
    ? `Product lookup for ASIN ${asin}`
    : "Product search/listing";
  return x402(basicPrice, proPrice, desc)(c, next);
});
app.route("/api/v1/products", productsRoutes);

// Price History
app.use("/api/v1/price-history", (c, next) => {
  const asin = c.req.query("asin");
  const desc = asin
    ? `Price history for ASIN ${asin}`
    : "Price history query";
  return x402("0.01", "0.025", desc)(c, next);
});
app.route("/api/v1/price-history", priceHistoryRoutes);

// Deals
app.use("/api/v1/deals", (c, next) => {
  const category = c.req.query("category");
  const desc = category
    ? `Best deals in ${category}`
    : "Best deals across all categories";
  return x402("0.008", "0.02", desc)(c, next);
});
app.route("/api/v1/deals", dealsRoutes);

// Compare
app.use("/api/v1/compare", (c, next) => {
  const asins = c.req.query("asins");
  const desc = asins
    ? `Price comparison for ${asins}`
    : "Product price comparison";
  return x402("0.015", "0.035", desc)(c, next);
});
app.route("/api/v1/compare", compareRoutes);

// Daily Digest — premium endpoint, same price for all tiers
app.use("/api/v1/daily-digest", (c, next) => {
  return x402("0.10", "0.10", "Daily digest — top 10 curated arbitrage opportunities")(c, next);
});
app.route("/api/v1/daily-digest", dailyDigestRoutes);

// Arbitrage — dynamic pricing based on sub-path
app.use("/api/v1/arbitrage/*", (c, next) => {
  const path = new URL(c.req.url).pathname;
  if (path.includes("/scan")) {
    const category = c.req.query("category");
    const desc = category ? `Arbitrage scan for ${category}` : "Cross-border arbitrage scan";
    return x402("0.03", "0.06", desc)(c, next);
  }
  // Default: calculate
  const asin = c.req.query("asin");
  const desc = asin ? `Arbitrage calculation for ${asin}` : "Arbitrage calculation";
  return x402("0.02", "0.045", desc)(c, next);
});
app.route("/api/v1/arbitrage", arbitrageRoutes);

export default app;
