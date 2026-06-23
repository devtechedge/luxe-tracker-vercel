'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { getTrends } from '@/lib/analytics'
import { TrendingUp, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const TYPE_ICONS: Record<string, string> = {
  color: '🎨',
  material: '🧵',
  silhouette: '👗',
  accessory: '💍',
  vibe: '✨',
}

export function TrendForecastPanel() {
  const allTrends = useMemo(() => getTrends(), [])
  const [season, setSeason] = useState<string>('all')

  const filtered = useMemo(() => {
    return season === 'all' ? allTrends : allTrends.filter((t) => t.season === season)
  }, [allTrends, season])

  const seasons = Array.from(new Set(allTrends.map((t) => t.season)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Sparkles className="size-4 text-pink-400" />
              Seasonal Trend Forecast
            </CardTitle>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              {allTrends.length} predicted trends · intensity + confidence scoring
            </p>
          </div>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="h-9 rounded-md border border-[var(--color-border)] bg-white/[0.03] px-2 text-xs text-[var(--color-ink)]"
          >
            <option value="all">All seasons</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 12).map((t) => {
            const intensityColor =
              t.intensity >= 80 ? '#ef4444' : t.intensity >= 60 ? '#f97316' : '#f59e0b'
            return (
              <div
                key={t.id}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
                style={{ borderLeftColor: intensityColor, borderLeftWidth: 3 }}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-base font-semibold text-[var(--color-ink)]">
                      {TYPE_ICONS[t.trendType] || '✨'} {t.trendName}
                    </div>
                    <div className="text-[11px] text-[var(--color-ink-muted)]">
                      {t.season} {t.year} · {t.category}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] uppercase">
                    {t.trendType}
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="mb-0.5 flex justify-between text-[11px]">
                      <span className="text-[var(--color-ink-muted)]">Intensity</span>
                      <span className="font-mono font-bold" style={{ color: intensityColor }}>
                        {t.intensity}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${t.intensity}%`, backgroundColor: intensityColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-0.5 flex justify-between text-[11px]">
                      <span className="text-[var(--color-ink-muted)]">Confidence</span>
                      <span className="font-mono text-[var(--color-ink)]">{t.confidence}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        style={{ width: `${t.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
                {t.keyBrands && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {(JSON.parse(t.keyBrands) as string[]).map((b) => (
                      <Badge key={b} variant="outline" className="text-[10px]">
                        {b}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
