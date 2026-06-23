'use client'

import { useMemo, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { PanelShell, DataRow } from '@/components/ui/panel-shell'
import { getArbitrage } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'

export function ArbitragePanel() {
  const data = useMemo(() => getArbitrage(), [])
  const [filter, setFilter] = useState<'all' | 'high'>('all')

  const filtered = useMemo(() => {
    return filter === 'high'
      ? data.topOpportunities.filter((o) => o.savingsPct >= 15)
      : data.topOpportunities.slice(0, 25)
  }, [data, filter])

  const headline = data.topOpportunities[0]

  return (
    <PanelShell
      category="Pricing"
      title="Arbitrage Opportunity Finder"
      subtitle={`${data.totalOpportunities} profitable routes · ${data.avgSavingsPct.toFixed(1)}% average savings`}
      caption="Buy from a low-priced region and ship to a high-priced region. Savings calculated net of shipping and import duty."
    >
      {/* HEADLINE METRIC */}
      {headline && (
        <div className="rule mb-6 grid grid-cols-1 gap-6 py-5 lg:grid-cols-[1fr,1fr]">
          <div>
            <div className="label mb-1">Top Opportunity</div>
            <h3 className="font-display text-[20px] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
              {headline.productName}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
              {headline.brand} · {headline.category} · {headline.sku}
            </p>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="label">Route</span>
              <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)]">
                {headline.buyFromRegion} → {headline.shipToRegion}
              </span>
              <ArrowRight className="size-3 text-[var(--color-ink-faint)]" />
            </div>
          </div>
          <div>
            <div className="label">Net Savings</div>
            <div className="hero-num mt-1 text-[56px] text-[var(--color-accent)]">
              {fmtEUR(headline.savingsEUR, 0)}
            </div>
            <div className="mt-1 font-mono text-[12px] tabular-nums text-[var(--color-ink-muted)]">
              {headline.savingsPct.toFixed(1)}% vs local purchase ·{' '}
              stock {headline.stockLevelAtSource}%
            </div>
          </div>
        </div>
      )}

      {/* FILTER + LIST */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em]">
          <span className="text-[var(--color-ink-subtle)]">Filter</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 transition-colors ${
              filter === 'all'
                ? 'border-b border-[var(--color-accent)] text-[var(--color-ink)]'
                : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-2 py-1 transition-colors ${
              filter === 'high'
                ? 'border-b border-[var(--color-accent)] text-[var(--color-ink)]'
                : 'text-[var(--color-ink-subtle)] hover:text-[var(--color-ink)]'
            }`}
          >
            High (15%+)
          </button>
        </div>
        <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink-subtle)]">
          {filtered.length} routes
        </span>
      </div>

      <div className="rule pt-2">
        {filtered.map((opp, i) => (
          <DataRow
            key={`${opp.productId}-${opp.buyFromRegion}-${opp.shipToRegion}-${i}`}
            primary={
              <div className="flex items-baseline gap-3">
                <span>{opp.productName}</span>
                <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                  {opp.brand}
                </span>
              </div>
            }
            secondary={
              <div className="flex items-center gap-2 font-mono normal-case tracking-normal">
                <span className="text-[var(--color-ink-muted)]">{opp.buyFromRegion}</span>
                <span className="text-[var(--color-ink-faint)]">
                  {opp.buyCurrency} {Math.round(opp.buyAtPrice).toLocaleString()}
                </span>
                <ArrowRight className="size-2.5 text-[var(--color-ink-faint)]" />
                <span className="text-[var(--color-ink-muted)]">{opp.shipToRegion}</span>
                <span className="text-[var(--color-ink-faint)]">
                  +ship {fmtEUR(opp.shippingCostEUR, 0)} · duty{' '}
                  {(opp.importDutyApplied * 100).toFixed(0)}%
                </span>
              </div>
            }
            trailing={
              <div className="text-right">
                <div className="font-mono text-[14px] tabular-nums text-[var(--color-accent)]">
                  {opp.savingsPct.toFixed(1)}%
                </div>
                <div className="font-mono text-[10px] tabular-nums text-[var(--color-ink-subtle)]">
                  {fmtEUR(opp.savingsEUR, 0)} save
                </div>
              </div>
            }
          />
        ))}
      </div>
    </PanelShell>
  )
}
