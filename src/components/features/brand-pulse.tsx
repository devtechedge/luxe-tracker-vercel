'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBrandPulse } from '@/lib/analytics'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function BrandPulse() {
  const data = useMemo(() => getBrandPulse(), [])
  const [featured, ...rest] = data.brands

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>💓 Brand Pulse Radar</CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            5-dimensional brand health · prestige × pricing × hype × velocity × stock
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {data.brands.map((b) => {
            const color = BRAND_COLORS[b.brand] || '#f97316'
            return (
              <div
                key={b.brandId}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{b.logo}</span>
                      <div>
                        <div className="text-base font-semibold text-white">{b.brand}</div>
                        <div className="text-[10px] text-gray-500">{b.country}</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color }}>
                      {b.overallScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">
                      Pulse Index
                    </div>
                  </div>
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer>
                    <RadarChart
                      data={[
                        { axis: 'Prestige', value: b.dimensions.prestige },
                        { axis: 'Pricing', value: b.dimensions.pricingPower },
                        { axis: 'Hype', value: b.dimensions.hypeIndex },
                        { axis: 'Velocity', value: b.dimensions.launchVelocity },
                        { axis: 'Stock', value: b.dimensions.stockHealth },
                      ]}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="axis" stroke="rgba(255,255,255,0.5)" fontSize={10} />
                      <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={9} domain={[0, 100]} />
                      <Radar
                        name={b.brand}
                        dataKey="value"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.3}
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
                <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-500">Products:</span>{' '}
                    <span className="text-white">{b.productCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Upcoming:</span>{' '}
                    <span className="text-white">{b.upcomingLaunches}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Avg hype:</span>{' '}
                    <span className="text-orange-400">{b.avgHypeScore}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Stock health:</span>{' '}
                    <span className="text-white">{b.dimensions.stockHealth}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
