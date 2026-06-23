'use client'

import { useMemo } from 'react'
import { PanelShell } from '@/components/ui/panel-shell'
import { getStockRisk } from '@/lib/analytics'
import { Progress } from '@/components/ui/progress'

export function StockRisk() {
  const data = useMemo(() => getStockRisk(), [])

  return (
    <PanelShell
      category="Market"
      title="Stock-Out Risk Index"
      subtitle={`${data.totalEntries} SKU × region combinations tracked`}
      caption="Sell-out probability based on inventory fill, hype score, and time to launch. Earlier intervention saves revenue."
    >
      {/* KPI strip */}
      <div className="rule mb-8 grid grid-cols-2 gap-x-8 gap-y-4 py-5 md:grid-cols-4">
        <div>
          <div className="label mb-1">Tracked SKUs</div>
          <div className="hero-num text-[36px] text-[var(--color-ink)]">{data.totalEntries}</div>
        </div>
        <div>
          <div className="label mb-1">Critical</div>
          <div className="hero-num text-[36px] text-[var(--color-negative)]">{data.criticalCount}</div>
        </div>
        <div>
          <div className="label mb-1">High</div>
          <div className="hero-num text-[36px] text-[var(--color-warning)]">{data.highCount}</div>
        </div>
        <div>
          <div className="label mb-1">Avg risk</div>
          <div className="hero-num text-[36px] text-[var(--color-ink)]">
            {data.topRisks.length > 0
              ? Math.round(data.topRisks.reduce((s, r) => s + r.riskScore, 0) / data.topRisks.length)
              : 0}
          </div>
        </div>
      </div>

      {/* Top risks list */}
      <section>
        <div className="rule" />
        <div className="py-4">
          <div className="label">Top risk items</div>
        </div>
        <div className="space-y-px">
          {data.topRisks.slice(0, 10).map((r) => {
            const levelColor =
              r.riskLevel === 'critical'
                ? 'var(--color-negative)'
                : r.riskLevel === 'high'
                  ? 'var(--color-warning)'
                  : r.riskLevel === 'medium'
                    ? 'var(--color-info)'
                    : 'var(--color-positive)'
            return (
              <article
                key={`${r.productId}-${r.region}`}
                className="grid grid-cols-1 gap-3 border-b border-[var(--color-border)] py-4 transition-colors hover:bg-[var(--color-surface)] md:grid-cols-[1fr,200px,140px,80px]"
              >
                <div className="min-w-0">
                  <div className="text-[13px] text-[var(--color-ink)]">{r.productName}</div>
                  <div className="mt-0.5 flex items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>{r.brand}</span>
                    <span>·</span>
                    <span>{r.region}</span>
                    <span>·</span>
                    <span>{r.category}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>Stock</span>
                    <span className="font-mono tabular-nums text-[var(--color-ink)]">{r.stockLevel}%</span>
                  </div>
                  <Progress
                    value={r.stockLevel}
                    className="mt-1"
                    indicatorClassName={
                      r.stockLevel < 30
                        ? 'bg-[var(--color-negative)]'
                        : r.stockLevel < 60
                          ? 'bg-[var(--color-warning)]'
                          : 'bg-[var(--color-positive)]'
                    }
                  />
                </div>

                <div className="text-right md:text-left">
                  <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    Days to sellout
                  </div>
                  <div className="font-mono text-[14px] tabular-nums text-[var(--color-ink)]">
                    {r.estimatedDaysToStockout}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className="text-[10px] uppercase tracking-[0.14em]"
                    style={{ color: levelColor }}
                  >
                    {r.riskLevel}
                  </span>
                  <div className="font-mono text-[14px] tabular-nums" style={{ color: levelColor }}>
                    {r.riskScore}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </PanelShell>
  )
}
