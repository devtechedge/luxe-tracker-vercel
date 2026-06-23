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
import { getRunway } from '@/lib/analytics'
import { Calendar, MapPin, Sparkles } from 'lucide-react'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function RunwayPanel() {
  const data = useMemo(() => getRunway(), [])

  const cityChart = useMemo(
    () =>
      Object.entries(data.byCity).map(([city, count]) => ({
        city,
        count,
      })),
    [data],
  )

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <Sparkles className="size-4 text-purple-400" />
            Runway Collection Tracker
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            {data.totalShows} shows across {data.cities.length} cities
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-48 w-full">
          <ResponsiveContainer>
            <BarChart data={cityChart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="city" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1220',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: 11,
                }}
              />
              <Bar dataKey="count" fill="#a855f7" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {data.shows.slice(0, 10).map((show) => {
            const color = BRAND_COLORS[show.brand.name] || '#a855f7'
            return (
              <div
                key={show.id}
                className="rounded-md border border-white/5 bg-white/[0.02] p-3"
                style={{ borderLeftColor: color, borderLeftWidth: 3 }}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white">{show.showName}</div>
                    <div className="mt-0.5 text-[11px] text-gray-500">
                      {show.season} {show.year} · {show.lookCount} looks · {show.standouts} standouts
                    </div>
                  </div>
                  <Badge variant="secondary">{show.brand.name}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="size-3" />
                    {new Date(show.showDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="size-3" />
                    {show.city}
                  </div>
                  {show.mood && (
                    <Badge variant="outline" className="text-[10px]">
                      {show.mood}
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
