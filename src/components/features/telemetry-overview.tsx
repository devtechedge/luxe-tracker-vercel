'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { getTelemetry } from '@/lib/analytics'
import { fmtEUR, fmtNum, fmtPct } from '@/lib/utils'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function TelemetryOverview() {
  const data = useMemo(() => getTelemetry(), [])
  const o = data.overview

  // 8 headline KPIs, presented as editorial metric strips
  const metrics = [
    { label: 'Products', value: fmtNum(o.totalProducts), trend: null, accent: false },
    { label: 'Brands', value: fmtNum(o.totalBrands), trend: null, accent: false },
    { label: 'Launches', value: fmtNum(o.totalLaunches), trend: null, accent: false },
    { label: 'Avg Disparity', value: `${o.avgDisparityOverall >= 0 ? '+' : ''}${o.avgDisparityOverall.toFixed(2)}%`, trend: o.avgDisparityOverall > 0 ? 'up' : 'down', accent: false },
    { label: 'Max Disparity', value: `${o.maxDisparityOverall.toFixed(1)}%`, trend: 'up', accent: true },
    { label: 'Avg Hype', value: String(o.avgHypeScore), trend: null, accent: false },
    { label: 'High-Duty', value: fmtNum(o.highDutyProducts), trend: null, accent: false },
    { label: 'Low Stock', value: fmtNum(o.limitedStockCount), trend: null, accent: false },
  ]

  // Currency rates strip
  const rates = data.currencyRates.slice(0, 4)

  return (
    <div className="fade-in">
      {/* ============================================================ */}
      {/* HERO — editorial metric strip                                  */}
      {/* ============================================================ */}
      <section className="pb-10">
        <div className="mb-3 flex items-baseline gap-3">
          <span className="label label-accent">Live Telemetry</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
            Updated every second
          </span>
        </div>

        {/* Massive headline number — the hero metric */}
        <div className="mb-8 flex items-baseline gap-4">
          <span className="hero-num text-[80px] text-[var(--color-ink)]">
            {o.maxDisparityOverall.toFixed(1)}
            <span className="text-[44px] text-[var(--color-ink-subtle)]">%</span>
          </span>
          <div className="pb-3">
            <div className="label">Maximum Markup vs EU</div>
            <div className="mt-1 flex items-center gap-1 text-[12px] text-[var(--color-ink-muted)]">
              <ArrowUpRight className="size-3.5 text-[var(--color-negative)]" />
              <span>Across 5 maisons, 5 regions, 25 SKUs</span>
            </div>
          </div>
        </div>

        {/* Metric grid — 8 columns of typographic numbers */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--color-border)] pt-6 md:grid-cols-4 lg:grid-cols-8">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="label mb-1">{m.label}</div>
              <div
                className={`hero-num text-[26px] ${
                  m.accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'
                }`}
              >
                {m.value}
              </div>
              {m.trend && (
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--color-ink-subtle)]">
                  {m.trend === 'up' ? (
                    <ArrowUpRight className="size-2.5 text-[var(--color-negative)]" />
                  ) : (
                    <ArrowDownRight className="size-2.5 text-[var(--color-positive)]" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Currency rates — inline data strip */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-[var(--color-border)] pt-5">
          <span className="label">FX Rates</span>
          {rates.map((r) => (
            <div key={r.pair} className="flex items-baseline gap-2">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                {r.pair}
              </span>
              <span className="font-mono text-[13px] tabular-nums text-[var(--color-ink)]">
                {r.rate.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* DATA SECTION — typography-first, minimal chrome                */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 gap-8 border-t border-[var(--color-border)] pt-10 lg:grid-cols-2">
        <ChartPanel
          label="By Region"
          title="Markup vs EU baseline, by region"
          caption="Higher = more expensive than EU. India carries the highest premium."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.regionSummary} layout="vertical" margin={{ left: 0, right: 24, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--color-ink-subtle)"
                fontSize={10}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="region"
                type="category"
                stroke="var(--color-ink-muted)"
                fontSize={11}
                width={64}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<EditorialTooltip />} cursor={{ fill: 'var(--color-surface-2)' }} />
              <Bar dataKey="avgDisparityPct" fill="var(--color-accent)" radius={[0, 1, 1, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          label="By Brand"
          title="Markup vs EU baseline, by maison"
          caption="Louis Vuitton maintains tightest global pricing discipline."
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.brandSummary} layout="vertical" margin={{ left: 0, right: 24, top: 8, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" horizontal={false} />
              <XAxis
                type="number"
                stroke="var(--color-ink-subtle)"
                fontSize={10}
                tickFormatter={(v) => `${v.toFixed(0)}%`}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey="brand"
                type="category"
                stroke="var(--color-ink-muted)"
                fontSize={11}
                width={92}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<EditorialTooltip />} cursor={{ fill: 'var(--color-surface-2)' }} />
              <Bar dataKey="avgDisparityPct" fill="var(--color-accent)" radius={[0, 1, 1, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>
      </section>
    </div>
  )
}

// ============================================================
// CHART PANEL — minimal editorial wrapper
// ============================================================
function ChartPanel({
  label,
  title,
  caption,
  children,
}: {
  label: string
  title: string
  caption?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline gap-3">
        <span className="label label-accent">{label}</span>
      </div>
      <h3 className="font-display text-[17px] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
        {title}
      </h3>
      {caption && (
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-subtle)]">
          {caption}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  )
}

// ============================================================
// EDITORIAL TOOLTIP — restrained, no rounded corners, mono numbers
// ============================================================
function EditorialTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 shadow-xl">
      <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
        {label}
      </div>
      <div className="mt-0.5 font-mono text-[13px] tabular-nums text-[var(--color-ink)]">
        {payload[0].value.toFixed(2)}%
      </div>
    </div>
  )
}
