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
import { getConflicts } from '@/lib/analytics'

export function LaunchConflicts() {
  const data = useMemo(() => getConflicts(), [])
  const high = data.conflictDays.filter((d) => d.cannibalizationRisk === 'high').length
  const medium = data.conflictDays.filter((d) => d.cannibalizationRisk === 'medium').length

  return (
    <PanelShell
      category="Market"
      title="Launch Conflict Radar"
      subtitle={`${data.totalConflicts} conflict days detected across ${data.weeklyDensity.length} weeks`}
      caption="Identifies overlapping drop windows that cannibalize demand. Brighter bars = higher launch density in that week."
    >
      {/* KPI strip */}
      <div className="rule mb-8 grid grid-cols-2 gap-x-8 gap-y-4 py-5 md:grid-cols-4">
        <div>
          <div className="label mb-1">Total conflicts</div>
          <div className="hero-num text-[36px] text-[var(--color-ink)]">{data.totalConflicts}</div>
        </div>
        <div>
          <div className="label mb-1">High risk</div>
          <div className="hero-num text-[36px] text-[var(--color-negative)]">{high}</div>
        </div>
        <div>
          <div className="label mb-1">Medium risk</div>
          <div className="hero-num text-[36px] text-[var(--color-warning)]">{medium}</div>
        </div>
        <div>
          <div className="label mb-1">Weeks tracked</div>
          <div className="hero-num text-[36px] text-[var(--color-ink)]">{data.weeklyDensity.length}</div>
        </div>
      </div>

      {/* Weekly density chart */}
      <section className="mb-10">
        <div className="rule" />
        <div className="py-4">
          <div className="label">Weekly launch density</div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.weeklyDensity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="weekStart" stroke="var(--color-ink-subtle)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-ink-subtle)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-2)' }} />
              <Bar dataKey="totalLaunches" fill="var(--color-accent)" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Conflict days list */}
      <section>
        <div className="rule" />
        <div className="py-4">
          <div className="label">Conflict days</div>
        </div>
        <div className="space-y-px">
          {data.conflictDays.slice(0, 8).map((day) => (
            <article
              key={day.date}
              className="flex items-baseline justify-between gap-4 border-b border-[var(--color-border)] py-3 transition-colors hover:bg-[var(--color-surface)]"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink)]">{day.date}</span>
                <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink-muted)]">
                  {day.eventCount} launches
                </span>
                <span
                  className={`text-[10px] uppercase tracking-[0.12em] ${
                    day.cannibalizationRisk === 'high'
                      ? 'text-[var(--color-negative)]'
                      : day.cannibalizationRisk === 'medium'
                        ? 'text-[var(--color-warning)]'
                        : 'text-[var(--color-ink-subtle)]'
                  }`}
                >
                  {day.cannibalizationRisk} risk
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {day.brands.slice(0, 4).map((b) => (
                  <span key={b} className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                    {b}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PanelShell>
  )
}
