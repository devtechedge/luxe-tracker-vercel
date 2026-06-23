'use client'

import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getProducts } from '@/lib/analytics'
import { fmtEUR, fmtPct } from '@/lib/utils'

const REGIONS = ['EU', 'US', 'UK', 'Norway', 'India']
const REGION_COLORS: Record<string, string> = {
  EU: '#10b981',
  US: '#3b82f6',
  UK: '#a855f7',
  Norway: '#f59e0b',
  India: '#ef4444',
}

export function PriceMatrix() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'disparity' | 'name' | 'price'>('disparity')

  const products = useMemo(() => {
    const all = getProducts()
    return all
      .filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.sku.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        if (sortBy === 'price')
          return (b.disparity?.maxDisparity?.priceInEUR || 0) - (a.disparity?.maxDisparity?.priceInEUR || 0)
        return Math.abs(b.disparity?.avgDisparity || 0) - Math.abs(a.disparity?.avgDisparity || 0)
      })
  }, [search, sortBy])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>📊 Price Disparity Matrix</CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              Regional pricing per product, baseline EU · {products.length} products
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Search SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-9 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs text-white"
            >
              <option value="disparity">Sort: Disparity</option>
              <option value="name">Sort: Name</option>
              <option value="price">Sort: Price</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10 border-b border-white/5 bg-[#0d1220]">
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-500">
                <th className="px-3 py-2 font-medium">Product</th>
                <th className="px-3 py-2 font-medium">Brand</th>
                {REGIONS.map((r) => (
                  <th key={r} className="px-3 py-2 text-right font-medium">
                    <span style={{ color: REGION_COLORS[r] }}>●</span> {r}
                  </th>
                ))}
                <th className="px-3 py-2 text-right font-medium">Avg Δ</th>
                <th className="px-3 py-2 text-right font-medium">Max Δ</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 50).map((p) => {
                const euPrice = p.regionalPrices.find((r: any) => r.region === 'EU')?.price || 0
                return (
                  <tr
                    key={p.id}
                    className="border-b border-white/[0.02] transition-colors hover:bg-white/[0.02]"
                  >
                    <td className="max-w-[200px] truncate px-3 py-2">
                      <div className="font-medium text-white">{p.name}</div>
                      <div className="text-[10px] text-gray-500">{p.sku}</div>
                    </td>
                    <td className="px-3 py-2 text-gray-400">{p.brand.name}</td>
                    {REGIONS.map((r) => {
                      const rp = p.regionalPrices.find((x: any) => x.region === r)
                      const disparity = rp && euPrice ? ((rp.price * 1) - euPrice) / euPrice * 100 : 0
                      const positive = disparity > 0
                      return (
                        <td key={r} className="px-3 py-2 text-right font-mono">
                          <div className="text-white">
                            {rp ? fmtEUR(rp.price, rp.currency === 'EUR' ? 0 : 0) : '—'}
                          </div>
                          {rp && r !== 'EU' && (
                            <div
                              className={`text-[10px] ${positive ? 'text-red-400' : 'text-emerald-400'}`}
                            >
                              {fmtPct(disparity)}
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-3 py-2 text-right font-mono">
                      <Badge
                        variant={
                          Math.abs(p.disparity?.avgDisparity || 0) > 15
                            ? 'destructive'
                            : Math.abs(p.disparity?.avgDisparity || 0) > 5
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {fmtPct(p.disparity?.avgDisparity || 0)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-orange-300">
                      {fmtPct(p.disparity?.maxDisparity?.disparityPct || 0)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
