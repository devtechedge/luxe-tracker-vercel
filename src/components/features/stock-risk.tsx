'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getStockRisk } from '@/lib/analytics'
import { AlertTriangle, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

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
            <AlertTriangle className="size-4 text-[var(--color-negative)]" />
            Stock-Out Risk Index
          </CardTitle>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            {data.totalEntries} SKU-region combinations ·{' '}
            <span className="text-[var(--color-negative)]">{data.criticalCount} critical</span> ·{' '}
            <span className="text-[var(--color-accent)]">{data.highCount} high</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.topRisks.slice(0, 12).map((r) => (
            <div
              key={`${r.productId}-${r.region}`}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--color-ink)]">
                    {r.productName}
                  </div>
                  <div className="text-[11px] text-[var(--color-ink-muted)]">
                    {r.brand} · {r.region} · {r.category}
                  </div>
                </div>
                <Badge variant={RISK_COLORS[r.riskLevel]}>{r.riskLevel}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 text-[11px]">
                <div>
                  <div className="text-[var(--color-ink-muted)]">Stock</div>
                  <div className="font-mono text-[var(--color-ink)]">{r.stockLevel}%</div>
                  <Progress
                    value={r.stockLevel}
                    className="mt-1"
                    indicatorClassName={
                      r.stockLevel < 30
                        ? 'bg-[var(--color-negative)]'
                        : r.stockLevel < 60
                          ? 'bg-[var(--color-accent)]'
                          : 'bg-[var(--color-positive)]'
                    }
                  />
                </div>
                <div>
                  <div className="text-[var(--color-ink-muted)]">Risk Score</div>
                  <div className="font-mono font-bold text-[var(--color-accent)]">{r.riskScore}</div>
                </div>
                <div>
                  <div className="text-[var(--color-ink-muted)]">Days to sellout</div>
                  <div className="font-mono text-[var(--color-ink)]">{r.estimatedDaysToStockout}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
