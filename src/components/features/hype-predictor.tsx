'use client'

import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { PanelShell, ChartTooltip } from '@/components/ui/panel-shell'
import { getHype } from '@/lib/analytics'

export function HypePredictor() {
  const data = useMemo(() => getHype(), [])
  const [category, setCategory] = useState<string>('all')

  const filtered = useMemo(() => {
    return category === 'all'
      ? data.topHyped
      : data.allProducts.filter((p) => p.category === category)
  }, [data, category])

  const featured = filtered[0]
  const categories = Array.from(new Set(data.allProducts.map((p) => p.category)))

  return (
    <PanelShell
      category="Market"
      title="Launch Hype Predictor"
      subtitle={`Predicted demand for ${data.totalProducts} products · average hype ${data.avgHypeScore}`}
      caption="Composite score blending brand tier, category demand, season timing, exclusivity, and time-decay."
    >
      {/* HEADLINE */}
      {featured && (
        <div className="rule mb-8 grid grid-cols-1 gap-8 py-6 lg:grid-cols-[1fr,320px]">
          <div>
            <div className="label mb-2">Top Hyped · {featured.brand}</div>
            <h3 className="font-display text-[28px] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
              {featured.productName}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
              {featured.sku} · {featured.category} · {featured.season}
            </p>

            <div className="mt-6 flex items-baseline gap-6">
              <div>
                <div className="label mb-1">Hype Index</div>
                <div className="hero-num text-[80px] text-[var(--color-accent)] leading-none">
                  {featured.hypeScore}
                </div>
              </div>
              <div className="flex-1">
                <div className="label mb-1">Launch</div>
                <div className="font-display text-[20px] tabular-nums text-[var(--color-ink)]">
                  {featured.daysToLaunch !== null
                    ? `T-${featured.daysToLaunch}d`
                    : 'Past'}
                </div>
                <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                  {featured.launchRegion ?? '—'} · {featured.launchType ?? '—'}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-px border-t border-[var(--color-border)] pt-4">
              {featured.hypeBreakdown &&
                Object.entries(featured.hypeBreakdown).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="font-mono text-[13px] tabular-nums text-[var(--color-ink)]">
                      {val}
                    </div>
                    <div className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                      {key.replace('brandTier', 'Brand').replace('category', 'Cat').replace('season', 'Season').replace('exclusivity', 'Excl.').replace('decay', 'Decay')}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Radar chart */}
          <div className="flex flex-col justify-center border-l border-[var(--color-border)] pl-8">
            <div className="label mb-2">5-Dimension Profile</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  data={[
                    { axis: 'Brand', value: featured.hypeBreakdown?.brandTier ?? 0 },
                    { axis: 'Cat.', value: featured.hypeBreakdown?.category ?? 0 },
                    { axis: 'Season', value: featured.hypeBreakdown?.season ?? 0 },
                    { axis: 'Excl.', value: featured.hypeBreakdown?.exclusivity ?? 0 },
                    { axis: 'Decay', value: featured.hypeBreakdown?.decay ?? 0 },
                  ]}
                >
                  <PolarGrid stroke="var(--color-border)" />
                  <PolarAngleAxis
                    dataKey="axis"
                    stroke="var(--color-ink-muted)"
                    fontSize={10}
                    tick={{ fill: 'var(--color-ink-muted)' }}
                  />
                  <PolarRadiusAxis
                    stroke="var(--color-ink-faint)"
                    fontSize={9}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Hype"
                    dataKey="value"
                    stroke="var(--color-accent)"
                    fill="var(--color-accent)"
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCategory('all')}
            className={`-mb-px border-b px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
              category === 'all'
                ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`-mb-px border-b px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                category === c
                  ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink-subtle)]">
          {filtered.length} products
        </span>
      </div>

      {/* HYPED GRID */}
      <div className="grid grid-cols-2 gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-3 lg:grid-cols-4">
        {filtered.slice(0, 12).map((p) => (
          <article
            key={p.productId}
            className="bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] text-[var(--color-ink)]" title={p.productName}>
                  {p.productName}
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                  {p.brand}
                </div>
              </div>
              <div className="font-mono text-[20px] tabular-nums text-[var(--color-accent)]">
                {p.hypeScore}
              </div>
            </div>
            <div className="h-0.5 w-full overflow-hidden bg-[var(--color-surface-2)]">
              <div
                className="h-full bg-[var(--color-accent)]"
                style={{ width: `${p.hypeScore}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </PanelShell>
  )
}
