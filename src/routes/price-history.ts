import { Hono } from "hono";
import { productsData } from "../data/products";
import { API_VERSION, DATA_LAST_UPDATED, DISCLAIMER } from "../constants";

const priceHistory = new Hono();

priceHistory.get("/", (c) => {
  const asin = c.req.query("asin")?.toUpperCase();

  if (!asin) {
    return c.json(
      {
        error: "asin parameter is required",
        example: "/api/v1/price-history?asin=B0DFC3RHZ9",
      },
      400,
    );
  }

  const product = productsData.find((p) => p.asin === asin);
  if (!product) {
    return c.json(
      {
        error: "Product not found",
        asin,
        hint: "Use /api/v1/products to search for valid ASINs",
      },
      404,
    );
  }

  const prices = product.price_history.map((p) => p.price);
  const lowestPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const lowestDate = product.price_history.find((p) => p.price === lowestPrice)?.date ?? "";
  const highestDate = product.price_history.find((p) => p.price === highestPrice)?.date ?? "";

  // 30-day avg: last 1-2 data points
  const recent30 = product.price_history.slice(-2);
  const avg30d = recent30.reduce((sum, p) => sum + p.price, 0) / recent30.length;

  // 90-day avg: last 3-4 data points
  const recent90 = product.price_history.slice(-4);
  const avg90d = recent90.reduce((sum, p) => sum + p.price, 0) / recent90.length;

  const currentVsAvg = ((product.current_price - avg90d) / avg90d) * 100;

  // Determine trend from last 3 data points
  const lastThree = product.price_history.slice(-3);
  let trend: "rising" | "declining" | "stable" = "stable";
  if (lastThree.length >= 3) {
    const first = lastThree[0]!.price;
    const last = lastThree[lastThree.length - 1]!.price;
    const changePct = ((last - first) / first) * 100;
    if (changePct < -3) trend = "declining";
    else if (changePct > 3) trend = "rising";
  }

  return c.json({
    meta: {
      endpoint: "/api/v1/price-history",
      price_usd: "0.01",
      disclaimer: DISCLAIMER,
      data_version: API_VERSION,
      data_last_updated: DATA_LAST_UPDATED,
    },
    data: {
      asin: product.asin,
      title: product.title,
      current_price: product.current_price,
      price_history: product.price_history,
      analytics: {
        lowest_price: lowestPrice,
        lowest_date: lowestDate,
        highest_price: highestPrice,
        highest_date: highestDate,
        avg_price_30d: Math.round(avg30d * 100) / 100,
        avg_price_90d: Math.round(avg90d * 100) / 100,
        price_trend: trend,
        current_vs_avg: Math.round(currentVsAvg * 10) / 10,
        is_good_deal: product.current_price < avg90d,
      },
    },
  });
});

export default priceHistory;
