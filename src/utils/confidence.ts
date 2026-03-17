import { Product } from "../data/products";

export interface ConfidenceFull {
  score: number;
  factors: string[];
  data_age_hours: number;
}

export type ConfidenceBasic = number;

function daysSinceUpdate(lastUpdated: string): number {
  const updated = new Date(lastUpdated).getTime();
  const now = new Date("2026-03-17").getTime();
  return (now - updated) / (1000 * 60 * 60 * 24);
}

export function calculateProductConfidence(product: Product): ConfidenceFull {
  let score = 70;
  const factors: string[] = ["curated_data"];

  if (product.review_count > 100) {
    score += 10;
    factors.push("high_volume_product");
  }

  // Check price trend stability from price history
  const prices = product.price_history.map((p) => p.price);
  if (prices.length >= 3) {
    const last3 = prices.slice(-3);
    const first = last3[0]!;
    const last = last3[last3.length - 1]!;
    const changePct = Math.abs(((last - first) / first) * 100);
    if (changePct <= 3) {
      score += 10;
      factors.push("stable_pricing");
    }
  }

  if (product.in_stock) {
    score += 5;
    factors.push("in_stock");
  }

  const daysOld = daysSinceUpdate(product.last_updated);
  if (daysOld > 7) {
    score -= 15;
    factors.push("data_older_than_7d");
  } else {
    factors.push("price_verified_24h");
  }

  if (product.discount_pct > 40) {
    score -= 5;
    factors.push("high_discount_warning");
  }

  score = Math.max(0, Math.min(100, score));

  const dataAgeHours = Math.round(daysOld * 24);

  return { score, factors, data_age_hours: dataAgeHours };
}

export function calculateArbitrageConfidence(
  product: Product,
  netMarginPct: number,
  shippingDays: string,
  buyInStock: boolean,
  sellInStock: boolean,
): ConfidenceFull {
  const base = calculateProductConfidence(product);
  let score = base.score;
  const factors = [...base.factors];

  if (netMarginPct > 15) {
    score += 10;
    factors.push("strong_margin");
  }

  // Parse shipping days to check if long
  const parts = shippingDays.split("-");
  const maxDays = parseInt(parts[parts.length - 1] ?? "0", 10);
  if (maxDays >= 14) {
    score -= 10;
    factors.push("long_shipping_risk");
  }

  if (buyInStock && sellInStock) {
    score += 5;
    if (!factors.includes("in_stock")) {
      factors.push("both_regions_in_stock");
    }
  }

  score = Math.max(0, Math.min(100, score));

  return { score, factors, data_age_hours: base.data_age_hours };
}

export function confidenceForTier(
  full: ConfidenceFull,
  tier: string,
): ConfidenceFull | ConfidenceBasic {
  if (tier === "pro") {
    return full;
  }
  return full.score;
}
