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
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getSustainability } from '@/lib/analytics'
import { Leaf } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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
            <Leaf className="size-4 text-[var(--color-positive)]" />
            Sustainability Scores
          </CardTitle>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
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
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-[var(--color-ink)]">{m.brand}</div>
                    <div className="text-[10px] text-[var(--color-ink-muted)]">FY {m.reportYear}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color }}>
                      {m.overallScore}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
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
        <span className="text-[var(--color-ink-muted)]">{label}</span>
        <span className="font-mono text-[var(--color-ink)]">{value}</span>
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
