export interface RegionalPrice {
  asin: string;
  region: "us" | "jp" | "sg" | "au";
  region_name: string;
  currency: string;
  local_price: number;
  usd_price: number;
  exchange_rate: number;
  in_stock: boolean;
  url: string;
  last_updated: string;
}

// Exchange rates (March 2026)
// USD: 1.0
// JPY: ~150 per USD → rate = 0.00667
// SGD: ~1.35 per USD → rate = 0.741
// AUD: ~1.55 per USD → rate = 0.645

const RATES = {
  USD: 1.0,
  JPY: 0.00667,
  SGD: 0.741,
  AUD: 0.645,
};

const UPDATED = "2026-03-16";

function usd(localPrice: number, rate: number): number {
  return Math.round(localPrice * rate * 100) / 100;
}

function url(asin: string, region: "us" | "jp" | "sg" | "au"): string {
  const domains: Record<string, string> = {
    us: "https://www.amazon.com/dp/",
    jp: "https://www.amazon.co.jp/dp/",
    sg: "https://www.amazon.sg/dp/",
    au: "https://www.amazon.com.au/dp/",
  };
  return domains[region] + asin;
}

function p(
  asin: string,
  region: "us" | "jp" | "sg" | "au",
  regionName: string,
  currency: string,
  localPrice: number,
  rate: number,
  inStock: boolean,
): RegionalPrice {
  return {
    asin,
    region,
    region_name: regionName,
    currency,
    local_price: localPrice,
    usd_price: usd(localPrice, rate),
    exchange_rate: rate,
    in_stock: inStock,
    url: url(asin, region),
    last_updated: UPDATED,
  };
}

