'use client'

import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingDown, Plane, ShoppingCart } from 'lucide-react'
import { getOptimizer } from '@/lib/analytics'
import { getProducts } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const TARGET_REGIONS = ['EU', 'US', 'UK', 'Norway', 'India']

export function OptimizerPanel() {
  const products = useMemo(() => getProducts(), [])
  const [productId, setProductId] = useState(products[0]?.id || '')
  const [targetRegion, setTargetRegion] = useState('US')

  const result = useMemo(
    () => getOptimizer(productId, targetRegion),
    [productId, targetRegion],
  )

  if (!result) return null

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <Plane className="size-4 text-[var(--color-positive)]" />
            Landed Cost Optimizer
          </CardTitle>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Cheapest route to acquire a product in your target region
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
              Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="h-9 w-full rounded-md border border-[var(--color-border)] bg-white/[0.03] px-3 text-sm text-[var(--color-ink)]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand.name} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
              Target Region
            </label>
            <div className="flex gap-1">
              {TARGET_REGIONS.map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={targetRegion === r ? 'default' : 'outline'}
                  onClick={() => setTargetRegion(r)}
                  className="flex-1"
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Best route highlight */}
        <div className="mb-4 rounded-lg border border-[var(--color-positive)] bg-[var(--color-positive)]/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[var(--color-positive)]">
              ✓ Best Route
            </span>
            <Badge variant="success">{result.bestRoute.sourceRegion}</Badge>
          </div>
          <div className="text-2xl font-bold text-[var(--color-ink)]">
            {fmtEUR(result.bestRoute.totalLandedCostEUR, 0)}
          </div>
          <div className="mt-1 text-xs text-[var(--color-ink-muted)]">
            Total landed cost in {targetRegion} · saves{' '}
            <span className="font-mono text-[var(--color-positive)]">
              {fmtEUR(result.potentialSavingsEUR, 0)}
            </span>{' '}
            vs buying locally ({fmtEUR(result.localPriceEUR, 0)})
          </div>
        </div>

        {/* All routes table */}
        <div className="overflow-hidden rounded-md border border-[var(--color-border)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">
                <th className="px-3 py-2 text-left font-medium">Source</th>
                <th className="px-3 py-2 text-right font-medium">Local Price</th>
                <th className="px-3 py-2 text-right font-medium">+ Ship</th>
                <th className="px-3 py-2 text-right font-medium">+ Duty</th>
                <th className="px-3 py-2 text-right font-medium">Total</th>
                <th className="px-3 py-2 text-right font-medium">Savings</th>
              </tr>
            </thead>
            <tbody>
              {result.allRoutes.map((r) => (
                <tr
                  key={r.sourceRegion}
                  className={`border-b border-[var(--color-border)] ${
                    r.isLocalPurchase ? 'bg-[var(--color-accent)]/5' : ''
                  }`}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--color-ink)]">{r.sourceRegion}</span>
                      {r.isLocalPurchase && (
                        <ShoppingCart className="size-3 text-[var(--color-accent)]" />
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--color-ink-muted)]">
                      Stock: {r.stockLevelAtSource}% · {r.stockStatusAtSource}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--color-ink)]">
                    {fmtEUR(r.sourcePriceEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--color-ink-muted)]">
                    +{fmtEUR(r.shippingCostEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-[var(--color-ink-muted)]">
                    +{fmtEUR(r.importDutyAmountEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-[var(--color-ink)]">
                    {fmtEUR(r.totalLandedCostEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {r.isLocalPurchase ? (
                      <span className="text-[var(--color-ink-muted)]">—</span>
                    ) : (
                      <span
                        className={
                          r.savingsVsLocalPct > 0 ? 'text-[var(--color-positive)]' : 'text-[var(--color-negative)]'
                        }
                      >
                        {r.savingsVsLocalPct > 0 ? (
                          <>
                            <TrendingDown className="inline size-3" /> {r.savingsVsLocalPct.toFixed(1)}%
                          </>
                        ) : (
                          <>−{Math.abs(r.savingsVsLocalPct).toFixed(1)}%</>
                        )}
                      </span>
                    )}
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
