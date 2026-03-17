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

const products = new Hono<{ Bindings: Env; Variables: { tier: string } }>();

function getMarketPosition(product: Product, allProducts: Product[]): string {
  const catProducts = allProducts.filter((p) => p.category === product.category);
  const avgPrice = catProducts.reduce((sum, p) => sum + p.current_price, 0) / catProducts.length;
  if (product.current_price > avgPrice * 1.3) return "premium";
  if (product.current_price < avgPrice * 0.7) return "budget";
  return "mid-range";
}

function getBuySignal(product: Product): string {
  const prices = product.price_history.map((p) => p.price);
  const recent = prices.slice(-4);
  const avg90d = recent.reduce((sum, p) => sum + p, 0) / recent.length;
  const currentVsAvg = ((product.current_price - avg90d) / avg90d) * 100;
  if (currentVsAvg < -10) return "strong_buy";
  if (currentVsAvg < -3) return "buy";
  if (currentVsAvg > 5) return "wait";
  return "hold";
}

function enrichProduct(product: Product, tier: string) {
  const conf = calculateProductConfidence(product);
  const base: Record<string, unknown> = { ...product };
  base["confidence"] = confidenceForTier(conf, tier);
  if (tier === "pro") {
    base["market_position"] = getMarketPosition(product, productsData);
    base["buy_signal"] = getBuySignal(product);
  }
  return base;
}

products.get("/", (c) => {
  const tier = c.get("tier") || "basic";
  const asin = c.req.query("asin");
  const query = c.req.query("q") || c.req.query("query");
  const category = c.req.query("category")?.toLowerCase();
  const brand = c.req.query("brand")?.toLowerCase();
  const minPrice = c.req.query("min_price") ? parseFloat(c.req.query("min_price")!) : undefined;
  const maxPrice = c.req.query("max_price") ? parseFloat(c.req.query("max_price")!) : undefined;
  const onSale = c.req.query("on_sale");
  const sort = c.req.query("sort");
  const limit = Math.min(parseInt(c.req.query("limit") || "25", 10) || 25, 100);

  // Single ASIN lookup
  if (asin) {
    const product = productsData.find((p) => p.asin === asin.toUpperCase());
    if (!product) {
      return c.json(
        {
          error: "Product not found",
          asin,
          hint: "Use /api/v1/products to search or browse all products",
        },
        404,
      );
    }
    return c.json({
      meta: {
        endpoint: "/api/v1/products",
        tier,
        price_usd: tier === "pro" ? "0.012" : "0.005",
        total_results: 1,
        query_params: { asin },
        disclaimer: DISCLAIMER,
        data_version: API_VERSION,
        data_last_updated: DATA_LAST_UPDATED,
      },
      data: [enrichProduct(product, tier)],
    });
  }

  // Filter
  let results: Product[] = [...productsData];

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q),
    );
  }

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category);
  }

  if (brand) {
    results = results.filter((p) => p.brand.toLowerCase() === brand);
  }

  if (minPrice !== undefined) {
    results = results.filter((p) => p.current_price >= minPrice);
  }

  if (maxPrice !== undefined) {
    results = results.filter((p) => p.current_price <= maxPrice);
  }

  if (onSale === "true") {
    results = results.filter((p) => p.discount_pct > 0);
  }

  // Sort
  switch (sort) {
    case "price_asc":
      results.sort((a, b) => a.current_price - b.current_price);
      break;
    case "price_desc":
      results.sort((a, b) => b.current_price - a.current_price);
      break;
    case "discount":
      results.sort((a, b) => b.discount_pct - a.discount_pct);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      results.sort((a, b) => b.review_count - a.review_count);
      break;
  }

  const totalResults = results.length;
  results = results.slice(0, limit);

  return c.json({
    meta: {
      endpoint: "/api/v1/products",
      tier,
      price_usd: tier === "pro" ? "0.025" : "0.01",
      total_results: totalResults,
      returned: results.length,
      query_params: {
        ...(query && { q: query }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(minPrice !== undefined && { min_price: minPrice }),
        ...(maxPrice !== undefined && { max_price: maxPrice }),
        ...(onSale && { on_sale: onSale }),
        ...(sort && { sort }),
        limit,
      },
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: results.map((p) => enrichProduct(p, tier)),
  });
});

export default products;
