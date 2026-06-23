'use client'

import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingDown, Plane, ShoppingCart } from 'lucide-react'
import { getOptimizer } from '@/lib/analytics'
import { getProducts } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'

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
            <Plane className="size-4 text-emerald-400" />
            Landed Cost Optimizer
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            Cheapest route to acquire a product in your target region
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
              Product
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="h-9 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.brand.name} — {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
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
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-emerald-400">
              ✓ Best Route
            </span>
            <Badge variant="success">{result.bestRoute.sourceRegion}</Badge>
          </div>
          <div className="text-2xl font-bold text-white">
            {fmtEUR(result.bestRoute.totalLandedCostEUR, 0)}
          </div>
          <div className="mt-1 text-xs text-gray-500">
            Total landed cost in {targetRegion} · saves{' '}
            <span className="font-mono text-emerald-400">
              {fmtEUR(result.potentialSavingsEUR, 0)}
            </span>{' '}
            vs buying locally ({fmtEUR(result.localPriceEUR, 0)})
          </div>
        </div>

        {/* All routes table */}
        <div className="overflow-hidden rounded-md border border-white/5">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-wider text-gray-500">
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
                  className={`border-b border-white/[0.02] ${
                    r.isLocalPurchase ? 'bg-orange-500/5' : ''
                  }`}
                >
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{r.sourceRegion}</span>
                      {r.isLocalPurchase && (
                        <ShoppingCart className="size-3 text-orange-400" />
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Stock: {r.stockLevelAtSource}% · {r.stockStatusAtSource}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-white">
                    {fmtEUR(r.sourcePriceEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-400">
                    +{fmtEUR(r.shippingCostEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-400">
                    +{fmtEUR(r.importDutyAmountEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-white">
                    {fmtEUR(r.totalLandedCostEUR, 0)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono">
                    {r.isLocalPurchase ? (
                      <span className="text-gray-500">—</span>
                    ) : (
                      <span
                        className={
                          r.savingsVsLocalPct > 0 ? 'text-emerald-400' : 'text-red-400'
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
