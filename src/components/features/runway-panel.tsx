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
import { getRunway } from '@/lib/analytics'
import { fmtNum } from '@/lib/utils'

export function RunwayPanel() {
  const data = useMemo(() => getRunway(), [])

  const cityChart = useMemo(
    () => Object.entries(data.byCity).map(([city, count]) => ({ city, count })),
    [data],
  )

  const cityColor = '#a855f7'

  return (
    <PanelShell
      category="Luxury"
      title="Runway Collection Tracker"
      subtitle={`${data.totalShows} shows across ${data.cities.length} cities`}
      caption="Maison-level runway calendar with mood, venue, and look-count tracking. Seasonal cadence drives demand forecasts."
    >
      <section className="mb-8">
        <div className="rule" />
        <div className="py-5">
          <div className="label">Shows by city</div>
        </div>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cityChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="city" stroke="var(--color-ink-muted)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-ink-subtle)" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-surface-2)' }} />
              <Bar dataKey="count" fill={cityColor} radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <div className="rule" />
        <div className="py-5">
          <div className="label">Recent shows</div>
        </div>
        <div className="space-y-px">
          {data.shows.slice(0, 10).map((show) => (
            <article
              key={show.id}
              className="grid grid-cols-1 gap-3 border-b border-[var(--color-border)] py-4 transition-colors hover:bg-[var(--color-surface)] md:grid-cols-[1fr,200px,140px]"
            >
              <div className="min-w-0">
                <div className="text-[13px] text-[var(--color-ink)]">{show.showName}</div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                  <span>{show.season} {show.year}</span>
                  <span>·</span>
                  <span>{show.city}</span>
                  <span>·</span>
                  <span>{show.lookCount} looks</span>
                  <span>·</span>
                  <span>{show.standouts} standouts</span>
                  {show.mood && (
                    <>
                      <span>·</span>
                      <span className="text-[var(--color-ink-muted)]">{show.mood}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)] md:text-right">
                {new Date(show.showDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="font-mono text-[12px] tabular-nums text-[var(--color-ink-subtle)] md:text-right">
                {show.brand.name}
              </div>
            </article>
          ))}
        </div>
      </section>
    </PanelShell>
  )
}
