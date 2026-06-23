'use client'

import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, TrendingUp, Plane } from 'lucide-react'
import { getArbitrage } from '@/lib/analytics'
import { fmtEUR } from '@/lib/utils'

export function ArbitragePanel() {
  const data = useMemo(() => getArbitrage(), [])
  const [filter, setFilter] = useState<'all' | 'high'>('all')

  const filtered = useMemo(() => {
    return filter === 'high'
      ? data.topOpportunities.filter((o) => o.savingsPct >= 15)
      : data.topOpportunities.slice(0, 20)
  }, [data, filter])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Plane className="size-4 text-orange-400" />
              Arbitrage Opportunity Finder
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              Buy-cheap ship-expensive opportunities · {data.totalOpportunities} total ·{' '}
              {data.avgSavingsPct.toFixed(1)}% avg savings
            </p>
          </div>
          <div className="flex gap-1 rounded-md border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setFilter('all')}
              className={`rounded px-2 py-0.5 text-xs ${filter === 'all' ? 'bg-orange-500/15 text-orange-300' : 'text-gray-400'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('high')}
              className={`rounded px-2 py-0.5 text-xs ${filter === 'high' ? 'bg-orange-500/15 text-orange-300' : 'text-gray-400'}`}
            >
              High (15%+)
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[560px] divide-y divide-white/[0.02] overflow-y-auto">
          {filtered.map((opp, i) => (
            <div
              key={`${opp.productId}-${opp.buyFromRegion}-${opp.shipToRegion}-${i}`}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02]"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white truncate">
                    {opp.productName}
                  </span>
                  <Badge variant="secondary">{opp.brand}</Badge>
                </div>
                <div className="mt-0.5 text-[11px] text-gray-500">{opp.sku} · {opp.category}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px]">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-300">
                    Buy: {opp.buyFromRegion} · {fmtEUR(opp.buyAtPrice, 0).replace('€', '')} {opp.buyCurrency}
                  </Badge>
                  <ArrowRight className="size-3 text-gray-500" />
                  <Badge variant="outline" className="border-red-500/30 text-red-300">
                    Ship: {opp.shipToRegion}
                  </Badge>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-400">
                    ship {fmtEUR(opp.shippingCostEUR, 0)} + duty {(opp.importDutyApplied * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                  <TrendingUp className="size-3" />
                  {opp.savingsPct.toFixed(1)}%
                </div>
                <div className="text-[11px] text-gray-500">
                  Save {fmtEUR(opp.savingsEUR, 0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
