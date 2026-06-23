'use client'

import { useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { PanelShell, ChartTooltip } from '@/components/ui/panel-shell'
import { getVolatility } from '@/lib/analytics'
import { fmtPct } from '@/lib/utils'

const RISK_COLOR: Record<string, string> = {
  high: 'var(--color-negative)',
  medium: 'var(--color-warning)',
  low: 'var(--color-positive)',
}

export function FxVolatility() {
  const data = useMemo(() => getVolatility(), [])
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const featured = data.pairs[featuredIdx] ?? data.pairs[0]

  return (
    <PanelShell
      category="Pricing"
      title="Currency Volatility Hedge Calculator"
      subtitle={`90-day FX history · overall risk ${data.overallRisk}/100`}
      caption="Range, volatility, and risk score per currency pair. Higher volatility = greater exposure to FX swings."
    >
      {/* KPI strip */}
      <div className="rule grid grid-cols-2 gap-x-8 gap-y-4 py-5 md:grid-cols-4">
        {data.pairs.slice(0, 4).map((p) => (
          <button
            key={p.pair}
            onClick={() => setFeaturedIdx(data.pairs.indexOf(p))}
            className={`text-left transition-opacity hover:opacity-80 ${
              p.pair === featured.pair ? '' : 'opacity-60'
            }`}
          >
            <div className="label mb-1">{p.pair}</div>
            <div className="hero-num text-[28px] tabular-nums text-[var(--color-ink)]">
              {p.currentRate.toFixed(4)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em]" style={{ color: RISK_COLOR[p.riskLevel] }}>
              {p.riskLevel} risk
            </div>
          </button>
        ))}
      </div>

      {/* Featured chart */}
      <section>
        <div className="rule" />
        <div className="grid grid-cols-1 gap-8 py-5 lg:grid-cols-[1fr,300px]">
          <div>
            <div className="mb-1 label">90-day series</div>
            <h3 className="font-display text-[20px] font-medium tracking-tight text-[var(--color-ink)]">
              {featured?.pair}
            </h3>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={featured?.series || []} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`fx-${featured?.pair}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--color-border)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="var(--color-ink-subtle)"
                    fontSize={10}
                    interval="preserveStartEnd"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--color-ink-subtle)"
                    fontSize={10}
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--color-ink-faint)' }} />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="var(--color-accent)"
                    strokeWidth={1.5}
                    fill={`url(#fx-${featured?.pair})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col justify-center lg:border-l lg:border-[var(--color-border)] lg:pl-8">
            <div className="label">90-day change</div>
            <div
              className="hero-num mt-1 text-[64px]"
              style={{
                color:
                  (featured?.change90dPct ?? 0) >= 0 ? 'var(--color-negative)' : 'var(--color-positive)',
              }}
            >
              {fmtPct(featured?.change90dPct ?? 0)}
            </div>
            <div className="mt-2 font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)]">
              {featured?.min.toFixed(4)} → {featured?.max.toFixed(4)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
              range {featured?.rangePct.toFixed(2)}% · volatility {featured?.volatilityPct.toFixed(2)}%
            </div>
          </div>
        </div>
      </section>
    </PanelShell>
  )
}
