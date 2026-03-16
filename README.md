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

## Free Endpoints (No Payment Required)

Try the data before you buy:

```bash
# Sample products — 3 per category, limited fields
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/sample/products

# Sample arbitrage opportunities — top 3 raw price spreads
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/sample/arbitrage

# API documentation
curl https://price-intel-api.f7nv4k694k.workers.dev/api/v1/endpoints

# x402 payment discovery
curl https://price-intel-api.f7nv4k694k.workers.dev/.well-known/x402.json

# MCP server card
curl https://price-intel-api.f7nv4k694k.workers.dev/.well-known/mcp/server-card.json
```

## Paid Endpoints

| Endpoint | Price | Description |
|----------|-------|-------------|
| `GET /api/v1/products?asin=X` | $0.005 | Single product lookup |
| `GET /api/v1/products?q=X` | $0.01 | Search & filter products |
| `GET /api/v1/price-history?asin=X` | $0.01 | 6-month price history + analytics |
| `GET /api/v1/deals` | $0.008 | Current best deals |
| `GET /api/v1/compare?asins=X,Y` | $0.015 | Side-by-side price comparison |
| `GET /api/v1/arbitrage/calculate` | $0.02 | Cross-border profit calculation |
| `GET /api/v1/arbitrage/scan` | $0.03 | Scan for arbitrage opportunities |

## Payment (x402)

All paid endpoints use the [x402 protocol](https://x402.org) — USDC on Base network.

**How it works:**
1. Call any paid endpoint without payment → get `402 Payment Required` with payment instructions
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

const { data } = await client.get(
  "https://price-intel-api.f7nv4k694k.workers.dev/api/v1/products?category=headphones&sort=discount"
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
| `search_products` | Search by keyword, category, brand, price range |
| `get_product` | Get details for a specific ASIN |
| `get_price_history` | 6-month price history with analytics |
| `get_deals` | Current deals, filterable by category |
| `compare_products` | Side-by-side comparison of multiple ASINs |
| `calculate_arbitrage` | Cross-border profit calculation with full cost breakdown |
| `scan_arbitrage` | Find best arbitrage opportunities across all regions |

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
```

## Tech Stack

- **Runtime:** Cloudflare Workers
- **Framework:** Hono
- **Payment:** x402 protocol (USDC on Base)
- **Data:** Curated product data, updated monthly

## License

MIT
