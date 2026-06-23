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
import { Badge } from '@/components/ui/badge'
import { getVolatility } from '@/lib/analytics'
import { fmtPct } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const RISK_COLORS: Record<string, 'destructive' | 'warning' | 'success'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'success',
}

export function FxVolatility() {
  const data = useMemo(() => getVolatility(), [])
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const featured = data.pairs[featuredIdx] || data.pairs[0]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>💱 Currency Volatility Hedge Calculator</CardTitle>
            <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
              90-day FX history · overall risk: {data.overallRisk}/100
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Featured chart */}
        <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[var(--color-ink)]">{featured?.pair}</div>
              <div className="text-[11px] text-[var(--color-ink-muted)]">90-day daily series</div>
            </div>
            <Badge variant={RISK_COLORS[featured?.riskLevel || 'low']}>
              {featured?.riskLevel?.toUpperCase()} RISK · {featured?.riskScore}
            </Badge>
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer>
              <AreaChart
                data={featured?.series || []}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`fx-${featured?.pair}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} interval="preserveStartEnd" />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={10}
                  domain={['dataMin - 0.05', 'dataMax + 0.05']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1220',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill={`url(#fx-${featured?.pair})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3 text-center">
            <Stat label="Current" value={featured?.currentRate.toFixed(4) || '—'} />
            <Stat label="Min" value={featured?.min.toFixed(4) || '—'} accent="emerald" />
            <Stat label="Max" value={featured?.max.toFixed(4) || '—'} accent="red" />
            <Stat
              label="90d Change"
              value={(featured?.change90dPct ?? 0) >= 0 ? fmtPct(featured?.change90dPct ?? 0) : fmtPct(featured?.change90dPct ?? 0)}
              accent={(featured?.change90dPct ?? 0) >= 0 ? 'red' : 'emerald'}
            />
          </div>
        </div>

        {/* Pair selector grid */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {data.pairs.map((p, i) => (
            <button
              key={p.pair}
              onClick={() => setFeaturedIdx(i)}
              className={`flex items-center justify-between rounded-md border p-3 text-left transition-all ${
                i === featuredIdx
                  ? 'border-[var(--color-border-strong)] bg-[var(--color-accent)]/5'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-white/[0.04]'
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-[var(--color-ink)]">{p.pair}</div>
                <div className="text-[10px] text-[var(--color-ink-muted)]">
                  Vol: {p.volatilityPct.toFixed(2)}% · Range: {p.rangePct.toFixed(2)}%
                </div>
              </div>
              <Badge variant={RISK_COLORS[p.riskLevel]}>{p.riskLevel}</Badge>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: 'emerald' | 'red' }) {
  const color = accent === 'emerald' ? '#10b981' : accent === 'red' ? '#ef4444' : '#94a3b8'
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  )
}
