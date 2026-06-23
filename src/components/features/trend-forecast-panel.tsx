'use client'

import { useMemo, useState } from 'react'
import { PanelShell } from '@/components/ui/panel-shell'
import { getTrends } from '@/lib/analytics'

const TYPE_LABEL: Record<string, string> = {
  color: 'Color',
  material: 'Material',
  silhouette: 'Silhouette',
  accessory: 'Accessory',
  vibe: 'Vibe',
}

export function TrendForecastPanel() {
  const allTrends = useMemo(() => getTrends(), [])
  const [season, setSeason] = useState<string>('all')

  const filtered = useMemo(() => {
    return season === 'all' ? allTrends : allTrends.filter((t) => t.season === season)
  }, [allTrends, season])

  const seasons = Array.from(new Set(allTrends.map((t) => t.season)))

  return (
    <PanelShell
      category="Luxury"
      title="Seasonal Trend Forecast"
      subtitle={`${allTrends.length} predicted trends · ${seasons.length} seasons tracked`}
      caption="Composite intensity + confidence score. Each trend is scored on predicted demand strength and forecast reliability."
    >
      {/* Season filter */}
      <div className="mb-4 flex items-center justify-between border-b border-[var(--color-border)]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSeason('all')}
            className={`-mb-px border-b px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
              season === 'all'
                ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
            }`}
          >
            All seasons
          </button>
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => setSeason(s)}
              className={`-mb-px border-b px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-colors ${
                season === s
                  ? 'border-[var(--color-accent)] text-[var(--color-ink)]'
                  : 'border-transparent text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink-subtle)]">
          {filtered.length} trends
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] md:grid-cols-2 xl:grid-cols-3">
        {filtered.slice(0, 12).map((t) => {
          const intensityColor =
            t.intensity >= 80
              ? 'var(--color-negative)'
              : t.intensity >= 60
                ? 'var(--color-accent)'
                : 'var(--color-warning)'
          return (
            <article
              key={t.id}
              className="bg-[var(--color-bg)] p-4 transition-colors hover:bg-[var(--color-surface)]"
              style={{ borderLeft: `2px solid ${intensityColor}` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-[15px] font-medium tracking-tight text-[var(--color-ink)]">
                    {t.trendName}
                  </div>
                  <div className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    {t.season} {t.year} · {t.category}
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
                  {TYPE_LABEL[t.trendType] || t.trendType}
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="mb-0.5 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>Intensity</span>
                    <span className="font-mono tabular-nums" style={{ color: intensityColor }}>
                      {t.intensity}
                    </span>
                  </div>
                  <div className="h-1 w-full overflow-hidden bg-[var(--color-surface-2)]">
                    <div
                      className="h-full transition-all duration-300"
                      style={{ width: `${t.intensity}%`, backgroundColor: intensityColor }}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-0.5 flex justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>Confidence</span>
                    <span className="font-mono tabular-nums text-[var(--color-ink)]">{t.confidence}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden bg-[var(--color-surface-2)]">
                    <div
                      className="h-full bg-[var(--color-positive)]"
                      style={{ width: `${t.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              {t.keyBrands && (
                <div className="mt-3 flex flex-wrap gap-x-2 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                  {(JSON.parse(t.keyBrands) as string[]).map((b) => (
                    <span key={b}>{b}</span>
                  ))}
                </div>
              )}
            </article>
          )
        })}
      </div>
    </PanelShell>
  )
}
