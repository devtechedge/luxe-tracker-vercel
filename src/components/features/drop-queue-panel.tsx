'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getDropQueue } from '@/lib/analytics'
import { Clock, Users } from 'lucide-react'
import { useWatchlist } from '@/hooks/use-watchlist'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'secondary'> = {
  upcoming: 'default',
  open: 'success',
  closed: 'warning',
  fulfilled: 'secondary',
}

export function DropQueuePanel() {
  const drops = useMemo(() => getDropQueue(), [])
  const { add, has, hydrated } = useWatchlist()

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <Users className="size-4 text-[var(--color-accent)]" />
            Exclusive Drop Queue
          </CardTitle>
          <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
            {drops.length} active drop queues · simulated positions + odds
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/[0.02]">
          {drops.map((d) => {
            const fillPct = (d.filledSlots / d.totalSlots) * 100
            const inWatchlist = hydrated && has((e) => e.productId === d.productId)
            return (
              <div key={d.id} className="px-5 py-4 hover:bg-[var(--color-surface)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-[var(--color-ink)]">{d.productName}</div>
                    <div className="text-[11px] text-[var(--color-ink-muted)]">
                      {d.brand} · {d.region} · {d.queueType}
                    </div>
                  </div>
                  <Badge variant={STATUS_COLORS[d.status]}>{d.status}</Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-[11px]">
                  <div>
                    <div className="text-[var(--color-ink-muted)]">Slots</div>
                    <div className="font-mono text-[var(--color-ink)]">
                      {d.filledSlots} / {d.totalSlots}
                    </div>
                    <Progress
                      value={fillPct}
                      className="mt-1"
                      indicatorClassName="bg-[var(--color-accent)]"
                    />
                  </div>
                  <div>
                    <div className="text-[var(--color-ink-muted)]">Your position</div>
                    <div className="font-mono font-bold text-[var(--color-accent)]">
                      #{d.userPosition ?? '—'}
                    </div>
                    <div className="text-[10px] text-[var(--color-ink-muted)]">
                      {d.userPosition
                        ? `of ${d.totalSlots}`
                        : 'not in queue'}
                    </div>
                  </div>
                  <div>
                    <div className="text-[var(--color-ink-muted)]">Odds</div>
                    <div className="font-mono font-bold text-[var(--color-positive)]">
                      {(d.oddsOfSuccess * 100).toFixed(0)}%
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--color-ink-muted)]">
                      <Clock className="size-2.5" />
                      {new Date(d.opensAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant={inWatchlist ? 'secondary' : 'outline'}
                    onClick={() =>
                      inWatchlist
                        ? null
                        : add({
                            watchType: 'product',
                            productId: d.productId,
                            productName: d.productName,
                            brand: d.brand,
                            region: d.region,
                          })
                    }
                  >
                    {inWatchlist ? '✓ Watching' : '+ Add to watchlist'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
