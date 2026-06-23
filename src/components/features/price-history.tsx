'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getPriceHistory } from '@/lib/analytics'
import { getSnapshot } from '@/lib/data-snapshot'
import { fmtPct } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function PriceHistory() {
  const data = useMemo(() => getPriceHistory(), [])
  const snap = getSnapshot()

  // Pick the most volatile product to chart
  const featuredSeries = useMemo(() => {
    if (data.topMovers.length === 0) return null
    const top = data.topMovers[0]
    const product = snap.products.find((p) => p.id === top.productId)
    if (!product) return null
    const series = product.priceHistory
      .filter((ph) => ph.region === top.region)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((ph) => ({
        date: ph.date.slice(5),
        price: ph.price,
        anomaly: ph.anomalyFlag,
      }))
    return { ...top, series, product }
  }, [data, snap])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <span className="text-amber-400">📈</span> Price History & Trend Charts
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            90-day daily price series · {data.totalSeries} tracked series ·{' '}
            <span className="text-orange-400">{data.totalAnomalies} anomalies</span> (≥3% moves)
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {featuredSeries && (
          <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white">
                  {featuredSeries.productName}
                </div>
                <div className="text-[11px] text-gray-500">
                  {featuredSeries.brand} · {featuredSeries.region} · {featuredSeries.series.length} data points
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`flex items-center gap-1 text-lg font-bold ${
                    featuredSeries.change90dPct >= 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}
                >
                  {featuredSeries.change90dPct >= 0 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  {fmtPct(featuredSeries.change90dPct)}
                </div>
                <div className="text-[10px] text-gray-500">90-day change</div>
              </div>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer>
                <LineChart data={featuredSeries.series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    interval="preserveStartEnd"
                  />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1220',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                  />
                  <ReferenceLine y={featuredSeries.startPrice} stroke="#10b981" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Top movers table */}
        <div className="max-h-[280px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-[#0d1220]">
              <tr className="border-b border-white/5 text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 text-left font-medium">Product</th>
                <th className="px-3 py-2 text-left font-medium">Region</th>
                <th className="px-3 py-2 text-right font-medium">Start</th>
                <th className="px-3 py-2 text-right font-medium">Now</th>
                <th className="px-3 py-2 text-right font-medium">90d Δ</th>
                <th className="px-3 py-2 text-right font-medium">Anomalies</th>
              </tr>
            </thead>
            <tbody>
              {data.topMovers.slice(0, 15).map((m) => (
                <tr key={`${m.productId}-${m.region}`} className="border-b border-white/[0.02] hover:bg-white/[0.02]">
                  <td className="max-w-[180px] truncate px-3 py-2 font-medium text-white">
                    {m.productName}
                    <div className="text-[10px] text-gray-500">{m.brand}</div>
                  </td>
                  <td className="px-3 py-2 text-gray-400">{m.region}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-400">{m.startPrice}</td>
                  <td className="px-3 py-2 text-right font-mono text-white">{m.endPrice}</td>
                  <td className="px-3 py-2 text-right font-mono">
                    <Badge
                      variant={m.change90dPct > 0 ? 'destructive' : 'success'}
                    >
                      {fmtPct(m.change90dPct)}
                    </Badge>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-orange-300">
                    {m.anomalyCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
