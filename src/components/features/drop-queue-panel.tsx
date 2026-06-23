'use client'

import { useMemo } from 'react'
import { PanelShell } from '@/components/ui/panel-shell'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getDropQueue } from '@/lib/analytics'
import { useWatchlist } from '@/hooks/use-watchlist'

const STATUS_DOT: Record<string, string> = {
  upcoming: 'var(--color-warning)',
  open: 'var(--color-positive)',
  closed: 'var(--color-ink-subtle)',
  fulfilled: 'var(--color-info)',
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Upcoming',
  open: 'Open',
  closed: 'Closed',
  fulfilled: 'Fulfilled',
}

export function DropQueuePanel() {
  const drops = useMemo(() => getDropQueue(), [])
  const { add, has, hydrated } = useWatchlist()

  const open = drops.filter((d) => d.status === 'open').length
  const upcoming = drops.filter((d) => d.status === 'upcoming').length

  return (
    <PanelShell
      category="Luxury"
      title="Exclusive Drop Queue"
      subtitle={`${drops.length} active drop queues · ${open} open · ${upcoming} upcoming`}
      caption="Raffles, waitlists, and invite-only drops. Your simulated position vs total slots indicates odds of securing the item."
    >
      {/* KPI strip */}
      <div className="rule grid grid-cols-2 gap-x-8 gap-y-6 py-6 md:grid-cols-4">
        <div className="min-w-0">
          <div className="label mb-1.5">Active queues</div>
          <div className="hero-num text-[28px] text-[var(--color-ink)]">{drops.length}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">Open now</div>
          <div className="hero-num text-[28px] text-[var(--color-positive)]">{open}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">Upcoming</div>
          <div className="hero-num text-[28px] text-[var(--color-warning)]">{upcoming}</div>
        </div>
        <div className="min-w-0">
          <div className="label mb-1.5">Avg odds</div>
          <div className="hero-num text-[28px] text-[var(--color-ink)]">
            {drops.length > 0
              ? `${Math.round(
                  (drops.reduce((s, d) => s + d.oddsOfSuccess, 0) / drops.length) * 100,
                )}%`
              : '—'}
          </div>
        </div>
      </div>

      <section>
        <div className="rule" />
        <div className="py-5">
          <div className="label">Drop queue</div>
        </div>
        <div className="space-y-px">
          {drops.map((d) => {
            const fillPct = (d.filledSlots / d.totalSlots) * 100
            const inWatchlist = hydrated && has((e) => e.productId === d.productId)
            return (
              <article
                key={d.id}
                className="grid grid-cols-1 gap-3 border-b border-[var(--color-border)] py-4 transition-colors hover:bg-[var(--color-surface)] md:grid-cols-[1fr,260px,180px]"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block size-1.5 rounded-full"
                      style={{ background: STATUS_DOT[d.status] }}
                    />
                    <span className="text-[13px] text-[var(--color-ink)]">{d.productName}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>{d.brand}</span>
                    <span>·</span>
                    <span>{d.region}</span>
                    <span>·</span>
                    <span>{d.queueType}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>Slots filled</span>
                    <span className="font-mono tabular-nums text-[var(--color-ink)]">
                      {d.filledSlots} / {d.totalSlots}
                    </span>
                  </div>
                  <Progress value={fillPct} className="mt-1.5" indicatorClassName="bg-[var(--color-accent)]" />
                  <div className="mt-1.5 flex items-baseline justify-between text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">
                    <span>Your position</span>
                    <span className="font-mono tabular-nums text-[var(--color-accent)]">
                      #{d.userPosition ?? '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:gap-4">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--color-ink-subtle)]">Odds</div>
                    <div className="font-mono text-[15px] tabular-nums text-[var(--color-positive)]">
                      {(d.oddsOfSuccess * 100).toFixed(0)}%
                    </div>
                  </div>
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
                    {inWatchlist ? '✓ Watching' : '+ Watch'}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </section>
    </PanelShell>
  )
}
