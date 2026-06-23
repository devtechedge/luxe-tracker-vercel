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
import { PanelShell, ChartTooltip } from '@/components/ui/panel-shell'
import { getCompetitiveMatrix } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function CompetitiveMatrix() {
  const data = useMemo(() => getCompetitiveMatrix(), [])

  const chartData = useMemo(
    () =>
      data.categories.map((cat) => {
        const row: Record<string, any> = { category: cat.category }
        for (const b of cat.brands) row[b.brand] = b.avgPriceEUR
        return row
      }),
    [data],
  )

  return (
    <PanelShell
      category="Market"
      title="Competitive Brand Comparison"
      subtitle="Average EU retail price per category"
      caption="Which brand carries the value-leader title, and which commands the premium. Spread = dispersion within category."
    >
      <section className="mb-8">
        <div className="rule" />
        <div className="py-5">
          <div className="label">EU price by category × brand</div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--color-ink-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis
                stroke="var(--color-ink-subtle)"
                fontSize={10}
                tickFormatter={(v) => `€${v}`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => fmtEUR(v, 0)} />} cursor={{ fill: 'var(--color-surface-2)' }} />
              {Object.keys(BRAND_COLORS).map((brand) => (
                <Bar
                  key={brand}
                  dataKey={brand}
                  fill={BRAND_COLORS[brand]}
                  radius={[1, 1, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <div className="rule" />
        <div className="py-5">
          <div className="label">By category</div>
        </div>
        <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 xl:grid-cols-3">
          {data.categories.map((cat) => (
            <article key={cat.category} className="bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]">
              <div className="mb-3 flex items-baseline justify-between">
                <h4 className="font-display text-[15px] font-medium tracking-tight text-[var(--color-ink)]">
                  {cat.category}
                </h4>
                <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink-subtle)]">
                  {cat.totalProducts} products
                </span>
              </div>
              <dl className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-subtle)]">Value leader</dt>
                  <dd className="font-medium text-[var(--color-positive)]">{cat.valueLeader}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-subtle)]">Premium leader</dt>
                  <dd className="font-medium text-[var(--color-accent)]">{cat.premiumLeader}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-ink-subtle)]">Spread</dt>
                  <dd className="font-mono tabular-nums text-[var(--color-ink)]">
                    {fmtEUR(cat.priceSpreadEUR, 0)} ({cat.priceSpreadPct.toFixed(1)}%)
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </PanelShell>
  )
}
