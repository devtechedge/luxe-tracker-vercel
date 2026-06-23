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
import { getSustainability } from '@/lib/analytics'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function SustainabilityPanel() {
  const metrics = useMemo(() => getSustainability(), [])

  return (
    <PanelShell
      category="Luxury"
      title="Sustainability Scores"
      subtitle="ESG report 2025 · carbon, materials, supply, circularity, labor"
      caption="Composite sustainability scores per maison. Higher = better ESG performance."
    >
      {/* KPI strip */}
      <div className="rule grid grid-cols-2 gap-x-8 gap-y-4 py-5 md:grid-cols-5">
        {metrics.map((m) => (
          <div key={m.brandId}>
            <div className="label mb-1">{m.brand}</div>
            <div className="hero-num text-[28px] tabular-nums" style={{ color: BRAND_COLORS[m.brand] }}>
              {m.overallScore}
            </div>
          </div>
        ))}
      </div>

      {/* Per-brand grid */}
      <section>
        <div className="rule" />
        <div className="py-5">
          <div className="label">Per-dimension detail</div>
        </div>
        <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 xl:grid-cols-3">
          {metrics.map((m) => {
            const color = BRAND_COLORS[m.brand] || 'var(--color-accent)'
            return (
              <article key={m.brandId} className="bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]">
                <div className="mb-3 flex items-baseline justify-between">
                  <h4 className="font-display text-[18px] font-medium tracking-tight text-[var(--color-ink)]">
                    {m.brand}
                  </h4>
                  <span className="font-mono text-[20px] tabular-nums" style={{ color }}>
                    {m.overallScore}
                  </span>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={[
                        { axis: 'Carbon', value: m.carbonScore },
                        { axis: 'Materials', value: m.materialSourcing },
                        { axis: 'Supply', value: m.supplyChainTransparency },
                        { axis: 'Circular', value: m.circularityIndex },
                        { axis: 'Labor', value: m.laborPracticeScore },
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
                        name={m.brand}
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
                  {[
                    { label: 'C', value: m.carbonScore },
                    { label: 'M', value: m.materialSourcing },
                    { label: 'S', value: m.supplyChainTransparency },
                    { label: 'R', value: m.circularityIndex },
                    { label: 'L', value: m.laborPracticeScore },
                  ].map((d) => (
                    <div key={d.label} className="text-center">
                      <div className="font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
                        {d.value}
                      </div>
                      <div className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
                        {d.label}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </PanelShell>
  )
}
