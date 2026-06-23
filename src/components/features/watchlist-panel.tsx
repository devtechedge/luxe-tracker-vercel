'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useWatchlist, useAlerts } from '@/hooks/use-watchlist'
import { getSnapshot } from '@/lib/data-snapshot'
import { fmtEUR, fmtPct } from '@/lib/utils'
import { Heart, Trash2, Bell, AlertCircle } from 'lucide-react'

export function WatchlistPanel() {
  const snap = getSnapshot()
  const { items, remove, hydrated: wHydrated } = useWatchlist()
  const { alerts, markRead, clear, unread, hydrated: aHydrated } = useAlerts()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Heart className="size-4 text-pink-400" />
              My Watchlist
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              {wHydrated ? items.length : '—'} items · stored locally in your browser
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center px-5 text-center text-sm text-gray-500">
            <Heart className="mb-2 size-6 text-gray-600" />
            <p>Your watchlist is empty.</p>
            <p className="text-[11px] text-gray-600">
              Add products or brands from any panel to start tracking them.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.02]">
            {items.map((item) => {
              // If it's a product, lookup current pricing
              let currentPriceEUR: number | null = null
              let disparity: number | null = null
              if (item.productId) {
                const p = snap.products.find((x) => x.id === item.productId)
                if (p) {
                  const eu = p.regionalPrices.find((r: any) => r.region === 'EU')
                  currentPriceEUR = eu?.price ?? null
                  // Calculate disparity
                  const us = p.regionalPrices.find((r: any) => r.region === 'US')
                  if (eu && us) {
                    disparity = ((us.price * (1 / 1.085) - eu.price) / eu.price) * 100
                  }
                }
              }

              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 px-5 py-3 hover:bg-white/[0.02]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white">
                      {item.productName || item.brand || item.region}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      <Badge variant="secondary" className="mr-1 text-[10px]">
                        {item.watchType}
                      </Badge>
                      {item.brand && <span className="mr-2">{item.brand}</span>}
                      {item.region && <span>{item.region}</span>}
                    </div>
                    {currentPriceEUR !== null && (
                      <div className="mt-1.5 flex items-center gap-3 text-[11px]">
                        <span className="text-gray-500">EU baseline:</span>
                        <span className="font-mono text-white">
                          {fmtEUR(currentPriceEUR, 0)}
                        </span>
                        {disparity !== null && (
                          <span
                            className={`font-mono ${disparity > 0 ? 'text-red-400' : 'text-emerald-400'}`}
                          >
                            US: {fmtPct(disparity)}
                          </span>
                        )}
                      </div>
                    )}
                    {item.targetPrice && (
                      <div className="mt-0.5 text-[11px] text-amber-400">
                        Target: {fmtEUR(item.targetPrice, 0)}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(item.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function AlertsPanel() {
  const { alerts, markRead, clear, unread, hydrated } = useAlerts()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>
              <Bell className="size-4 text-amber-400" />
              Alerts
              {unread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unread} new
                </Badge>
              )}
            </CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              {hydrated ? alerts.length : '—'} alerts · click to mark read
            </p>
          </div>
          {alerts.length > 0 && (
            <Button size="sm" variant="ghost" onClick={clear}>
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {alerts.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center px-5 text-center text-sm text-gray-500">
            <Bell className="mb-2 size-6 text-gray-600" />
            <p>No alerts yet.</p>
            <p className="text-[11px] text-gray-600">
              Alerts will appear here when watchlist conditions are met.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.02]">
            {alerts.slice().reverse().map((a) => (
              <button
                key={a.id}
                onClick={() => markRead(a.id)}
                className={`flex w-full items-start gap-3 px-5 py-3 text-left transition-colors hover:bg-white/[0.02] ${
                  !a.read ? 'bg-orange-500/[0.03]' : ''
                }`}
              >
                <AlertCircle
                  className={`size-4 shrink-0 ${
                    a.severity === 'critical'
                      ? 'text-red-400'
                      : a.severity === 'warning'
                        ? 'text-amber-400'
                        : 'text-sky-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white">{a.message}</div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {new Date(a.createdAt).toLocaleString()}
                    {!a.read && (
                      <span className="ml-2 text-orange-400">· unread</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
