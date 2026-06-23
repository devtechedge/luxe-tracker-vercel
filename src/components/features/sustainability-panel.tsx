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
import { Progress } from '@/components/ui/progress'
import { getSustainability } from '@/lib/analytics'
import { Leaf } from 'lucide-react'

const BRAND_COLORS: Record<string, string> = {
  Prada: '#a855f7',
  Gucci: '#10b981',
  Balenciaga: '#ef4444',
  'Louis Vuitton': '#f59e0b',
  Versace: '#3b82f6',
}

export function SustainabilityPanel() {
  const metrics = useMemo(() => getSustainability(), [])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <Leaf className="size-4 text-emerald-400" />
            Sustainability Scores
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            2025 ESG report · carbon, materials, supply, circularity, labor
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((m) => {
            const color = BRAND_COLORS[m.brand] || '#10b981'
            return (
              <div
                key={m.brandId}
                className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-white">{m.brand}</div>
                    <div className="text-[10px] text-gray-500">FY {m.reportYear}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color }}>
                      {m.overallScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500">
                      Overall
                    </div>
                  </div>
                </div>
                <div className="h-32">
                  <ResponsiveContainer>
                    <RadarChart
                      data={[
                        { axis: 'Carbon', value: m.carbonScore },
                        { axis: 'Materials', value: m.materialSourcing },
                        { axis: 'Supply', value: m.supplyChainTransparency },
                        { axis: 'Circular', value: m.circularityIndex },
                        { axis: 'Labor', value: m.laborPracticeScore },
                      ]}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="axis" stroke="rgba(255,255,255,0.5)" fontSize={9} />
                      <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={8} domain={[0, 100]} />
                      <Radar
                        name={m.brand}
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
                          fontSize: 10,
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1.5 text-[11px]">
                  <Bar label="Carbon" value={m.carbonScore} />
                  <Bar label="Materials" value={m.materialSourcing} />
                  <Bar label="Supply" value={m.supplyChainTransparency} />
                  <Bar label="Circular" value={m.circularityIndex} />
                  <Bar label="Labor" value={m.laborPracticeScore} />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function Bar({ label, value }: { label: string; value: number }) {
  const color = value >= 75 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div>
      <div className="mb-0.5 flex justify-between">
        <span className="text-gray-500">{label}</span>
        <span className="font-mono text-white">{value}</span>
      </div>
      <Progress value={value} indicatorClassName="" className="h-1" />
      <div className="mt-[-3px] h-0.5">
        <div
          className="h-1 rounded-full"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
