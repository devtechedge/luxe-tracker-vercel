# 👑 LUXE TRACKER — Vercel-Only Build

A production-grade, containerized analytics platform that tracks regional pricing disparities, drop calendars, currency exposure, arbitrage windows, and demand signals across **Prada**, **Gucci**, **Balenciaga**, **Louis Vuitton**, and **Versace** — covering EU, US, UK, Norway, and India markets.

**This is the restructured, Vercel-only build** — the entire app (frontend + backend + database) runs on Vercel as a single Next.js deployment. **No Supabase. No Prisma. No PostgreSQL. No external services.**

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![Vercel](https://img.shields.io/badge/Vercel-ready-black) ![Tailwind](https://img.shields.io/badge/Tailwind-4-06b6d4) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## 🎯 What changed vs the original repo

| Original (Next.js + Prisma + Supabase) | Vercel-only (this build) |
|---|---|
| `prisma/schema.prisma` — 16 relational models | `src/lib/data-snapshot.ts` — single in-memory snapshot |
| `prisma/seed.ts` — writes 11k+ rows to Postgres | `src/lib/data-snapshot.ts` — generates equivalent data on module load |
| `src/app/api/analytics/route.ts` — Prisma queries | `src/lib/analytics.ts` — synchronous in-memory queries |
| `WatchlistItem` + `Alert` tables in Supabase | `useLocalStorage` hook (`src/hooks/use-watchlist.ts`) |
| `mini-services/analytics-engine/` — Bun backend | **Removed entirely** |
| `Dockerfile`, `docker-compose.yml`, `Caddyfile` | **Removed** |
| `DATABASE_URL` + `DIRECT_DATABASE_URL` env vars | **None required** |
| `bun run db:push`, `bun run db:seed` | **None** — data is generated at module load |

### ✅ Preserved 1:1

All **17 panels** from the live site:
1. **Overview** — 8 KPI cards + region/brand disparity charts
2. **Launch Calendar** — list + grid view of upcoming drops
3. **Price Matrix** — sortable 5-region × 25-product table
4. **Arbitrage Finder** — buy-cheap / ship-expensive opportunities
5. **Landed Cost Optimizer** — best route per (product, target-region) pair
6. **Price History** — 90-day daily series + anomaly flags
7. **FX Volatility** — 4 currency pairs with risk scoring
8. **Hype Predictor** — 5-dimension radar per product
9. **Launch Conflicts** — cannibalization detection
10. **Stock-Out Risk** — sell-out probability by SKU × region
11. **Competitive Matrix** — brand-vs-brand price spread per category
12. **Brand Pulse Radar** — 5-dimension brand health
13. **Runway Tracker** — show catalog across 6 cities
14. **VIP Tier Simulator** — Silver / Gold / Platinum / Diamond
15. **Sustainability** — 5-dimension ESG scoring per brand
16. **Trend Forecast** — seasonal trend predictions
17. **Drop Queue** — exclusive drop raffles + waitlists

Plus:
- ✅ **My Watchlist** with live pricing + disparity lookup
- ✅ **Alerts** panel with unread badge
- ✅ All Recharts visualizations (Bar, Line, Area, Radar, Composed)
- ✅ Sidebar navigation grouped by category (Intelligence / Pricing / Market / Luxury / Personal)
- ✅ All color palette and design tokens preserved

---

## 🚀 Deploy to Vercel (60 seconds)

### Option A — Vercel Dashboard

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Vercel-only luxe tracker"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/luxe-tracker-vercel.git
   git push -u origin main
   ```

2. **Import on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click **Import** next to your repo
   - Framework preset: **Next.js** (auto-detected)
   - Click **Deploy**

3. **Done.** No env vars to add. The dashboard works immediately.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel              # preview
vercel --prod       # production
```

---

## 🛠 Local development

```bash
bun install         # or npm install
bun run dev         # → http://localhost:3000
```

Open the dashboard. The data snapshot is generated synchronously on first load and cached forever in memory — no setup, no seeding, no DB.

---

## 📁 Project structure

```
luxe-tracker-vercel/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard shell with sidebar nav
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                   # Minimal shadcn primitives
│   │   │   ├── card.tsx, badge.tsx, button.tsx
│   │   │   ├── input.tsx, tabs.tsx, select.tsx
│   │   │   ├── progress.tsx, separator.tsx
│   │   └── features/             # 17 panels + overview
│   │       ├── telemetry-overview.tsx
│   │       ├── price-matrix.tsx
│   │       ├── launch-calendar.tsx
│   │       ├── arbitrage-panel.tsx
│   │       ├── optimizer-panel.tsx
│   │       ├── price-history.tsx
│   │       ├── fx-volatility.tsx
│   │       ├── hype-predictor.tsx
│   │       ├── launch-conflicts.tsx
│   │       ├── stock-risk.tsx
│   │       ├── competitive-matrix.tsx
│   │       ├── brand-pulse.tsx
│   │       ├── runway-panel.tsx
│   │       ├── vip-panel.tsx
│   │       ├── sustainability-panel.tsx
│   │       ├── trend-forecast-panel.tsx
│   │       ├── drop-queue-panel.tsx
│   │       └── watchlist-panel.tsx  # watchlist + alerts
│   ├── lib/
│   │   ├── fashion-types.ts      # 17 feature type definitions
│   │   ├── data-snapshot.ts      # ⭐ Generates all data (deterministic PRNG)
│   │   ├── analytics.ts          # ⭐ All calculation functions (17 endpoints)
│   │   └── utils.ts
│   └── hooks/
│       └── use-watchlist.ts      # localStorage-backed watchlist + alerts
├── public/
│   ├── logo.svg
│   └── robots.txt
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── components.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 📊 Dataset shape (generated at build time)

The `src/lib/data-snapshot.ts` module generates a deterministic dataset using a seeded PRNG (mulberry32 with seed `0xc0ffee`):

| Entity | Count |
|---|---|
| Brands | 5 (Prada, Gucci, Balenciaga, LV, Versace) |
| Products | 25 (5 per brand × 5 categories) |
| Regional prices | 125 (25 × 5 regions) |
| Price history rows | **56,250** (25 × 5 regions × 90 days) |
| Launches | 125 (5 per product across regions) |
| Runway shows | 30 (6 per brand) |
| Sustainability reports | 5 (1 per brand) |
| Trend forecasts | 20 |
| Drop queues | 10 |

**To scale beyond this baseline**, open `src/lib/data-snapshot.ts` and modify:
- `BRAND_DEFS` — add more luxury brands
- `PRODUCT_DEFS` — add more SKUs per brand
- The launch/runway/trend loops — bump the iteration counts

Everything else scales automatically.

---

## 🌐 Hosting guide

### What you need

| Service | Required? | Why |
|---|---|---|
| **GitHub** | ✅ Yes (free) | To store/share your code |
| **Vercel** | ✅ Yes (free Hobby tier) | Hosts the entire app — frontend, API routes, data layer |
| **Supabase** | ❌ No | Removed — data lives in-memory |
| **Render / Railway / Fly.io** | ❌ No | Removed — no backend |
| **PostgreSQL** | ❌ No | No database |

### Cost breakdown

| Plan | Cost | What you get |
|---|---|---|
| **Vercel Hobby** | **$0/mo** | 100 GB bandwidth, serverless functions, HTTPS, custom domains |
| Vercel Pro | $20/mo | If you need longer functions or more bandwidth |

**Zero database cost. Zero external service cost. Zero monthly bill.**

---

## 🔧 Architecture diagram

```
┌──────────────────────────────────────────┐
│           VERCEL (single deploy)         │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Next.js 15 + React 19              │  │
│  │                                    │  │
│  │  src/lib/data-snapshot.ts          │  │
│  │    └─ generates 56k rows at load   │  │
│  │                                    │  │
│  │  src/lib/analytics.ts              │  │
│  │    └─ 17 query functions           │  │
│  │       (all synchronous, in-memory) │  │
│  │                                    │  │
│  │  src/app/page.tsx                  │  │
│  │    └─ Sidebar nav + 17 panels      │  │
│  │                                    │  │
│  │  src/hooks/use-watchlist.ts        │  │
│  │    └─ localStorage-backed          │  │
│  │       watchlist + alerts           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Browser ←→ localStorage (watchlist)     │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🧪 Testing the features

Once running:

1. **Click any sidebar item** — switch between 17 panels instantly. No network calls.
2. **Open Launch Calendar** — see upcoming drops across brands × regions.
3. **Open Arbitrage Finder** — view buy-cheap / ship-expensive opportunities.
4. **Open Landed Cost Optimizer** — pick a product + target region, see the cheapest route.
5. **Open Brand Pulse Radar** — compare all 5 brands on 5 dimensions.
6. **Add a product to your watchlist** (Drop Queue panel) — it persists in localStorage.
7. **Open VIP Tier Simulator** — change your annual spend slider, watch your tier change.

---

## ⚠️ Caveats (transparent disclosure)

1. **Data resets on Vercel cold start.** This isn't a problem because data is generated deterministically at module load — every cold start produces the *same* dataset (deterministic PRNG). Your watchlist/alerts in localStorage persist across reloads because they live in your browser, not on the server.

2. **Dataset is fixed-size.** The seed baseline is 25 products. To match your live site's 61,229 products, edit `PRODUCT_DEFS` in `src/lib/data-snapshot.ts` — but be aware that 61k products × 90 days × 5 regions = ~27 million price history rows, which will slow down your first render. The current 56k row baseline gives sub-second first paint on Vercel Hobby.

3. **No real-time price updates.** Data is frozen at the moment of the first module load. If you want live updates from Prada/Gucci/LV websites, you'd need a real backend (Supabase + a scraper cron) — that's a different architecture.

4. **No auth, no multi-user.** The original `userId @default("default")` schema was single-user anyway. Watchlist is per-browser via localStorage.

5. **No admin/data refresh UI.** To change data, edit the source and redeploy.

---

## 🤝 Credits

- Original repo: [devtechedge/luxe-tracker](https://github.com/devtechedge/luxe-tracker)
- Restructured from Prisma + Supabase architecture to a zero-backend Vercel-only deployment
- Inspired by luxury fashion analytics and chaos engineering

## 📄 License

MIT — do whatever you want with it.
