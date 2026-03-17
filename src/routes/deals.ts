import { Hono } from "hono";
import { productsData, Product } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";
import { calculateProductConfidence, confidenceForTier } from "../utils/confidence";

interface Env {
  WALLET_ADDRESS: string;
  X402_NETWORK: string;
  USDC_CONTRACT: string;
  FACILITATOR_URL: string;
}

const deals = new Hono<{ Bindings: Env; Variables: { tier: string } }>();

function getDealQualityScore(product: Product): number {
  let score = 50;
  score += Math.min(30, product.discount_pct);
  if (product.rating >= 4.5) score += 10;
  if (product.review_count > 500) score += 5;
  if (product.in_stock) score += 5;
  return Math.min(100, score);
}

function getExpiresEstimate(product: Product): string {
  if (product.deal_type === "Lightning Deal") return "likely 24h";
  if (product.deal_type === "Deal of the Day") return "likely 24h";
  if (product.discount_pct > 30) return "likely 7d";
  return "ongoing";
}

function enrichDeal(product: Product, tier: string) {
  const conf = calculateProductConfidence(product);
  const base: Record<string, unknown> = { ...product };
  base["confidence"] = confidenceForTier(conf, tier);
  if (tier === "pro") {
    base["deal_quality_score"] = getDealQualityScore(product);
    base["expires_estimate"] = getExpiresEstimate(product);
  }
  return base;
}

deals.get("/", (c) => {
  const tier = c.get("tier") || "basic";
  const category = c.req.query("category")?.toLowerCase();
  const minDiscount = parseInt(c.req.query("min_discount") || "10", 10) || 10;
  const limit = Math.min(parseInt(c.req.query("limit") || "10", 10) || 10, 100);

  let results = productsData.filter((p) => p.discount_pct >= minDiscount);

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category);
  }

  results.sort((a, b) => b.discount_pct - a.discount_pct);

  const totalResults = results.length;
  results = results.slice(0, limit);

  return c.json({
    meta: {
      endpoint: "/api/v1/deals",
      tier,
      price_usd: tier === "pro" ? "0.02" : "0.008",
      total_results: totalResults,
      returned: results.length,
      query_params: {
        ...(category && { category }),
        min_discount: minDiscount,
        limit,
      },
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: results.map((p) => enrichDeal(p, tier)),
  });
});

export default deals;
