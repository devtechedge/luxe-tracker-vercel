'use client'

import { useMemo } from 'react'
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
import { getBrandPulse } from '@/lib/analytics'

const BRAND_COLOR: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function BrandPulse() {
  const data = useMemo(() => getBrandPulse(), [])
  const headline = data.brands[0]

  return (
    <PanelShell
      category="Market"
      title="Brand Pulse"
      subtitle="Five-dimensional brand health index"
      caption="Composite score from prestige, pricing power, hype, launch velocity, and stock availability."
    >
      {/* HEADLINE METRIC */}
      {headline && (
        <div className="rule mb-8 grid grid-cols-1 gap-6 py-6 lg:grid-cols-[1fr,1fr]">
          <div>
            <div className="label mb-1">Leading brand</div>
            <h3 className="font-display text-[26px] font-medium tracking-tight text-[var(--color-ink)]">
              {headline.brand}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
              {headline.country} · {headline.productCount} products ·{' '}
              {headline.upcomingLaunches} upcoming
            </p>
          </div>
          <div>
            <div className="label">Pulse Index</div>
            <div className="hero-num mt-1 text-[80px]" style={{ color: BRAND_COLOR[headline.brand] }}>
              {headline.overallScore}
              <span className="text-[36px] text-[var(--color-ink-subtle)]">/100</span>
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
              Avg hype {headline.avgHypeScore}
            </div>
          </div>
        </div>
      )}

      {/* PER-BRAND RADAR GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.brands.map((b) => {
          const color = BRAND_COLOR[b.brand] || 'var(--color-accent)'
          return (
            <article key={b.brandId} className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <div className="font-display text-[18px] font-medium tracking-tight text-[var(--color-ink)]">
                    {b.brand}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    {b.country}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-[28px] tabular-nums" style={{ color }}>
                    {b.overallScore}
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.14em] text-[var(--color-ink-faint)]">
                    /100
                  </div>
                </div>
              </div>

              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    data={[
                      { axis: 'Prestige', value: b.dimensions.prestige },
                      { axis: 'Pricing', value: b.dimensions.pricingPower },
                      { axis: 'Hype', value: b.dimensions.hypeIndex },
                      { axis: 'Velocity', value: b.dimensions.launchVelocity },
                      { axis: 'Stock', value: b.dimensions.stockHealth },
                    ]}
                  >
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis
                      dataKey="axis"
                      stroke="var(--color-ink-subtle)"
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
                      name={b.brand}
                      dataKey="value"
                      stroke={color}
                      fill={color}
                      fillOpacity={0.18}
                      strokeWidth={1.5}
                    />
                    <Tooltip content={<ChartTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 grid grid-cols-5 gap-px border-t border-[var(--color-border)] pt-3">
                {Object.entries(b.dimensions).map(([key, val]) => (
                  <div key={key} className="text-center">
                    <div className="font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
                      {val}
                    </div>
                    <div className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                      {key.replace('pricingPower', 'Pricing').replace('launchVelocity', 'Velocity')}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </PanelShell>
  )
}
