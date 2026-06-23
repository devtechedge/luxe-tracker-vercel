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
import { Badge } from '@/components/ui/badge'
import { getHype } from '@/lib/analytics'
import { Flame } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export function HypePredictor() {
  const data = useMemo(() => getHype(), [])
  const [category, setCategory] = useState<string>('all')

  const filtered = useMemo(() => {
    return category === 'all'
      ? data.topHyped
      : data.allProducts.filter((p) => p.category === category)
  }, [data, category])

  const featured = filtered[0]
  const radarData = featured?.hypeBreakdown
    ? [
        { axis: 'Brand Tier', value: featured.hypeBreakdown.brandTier },
        { axis: 'Category', value: featured.hypeBreakdown.category },
        { axis: 'Season', value: featured.hypeBreakdown.season },
        { axis: 'Exclusivity', value: featured.hypeBreakdown.exclusivity },
        { axis: 'Decay', value: featured.hypeBreakdown.decay },
      ]
    : []

  const categories = Array.from(new Set(data.allProducts.map((p) => p.category)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Flame className="size-4 text-[var(--color-negative)]" />
              Launch Hype Predictor
            </CardTitle>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              Predicted demand for {data.totalProducts} products · avg hype{' '}
              <span className="font-mono text-[var(--color-accent)]">{data.avgHypeScore}</span>
            </p>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-md border border-[var(--color-border)] bg-white/[0.03] px-2 text-xs text-[var(--color-ink)]"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        {featured && (
          <div className="mb-4 grid grid-cols-1 gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-xs uppercase tracking-wider text-[var(--color-ink-muted)]">
                Top Hype: {featured.brand}
              </div>
              <div className="text-lg font-semibold text-[var(--color-ink)]">{featured.productName}</div>
              <div className="mt-1 text-[11px] text-[var(--color-ink-muted)]">{featured.sku}</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="text-3xl font-bold text-[var(--color-accent)]">{featured.hypeScore}</div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                  Hype Index
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-[var(--color-ink-muted)]">Edition:</span>{' '}
                  <span className="text-[var(--color-ink)]">{featured.editionType}</span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-muted)]">Resale idx:</span>{' '}
                  <span className="font-mono text-[var(--color-ink)]">
                    {featured.resaleValueIdx.toFixed(2)}×
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-muted)]">Days to launch:</span>{' '}
                  <span className="font-mono text-[var(--color-ink)]">
                    {featured.daysToLaunch ?? '—'}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-ink-muted)]">Region:</span>{' '}
                  <span className="text-[var(--color-ink)]">{featured.launchRegion ?? '—'}</span>
                </div>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="axis" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                  <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                  <Radar
                    name="Hype"
                    dataKey="value"
                    stroke="#f97316"
                    fill="#f97316"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1220',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.slice(0, 12).map((p) => (
            <div
              key={p.productId}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium text-[var(--color-ink)]" title={p.productName}>
                    {p.productName}
                  </div>
                  <div className="text-[10px] text-[var(--color-ink-muted)]">{p.brand}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-base font-bold text-[var(--color-accent)]">
                    {p.hypeScore}
                  </span>
                </div>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${p.hypeScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
