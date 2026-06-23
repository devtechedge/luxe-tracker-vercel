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
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCompetitiveMatrix } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function CompetitiveMatrix() {
  const data = useMemo(() => getCompetitiveMatrix(), [])

  // Prepare data for grouped bar chart
  const chartData = useMemo(() => {
    return data.categories.map((cat) => {
      const row: Record<string, any> = { category: cat.category }
      for (const b of cat.brands) {
        row[b.brand] = b.avgPriceEUR
      }
      return row
    })
  }, [data])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>🆚 Competitive Brand Comparison</CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Average EU price per category · value leader vs premium leader
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 h-64 w-full">
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
              <XAxis dataKey="category" stroke="rgba(255,255,255,0.3)" fontSize={11} />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={10}
                tickFormatter={(v) => `€${v}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1220',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(v: number) => fmtEUR(v, 0)}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {Object.keys(BRAND_COLORS).map((brand) => (
                <Bar
                  key={brand}
                  dataKey={brand}
                  fill={BRAND_COLORS[brand]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category summaries */}
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((cat) => (
            <div
              key={cat.category}
              className="rounded-md border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{cat.category}</h4>
                <Badge variant="secondary">{cat.totalProducts} products</Badge>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-500">Value leader:</span>
                  <span className="font-medium text-emerald-400">{cat.valueLeader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Premium leader:</span>
                  <span className="font-medium text-orange-400">{cat.premiumLeader}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spread:</span>
                  <span className="font-mono text-white">
                    {fmtEUR(cat.priceSpreadEUR, 0)} ({cat.priceSpreadPct.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