export const regionalPricesData: RegionalPrice[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // LAPTOPS (13 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0DW1CLXGK — Apple MacBook Air 15" M5 — US $1249
  p("B0DW1CLXGK", "us", "Amazon US", "USD", 1249, RATES.USD, true),
  p("B0DW1CLXGK", "jp", "Amazon Japan", "JPY", 194700, RATES.JPY, true),  // ~$1298 (+4%)
  p("B0DW1CLXGK", "sg", "Amazon Singapore", "SGD", 1658.00, RATES.SGD, true),  // ~$1228 (-2%)
  p("B0DW1CLXGK", "au", "Amazon Australia", "AUD", 3076.00, RATES.AUD, true),  // ~$1984 (+59%) Australia Tax

  // B0DW1DMRFH — Apple MacBook Air 13" M5 — US $1049
  p("B0DW1DMRFH", "us", "Amazon US", "USD", 1049, RATES.USD, true),
  p("B0DW1DMRFH", "jp", "Amazon Japan", "JPY", 154300, RATES.JPY, true),  // ~$1029 (-2%)
  p("B0DW1DMRFH", "sg", "Amazon Singapore", "SGD", 1533.00, RATES.SGD, true),  // ~$1135 (+8%)
  p("B0DW1DMRFH", "au", "Amazon Australia", "AUD", 2675.00, RATES.AUD, true),  // ~$1725 (+64%) Australia Tax

  // B0DW1NEOMC — Apple MacBook Neo — US $599
  p("B0DW1NEOMC", "us", "Amazon US", "USD", 599, RATES.USD, true),
  p("B0DW1NEOMC", "jp", "Amazon Japan", "JPY", 96500, RATES.JPY, true),  // ~$643 (+7%)
  p("B0DW1NEOMC", "sg", "Amazon Singapore", "SGD", 802.00, RATES.SGD, true),  // ~$594 (-1%)
  p("B0DW1NEOMC", "au", "Amazon Australia", "AUD", 1494.00, RATES.AUD, true),  // ~$963 (+61%) Australia Tax

  // B0DPRQM8KX — Apple MacBook Pro 14" M5 Pro — US $1599
  p("B0DPRQM8KX", "us", "Amazon US", "USD", 1599, RATES.USD, true),
  p("B0DPRQM8KX", "jp", "Amazon Japan", "JPY", 228700, RATES.JPY, true),  // ~$1525 (-5%)
  p("B0DPRQM8KX", "sg", "Amazon Singapore", "SGD", 2181.00, RATES.SGD, true),  // ~$1616 (+1%)
  p("B0DPRQM8KX", "au", "Amazon Australia", "AUD", 4018.00, RATES.AUD, true),  // ~$2591 (+62%) Australia Tax

  // B0DPRQM9LZ — Apple MacBook Pro 16" M5 Max — US $2799
  p("B0DPRQM9LZ", "us", "Amazon US", "USD", 2799, RATES.USD, true),
  p("B0DPRQM9LZ", "jp", "Amazon Japan", "JPY", 400200, RATES.JPY, true),  // ~$2669 (-5%)
  p("B0DPRQM9LZ", "sg", "Amazon Singapore", "SGD", 3807.00, RATES.SGD, false),  // out of stock
  p("B0DPRQM9LZ", "au", "Amazon Australia", "AUD", 7121.00, RATES.AUD, true),  // ~$4593 (+64%) Australia Tax

  // B0CTJLZ4SV — Lenovo ThinkPad E16 Gen 2 — US $999.99
  p("B0CTJLZ4SV", "us", "Amazon US", "USD", 999.99, RATES.USD, true),
  p("B0CTJLZ4SV", "jp", "Amazon Japan", "JPY", 114900, RATES.JPY, true),  // ~$766 (-23%)
  p("B0CTJLZ4SV", "sg", "Amazon Singapore", "SGD", 1243.00, RATES.SGD, true),  // ~$921 (-8%)
  p("B0CTJLZ4SV", "au", "Amazon Australia", "AUD", 2577.00, RATES.AUD, true),  // ~$1662 (+66%) Australia Tax

  // B0CZFRGXMS — Dell XPS 14 (2026) — US $1699
  p("B0CZFRGXMS", "us", "Amazon US", "USD", 1699, RATES.USD, true),
  p("B0CZFRGXMS", "jp", "Amazon Japan", "JPY", 278500, RATES.JPY, true),  // ~$1857 (+9%)
  p("B0CZFRGXMS", "sg", "Amazon Singapore", "SGD", 2089.00, RATES.SGD, true),  // ~$1547 (-9%)
  p("B0CZFRGXMS", "au", "Amazon Australia", "AUD", 4459.00, RATES.AUD, false),  // out of stock

  // B0D36M4NLJ — HP Spectre x360 16 — US $1849.99
  p("B0D36M4NLJ", "us", "Amazon US", "USD", 1849.99, RATES.USD, true),
  p("B0D36M4NLJ", "jp", "Amazon Japan", "JPY", 290600, RATES.JPY, true),  // ~$1938 (+5%)
  p("B0D36M4NLJ", "sg", "Amazon Singapore", "SGD", 2441.00, RATES.SGD, true),  // ~$1808 (-2%)
  p("B0D36M4NLJ", "au", "Amazon Australia", "AUD", 4508.00, RATES.AUD, true),  // ~$2907 (+57%) Australia Tax

  // B0DGJ4F3VC — ASUS ROG Zephyrus G16 — US $2299.99
  p("B0DGJ4F3VC", "us", "Amazon US", "USD", 2299.99, RATES.USD, true),
  p("B0DGJ4F3VC", "jp", "Amazon Japan", "JPY", 284100, RATES.JPY, true),  // ~$1894 (-18%) gaming market discount
  p("B0DGJ4F3VC", "sg", "Amazon Singapore", "SGD", 2878.00, RATES.SGD, true),  // ~$2132 (-7%)
  p("B0DGJ4F3VC", "au", "Amazon Australia", "AUD", 5787.00, RATES.AUD, true),  // ~$3732 (+62%) Australia Tax

  // B0DGJ5H7WD — Razer Blade 16 — US $3499.99
  p("B0DGJ5H7WD", "us", "Amazon US", "USD", 3499.99, RATES.USD, true),
  p("B0DGJ5H7WD", "jp", "Amazon Japan", "JPY", 537100, RATES.JPY, false),  // out of stock
  p("B0DGJ5H7WD", "sg", "Amazon Singapore", "SGD", 4859.00, RATES.SGD, true),  // ~$3600 (+3%)
  p("B0DGJ5H7WD", "au", "Amazon Australia", "AUD", 9032.00, RATES.AUD, true),  // ~$5825 (+66%) Australia Tax

  // B0CZJLN3QR — Lenovo Yoga Pro 9i — US $1899
  p("B0CZJLN3QR", "us", "Amazon US", "USD", 1899, RATES.USD, true),
  p("B0CZJLN3QR", "jp", "Amazon Japan", "JPY", 228600, RATES.JPY, true),  // ~$1524 (-20%)
  p("B0CZJLN3QR", "sg", "Amazon Singapore", "SGD", 2543.00, RATES.SGD, true),  // ~$1884 (-1%)
  p("B0CZJLN3QR", "au", "Amazon Australia", "AUD", 4873.00, RATES.AUD, true),  // ~$3143 (+66%) Australia Tax

  // B0D5BM8JKX — Samsung Galaxy Book5 Pro 360 — US $1349.99
  p("B0D5BM8JKX", "us", "Amazon US", "USD", 1349.99, RATES.USD, true),
  p("B0D5BM8JKX", "jp", "Amazon Japan", "JPY", 272500, RATES.JPY, true),  // ~$1817 (+35%) Samsung JP markup
  p("B0D5BM8JKX", "sg", "Amazon Singapore", "SGD", 1099.00, RATES.SGD, true),  // ~$814 (-40%) SG HQ pricing
  p("B0D5BM8JKX", "au", "Amazon Australia", "AUD", 3615.00, RATES.AUD, true),  // ~$2331 (+73%) Australia Tax

  // B0CTKNV3PQ — Acer Swift X 14 — US $1099.99
  p("B0CTKNV3PQ", "us", "Amazon US", "USD", 1099.99, RATES.USD, true),
  p("B0CTKNV3PQ", "jp", "Amazon Japan", "JPY", 142800, RATES.JPY, true),  // ~$952 (-13%)
  p("B0CTKNV3PQ", "sg", "Amazon Singapore", "SGD", 1435.00, RATES.SGD, true),  // ~$1063 (-3%)
  p("B0CTKNV3PQ", "au", "Amazon Australia", "AUD", 2849.00, RATES.AUD, true),  // ~$1837 (+67%) Australia Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADPHONES (11 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0DFC3RHZ9 — Apple AirPods Pro 3 — US $189
  p("B0DFC3RHZ9", "us", "Amazon US", "USD", 189, RATES.USD, true),
  p("B0DFC3RHZ9", "jp", "Amazon Japan", "JPY", 29200, RATES.JPY, true),  // ~$194 (+3%)
  p("B0DFC3RHZ9", "sg", "Amazon Singapore", "SGD", 275.00, RATES.SGD, true),  // ~$203 (+8%)
  p("B0DFC3RHZ9", "au", "Amazon Australia", "AUD", 456.00, RATES.AUD, true),  // ~$294 (+56%) Australia Tax

  // B0BDHB9Y8H — Apple AirPods 4 ANC — US $99
  p("B0BDHB9Y8H", "us", "Amazon US", "USD", 99, RATES.USD, true),
  p("B0BDHB9Y8H", "jp", "Amazon Japan", "JPY", 14600, RATES.JPY, true),  // ~$97 (-2%)
  p("B0BDHB9Y8H", "sg", "Amazon Singapore", "SGD", 136.00, RATES.SGD, true),  // ~$100 (+2%)
  p("B0BDHB9Y8H", "au", "Amazon Australia", "AUD", 240.00, RATES.AUD, true),  // ~$154 (+56%) Australia Tax

  // B0D1XD1ZV3 — Apple AirPods Max USB-C — US $549
  p("B0D1XD1ZV3", "us", "Amazon US", "USD", 549, RATES.USD, true),
  p("B0D1XD1ZV3", "jp", "Amazon Japan", "JPY", 80900, RATES.JPY, true),  // ~$539 (-2%)
  p("B0D1XD1ZV3", "sg", "Amazon Singapore", "SGD", 737.00, RATES.SGD, true),  // ~$546 (-1%)
  p("B0D1XD1ZV3", "au", "Amazon Australia", "AUD", 1352.00, RATES.AUD, true),  // ~$872 (+59%) Australia Tax

  // B0CX5RTTCG — Bose QC Ultra Headphones — US $279
  p("B0CX5RTTCG", "us", "Amazon US", "USD", 279, RATES.USD, true),
  p("B0CX5RTTCG", "jp", "Amazon Japan", "JPY", 51800, RATES.JPY, true),  // ~$345 (+24%)
  p("B0CX5RTTCG", "sg", "Amazon Singapore", "SGD", 211.00, RATES.SGD, true),  // ~$156 (-44%) APAC distribution
  p("B0CX5RTTCG", "au", "Amazon Australia", "AUD", 719.00, RATES.AUD, true),  // ~$463 (+66%) Australia Tax

  // B0CX5RV2DT — Bose QC Headphones — US $249
  p("B0CX5RV2DT", "us", "Amazon US", "USD", 249, RATES.USD, true),
  p("B0CX5RV2DT", "jp", "Amazon Japan", "JPY", 44000, RATES.JPY, true),  // ~$293 (+18%)
  p("B0CX5RV2DT", "sg", "Amazon Singapore", "SGD", 184.00, RATES.SGD, true),  // ~$136 (-45%) APAC distribution
  p("B0CX5RV2DT", "au", "Amazon Australia", "AUD", 672.00, RATES.AUD, true),  // ~$433 (+74%) Australia Tax

  // B0C8PSRWFM — Sony WH-1000XM5 — US $298
  p("B0C8PSRWFM", "us", "Amazon US", "USD", 298, RATES.USD, true),
  p("B0C8PSRWFM", "jp", "Amazon Japan", "JPY", 26800, RATES.JPY, true),  // ~$178 (-40%) home market
  p("B0C8PSRWFM", "sg", "Amazon Singapore", "SGD", 348.00, RATES.SGD, true),  // ~$257 (-13%)
  p("B0C8PSRWFM", "au", "Amazon Australia", "AUD", 773.00, RATES.AUD, true),  // ~$498 (+67%) Australia Tax

  // B0C8PTLZ7K — Sony WF-C700N Earbuds — US $98
  p("B0C8PTLZ7K", "us", "Amazon US", "USD", 98, RATES.USD, true),
  p("B0C8PTLZ7K", "jp", "Amazon Japan", "JPY", 9000, RATES.JPY, true),  // ~$60 (-39%) home market
  p("B0C8PTLZ7K", "sg", "Amazon Singapore", "SGD", 106.00, RATES.SGD, true),  // ~$78 (-20%)
  p("B0C8PTLZ7K", "au", "Amazon Australia", "AUD", 259.00, RATES.AUD, true),  // ~$167 (+70%) Australia Tax

  // B0D7RTCJNB — Samsung Galaxy Buds3 Pro — US $99.99
  p("B0D7RTCJNB", "us", "Amazon US", "USD", 99.99, RATES.USD, true),
  p("B0D7RTCJNB", "jp", "Amazon Japan", "JPY", 20200, RATES.JPY, true),  // ~$134 (+35%) Samsung JP markup
  p("B0D7RTCJNB", "sg", "Amazon Singapore", "SGD", 86.00, RATES.SGD, true),  // ~$63 (-36%) SG HQ pricing
  p("B0D7RTCJNB", "au", "Amazon Australia", "AUD", 268.00, RATES.AUD, true),  // ~$172 (+73%) Australia Tax

  // B0D1RXFQVZ — Sony WF-1000XM6 — US $228
  p("B0D1RXFQVZ", "us", "Amazon US", "USD", 228, RATES.USD, true),
  p("B0D1RXFQVZ", "jp", "Amazon Japan", "JPY", 20700, RATES.JPY, true),  // ~$138 (-39%) home market
  p("B0D1RXFQVZ", "sg", "Amazon Singapore", "SGD", 276.00, RATES.SGD, true),  // ~$204 (-10%)
  p("B0D1RXFQVZ", "au", "Amazon Australia", "AUD", 622.00, RATES.AUD, true),  // ~$401 (+76%) Australia Tax

  // B0CX5RQWKL — Bose QC Ultra Earbuds — US $229
  p("B0CX5RQWKL", "us", "Amazon US", "USD", 229, RATES.USD, true),
  p("B0CX5RQWKL", "jp", "Amazon Japan", "JPY", 40600, RATES.JPY, true),  // ~$270 (+18%)
  p("B0CX5RQWKL", "sg", "Amazon Singapore", "SGD", 159.00, RATES.SGD, true),  // ~$117 (-49%) APAC distribution
  p("B0CX5RQWKL", "au", "Amazon Australia", "AUD", 587.00, RATES.AUD, true),  // ~$378 (+65%) Australia Tax

  // B0CZJKN8DP — Sennheiser MOMENTUM TW 4 — US $249.95
  p("B0CZJKN8DP", "us", "Amazon US", "USD", 249.95, RATES.USD, true),
  p("B0CZJKN8DP", "jp", "Amazon Japan", "JPY", 43000, RATES.JPY, true),  // ~$286 (+15%)
  p("B0CZJKN8DP", "sg", "Amazon Singapore", "SGD", 189.00, RATES.SGD, true),  // ~$140 (-44%) APAC distribution
  p("B0CZJKN8DP", "au", "Amazon Australia", "AUD", 683.00, RATES.AUD, false),  // out of stock

  // ═══════════════════════════════════════════════════════════════════════════
  // SMARTPHONES (8 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0DK4N9ZV3 — Apple iPhone 17 Pro Max — US $1099
  p("B0DK4N9ZV3", "us", "Amazon US", "USD", 1099, RATES.USD, true),
  p("B0DK4N9ZV3", "jp", "Amazon Japan", "JPY", 176700, RATES.JPY, true),  // ~$1178 (+7%)
  p("B0DK4N9ZV3", "sg", "Amazon Singapore", "SGD", 1519.00, RATES.SGD, true),  // ~$1125 (+2%)
  p("B0DK4N9ZV3", "au", "Amazon Australia", "AUD", 2797.00, RATES.AUD, true),  // ~$1804 (+64%) Australia Tax

  // B0DK4N8YW2 — Apple iPhone 17 Pro — US $999
  p("B0DK4N8YW2", "us", "Amazon US", "USD", 999, RATES.USD, true),
  p("B0DK4N8YW2", "jp", "Amazon Japan", "JPY", 150600, RATES.JPY, true),  // ~$1004 (+1%)
  p("B0DK4N8YW2", "sg", "Amazon Singapore", "SGD", 1494.00, RATES.SGD, true),  // ~$1107 (+11%)
  p("B0DK4N8YW2", "au", "Amazon Australia", "AUD", 2500.00, RATES.AUD, true),  // ~$1612 (+61%) Australia Tax

  // B0DK4N7XV1 — Apple iPhone 17 — US $799
  p("B0DK4N7XV1", "us", "Amazon US", "USD", 799, RATES.USD, true),
  p("B0DK4N7XV1", "jp", "Amazon Japan", "JPY", 118200, RATES.JPY, true),  // ~$788 (-1%)
  p("B0DK4N7XV1", "sg", "Amazon Singapore", "SGD", 1094.00, RATES.SGD, true),  // ~$810 (+1%)
  p("B0DK4N7XV1", "au", "Amazon Australia", "AUD", 2017.00, RATES.AUD, true),  // ~$1300 (+63%) Australia Tax

  // B0DFRN2QRS — Samsung Galaxy S26 Ultra — US $1199.99
  p("B0DFRN2QRS", "us", "Amazon US", "USD", 1199.99, RATES.USD, true),
  p("B0DFRN2QRS", "jp", "Amazon Japan", "JPY", 224300, RATES.JPY, true),  // ~$1496 (+25%) Samsung JP markup
  p("B0DFRN2QRS", "sg", "Amazon Singapore", "SGD", 1023.00, RATES.SGD, true),  // ~$758 (-37%) SG HQ pricing
  p("B0DFRN2QRS", "au", "Amazon Australia", "AUD", 3304.00, RATES.AUD, true),  // ~$2131 (+78%) Australia Tax

  // B0DFRN3STU — Samsung Galaxy S26 — US $799.99
  p("B0DFRN3STU", "us", "Amazon US", "USD", 799.99, RATES.USD, true),
  p("B0DFRN3STU", "jp", "Amazon Japan", "JPY", 151800, RATES.JPY, true),  // ~$1012 (+27%) Samsung JP markup
  p("B0DFRN3STU", "sg", "Amazon Singapore", "SGD", 627.00, RATES.SGD, true),  // ~$464 (-42%) SG HQ pricing
  p("B0DFRN3STU", "au", "Amazon Australia", "AUD", 2220.00, RATES.AUD, true),  // ~$1431 (+79%) Australia Tax

  // B0D5BQJK7R — Google Pixel 10 Pro — US $899
  p("B0D5BQJK7R", "us", "Amazon US", "USD", 899, RATES.USD, true),
  p("B0D5BQJK7R", "jp", "Amazon Japan", "JPY", 148400, RATES.JPY, true),  // ~$989 (+10%)
  p("B0D5BQJK7R", "sg", "Amazon Singapore", "SGD", 1180.00, RATES.SGD, true),  // ~$874 (-3%)
  p("B0D5BQJK7R", "au", "Amazon Australia", "AUD", 2142.00, RATES.AUD, false),  // out of stock

  // B0D5BQKL8S — Google Pixel 10 — US $649
  p("B0D5BQKL8S", "us", "Amazon US", "USD", 649, RATES.USD, true),
  p("B0D5BQKL8S", "jp", "Amazon Japan", "JPY", 101700, RATES.JPY, true),  // ~$678 (+5%)
  p("B0D5BQKL8S", "sg", "Amazon Singapore", "SGD", 918.00, RATES.SGD, true),  // ~$680 (+5%)
  p("B0D5BQKL8S", "au", "Amazon Australia", "AUD", 1651.00, RATES.AUD, true),  // ~$1064 (+64%) Australia Tax

  // B0DFRN4VWX — Samsung Galaxy Z Flip 7 — US $949.99
  p("B0DFRN4VWX", "us", "Amazon US", "USD", 949.99, RATES.USD, true),
  p("B0DFRN4VWX", "jp", "Amazon Japan", "JPY", 180800, RATES.JPY, true),  // ~$1205 (+27%) Samsung JP markup
  p("B0DFRN4VWX", "sg", "Amazon Singapore", "SGD", 717.00, RATES.SGD, true),  // ~$531 (-44%) SG HQ pricing
  p("B0DFRN4VWX", "au", "Amazon Australia", "AUD", 2509.00, RATES.AUD, true),  // ~$1618 (+70%) Australia Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // TVS & MONITORS (9 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0CV5VN4Q3 — Samsung 55" S90F OLED 4K — US $1097.99
  p("B0CV5VN4Q3", "us", "Amazon US", "USD", 1097.99, RATES.USD, true),
  p("B0CV5VN4Q3", "jp", "Amazon Japan", "JPY", 222100, RATES.JPY, true),  // ~$1481 (+35%) Samsung JP markup
  p("B0CV5VN4Q3", "sg", "Amazon Singapore", "SGD", 925.00, RATES.SGD, true),  // ~$685 (-38%) SG HQ pricing
  p("B0CV5VN4Q3", "au", "Amazon Australia", "AUD", 3040.00, RATES.AUD, true),  // ~$1960 (+79%) Australia Tax

  // B0CV5VN5R4 — Samsung 55" Neo QLED QN80F — US $697.99
  p("B0CV5VN5R4", "us", "Amazon US", "USD", 697.99, RATES.USD, true),
  p("B0CV5VN5R4", "jp", "Amazon Japan", "JPY", 139200, RATES.JPY, true),  // ~$928 (+33%) Samsung JP markup
  p("B0CV5VN5R4", "sg", "Amazon Singapore", "SGD", 520.00, RATES.SGD, true),  // ~$385 (-45%) SG HQ pricing
  p("B0CV5VN5R4", "au", "Amazon Australia", "AUD", 1895.00, RATES.AUD, true),  // ~$1222 (+75%) Australia Tax

  // B0D7RJK2MN — Samsung 27" Odyssey OLED G5 Gaming Monitor — US $349.99
  p("B0D7RJK2MN", "us", "Amazon US", "USD", 349.99, RATES.USD, true),
  p("B0D7RJK2MN", "jp", "Amazon Japan", "JPY", 68500, RATES.JPY, true),  // ~$456 (+31%) Samsung JP markup
  p("B0D7RJK2MN", "sg", "Amazon Singapore", "SGD", 295.00, RATES.SGD, true),  // ~$218 (-38%) SG HQ pricing
  p("B0D7RJK2MN", "au", "Amazon Australia", "AUD", 916.00, RATES.AUD, true),  // ~$590 (+69%) Australia Tax

  // B0CWB5FTLV — LG 55" B5 OLED 4K — US $896.99
  p("B0CWB5FTLV", "us", "Amazon US", "USD", 896.99, RATES.USD, true),
  p("B0CWB5FTLV", "jp", "Amazon Japan", "JPY", 104900, RATES.JPY, true),  // ~$699 (-22%) Korean brand discount JP
  p("B0CWB5FTLV", "sg", "Amazon Singapore", "SGD", 830.00, RATES.SGD, true),  // ~$615 (-31%)
  p("B0CWB5FTLV", "au", "Amazon Australia", "AUD", 2351.00, RATES.AUD, true),  // ~$1516 (+69%) Australia Tax

  // B0CWB5GUMW — LG 65" C5 OLED evo 4K — US $1696.99
  p("B0CWB5GUMW", "us", "Amazon US", "USD", 1696.99, RATES.USD, true),
  p("B0CWB5GUMW", "jp", "Amazon Japan", "JPY", 191700, RATES.JPY, true),  // ~$1278 (-25%) Korean brand discount JP
  p("B0CWB5GUMW", "sg", "Amazon Singapore", "SGD", 1840.00, RATES.SGD, false),  // out of stock
  p("B0CWB5GUMW", "au", "Amazon Australia", "AUD", 4611.00, RATES.AUD, true),  // ~$2974 (+75%) Australia Tax

  // B0D7RJK3NO — Dell UltraSharp 27 4K Monitor — US $479.99
  p("B0D7RJK3NO", "us", "Amazon US", "USD", 479.99, RATES.USD, true),
  p("B0D7RJK3NO", "jp", "Amazon Japan", "JPY", 73200, RATES.JPY, true),  // ~$488 (+2%)
  p("B0D7RJK3NO", "sg", "Amazon Singapore", "SGD", 635.00, RATES.SGD, true),  // ~$470 (-2%)
  p("B0D7RJK3NO", "au", "Amazon Australia", "AUD", 1194.00, RATES.AUD, true),  // ~$770 (+60%) Australia Tax

  // B0CWBLNHPQ — Apple TV 4K — US $149
  p("B0CWBLNHPQ", "us", "Amazon US", "USD", 149, RATES.USD, true),
  p("B0CWBLNHPQ", "jp", "Amazon Japan", "JPY", 24100, RATES.JPY, true),  // ~$160 (+8%)
  p("B0CWBLNHPQ", "sg", "Amazon Singapore", "SGD", 222.00, RATES.SGD, true),  // ~$164 (+10%)
  p("B0CWBLNHPQ", "au", "Amazon Australia", "AUD", 368.00, RATES.AUD, true),  // ~$237 (+59%) Australia Tax

  // B0D7RJK4OP — ASUS ROG Swift OLED Gaming Monitor — US $799.99
  p("B0D7RJK4OP", "us", "Amazon US", "USD", 799.99, RATES.USD, true),
  p("B0D7RJK4OP", "jp", "Amazon Japan", "JPY", 93500, RATES.JPY, true),  // ~$623 (-22%) gaming market discount
  p("B0D7RJK4OP", "sg", "Amazon Singapore", "SGD", 1042.00, RATES.SGD, true),  // ~$772 (-3%)
  p("B0D7RJK4OP", "au", "Amazon Australia", "AUD", 2023.00, RATES.AUD, true),  // ~$1304 (+63%) Australia Tax

  // B0CV5VN6S5 — Samsung 65" S95F QD-OLED 4K — US $2497.99
  p("B0CV5VN6S5", "us", "Amazon US", "USD", 2497.99, RATES.USD, true),
  p("B0CV5VN6S5", "jp", "Amazon Japan", "JPY", 493100, RATES.JPY, true),  // ~$3288 (+32%) Samsung JP markup
  p("B0CV5VN6S5", "sg", "Amazon Singapore", "SGD", 2109.00, RATES.SGD, true),  // ~$1562 (-37%) SG HQ pricing
  p("B0CV5VN6S5", "au", "Amazon Australia", "AUD", 6812.00, RATES.AUD, true),  // ~$4393 (+76%) Australia Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // TABLETS (7 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0DD2G1LQN — Apple iPad Air 13" M3 — US $799
  p("B0DD2G1LQN", "us", "Amazon US", "USD", 799, RATES.USD, true),
  p("B0DD2G1LQN", "jp", "Amazon Japan", "JPY", 122700, RATES.JPY, true),  // ~$818 (+2%)
  p("B0DD2G1LQN", "sg", "Amazon Singapore", "SGD", 1057.00, RATES.SGD, true),  // ~$783 (-2%)
  p("B0DD2G1LQN", "au", "Amazon Australia", "AUD", 1976.00, RATES.AUD, true),  // ~$1274 (+60%) Australia Tax

  // B0DD2G2MRO — Apple iPad Air 11" M3 — US $599
  p("B0DD2G2MRO", "us", "Amazon US", "USD", 599, RATES.USD, true),
  p("B0DD2G2MRO", "jp", "Amazon Japan", "JPY", 85600, RATES.JPY, true),  // ~$570 (-5%)
  p("B0DD2G2MRO", "sg", "Amazon Singapore", "SGD", 897.00, RATES.SGD, true),  // ~$664 (+11%)
  p("B0DD2G2MRO", "au", "Amazon Australia", "AUD", 1554.00, RATES.AUD, true),  // ~$1002 (+67%) Australia Tax

  // B0DD2G3NSP — Apple iPad Pro 13" M5 — US $1299
  p("B0DD2G3NSP", "us", "Amazon US", "USD", 1299, RATES.USD, true),
  p("B0DD2G3NSP", "jp", "Amazon Japan", "JPY", 207700, RATES.JPY, true),  // ~$1385 (+7%)
  p("B0DD2G3NSP", "sg", "Amazon Singapore", "SGD", 1793.00, RATES.SGD, true),  // ~$1328 (+2%)
  p("B0DD2G3NSP", "au", "Amazon Australia", "AUD", 3138.00, RATES.AUD, true),  // ~$2024 (+56%) Australia Tax

  // B0D5BMJK9T — Samsung Galaxy Tab S10 FE — US $449.99
  p("B0D5BMJK9T", "us", "Amazon US", "USD", 449.99, RATES.USD, true),
  p("B0D5BMJK9T", "jp", "Amazon Japan", "JPY", 89900, RATES.JPY, true),  // ~$599 (+33%) Samsung JP markup
  p("B0D5BMJK9T", "sg", "Amazon Singapore", "SGD", 415.00, RATES.SGD, true),  // ~$307 (-32%) SG HQ pricing
  p("B0D5BMJK9T", "au", "Amazon Australia", "AUD", 1160.00, RATES.AUD, true),  // ~$748 (+66%) Australia Tax

  // B0D5BMKL0U — Samsung Galaxy Tab S10 Ultra — US $1049.99
  p("B0D5BMKL0U", "us", "Amazon US", "USD", 1049.99, RATES.USD, true),
  p("B0D5BMKL0U", "jp", "Amazon Japan", "JPY", 201200, RATES.JPY, true),  // ~$1342 (+28%) Samsung JP markup
  p("B0D5BMKL0U", "sg", "Amazon Singapore", "SGD", 793.00, RATES.SGD, true),  // ~$587 (-44%) SG HQ pricing
  p("B0D5BMKL0U", "au", "Amazon Australia", "AUD", 2859.00, RATES.AUD, true),  // ~$1844 (+76%) Australia Tax

  // B0DD2G4OTQ — Apple iPad (A16) 10th Gen — US $349
  p("B0DD2G4OTQ", "us", "Amazon US", "USD", 349, RATES.USD, true),
  p("B0DD2G4OTQ", "jp", "Amazon Japan", "JPY", 55300, RATES.JPY, true),  // ~$368 (+6%)
  p("B0DD2G4OTQ", "sg", "Amazon Singapore", "SGD", 470.00, RATES.SGD, true),  // ~$348 (0%)
  p("B0DD2G4OTQ", "au", "Amazon Australia", "AUD", 875.00, RATES.AUD, true),  // ~$564 (+62%) Australia Tax

  // B0D5BMLL1V — Amazon Fire Max 11 — US $229.99
  p("B0D5BMLL1V", "us", "Amazon US", "USD", 229.99, RATES.USD, true),
  p("B0D5BMLL1V", "jp", "Amazon Japan", "JPY", 39900, RATES.JPY, true),  // ~$266 (+16%)
  p("B0D5BMLL1V", "sg", "Amazon Singapore", "SGD", 362.00, RATES.SGD, false),  // out of stock
  p("B0D5BMLL1V", "au", "Amazon Australia", "AUD", 571.00, RATES.AUD, true),  // ~$368 (+60%) Australia Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // WEARABLES (7 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0DGKLM5WX — Apple Watch Series 11 — US $399
  p("B0DGKLM5WX", "us", "Amazon US", "USD", 399, RATES.USD, true),
  p("B0DGKLM5WX", "jp", "Amazon Japan", "JPY", 60400, RATES.JPY, true),  // ~$402 (+1%)
  p("B0DGKLM5WX", "sg", "Amazon Singapore", "SGD", 544.00, RATES.SGD, true),  // ~$403 (+1%)
  p("B0DGKLM5WX", "au", "Amazon Australia", "AUD", 1006.00, RATES.AUD, true),  // ~$648 (+63%) Australia Tax

  // B0DGKLM6XY — Apple Watch Ultra 3 — US $799
  p("B0DGKLM6XY", "us", "Amazon US", "USD", 799, RATES.USD, true),
  p("B0DGKLM6XY", "jp", "Amazon Japan", "JPY", 126000, RATES.JPY, true),  // ~$840 (+5%)
  p("B0DGKLM6XY", "sg", "Amazon Singapore", "SGD", 1087.00, RATES.SGD, true),  // ~$805 (+1%)
  p("B0DGKLM6XY", "au", "Amazon Australia", "AUD", 1974.00, RATES.AUD, true),  // ~$1273 (+59%) Australia Tax

  // B0DGKLM7YZ — Samsung Galaxy Watch 8 Classic — US $369.99
  p("B0DGKLM7YZ", "us", "Amazon US", "USD", 369.99, RATES.USD, true),
  p("B0DGKLM7YZ", "jp", "Amazon Japan", "JPY", 74800, RATES.JPY, true),  // ~$498 (+35%) Samsung JP markup
  p("B0DGKLM7YZ", "sg", "Amazon Singapore", "SGD", 320.00, RATES.SGD, true),  // ~$237 (-36%) SG HQ pricing
  p("B0DGKLM7YZ", "au", "Amazon Australia", "AUD", 982.00, RATES.AUD, true),  // ~$633 (+71%) Australia Tax

  // B0DGKLM8ZA — Samsung Galaxy Watch 8 — US $249.99
  p("B0DGKLM8ZA", "us", "Amazon US", "USD", 249.99, RATES.USD, true),
  p("B0DGKLM8ZA", "jp", "Amazon Japan", "JPY", 48100, RATES.JPY, true),  // ~$320 (+28%) Samsung JP markup
  p("B0DGKLM8ZA", "sg", "Amazon Singapore", "SGD", 191.00, RATES.SGD, true),  // ~$141 (-43%) SG HQ pricing
  p("B0DGKLM8ZA", "au", "Amazon Australia", "AUD", 652.00, RATES.AUD, true),  // ~$420 (+68%) Australia Tax

  // B0D5BQML9U — Google Pixel Watch 3 — US $329.99
  p("B0D5BQML9U", "us", "Amazon US", "USD", 329.99, RATES.USD, true),
  p("B0D5BQML9U", "jp", "Amazon Japan", "JPY", 53300, RATES.JPY, true),  // ~$355 (+8%)
  p("B0D5BQML9U", "sg", "Amazon Singapore", "SGD", 464.00, RATES.SGD, true),  // ~$343 (+4%)
  p("B0D5BQML9U", "au", "Amazon Australia", "AUD", 799.00, RATES.AUD, false),  // out of stock

  // B0DGKLM9AB — Garmin Fenix 8 — US $899.99
  p("B0DGKLM9AB", "us", "Amazon US", "USD", 899.99, RATES.USD, true),
  p("B0DGKLM9AB", "jp", "Amazon Japan", "JPY", 100000, RATES.JPY, true),  // ~$667 (-26%)
  p("B0DGKLM9AB", "sg", "Amazon Singapore", "SGD", 923.00, RATES.SGD, true),  // ~$683 (-24%)
  p("B0DGKLM9AB", "au", "Amazon Australia", "AUD", 2328.00, RATES.AUD, true),  // ~$1501 (+67%) Australia Tax

  // B0DGKLMABC — Fitbit Sense 3 — US $249.95
  p("B0DGKLMABC", "us", "Amazon US", "USD", 249.95, RATES.USD, true),
  p("B0DGKLMABC", "jp", "Amazon Japan", "JPY", 37200, RATES.JPY, false),  // out of stock
  p("B0DGKLMABC", "sg", "Amazon Singapore", "SGD", 340.00, RATES.SGD, true),  // ~$251 (+1%)
  p("B0DGKLMABC", "au", "Amazon Australia", "AUD", 632.00, RATES.AUD, true),  // ~$407 (+63%) Australia Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // CAMERAS (10 products) — NEW CATEGORY
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1CAM01 — Sony A7C II — US $1798
  p("B0EX1CAM01", "us", "Amazon US", "USD", 1798, RATES.USD, true),
  p("B0EX1CAM01", "jp", "Amazon Japan", "JPY", 186800, RATES.JPY, true),   // ~$1246 (-31%) Sony home market
  p("B0EX1CAM01", "sg", "Amazon Singapore", "SGD", 2148.00, RATES.SGD, true),  // ~$1591 (-12%) Sony SG
  p("B0EX1CAM01", "au", "Amazon Australia", "AUD", 4727.00, RATES.AUD, true),  // ~$3049 (+70%) AU Tax

  // B0EX1CAM02 — Sony A7R V — US $3498
  p("B0EX1CAM02", "us", "Amazon US", "USD", 3498, RATES.USD, true),
  p("B0EX1CAM02", "jp", "Amazon Japan", "JPY", 369800, RATES.JPY, true),   // ~$2466 (-29%) Sony home market
  p("B0EX1CAM02", "sg", "Amazon Singapore", "SGD", 4150.00, RATES.SGD, true),  // ~$3075 (-12%) Sony SG
  p("B0EX1CAM02", "au", "Amazon Australia", "AUD", 9185.00, RATES.AUD, true),  // ~$5924 (+69%) AU Tax

  // B0EX1CAM03 — Canon EOS R8 — US $1299
  p("B0EX1CAM03", "us", "Amazon US", "USD", 1299, RATES.USD, true),
  p("B0EX1CAM03", "jp", "Amazon Japan", "JPY", 126700, RATES.JPY, true),   // ~$845 (-35%) Canon JP home market
  p("B0EX1CAM03", "sg", "Amazon Singapore", "SGD", 1537.00, RATES.SGD, true),  // ~$1138 (-12%) Canon SG
  p("B0EX1CAM03", "au", "Amazon Australia", "AUD", 3472.00, RATES.AUD, true),  // ~$2239 (+72%) AU Tax

  // B0EX1CAM04 — Canon EOS R5 Mark II — US $3899
  p("B0EX1CAM04", "us", "Amazon US", "USD", 3899, RATES.USD, true),
  p("B0EX1CAM04", "jp", "Amazon Japan", "JPY", 398900, RATES.JPY, true),   // ~$2660 (-32%) Canon JP home market
  p("B0EX1CAM04", "sg", "Amazon Singapore", "SGD", 4653.00, RATES.SGD, false),  // out of stock
  p("B0EX1CAM04", "au", "Amazon Australia", "AUD", 10098.00, RATES.AUD, true),  // ~$6513 (+67%) AU Tax

  // B0EX1CAM05 — Nikon Z6 III — US $2496
  p("B0EX1CAM05", "us", "Amazon US", "USD", 2496, RATES.USD, true),
  p("B0EX1CAM05", "jp", "Amazon Japan", "JPY", 249600, RATES.JPY, true),   // ~$1664 (-33%) Nikon JP home market
  p("B0EX1CAM05", "sg", "Amazon Singapore", "SGD", 2928.00, RATES.SGD, true),  // ~$2169 (-13%) Nikon SG
  p("B0EX1CAM05", "au", "Amazon Australia", "AUD", 6581.00, RATES.AUD, true),  // ~$4244 (+70%) AU Tax

  // B0EX1CAM06 — Fujifilm X-T5 — US $1699
  p("B0EX1CAM06", "us", "Amazon US", "USD", 1699, RATES.USD, true),
  p("B0EX1CAM06", "jp", "Amazon Japan", "JPY", 170900, RATES.JPY, true),   // ~$1139 (-33%) Fuji JP home market
  p("B0EX1CAM06", "sg", "Amazon Singapore", "SGD", 1996.00, RATES.SGD, true),  // ~$1479 (-13%) Fuji SG
  p("B0EX1CAM06", "au", "Amazon Australia", "AUD", 4527.00, RATES.AUD, true),  // ~$2920 (+72%) AU Tax

  // B0EX1CAM07 — Sony ZV-E10 II — US $898
  p("B0EX1CAM07", "us", "Amazon US", "USD", 898, RATES.USD, true),
  p("B0EX1CAM07", "jp", "Amazon Japan", "JPY", 92700, RATES.JPY, true),   // ~$618 (-31%) Sony home market
  p("B0EX1CAM07", "sg", "Amazon Singapore", "SGD", 1070.00, RATES.SGD, true),  // ~$792 (-12%) Sony SG
  p("B0EX1CAM07", "au", "Amazon Australia", "AUD", 2382.00, RATES.AUD, true),  // ~$1536 (+71%) AU Tax

  // B0EX1CAM08 — GoPro HERO13 Black — US $349
  p("B0EX1CAM08", "us", "Amazon US", "USD", 349, RATES.USD, true),
  p("B0EX1CAM08", "jp", "Amazon Japan", "JPY", 55800, RATES.JPY, true),   // ~$372 (+7%) Western brand JP
  p("B0EX1CAM08", "sg", "Amazon Singapore", "SGD", 458.00, RATES.SGD, true),  // ~$339 (-3%)
  p("B0EX1CAM08", "au", "Amazon Australia", "AUD", 896.00, RATES.AUD, true),  // ~$578 (+66%) AU Tax

  // B0EX1CAM09 — DJI Osmo Action 5 Pro — US $349
  p("B0EX1CAM09", "us", "Amazon US", "USD", 349, RATES.USD, false),
  p("B0EX1CAM09", "jp", "Amazon Japan", "JPY", 53900, RATES.JPY, true),   // ~$359 (+3%)
  p("B0EX1CAM09", "sg", "Amazon Singapore", "SGD", 449.00, RATES.SGD, true),  // ~$332 (-5%)
  p("B0EX1CAM09", "au", "Amazon Australia", "AUD", 879.00, RATES.AUD, true),  // ~$567 (+62%) AU Tax

  // B0EX1CAM10 — Insta360 X4 — US $499
  p("B0EX1CAM10", "us", "Amazon US", "USD", 499, RATES.USD, true),
  p("B0EX1CAM10", "jp", "Amazon Japan", "JPY", 79200, RATES.JPY, true),   // ~$528 (+6%)
  p("B0EX1CAM10", "sg", "Amazon Singapore", "SGD", 648.00, RATES.SGD, true),  // ~$480 (-4%)
  p("B0EX1CAM10", "au", "Amazon Australia", "AUD", 1273.00, RATES.AUD, false),  // out of stock

  // ═══════════════════════════════════════════════════════════════════════════
  // GAMING CONSOLES & ACCESSORIES (10 products) — NEW CATEGORY
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1GAM01 — PS5 Pro — US $699
  p("B0EX1GAM01", "us", "Amazon US", "USD", 699, RATES.USD, true),
  p("B0EX1GAM01", "jp", "Amazon Japan", "JPY", 72400, RATES.JPY, true),   // ~$482 (-31%) Sony home market
  p("B0EX1GAM01", "sg", "Amazon Singapore", "SGD", 832.00, RATES.SGD, true),  // ~$616 (-12%) Sony SG
  p("B0EX1GAM01", "au", "Amazon Australia", "AUD", 1847.00, RATES.AUD, true),  // ~$1191 (+70%) AU Tax

  // B0EX1GAM02 — Xbox Series X — US $499
  p("B0EX1GAM02", "us", "Amazon US", "USD", 499, RATES.USD, true),
  p("B0EX1GAM02", "jp", "Amazon Japan", "JPY", 81700, RATES.JPY, true),   // ~$545 (+9%) Western brand JP
  p("B0EX1GAM02", "sg", "Amazon Singapore", "SGD", 662.00, RATES.SGD, true),  // ~$490 (-2%)
  p("B0EX1GAM02", "au", "Amazon Australia", "AUD", 1282.00, RATES.AUD, true),  // ~$827 (+66%) AU Tax

  // B0EX1GAM03 — Nintendo Switch 2 — US $449
  p("B0EX1GAM03", "us", "Amazon US", "USD", 449, RATES.USD, true),
  p("B0EX1GAM03", "jp", "Amazon Japan", "JPY", 52500, RATES.JPY, true),   // ~$350 (-22%) Nintendo JP home market
  p("B0EX1GAM03", "sg", "Amazon Singapore", "SGD", 574.00, RATES.SGD, true),  // ~$425 (-5%) Nintendo SG
  p("B0EX1GAM03", "au", "Amazon Australia", "AUD", 1122.00, RATES.AUD, true),  // ~$723 (+61%) AU Tax

  // B0EX1GAM04 — Steam Deck OLED 1TB — US $649
  p("B0EX1GAM04", "us", "Amazon US", "USD", 649, RATES.USD, false),
  p("B0EX1GAM04", "jp", "Amazon Japan", "JPY", 107200, RATES.JPY, true),   // ~$715 (+10%) Valve JP
  p("B0EX1GAM04", "sg", "Amazon Singapore", "SGD", 872.00, RATES.SGD, false),  // out of stock
  p("B0EX1GAM04", "au", "Amazon Australia", "AUD", 1693.00, RATES.AUD, true),  // ~$1091 (+68%) AU Tax

  // B0EX1GAM05 — PS5 DualSense Edge — US $199
  p("B0EX1GAM05", "us", "Amazon US", "USD", 199, RATES.USD, true),
  p("B0EX1GAM05", "jp", "Amazon Japan", "JPY", 20400, RATES.JPY, true),   // ~$136 (-32%) Sony home market
  p("B0EX1GAM05", "sg", "Amazon Singapore", "SGD", 237.00, RATES.SGD, true),  // ~$175 (-12%) Sony SG
  p("B0EX1GAM05", "au", "Amazon Australia", "AUD", 526.00, RATES.AUD, true),  // ~$339 (+70%) AU Tax

  // B0EX1GAM06 — Xbox Elite Series 2 Core — US $129
  p("B0EX1GAM06", "us", "Amazon US", "USD", 129, RATES.USD, true),
  p("B0EX1GAM06", "jp", "Amazon Japan", "JPY", 21300, RATES.JPY, true),   // ~$142 (+10%) Western brand JP
  p("B0EX1GAM06", "sg", "Amazon Singapore", "SGD", 170.00, RATES.SGD, true),  // ~$125 (-3%)
  p("B0EX1GAM06", "au", "Amazon Australia", "AUD", 337.00, RATES.AUD, true),  // ~$217 (+69%) AU Tax

  // B0EX1GAM07 — Meta Quest 3S — US $299
  p("B0EX1GAM07", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1GAM07", "jp", "Amazon Japan", "JPY", 48100, RATES.JPY, true),   // ~$320 (+7%) Western brand JP
  p("B0EX1GAM07", "sg", "Amazon Singapore", "SGD", 399.00, RATES.SGD, true),  // ~$295 (-1%)
  p("B0EX1GAM07", "au", "Amazon Australia", "AUD", 773.00, RATES.AUD, true),  // ~$498 (+67%) AU Tax

  // B0EX1GAM08 — PlayStation Portal — US $199
  p("B0EX1GAM08", "us", "Amazon US", "USD", 199, RATES.USD, true),
  p("B0EX1GAM08", "jp", "Amazon Japan", "JPY", 20800, RATES.JPY, true),   // ~$138 (-31%) Sony home market
  p("B0EX1GAM08", "sg", "Amazon Singapore", "SGD", 238.00, RATES.SGD, true),  // ~$176 (-12%) Sony SG
  p("B0EX1GAM08", "au", "Amazon Australia", "AUD", 519.00, RATES.AUD, false),  // out of stock

  // B0EX1GAM09 — Razer Kishi Ultra — US $149
  p("B0EX1GAM09", "us", "Amazon US", "USD", 149, RATES.USD, true),
  p("B0EX1GAM09", "jp", "Amazon Japan", "JPY", 24100, RATES.JPY, true),   // ~$160 (+8%) Western brand JP
  p("B0EX1GAM09", "sg", "Amazon Singapore", "SGD", 199.00, RATES.SGD, true),  // ~$147 (-1%)
  p("B0EX1GAM09", "au", "Amazon Australia", "AUD", 383.00, RATES.AUD, true),  // ~$247 (+66%) AU Tax

  // B0EX1GAM10 — 8BitDo Ultimate Controller — US $69
  p("B0EX1GAM10", "us", "Amazon US", "USD", 69, RATES.USD, true),
  p("B0EX1GAM10", "jp", "Amazon Japan", "JPY", 10200, RATES.JPY, true),   // ~$68 (-1%)
  p("B0EX1GAM10", "sg", "Amazon Singapore", "SGD", 91.00, RATES.SGD, true),  // ~$67 (-3%)
  p("B0EX1GAM10", "au", "Amazon Australia", "AUD", 174.00, RATES.AUD, true),  // ~$112 (+63%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // STORAGE & NETWORKING (10 products) — NEW CATEGORY
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1STR01 — Samsung 990 Pro 4TB — US $299
  p("B0EX1STR01", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1STR01", "jp", "Amazon Japan", "JPY", 57100, RATES.JPY, true),   // ~$380 (+27%) Samsung JP markup
  p("B0EX1STR01", "sg", "Amazon Singapore", "SGD", 242.00, RATES.SGD, true),  // ~$179 (-40%) SG HQ pricing
  p("B0EX1STR01", "au", "Amazon Australia", "AUD", 789.00, RATES.AUD, true),  // ~$509 (+70%) AU Tax

  // B0EX1STR02 — WD Black SN850X 4TB — US $279
  p("B0EX1STR02", "us", "Amazon US", "USD", 279, RATES.USD, true),
  p("B0EX1STR02", "jp", "Amazon Japan", "JPY", 44500, RATES.JPY, true),   // ~$296 (+6%)
  p("B0EX1STR02", "sg", "Amazon Singapore", "SGD", 371.00, RATES.SGD, true),  // ~$274 (-2%)
  p("B0EX1STR02", "au", "Amazon Australia", "AUD", 718.00, RATES.AUD, true),  // ~$463 (+66%) AU Tax

  // B0EX1STR03 — Samsung T9 Portable 4TB — US $299
  p("B0EX1STR03", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1STR03", "jp", "Amazon Japan", "JPY", 55800, RATES.JPY, true),   // ~$372 (+24%) Samsung JP markup
  p("B0EX1STR03", "sg", "Amazon Singapore", "SGD", 248.00, RATES.SGD, true),  // ~$183 (-39%) SG HQ pricing
  p("B0EX1STR03", "au", "Amazon Australia", "AUD", 798.00, RATES.AUD, true),  // ~$514 (+72%) AU Tax

  // B0EX1STR04 — Seagate 18TB HDD — US $279
  p("B0EX1STR04", "us", "Amazon US", "USD", 279, RATES.USD, true),
  p("B0EX1STR04", "jp", "Amazon Japan", "JPY", 45500, RATES.JPY, true),   // ~$303 (+9%)
  p("B0EX1STR04", "sg", "Amazon Singapore", "SGD", 368.00, RATES.SGD, true),  // ~$272 (-3%)
  p("B0EX1STR04", "au", "Amazon Australia", "AUD", 721.00, RATES.AUD, false),  // out of stock

  // B0EX1STR05 — ASUS RT-BE96U WiFi 7 Router — US $599
  p("B0EX1STR05", "us", "Amazon US", "USD", 599, RATES.USD, true),
  p("B0EX1STR05", "jp", "Amazon Japan", "JPY", 93200, RATES.JPY, true),   // ~$621 (+4%)
  p("B0EX1STR05", "sg", "Amazon Singapore", "SGD", 794.00, RATES.SGD, true),  // ~$588 (-2%)
  p("B0EX1STR05", "au", "Amazon Australia", "AUD", 1554.00, RATES.AUD, true),  // ~$1002 (+67%) AU Tax

  // B0EX1STR06 — TP-Link Deco BE85 Mesh — US $699
  p("B0EX1STR06", "us", "Amazon US", "USD", 699, RATES.USD, true),
  p("B0EX1STR06", "jp", "Amazon Japan", "JPY", 112300, RATES.JPY, true),   // ~$749 (+7%)
  p("B0EX1STR06", "sg", "Amazon Singapore", "SGD", 926.00, RATES.SGD, true),  // ~$686 (-2%)
  p("B0EX1STR06", "au", "Amazon Australia", "AUD", 1812.00, RATES.AUD, true),  // ~$1168 (+67%) AU Tax

  // B0EX1STR07 — Synology DS224+ NAS — US $299
  p("B0EX1STR07", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1STR07", "jp", "Amazon Japan", "JPY", 48800, RATES.JPY, true),   // ~$325 (+9%)
  p("B0EX1STR07", "sg", "Amazon Singapore", "SGD", 393.00, RATES.SGD, true),  // ~$291 (-3%)
  p("B0EX1STR07", "au", "Amazon Australia", "AUD", 774.00, RATES.AUD, true),  // ~$499 (+67%) AU Tax

  // B0EX1STR08 — UniFi Dream Machine Pro — US $379
  p("B0EX1STR08", "us", "Amazon US", "USD", 379, RATES.USD, false),
  p("B0EX1STR08", "jp", "Amazon Japan", "JPY", 62100, RATES.JPY, true),   // ~$414 (+9%)
  p("B0EX1STR08", "sg", "Amazon Singapore", "SGD", 504.00, RATES.SGD, true),  // ~$373 (-2%)
  p("B0EX1STR08", "au", "Amazon Australia", "AUD", 978.00, RATES.AUD, true),  // ~$630 (+66%) AU Tax

  // B0EX1STR09 — Apple AirTag 4-Pack — US $99
  p("B0EX1STR09", "us", "Amazon US", "USD", 99, RATES.USD, true),
  p("B0EX1STR09", "jp", "Amazon Japan", "JPY", 15200, RATES.JPY, true),   // ~$101 (+2%) Apple JP
  p("B0EX1STR09", "sg", "Amazon Singapore", "SGD", 138.00, RATES.SGD, true),  // ~$102 (+3%) Apple SG
  p("B0EX1STR09", "au", "Amazon Australia", "AUD", 248.00, RATES.AUD, true),  // ~$159 (+61%) AU Tax

  // B0EX1STR10 — Samsung SmartTag2 4-Pack — US $79
  p("B0EX1STR10", "us", "Amazon US", "USD", 79, RATES.USD, true),
  p("B0EX1STR10", "jp", "Amazon Japan", "JPY", 15200, RATES.JPY, true),   // ~$101 (+28%) Samsung JP markup
  p("B0EX1STR10", "sg", "Amazon Singapore", "SGD", 63.00, RATES.SGD, true),  // ~$46 (-41%) SG HQ pricing
  p("B0EX1STR10", "au", "Amazon Australia", "AUD", 212.00, RATES.AUD, true),  // ~$136 (+73%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // SMART HOME (10 products) — NEW CATEGORY
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1SMH01 — Apple HomePod 2nd Gen — US $299
  p("B0EX1SMH01", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1SMH01", "jp", "Amazon Japan", "JPY", 46700, RATES.JPY, true),   // ~$311 (+4%) Apple JP
  p("B0EX1SMH01", "sg", "Amazon Singapore", "SGD", 419.00, RATES.SGD, true),  // ~$310 (+4%) Apple SG
  p("B0EX1SMH01", "au", "Amazon Australia", "AUD", 748.00, RATES.AUD, true),  // ~$482 (+61%) AU Tax

  // B0EX1SMH02 — Amazon Echo Show 15 — US $249
  p("B0EX1SMH02", "us", "Amazon US", "USD", 249, RATES.USD, true),
  p("B0EX1SMH02", "jp", "Amazon Japan", "JPY", 40100, RATES.JPY, true),   // ~$267 (+7%) Amazon JP
  p("B0EX1SMH02", "sg", "Amazon Singapore", "SGD", 336.00, RATES.SGD, true),  // ~$248 (0%)
  p("B0EX1SMH02", "au", "Amazon Australia", "AUD", 643.00, RATES.AUD, true),  // ~$414 (+66%) AU Tax

  // B0EX1SMH03 — Google Nest Hub Max — US $229
  p("B0EX1SMH03", "us", "Amazon US", "USD", 229, RATES.USD, true),
  p("B0EX1SMH03", "jp", "Amazon Japan", "JPY", 37400, RATES.JPY, true),   // ~$249 (+9%)
  p("B0EX1SMH03", "sg", "Amazon Singapore", "SGD", 305.00, RATES.SGD, true),  // ~$226 (-1%)
  p("B0EX1SMH03", "au", "Amazon Australia", "AUD", 586.00, RATES.AUD, true),  // ~$377 (+65%) AU Tax

  // B0EX1SMH04 — Sonos Era 300 — US $449
  p("B0EX1SMH04", "us", "Amazon US", "USD", 449, RATES.USD, true),
  p("B0EX1SMH04", "jp", "Amazon Japan", "JPY", 73800, RATES.JPY, true),   // ~$492 (+10%) Western brand JP
  p("B0EX1SMH04", "sg", "Amazon Singapore", "SGD", 589.00, RATES.SGD, true),  // ~$436 (-3%)
  p("B0EX1SMH04", "au", "Amazon Australia", "AUD", 1163.00, RATES.AUD, true),  // ~$750 (+67%) AU Tax

  // B0EX1SMH05 — Dyson Purifier Big Quiet — US $949
  p("B0EX1SMH05", "us", "Amazon US", "USD", 949, RATES.USD, true),
  p("B0EX1SMH05", "jp", "Amazon Japan", "JPY", 153700, RATES.JPY, true),   // ~$1025 (+8%) Dyson JP
  p("B0EX1SMH05", "sg", "Amazon Singapore", "SGD", 1255.00, RATES.SGD, true),  // ~$929 (-2%) Dyson SG
  p("B0EX1SMH05", "au", "Amazon Australia", "AUD", 2418.00, RATES.AUD, true),  // ~$1559 (+64%) AU Tax

  // B0EX1SMH06 — iRobot Roomba j9+ — US $799
  p("B0EX1SMH06", "us", "Amazon US", "USD", 799, RATES.USD, true),
  p("B0EX1SMH06", "jp", "Amazon Japan", "JPY", 131800, RATES.JPY, true),   // ~$879 (+10%) iRobot JP
  p("B0EX1SMH06", "sg", "Amazon Singapore", "SGD", 1058.00, RATES.SGD, true),  // ~$783 (-2%) iRobot SG
  p("B0EX1SMH06", "au", "Amazon Australia", "AUD", 2052.00, RATES.AUD, false),  // out of stock

  // B0EX1SMH07 — Ecovacs Deebot X2 Omni — US $999
  p("B0EX1SMH07", "us", "Amazon US", "USD", 999, RATES.USD, false),
  p("B0EX1SMH07", "jp", "Amazon Japan", "JPY", 137800, RATES.JPY, true),   // ~$919 (-8%) Chinese brand JP discount
  p("B0EX1SMH07", "sg", "Amazon Singapore", "SGD", 1094.00, RATES.SGD, true),  // ~$810 (-19%) APAC distribution
  p("B0EX1SMH07", "au", "Amazon Australia", "AUD", 2489.00, RATES.AUD, true),  // ~$1605 (+61%) AU Tax

  // B0EX1SMH08 — Ring Video Doorbell Pro 2 — US $249
  p("B0EX1SMH08", "us", "Amazon US", "USD", 249, RATES.USD, true),
  p("B0EX1SMH08", "jp", "Amazon Japan", "JPY", 40800, RATES.JPY, true),   // ~$272 (+9%) Western brand JP
  p("B0EX1SMH08", "sg", "Amazon Singapore", "SGD", 332.00, RATES.SGD, true),  // ~$246 (-1%)
  p("B0EX1SMH08", "au", "Amazon Australia", "AUD", 637.00, RATES.AUD, true),  // ~$410 (+65%) AU Tax

  // B0EX1SMH09 — Arlo Pro 5S 3-Camera Kit — US $499
  p("B0EX1SMH09", "us", "Amazon US", "USD", 499, RATES.USD, true),
  p("B0EX1SMH09", "jp", "Amazon Japan", "JPY", 82200, RATES.JPY, true),   // ~$548 (+10%)
  p("B0EX1SMH09", "sg", "Amazon Singapore", "SGD", 659.00, RATES.SGD, true),  // ~$488 (-2%)
  p("B0EX1SMH09", "au", "Amazon Australia", "AUD", 1293.00, RATES.AUD, true),  // ~$833 (+67%) AU Tax

  // B0EX1SMH10 — Nanoleaf Shapes Hexagons 15-Pack — US $249
  p("B0EX1SMH10", "us", "Amazon US", "USD", 249, RATES.USD, true),
  p("B0EX1SMH10", "jp", "Amazon Japan", "JPY", 39800, RATES.JPY, true),   // ~$265 (+6%)
  p("B0EX1SMH10", "sg", "Amazon Singapore", "SGD", 328.00, RATES.SGD, true),  // ~$243 (-2%)
  p("B0EX1SMH10", "au", "Amazon Australia", "AUD", 639.00, RATES.AUD, true),  // ~$412 (+66%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // LAPTOPS — EXPANSION (+4 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1LAP01 — Microsoft Surface Laptop 7 — US $1299
  p("B0EX1LAP01", "us", "Amazon US", "USD", 1299, RATES.USD, true),
  p("B0EX1LAP01", "jp", "Amazon Japan", "JPY", 207200, RATES.JPY, true),   // ~$1382 (+6%)
  p("B0EX1LAP01", "sg", "Amazon Singapore", "SGD", 1719.00, RATES.SGD, true),  // ~$1273 (-2%)
  p("B0EX1LAP01", "au", "Amazon Australia", "AUD", 3376.00, RATES.AUD, true),  // ~$2177 (+68%) AU Tax

  // B0EX1LAP02 — MacBook Pro 14" M5 — US $1999
  p("B0EX1LAP02", "us", "Amazon US", "USD", 1999, RATES.USD, true),
  p("B0EX1LAP02", "jp", "Amazon Japan", "JPY", 302800, RATES.JPY, true),   // ~$2019 (+1%) Apple JP
  p("B0EX1LAP02", "sg", "Amazon Singapore", "SGD", 2798.00, RATES.SGD, true),  // ~$2073 (+4%) Apple SG
  p("B0EX1LAP02", "au", "Amazon Australia", "AUD", 5022.00, RATES.AUD, true),  // ~$3239 (+62%) AU Tax

  // B0EX1LAP03 — Framework Laptop 16 — US $1399
  p("B0EX1LAP03", "us", "Amazon US", "USD", 1399, RATES.USD, true),
  p("B0EX1LAP03", "jp", "Amazon Japan", "JPY", 228700, RATES.JPY, true),   // ~$1525 (+9%)
  p("B0EX1LAP03", "sg", "Amazon Singapore", "SGD", 1848.00, RATES.SGD, true),  // ~$1369 (-2%)
  p("B0EX1LAP03", "au", "Amazon Australia", "AUD", 3621.00, RATES.AUD, false),  // out of stock

  // B0EX1LAP04 — ASUS Zenbook 14 OLED — US $999
  p("B0EX1LAP04", "us", "Amazon US", "USD", 999, RATES.USD, true),
  p("B0EX1LAP04", "jp", "Amazon Japan", "JPY", 126500, RATES.JPY, true),   // ~$843 (-16%) ASUS JP
  p("B0EX1LAP04", "sg", "Amazon Singapore", "SGD", 1301.00, RATES.SGD, true),  // ~$963 (-4%)
  p("B0EX1LAP04", "au", "Amazon Australia", "AUD", 2572.00, RATES.AUD, true),  // ~$1658 (+66%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADPHONES — EXPANSION (+3 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1HDP01 — Apple AirPods 4 (no ANC) — US $129
  p("B0EX1HDP01", "us", "Amazon US", "USD", 129, RATES.USD, true),
  p("B0EX1HDP01", "jp", "Amazon Japan", "JPY", 19800, RATES.JPY, true),   // ~$132 (+2%) Apple JP
  p("B0EX1HDP01", "sg", "Amazon Singapore", "SGD", 182.00, RATES.SGD, true),  // ~$134 (+4%) Apple SG
  p("B0EX1HDP01", "au", "Amazon Australia", "AUD", 324.00, RATES.AUD, true),  // ~$209 (+62%) AU Tax

  // B0EX1HDP02 — Jabra Elite 10 Gen 2 — US $279
  p("B0EX1HDP02", "us", "Amazon US", "USD", 279, RATES.USD, true),
  p("B0EX1HDP02", "jp", "Amazon Japan", "JPY", 46200, RATES.JPY, true),   // ~$308 (+10%)
  p("B0EX1HDP02", "sg", "Amazon Singapore", "SGD", 362.00, RATES.SGD, true),  // ~$268 (-4%)
  p("B0EX1HDP02", "au", "Amazon Australia", "AUD", 719.00, RATES.AUD, true),  // ~$463 (+66%) AU Tax

  // B0EX1HDP03 — Sony LinkBuds Open — US $179
  p("B0EX1HDP03", "us", "Amazon US", "USD", 179, RATES.USD, true),
  p("B0EX1HDP03", "jp", "Amazon Japan", "JPY", 18400, RATES.JPY, true),   // ~$122 (-32%) Sony home market
  p("B0EX1HDP03", "sg", "Amazon Singapore", "SGD", 213.00, RATES.SGD, true),  // ~$157 (-12%) Sony SG
  p("B0EX1HDP03", "au", "Amazon Australia", "AUD", 468.00, RATES.AUD, true),  // ~$301 (+69%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // SMARTPHONES — EXPANSION (+3 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1PHN01 — Samsung Galaxy Z Fold 7 — US $1799
  p("B0EX1PHN01", "us", "Amazon US", "USD", 1799, RATES.USD, true),
  p("B0EX1PHN01", "jp", "Amazon Japan", "JPY", 337900, RATES.JPY, true),   // ~$2253 (+25%) Samsung JP markup
  p("B0EX1PHN01", "sg", "Amazon Singapore", "SGD", 1508.00, RATES.SGD, true),  // ~$1117 (-38%) SG HQ pricing
  p("B0EX1PHN01", "au", "Amazon Australia", "AUD", 4818.00, RATES.AUD, true),  // ~$3107 (+73%) AU Tax

  // B0EX1PHN02 — Google Pixel 10a — US $499
  p("B0EX1PHN02", "us", "Amazon US", "USD", 499, RATES.USD, true),
  p("B0EX1PHN02", "jp", "Amazon Japan", "JPY", 78200, RATES.JPY, true),   // ~$521 (+4%)
  p("B0EX1PHN02", "sg", "Amazon Singapore", "SGD", 669.00, RATES.SGD, true),  // ~$495 (-1%)
  p("B0EX1PHN02", "au", "Amazon Australia", "AUD", 1278.00, RATES.AUD, true),  // ~$824 (+65%) AU Tax

  // B0EX1PHN03 — Nothing Phone 3 — US $599
  p("B0EX1PHN03", "us", "Amazon US", "USD", 599, RATES.USD, false),
  p("B0EX1PHN03", "jp", "Amazon Japan", "JPY", 97100, RATES.JPY, true),   // ~$647 (+8%)
  p("B0EX1PHN03", "sg", "Amazon Singapore", "SGD", 793.00, RATES.SGD, true),  // ~$587 (-2%)
  p("B0EX1PHN03", "au", "Amazon Australia", "AUD", 1524.00, RATES.AUD, true),  // ~$982 (+64%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // TVs & MONITORS — EXPANSION (+3 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1TVM01 — Sony A95L 65" QD-OLED — US $2798
  p("B0EX1TVM01", "us", "Amazon US", "USD", 2798, RATES.USD, true),
  p("B0EX1TVM01", "jp", "Amazon Japan", "JPY", 291600, RATES.JPY, true),   // ~$1945 (-30%) Sony home market
  p("B0EX1TVM01", "sg", "Amazon Singapore", "SGD", 3337.00, RATES.SGD, true),  // ~$2472 (-12%) Sony SG
  p("B0EX1TVM01", "au", "Amazon Australia", "AUD", 7352.00, RATES.AUD, true),  // ~$4742 (+70%) AU Tax

  // B0EX1TVM02 — BenQ MOBIUZ EX2710U — US $599
  p("B0EX1TVM02", "us", "Amazon US", "USD", 599, RATES.USD, true),
  p("B0EX1TVM02", "jp", "Amazon Japan", "JPY", 95900, RATES.JPY, true),   // ~$639 (+7%)
  p("B0EX1TVM02", "sg", "Amazon Singapore", "SGD", 789.00, RATES.SGD, true),  // ~$584 (-3%)
  p("B0EX1TVM02", "au", "Amazon Australia", "AUD", 1548.00, RATES.AUD, true),  // ~$998 (+67%) AU Tax

  // B0EX1TVM03 — Samsung Odyssey G9 57" — US $1299
  p("B0EX1TVM03", "us", "Amazon US", "USD", 1299, RATES.USD, true),
  p("B0EX1TVM03", "jp", "Amazon Japan", "JPY", 248900, RATES.JPY, true),   // ~$1660 (+28%) Samsung JP markup
  p("B0EX1TVM03", "sg", "Amazon Singapore", "SGD", 1089.00, RATES.SGD, true),  // ~$806 (-38%) SG HQ pricing
  p("B0EX1TVM03", "au", "Amazon Australia", "AUD", 3487.00, RATES.AUD, false),  // out of stock

  // ═══════════════════════════════════════════════════════════════════════════
  // TABLETS — EXPANSION (+3 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1TAB01 — Samsung Galaxy Tab S10+ — US $999
  p("B0EX1TAB01", "us", "Amazon US", "USD", 999, RATES.USD, true),
  p("B0EX1TAB01", "jp", "Amazon Japan", "JPY", 189800, RATES.JPY, true),   // ~$1265 (+27%) Samsung JP markup
  p("B0EX1TAB01", "sg", "Amazon Singapore", "SGD", 827.00, RATES.SGD, true),  // ~$612 (-39%) SG HQ pricing
  p("B0EX1TAB01", "au", "Amazon Australia", "AUD", 2678.00, RATES.AUD, true),  // ~$1727 (+73%) AU Tax

  // B0EX1TAB02 — Amazon Kindle Scribe 2 — US $389
  p("B0EX1TAB02", "us", "Amazon US", "USD", 389, RATES.USD, true),
  p("B0EX1TAB02", "jp", "Amazon Japan", "JPY", 63800, RATES.JPY, true),   // ~$425 (+9%) Amazon JP
  p("B0EX1TAB02", "sg", "Amazon Singapore", "SGD", 518.00, RATES.SGD, true),  // ~$383 (-2%)
  p("B0EX1TAB02", "au", "Amazon Australia", "AUD", 998.00, RATES.AUD, true),  // ~$643 (+65%) AU Tax

  // B0EX1TAB03 — reMarkable Paper Pro — US $579
  p("B0EX1TAB03", "us", "Amazon US", "USD", 579, RATES.USD, true),
  p("B0EX1TAB03", "jp", "Amazon Japan", "JPY", 95400, RATES.JPY, true),   // ~$636 (+10%)
  p("B0EX1TAB03", "sg", "Amazon Singapore", "SGD", 762.00, RATES.SGD, true),  // ~$564 (-3%)
  p("B0EX1TAB03", "au", "Amazon Australia", "AUD", 1478.00, RATES.AUD, true),  // ~$953 (+65%) AU Tax

  // ═══════════════════════════════════════════════════════════════════════════
  // WEARABLES — EXPANSION (+3 products)
  // ═══════════════════════════════════════════════════════════════════════════

  // B0EX1WRB01 — Apple Watch SE 3 — US $249
  p("B0EX1WRB01", "us", "Amazon US", "USD", 249, RATES.USD, true),
  p("B0EX1WRB01", "jp", "Amazon Japan", "JPY", 38200, RATES.JPY, true),   // ~$254 (+2%) Apple JP
  p("B0EX1WRB01", "sg", "Amazon Singapore", "SGD", 349.00, RATES.SGD, true),  // ~$258 (+4%) Apple SG
  p("B0EX1WRB01", "au", "Amazon Australia", "AUD", 623.00, RATES.AUD, true),  // ~$401 (+61%) AU Tax

  // B0EX1WRB02 — Samsung Galaxy Ring 2 — US $299
  p("B0EX1WRB02", "us", "Amazon US", "USD", 299, RATES.USD, true),
  p("B0EX1WRB02", "jp", "Amazon Japan", "JPY", 56800, RATES.JPY, true),   // ~$378 (+27%) Samsung JP markup
  p("B0EX1WRB02", "sg", "Amazon Singapore", "SGD", 247.00, RATES.SGD, true),  // ~$183 (-39%) SG HQ pricing
  p("B0EX1WRB02", "au", "Amazon Australia", "AUD", 798.00, RATES.AUD, true),  // ~$514 (+72%) AU Tax

  // B0EX1WRB03 — Oura Ring Gen 4 — US $349
  p("B0EX1WRB03", "us", "Amazon US", "USD", 349, RATES.USD, true),
  p("B0EX1WRB03", "jp", "Amazon Japan", "JPY", 56800, RATES.JPY, true),   // ~$378 (+8%)
  p("B0EX1WRB03", "sg", "Amazon Singapore", "SGD", 462.00, RATES.SGD, true),  // ~$342 (-2%)
  p("B0EX1WRB03", "au", "Amazon Australia", "AUD", 896.00, RATES.AUD, true),  // ~$578 (+66%) AU Tax
];
