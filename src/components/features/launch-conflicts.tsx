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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getConflicts } from '@/lib/analytics'

const RISK_COLORS: Record<string, 'destructive' | 'warning' | 'success'> = {
  high: 'destructive',
  medium: 'warning',
  low: 'success',
}

export function LaunchConflicts() {
  const data = useMemo(() => getConflicts(), [])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>⚔️ Launch Conflict Radar</CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            <span className="text-orange-400">{data.totalConflicts} conflict days</span> detected ·{' '}
            cannibalization across brands
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {/* Weekly density chart */}
        <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
          <div className="mb-2 text-xs uppercase tracking-wider text-gray-500">
            Weekly launch density
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer>
              <BarChart data={data.weeklyDensity} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                <XAxis dataKey="weekStart" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d1220',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="totalLaunches" fill="#f97316" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conflict days */}
        <div className="space-y-2">
          {data.conflictDays.slice(0, 8).map((day) => (
            <div
              key={day.date}
              className="rounded-md border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-white">
                    {day.date}
                  </span>
                  <Badge variant="secondary">{day.eventCount} launches</Badge>
                  <Badge variant={RISK_COLORS[day.cannibalizationRisk]}>
                    {day.cannibalizationRisk} risk
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {day.brands.slice(0, 3).map((b) => (
                    <Badge key={b} variant="outline" className="text-[10px]">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-1 text-[11px]">
                {day.events.slice(0, 3).map((e, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className="size-1 rounded-full bg-orange-500" />
                    <span className="truncate">{e.productName}</span>
                    <span className="text-gray-600">·</span>
                    <span>{e.region}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
