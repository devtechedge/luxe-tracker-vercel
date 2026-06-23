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
      <div className="rule grid grid-cols-2 gap-x-8 gap-y-6 py-6 md:grid-cols-4">
        <div className="min-w-0">
          <div className="label mb-1.5">Total conflicts</div>
          <div className="hero-num text-[28px] text-[var(--color-ink)]">{data.totalConflicts}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">High risk</div>
          <div className="hero-num text-[28px] text-[var(--color-negative)]">{high}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">Medium risk</div>
          <div className="hero-num text-[28px] text-[var(--color-warning)]">{medium}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">Weeks tracked</div>
          <div className="hero-num text-[28px] text-[var(--color-ink)]">{data.weeklyDensity.length}</div>
        </div>
      </div>

      {/* Weekly density chart */}
      <section className="mb-10">
        <div className="rule" />
        <div className="py-5">
          <div className="label">Weekly launch density</div>
        </div>
        <div className="h-[260px]">
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
        <div className="py-5">
          <div className="label">Conflict days</div>
        </div>
        <div className="space-y-px">
          {data.conflictDays.slice(0, 8).map((day) => (
            <article
              key={day.date}
              className="flex flex-col gap-1 border-b border-[var(--color-border)] py-4 transition-colors hover:bg-[var(--color-surface)] md:flex-row md:items-baseline md:justify-between md:gap-4"
            >
              <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
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
              <div className="flex flex-wrap items-center gap-3 mt-1 md:mt-0">
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
