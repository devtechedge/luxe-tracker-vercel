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
import { getTelemetry } from '@/lib/analytics'
import { fmtEUR, fmtNum, fmtPct } from '@/lib/utils'
import { TrendingUp, TrendingDown, Globe, Activity, AlertTriangle, Flame } from 'lucide-react'

export function TelemetryOverview() {
  const data = useMemo(() => getTelemetry(), [])
  const o = data.overview

  const kpis = [
    {
      label: 'Products',
      value: fmtNum(o.totalProducts),
      icon: Activity,
      accent: '#3b82f6',
      glow: 'bg-glow-emerald',
    },
    {
      label: 'Brands',
      value: fmtNum(o.totalBrands),
      icon: Globe,
      accent: '#a855f7',
      glow: '',
    },
    {
      label: 'Launches',
      value: fmtNum(o.totalLaunches),
      icon: Flame,
      accent: '#f97316',
      glow: 'bg-glow-amber',
    },
    {
      label: 'Avg Disp.',
      value: `${o.avgDisparityOverall >= 0 ? '+' : ''}${o.avgDisparityOverall.toFixed(2)}%`,
      icon: o.avgDisparityOverall > 0 ? TrendingUp : TrendingDown,
      accent: o.avgDisparityOverall > 5 ? '#ef4444' : o.avgDisparityOverall > 0 ? '#f59e0b' : '#10b981',
      glow: 'bg-glow-red',
    },
    {
      label: 'Max Disp.',
      value: `${o.maxDisparityOverall.toFixed(1)}%`,
      icon: AlertTriangle,
      accent: '#ef4444',
      glow: 'bg-glow-red',
    },
    {
      label: 'Avg Hype',
      value: String(o.avgHypeScore),
      icon: Flame,
      accent: '#f97316',
      glow: 'bg-glow-amber',
    },
    {
      label: 'High Duty',
      value: fmtNum(o.highDutyProducts),
      icon: AlertTriangle,
      accent: '#f59e0b',
      glow: '',
    },
    {
      label: 'Low Stock',
      value: fmtNum(o.limitedStockCount),
      icon: AlertTriangle,
      accent: '#a855f7',
      glow: '',
    },
  ]

  return (
    <>
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <div
              key={k.label}
              className={`relative overflow-hidden rounded-lg border border-white/5 bg-[#0d1220] p-4 ${k.glow}`}
              style={{
                boxShadow: `0 0 20px -8px ${k.accent}55`,
              }}
            >
              <div className="mb-2 flex items-center gap-1.5">
                <div
                  className="flex size-6 items-center justify-center rounded-md"
                  style={{ backgroundColor: `${k.accent}20` }}
                >
                  <Icon className="size-3" style={{ color: k.accent }} />
                </div>
                <span className="text-[10px] uppercase tracking-wider text-gray-500">
                  {k.label}
                </span>
              </div>
              <div
                className="font-mono text-lg font-bold leading-tight"
                style={{ color: k.accent }}
              >
                {k.value}
              </div>
            </div>
          )
        })}
      </div>

      {/* Region / brand disparity bars */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              <Globe className="size-4 text-amber-400" />
              Avg Disparity by Region
            </CardTitle>
            <p className="text-[11px] text-gray-500">Markup vs EU baseline</p>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={data.regionSummary}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                  />
                  <YAxis dataKey="region" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1220',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                    formatter={(v: number) => `${v.toFixed(2)}%`}
                  />
                  <Bar dataKey="avgDisparityPct" fill="#f97316" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Flame className="size-4 text-orange-400" />
              Avg Disparity by Brand
            </CardTitle>
            <p className="text-[11px] text-gray-500">Which brands carry highest premium</p>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer>
                <BarChart
                  data={data.brandSummary}
                  layout="vertical"
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    tickFormatter={(v) => `${v.toFixed(0)}%`}
                  />
                  <YAxis dataKey="brand" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0d1220',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 6,
                      fontSize: 11,
                    }}
                    formatter={(v: number) => `${v.toFixed(2)}%`}
                  />
                  <Bar dataKey="avgDisparityPct" fill="#a855f7" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
