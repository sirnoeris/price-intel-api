# Price Intel API

Real-time e-commerce price intelligence for AI agents. Track 114 electronics products across Amazon US, Japan, Singapore, and Australia. Pay per query with USDC on Base via [x402](https://x402.org).

**Live:** https://price-intel-api.f7nv4k694k.workers.dev

## What You Get

| Data | Details |
|------|---------|
| **Products** | 114 products across 10 categories (laptops, headphones, smartphones, TVs, tablets, wearables, cameras, gaming, storage, smart home) |
| **Regional Pricing** | Amazon US, JP, SG, AU — 456 price entries with real exchange rates |
| **Price History** | 6-month price trends with analytics (min, max, avg, volatility) |
| **Deals** | Real-time discount detection with deal type classification |
| **Cross-Border Arbitrage** | Profit calculator and scanner across 12 trade routes with shipping, duties, taxes, and platform fees |
| **Confidence Scores** | Data quality scores on all responses (Pro tier includes full breakdown) |
| **Daily Digest** | Curated top 10 arbitrage opportunities with full analysis |

## Tiered Pricing (Basic / Pro)

All paid endpoints support two tiers. Send the `x-tier` header to select:

| Tier | Header | What You Get |
|------|--------|--------------|
| **Basic** | `x-tier: basic` (or omit) | Core data + confidence score (number) |
| **Pro** | `x-tier: pro` | Full confidence details, analytics, market signals, risk assessments, and actionable insights |

## Free Endpoints (No Payment Required)

Try the data before you buy:

```bash
# Sample products — 3 per category, limited fields
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/sample/products

# Sample arbitrage opportunities — top 3 raw price spreads
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/sample/arbitrage

# API health check and data coverage
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/status

# API documentation
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/endpoints

# x402 payment discovery
curl https://price-intel-api.f7nv4k694k.workers.dev/.well-known/x402.json

# MCP server card
curl https://price-intel-api.f7nv4k694k.workers.dev/.well-known/mcp/server-card.json
```

## Paid Endpoints

| Endpoint | Basic Price | Pro Price | Description |
|----------|------------|-----------|-------------|
| `GET /api/v1/products?asin=X` | $0.005 | $0.012 | Single product lookup |
| `GET /api/v1/products?q=X` | $0.01 | $0.025 | Search & filter products |
| `GET /api/v1/price-history?asin=X` | $0.01 | $0.025 | 6-month price history + analytics |
| `GET /api/v1/deals` | $0.008 | $0.02 | Current best deals |
| `GET /api/v1/compare?asins=X,Y` | $0.015 | $0.035 | Side-by-side price comparison |
| `GET /api/v1/arbitrage/calculate` | $0.02 | $0.045 | Cross-border profit calculation |
| `GET /api/v1/arbitrage/scan` | $0.03 | $0.06 | Scan for arbitrage opportunities |
| `GET /api/v1/daily-digest` | $0.10 | $0.10 | Premium daily digest (always Pro data) |

### Pro Tier Extras

| Endpoint | Extra Fields |
|----------|-------------|
| **products** | `market_position`, `buy_signal`, full `confidence` object |
| **price-history** | `volatility_score`, `predicted_direction`, `optimal_buy_window` |
| **deals** | `deal_quality_score`, `expires_estimate` |
| **compare** | `detailed_recommendation` with reasoning |
| **arbitrage/calculate** | `risk_assessment`, `execution_tips` |
| **arbitrage/scan** | `opportunity_score` per result |

### Confidence Scores

Every paid endpoint response includes a confidence indicator:

- **Basic tier**: `confidence: 85` (number 0-100)
- **Pro tier**: `confidence: { score: 85, factors: ["curated_data", "high_volume_product", "stable_pricing"], data_age_hours: 24 }`

## Payment (x402)

All paid endpoints use the [x402 protocol](https://x402.org) — USDC on Base network.

**How it works:**
1. Call any paid endpoint without payment → get `402 Payment Required` with payment instructions (shows both Basic and Pro tier options)
2. Sign a USDC payment authorization (EIP-712) for the exact amount
3. Retry the request with the `X-PAYMENT` header containing the signed payload
4. The facilitator settles the payment, and you get the data

**Network:** Base mainnet
**Token:** USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
**Facilitator:** https://x402.org/facilitator

### Using x402-proxy (easiest)

```bash
# Install x402-proxy
npx x402-proxy

# It auto-handles 402 responses and payment signing
```

### Using @anthropic/x402-axios

```typescript
import { withX402 } from "@anthropic/x402-axios";
import axios from "axios";

const client = withX402(axios.create(), {
  walletPrivateKey: process.env.WALLET_KEY,
  network: "base",
});

// Basic tier (default)
const { data } = await client.get(
  "https://price-intel-api.f7nv4k694k.workers.dev/api/v1/products?category=headphones&sort=discount"
);

// Pro tier — add x-tier header
const { data: proData } = await client.get(
  "https://price-intel-api.f7nv4k694k.workers.dev/api/v1/products?category=headphones&sort=discount",
  { headers: { "x-tier": "pro" } }
);
```

### Using Coinbase CDP SDK

```typescript
import { X402Client } from "@coinbase/x402";

const client = new X402Client({ network: "base" });
const data = await client.get(
  "https://price-intel-api.f7nv4k694k.workers.dev/api/v1/arbitrage/scan?sell_in=au&min_margin=10"
);
```

## MCP Integration

This API is MCP-compatible. Discover tools at:

```
https://price-intel-api.f7nv4k694k.workers.dev/.well-known/mcp/server-card.json
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `search_products` | Search by keyword, category, brand, price range. Pro: market position, buy signals |
| `get_product` | Get details for a specific ASIN. Pro: market position, buy signal |
| `get_price_history` | 6-month price history with analytics. Pro: volatility, predicted direction |
| `get_deals` | Current deals, filterable by category. Pro: deal quality, expiration estimate |
| `compare_products` | Side-by-side comparison. Pro: detailed recommendation |
| `calculate_arbitrage` | Cross-border profit calculation. Pro: risk assessment, execution tips |
| `scan_arbitrage` | Find best arbitrage opportunities. Pro: opportunity score |
| `get_daily_digest` | Premium top 10 curated arbitrage opportunities (always Pro data) |
| `get_status` | Free health check — API status and data coverage |

## Arbitrage Scanner

The arbitrage endpoints analyze cross-border price differences across Amazon US, Japan, Singapore, and Australia. The scanner accounts for:

- **Shipping costs** ($20-38 depending on route)
- **Import duties** (0-5% depending on product and destination)
- **Sales tax / GST** (9-10% in JP, SG, AU)
- **Platform fees** (default 15%, overridable via `platform_fee` parameter)

### Custom Platform Fees

Override the default 15% Amazon seller fee to model different selling channels:

```bash
# Direct sale (no platform fee)
/api/v1/arbitrage/scan?platform_fee=0&min_margin=10

# Low-fee marketplace (Mercari, Carousell)
/api/v1/arbitrage/scan?platform_fee=0.05&min_margin=10

# Default Amazon reselling
/api/v1/arbitrage/scan?min_margin=10
```

## Categories

| Category | Products | Brands |
|----------|----------|--------|
| laptops | 17 | Apple, Lenovo, Dell, HP, ASUS, Razer, Acer, Samsung, Microsoft, Framework |
| headphones | 14 | Apple, Sony, Bose, Samsung, Sennheiser, Jabra |
| smartphones | 11 | Apple, Samsung, Google, Nothing |
| tvs_monitors | 12 | Samsung, LG, Dell, Apple, ASUS, Sony, BenQ |
| tablets | 10 | Apple, Samsung, Amazon, reMarkable, Kindle |
| wearables | 10 | Apple, Samsung, Google, Garmin, Fitbit, Oura |
| cameras | 10 | Sony, Canon, Nikon, Fujifilm, GoPro, DJI, Insta360 |
| gaming | 10 | Sony, Microsoft, Nintendo, Valve, Meta, Razer, 8BitDo |
| storage_networking | 10 | Samsung, WD, Seagate, ASUS, TP-Link, Synology, Ubiquiti, Apple |
| smart_home | 10 | Apple, Amazon, Google, Sonos, Dyson, iRobot, Ecovacs, Ring, Arlo, Nanoleaf |

## Example Queries

```bash
# Find cheap Sony headphones
/api/v1/products?brand=Sony&category=headphones&sort=price_asc

# Best deals right now
/api/v1/deals?sort=discount&limit=5

# Is it profitable to buy a Samsung TV in Singapore and sell in Australia?
/api/v1/arbitrage/calculate?asin=B0CV5VN4Q3&buy_from=sg&sell_in=au

# Find all profitable arbitrage routes for cameras
/api/v1/arbitrage/scan?category=cameras&min_margin=10&sort=profit

# Get today's top arbitrage opportunities with full analysis
/api/v1/daily-digest

# Check API health
/api/v1/status
```

## Tech Stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Payment:** x402 protocol (USDC on Base)
- **Data:** Curated product data, updated monthly

## License

MIT
