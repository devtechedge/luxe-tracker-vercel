'use client'

import { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getStockRisk } from '@/lib/analytics'
import { AlertTriangle, Zap } from 'lucide-react'

const RISK_COLORS: Record<string, 'destructive' | 'warning' | 'secondary' | 'success'> = {
  critical: 'destructive',
  high: 'warning',
  medium: 'secondary',
  low: 'success',
}

export function StockRisk() {
  const data = useMemo(() => getStockRisk(), [])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <AlertTriangle className="size-4 text-red-400" />
            Stock-Out Risk Index
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            {data.totalEntries} SKU-region combinations ·{' '}
            <span className="text-red-400">{data.criticalCount} critical</span> ·{' '}
            <span className="text-amber-400">{data.highCount} high</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.topRisks.slice(0, 12).map((r) => (
            <div
              key={`${r.productId}-${r.region}`}
              className="rounded-md border border-white/5 bg-white/[0.02] p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-white">
                    {r.productName}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    {r.brand} · {r.region} · {r.category}
                  </div>
                </div>
                <Badge variant={RISK_COLORS[r.riskLevel]}>{r.riskLevel}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <div className="text-gray-500">Stock</div>
                  <div className="font-mono text-white">{r.stockLevel}%</div>
                  <Progress
                    value={r.stockLevel}
                    className="mt-1"
                    indicatorClassName={
                      r.stockLevel < 30
                        ? 'bg-red-500'
                        : r.stockLevel < 60
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                    }
                  />
                </div>
                <div>
                  <div className="text-gray-500">Risk Score</div>
                  <div className="font-mono font-bold text-orange-400">{r.riskScore}</div>
                </div>
                <div>
                  <div className="text-gray-500">Days to sellout</div>
                  <div className="font-mono text-white">{r.estimatedDaysToStockout}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
