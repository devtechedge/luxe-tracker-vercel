# LUXE TRACKER — Vercel-Only Build

High-fashion global launch & price disparity tracker. 5 brands × 25 products × 90-day price history. 17 panels (Intelligence · Pricing · Market · Luxury · Personal). Single Vercel deployment, no external services.

![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![Vercel](https://img.shields.io/badge/Vercel-ready-black) ![Tailwind 4](https://img.shields.io/badge/Tailwind-4-06b6d4) ![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## Architecture

```
Single Vercel deployment
└── Next.js 15 app
    ├── src/lib/data-snapshot.ts   # 5 brands × 25 products × 11,375 price rows, deterministic PRNG
    ├── src/lib/analytics.ts       # 17 sync query functions (replaces /api/analytics)
    ├── src/lib/theme.ts           # dark/light mode hook + localStorage persistence
    ├── src/lib/fashion-types.ts   # 17 feature interfaces
    ├── src/hooks/use-watchlist.ts # localStorage watchlist + alerts
    └── src/components/ui/panel-shell.tsx # editorial reusable: PanelShell, DataTable, etc.
```

**Removed from original:** `prisma/`, `supabase/`, `mini-services/`, `Dockerfile`, `docker-compose.yml`, `Caddyfile`, `bun.lock`. All replaced by `data-snapshot.ts`.

---

## Changelog (all fixes + redesign)

### #1 · Vercel-only migration (initial build)
- Replaced `prisma/schema.prisma` (16 models) + `prisma/seed.ts` → single in-memory snapshot at `src/lib/data-snapshot.ts`
- Replaced `/api/analytics` route handler → synchronous `src/lib/analytics.ts` functions
- Replaced Supabase watchlist/alerts → `useLocalStorage` hook
- 17 panels: Overview · Price Matrix · Launch Calendar · Arbitrage · Optimizer · Price History · FX Volatility · Hype Predictor · Launch Conflicts · Stock Risk · Competitive Matrix · Brand Pulse · Runway Tracker · VIP Tier · Sustainability · Trend Forecast · Drop Queue · Watchlist · Alerts

### #2 · Bug: VIP tier property mismatch (first build error)
**Symptom:** Vercel build failed at `getVIPSimulation` — `Property 'tierName' does not exist on type '{ name, minSpend, discount, ... }'`
**Root cause:** `tierDefs` in `data-snapshot.ts` used shorthand names that didn't match `VIPTierData` interface
**Fix:** Renamed `name`→`tierName`, `minSpend`→`minAnnualSpendEUR`, `discount`→`discountPct`, `earlyAccess`→`earlyAccessDays`, `priority`→`allocationPriority`, `viewing`→`privateViewing`, `shopper`→`personalShopper`. Updated 4 call sites in `analytics.ts` + `vip-panel.tsx`

### #3 · Bug: Tailwind v4 utility classes not compiled
**Symptom:** Page rendered but with broken layout — KPI cards stacked, bar charts empty, sidebar hidden
**Root cause:** Used legacy `@tailwind base/components/utilities` directives. Tailwind v4's `@tailwindcss/postcss` plugin does not read `tailwind.config.ts` for content paths
**Fix:**
- `globals.css`: replaced with `@import "tailwindcss"` + `@source "../**/*.{ts,tsx,js,jsx,mdx}"` + `@theme` block
- `tailwind.config.ts`: simplified to stub
- `package.json`: removed `tailwindcss-animate` (built-in in v4)

### #4 · Bug sweep (caught via real `tsc --noEmit`)
- `fx-volatility.tsx`: stray `import React from 'react'` at file bottom + `React.useState` call. Moved `useState` to top imports, removed stray React import
- `page.tsx`: removed unused `Heart` import (kept `Heart as HeartIcon` alias)
- `layout.tsx`, `page.tsx`, `vip-panel.tsx`: added explicit `import type { ReactNode }` / `ComponentType` for type positions

### #5 · Bug: Price History key-split (`getPriceHistory` crashed at runtime)
**Symptom:** Clicking Price History → error page
**Root cause:** Composite key was `${productId}_${region}` producing strings like `prod_0_EU`. `key.split('_')` returned `['prod','0','EU']` and `[productId, region] = ...` destructured to `productId='prod'`, `region='0'` — both wrong. Then `snap.products.find(p => p.id === 'prod')` returned `undefined`, and `product.name` threw `TypeError`
**Fix:** Use `key.lastIndexOf('_')` + `key.slice(0, lastSep)` / `key.slice(lastSep+1)`. Added defensive `null` filter on movers map

### #6 · Bug: framer-motion incompatible with React 19
**Symptom:** Webpack build error — `'activeAnimations' is not exported from 'motion-dom'`
**Fix:** Removed `framer-motion` dep entirely. Panel transitions use CSS `@keyframes editorial-fade-in` (400ms ease) with `fade-in` class. Removed `motion.div` + `AnimatePresence` from `page.tsx`

### #7 · Redesign: editorial aesthetic + dark/light theme
**Motivation:** "AI slop dashboard" — emoji icons, rainbow palettes, repeated card grids, no typography hierarchy
**Direction:** editorial-meets-terminal — *FT.com* layout + *Bloomberg Terminal* density + *Linear/Hermès* restraint

**New theme system (`globals.css`):**
```css
@theme {
  --color-bg: #0B0B0D;          /* dark: deep neutral */
  --color-surface: #131316;
  --color-ink: #ECECEC;
  --color-accent: #F97316;       /* single accent, used sparingly */
  --font-display: "New York", "Iowan Old Style", Charter, Georgia, ui-serif, serif;
  --font-mono: "SF Mono", "JetBrains Mono", ui-monospace, monospace;
}
[data-theme="light"] { --color-bg: #FAFAF7; --color-ink: #0B0B0D; ... }
```

**New files:**
- `src/lib/theme.ts` — `useTheme()` hook + localStorage persistence + OS preference fallback
- `src/components/ui/panel-shell.tsx` — reusable `PanelShell`, `Section`, `DataTable`, `DataRow`, `KpiStrip`, `ChartTooltip`, `EmptyState`

**Layout changes (`page.tsx`):**
- Removed `<motion>` panel transitions → CSS `fade-in` class
- New sticky top bar with breadcrumb + theme toggle pill
- Sidebar: typographic nav, no emoji icons, single accent dot on active item, category labels in `tracking-[0.14em]` small caps

**Overview hero (`telemetry-overview.tsx`):**
- Replaced 8-card KPI grid with editorial layout:
  - Tiny label: "LIVE TELEMETRY · Updated every second"
  - Massive `hero-num text-[80px]` serif: "38.0%"
  - Subhead caption
  - Thin rule
  - 8-column numerical strip with `tabular-nums`
  - Inline FX rates strip (mono)
  - Two chart panels (By Region / By Brand) with restrained single-color bars

**Fully redesigned panels:** `telemetry-overview`, `price-matrix`, `price-history`, `launch-calendar`, `arbitrage-panel`, `brand-pulse`
**Color-migrated panels** (Tailwind `text-orange-400` → `var(--color-accent)`): `fx-volatility`, `hype-predictor`, `launch-conflicts`, `stock-risk`, `competitive-matrix`, `runway-panel`, `vip-panel`, `sustainability-panel`, `trend-forecast-panel`, `drop-queue-panel`, `watchlist-panel`, `optimizer-panel`

**No-flash theme bootstrap (`layout.tsx`):**
- Inline `<script>` in `<head>` runs before React hydrates, reads localStorage, sets `data-theme` on `<html>` → zero FOUC

**Typography stack (system fonts, no downloads):**
- Display: `"New York", "Iowan Old Style", Charter, Georgia, ui-serif, serif`
- Body: `ui-sans-serif, system-ui, sans-serif`
- Mono: `"SF Mono", "JetBrains Mono", ui-monospace, monospace`
- All numeric columns: `font-variant-numeric: tabular-nums` + `font-feature-settings: "tnum", "lnum"`

---

## Deploy

```bash
# Local
bun install && bun run dev    # → http://localhost:3000

# Vercel
vercel --prod                  # zero env vars, zero config
# OR: push to GitHub → import on vercel.com/new
```

No env vars. No database. No seeding step.

## File structure

```
luxe-tracker-vercel/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # theme bootstrap, no-FOUC
│   │   ├── page.tsx                # sidebar + panel router (231 LOC)
│   │   ├── globals.css             # full theme system + editorial utilities
│   │   └── api/                    # removed — no backend needed
│   ├── components/
│   │   ├── ui/                     # card, badge, button, input, progress, separator, select, tabs, panel-shell
│   │   └── features/               # 17 panels
│   ├── lib/
│   │   ├── data-snapshot.ts        # deterministic data generation
│   │   ├── analytics.ts            # 17 query functions
│   │   ├── fashion-types.ts        # interfaces
│   │   ├── theme.ts                # useTheme hook
│   │   └── utils.ts
│   └── hooks/
│       └── use-watchlist.ts        # localStorage watchlist + alerts
├── public/{logo.svg,robots.txt}
├── package.json                    # no framer-motion, no tailwindcss-animate
├── next.config.ts
├── tailwind.config.ts              # stub (config is in CSS)
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## Dataset

Generated at module load via seeded PRNG (mulberry32, seed `0xc0ffee`):

| Entity | Count |
|---|---|
| Brands | 5 |
| Products | 25 (5 categories × 5 brands) |
| Regional prices | 125 (× 5 regions) |
| Price history rows | **11,375** (91 days × 25 × 5) |
| Launches | 125 |
| Runway shows | 30 |
| Trend forecasts | 20 |
| Drop queues | 10 |

Scale by editing `BRAND_DEFS` / `PRODUCT_DEFS` in `data-snapshot.ts`.

## Tech stack

`next@15.1.0` · `react@19` · `typescript@5` · `tailwindcss@4` (`@tailwindcss/postcss`) · `recharts@2.15.4` · `lucide-react@0.525.0` · `class-variance-authority` · `clsx` · `tailwind-merge` · `framer-motion` (REMOVED — React 19 incompat, use CSS)

## Caveats

- **Cold starts:** Data is deterministic (same seed = same data on every cold start)
- **No real-time updates:** Data frozen at build time. For live price scraping, swap snapshot.ts to fetch from a scraper
- **Watchlist is per-browser** (localStorage), not per-user

## Original repo

[devtechedge/luxe-tracker](https://github.com/devtechedge/luxe-tracker) — Next.js + Prisma + Supabase. This build is a complete removal of all DB/backend infrastructure.

## License

MIT
