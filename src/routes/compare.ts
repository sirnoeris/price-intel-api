import { Hono } from "hono";
import { productsData } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";

const compare = new Hono();

compare.get("/", (c) => {
  const asinsParam = c.req.query("asins");

  if (!asinsParam) {
    return c.json(
      {
        error: "asins parameter is required (comma-separated, 2-5 ASINs)",
        example: "/api/v1/compare?asins=B0DFC3RHZ9,B0CX5RTTCG",
      },
      400,
    );
  }

  const asins = asinsParam.split(",").map((a) => a.trim().toUpperCase());

  if (asins.length < 2 || asins.length > 5) {
    return c.json(
      {
        error: "Provide between 2 and 5 ASINs for comparison",
        received: asins.length,
      },
      400,
    );
  }

  const products = asins
    .map((asin) => productsData.find((p) => p.asin === asin))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const notFound = asins.filter(
    (asin) => !products.some((p) => p.asin === asin),
  );

  if (products.length < 2) {
    return c.json(
      {
        error: "Need at least 2 valid products to compare",
        not_found: notFound,
      },
      404,
    );
  }

  // Determine best value: highest (rating / price) ratio
  const scored = products.map((p) => ({
    asin: p.asin,
    title: p.title,
    score: (p.rating / p.current_price) * 1000,
  }));
  scored.sort((a, b) => b.score - a.score);
  const bestValue = scored[0]!;

  const priceRange = {
    lowest: Math.min(...products.map((p) => p.current_price)),
    highest: Math.max(...products.map((p) => p.current_price)),
    spread: Math.max(...products.map((p) => p.current_price)) - Math.min(...products.map((p) => p.current_price)),
  };

  return c.json({
    meta: {
      endpoint: "/api/v1/compare",
      price_usd: "0.015",
      products_compared: products.length,
      ...(notFound.length > 0 && { not_found: notFound }),
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: {
      products: products.map((p) => ({
        asin: p.asin,
        title: p.title,
        brand: p.brand,
        current_price: p.current_price,
        original_price: p.original_price,
        discount_pct: p.discount_pct,
        rating: p.rating,
        review_count: p.review_count,
        deal_type: p.deal_type,
        in_stock: p.in_stock,
        specs: p.specs,
      })),
      price_range: priceRange,
      best_value: {
        asin: bestValue.asin,
        title: bestValue.title,
        reason: "Highest rating-to-price ratio among compared products",
      },
    },
  });
});

export default compare;
