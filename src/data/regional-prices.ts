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
];
