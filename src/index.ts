import { Hono } from "hono";
import { cors } from "hono/cors";
import { x402 } from "./middleware/x402";
import productsRoutes from "./routes/products";
import priceHistoryRoutes from "./routes/price-history";
import dealsRoutes from "./routes/deals";
import compareRoutes from "./routes/compare";

import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "./constants";
import { productsData } from "./data/products";

interface Env {
  WALLET_ADDRESS: string;
  X402_NETWORK: string;
  USDC_CONTRACT: string;
  FACILITATOR_URL: string;
}

const app = new Hono<{ Bindings: Env }>();

// CORS for all origins
app.use("*", cors());

// ─── Free endpoints ─────────────────────────────────────────────────────────

app.get("/", (c) => {
  return c.json({
    name: "Price Intel API",
    version: "1.0.0",
    description:
      "Real-time e-commerce price intelligence for AI agents — product prices, price history, deal detection, and comparison across Amazon electronics. Pay-per-query via x402 (USDC on Base).",
    status: "operational",
    documentation: "/api/v1/endpoints",
    x402_discovery: "/.well-known/x402.json",
    coverage: {
      retailer: "Amazon US",
      category: "Electronics",
      products_tracked: productsData.length,
      subcategories: ["laptops", "headphones", "smartphones", "tvs_monitors", "tablets", "wearables"],
    },
    disclaimer: DISCLAIMER,
  });
});

app.get("/api/v1/endpoints", (c) => {
  return c.json({
    name: "Price Intel API",
    version: "1.0.0",
    payment: {
      protocol: "x402",
      network: c.env.X402_NETWORK || "base-sepolia",
      token: "USDC",
      discovery: "/.well-known/x402.json",
    },
    endpoints: [
      {
        path: "/api/v1/products",
        method: "GET",
        description: "Search and filter electronics products by ASIN, keyword, category, brand, price range",
        price_usd_single: "0.005",
        price_usd_search: "0.01",
        params: {
          asin: "Exact ASIN lookup (e.g., 'B0DFC3RHZ9')",
          q: "Text search across title, brand, category",
          category: "Filter by category: laptops, headphones, smartphones, tvs_monitors, tablets, wearables",
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
        description: "Get 6-month price history and analytics for a product",
        price_usd: "0.01",
        params: {
          asin: "Product ASIN (required)",
        },
        example: "/api/v1/price-history?asin=B0DFC3RHZ9",
      },
      {
        path: "/api/v1/deals",
        method: "GET",
        description: "Get current best deals sorted by discount percentage",
        price_usd: "0.008",
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
        description: "Side-by-side price comparison for 2-5 products with best value recommendation",
        price_usd: "0.015",
        params: {
          asins: "Comma-separated list of 2-5 ASINs to compare",
        },
        example: "/api/v1/compare?asins=B0DFC3RHZ9,B0CX5RTTCG,B0C8PSRWFM",
      },
    ],
  });
});

// ─── MCP Server Card (Smithery discovery) ───────────────────────────────────

app.get("/.well-known/mcp/server-card.json", (c) => {
  return c.json({
    serverInfo: {
      name: "Price Intel API",
      version: "1.0.0",
    },
    authentication: {
      required: false,
    },
    tools: [
      {
        name: "search_products",
        description: "Search and filter electronics products by keyword, category, brand, price range, and more.",
        inputSchema: {
          type: "object",
          properties: {
            q: { type: "string", description: "Text search query" },
            category: { type: "string", description: "Category: laptops, headphones, smartphones, tvs_monitors, tablets, wearables" },
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
        description: "Get details for a specific product by ASIN.",
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
        description: "Get 6-month price history and analytics for a product.",
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
        description: "Get current best deals on electronics sorted by discount.",
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
        description: "Compare prices and specs across 2-5 products with best value recommendation.",
        inputSchema: {
          type: "object",
          properties: {
            asins: { type: "string", description: "Comma-separated list of 2-5 ASINs" },
          },
          required: ["asins"],
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
    maxAmountRequired: string;
    amountUSD: string;
  }

  const endpoints: EndpointConfig[] = [
    { path: "/api/v1/products?asin=*", method: "GET", description: "Single product lookup by ASIN", maxAmountRequired: "5000", amountUSD: "0.005" },
    { path: "/api/v1/products", method: "GET", description: "Search and filter products", maxAmountRequired: "10000", amountUSD: "0.01" },
    { path: "/api/v1/price-history?asin=*", method: "GET", description: "Price history and analytics for a product", maxAmountRequired: "10000", amountUSD: "0.01" },
    { path: "/api/v1/deals", method: "GET", description: "Current best deals", maxAmountRequired: "8000", amountUSD: "0.008" },
    { path: "/api/v1/compare?asins=*", method: "GET", description: "Price comparison for multiple products", maxAmountRequired: "15000", amountUSD: "0.015" },
  ];

  return c.json({
    x402Version: 2,
    name: "Price Intel API",
    description: "E-commerce price intelligence — product pricing, price history, deal detection, and comparison across Amazon electronics. Pay-per-query via USDC on Base.",
    endpoints: endpoints.map((ep) => ({
      path: ep.path,
      method: ep.method,
      description: ep.description,
      payment: {
        scheme: "exact",
        network,
        maxAmountRequired: ep.maxAmountRequired,
        amountUSD: ep.amountUSD,
        asset,
        payTo: walletAddress,
        maxTimeoutSeconds: 60,
        mimeType: "application/json",
      },
    })),
  });
});

// ─── Paid endpoints ─────────────────────────────────────────────────────────

// Products — dynamic pricing based on ASIN lookup vs search
app.use("/api/v1/products", (c, next) => {
  const asin = c.req.query("asin");
  const price = asin ? "0.005" : "0.01";
  const desc = asin
    ? `Product lookup for ASIN ${asin}`
    : "Product search/listing";
  return x402(price, desc)(c, next);
});
app.route("/api/v1/products", productsRoutes);

// Price History
app.use("/api/v1/price-history", (c, next) => {
  const asin = c.req.query("asin");
  const desc = asin
    ? `Price history for ASIN ${asin}`
    : "Price history query";
  return x402("0.01", desc)(c, next);
});
app.route("/api/v1/price-history", priceHistoryRoutes);

// Deals
app.use("/api/v1/deals", (c, next) => {
  const category = c.req.query("category");
  const desc = category
    ? `Best deals in ${category}`
    : "Best deals across all categories";
  return x402("0.008", desc)(c, next);
});
app.route("/api/v1/deals", dealsRoutes);

// Compare
app.use("/api/v1/compare", (c, next) => {
  const asins = c.req.query("asins");
  const desc = asins
    ? `Price comparison for ${asins}`
    : "Product price comparison";
  return x402("0.015", desc)(c, next);
});
app.route("/api/v1/compare", compareRoutes);

export default app;
