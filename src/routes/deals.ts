import { Hono } from "hono";
import { productsData } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";

const deals = new Hono();

deals.get("/", (c) => {
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
      price_usd: "0.008",
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
    data: results,
  });
});

export default deals;
