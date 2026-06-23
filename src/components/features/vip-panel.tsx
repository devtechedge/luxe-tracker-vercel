'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { getVIPSimulation } from '@/lib/analytics'
import { getSnapshot } from '@/lib/data-snapshot'
import { useAnnualSpend } from '@/hooks/use-watchlist'
import { fmtEUR } from '@/lib/utils'
import { Crown, Sparkles, Eye, User } from 'lucide-react'

export function VipPanel() {
  const snap = getSnapshot()
  const [brandIdx, setBrandIdx] = useState(0)
  const [annualSpend, setAnnualSpend, hydrated] = useAnnualSpend(8000)

  const sim = getVIPSimulation(brandIdx, annualSpend)
  const brand = snap.brandDefs[brandIdx]
  const qualifiedColor = sim.qualifiedTier ? '#10b981' : '#64748b'

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>
            <Crown className="size-4 text-amber-400" />
            VIP Client Tier Simulator
          </CardTitle>
          <p className="mt-1 text-xs text-gray-500">
            What tier would your spending qualify for at each maison?
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
              Brand
            </label>
            <select
              value={brandIdx}
              onChange={(e) => setBrandIdx(parseInt(e.target.value))}
              className="h-9 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white"
            >
              {snap.brandDefs.map((b, i) => (
                <option key={b.name} value={i}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-gray-500">
              Annual Spend (EUR)
            </label>
            <Input
              type="number"
              value={annualSpend}
              onChange={(e) => setAnnualSpend(parseInt(e.target.value) || 0)}
              step={1000}
            />
          </div>
        </div>

        {/* Status banner */}
        <div
          className="mb-4 rounded-lg border p-4"
          style={{
            borderColor: `${qualifiedColor}40`,
            backgroundColor: `${qualifiedColor}10`,
          }}
        >
          {sim.qualifiedTier ? (
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="size-4" style={{ color: qualifiedColor }} />
                <span className="text-xs uppercase tracking-wider" style={{ color: qualifiedColor }}>
                  Qualified Tier
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{sim.qualifiedTier.tierName}</span>
                <span className="text-sm text-gray-400">at {brand.name}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] md:grid-cols-4">
                <Benefit
                  icon={<Sparkles className="size-3" />}
                  label="Discount"
                  value={`${sim.qualifiedTier.discountPct}%`}
                />
                <Benefit
                  icon={<Eye className="size-3" />}
                  label="Early Access"
                  value={`${sim.qualifiedTier.earlyAccessDays}d`}
                />
                <Benefit
                  icon={<User className="size-3" />}
                  label="Personal Shopper"
                  value={sim.qualifiedTier.personalShopper ? 'Yes' : 'No'}
                />
                <Benefit
                  icon={<Crown className="size-3" />}
                  label="Allocation Prio"
                  value={`${sim.qualifiedTier.allocationPriority}/5`}
                />
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400">
              No tier qualified — your annual spend is too low for this brand.
            </div>
          )}
          {sim.nextTier && (
            <div className="mt-3 text-[11px] text-gray-400">
              Spend <span className="font-mono text-amber-400">{fmtEUR(sim.nextTier.gapEUR, 0)}</span> more to unlock{' '}
              <span className="font-semibold text-white">{sim.nextTier.tierName}</span>.
            </div>
          )}
        </div>

        {/* Tier ladder */}
        <div className="space-y-2">
          {sim.allTiers.map((tier, i) => {
            const isQualified = tier.achievable
            const isNext = !tier.achievable && sim.allTiers[i - 1]?.achievable
            return (
              <div
                key={tier.tierName}
                className={`flex items-center gap-3 rounded-md border p-3 transition-all ${
                  isQualified
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : isNext
                      ? 'border-amber-500/30 bg-amber-500/5'
                      : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="flex size-10 items-center justify-center rounded-md bg-white/5 text-lg">
                  {tier.tierName === 'Silver' && '🥈'}
                  {tier.tierName === 'Gold' && '🥇'}
                  {tier.tierName === 'Platinum' && '💎'}
                  {tier.tierName === 'Diamond' && '👑'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{tier.tierName}</span>
                    {isQualified && <Badge variant="success">Achieved</Badge>}
                    {isNext && <Badge variant="warning">Next</Badge>}
                  </div>
                  <div className="text-[11px] text-gray-500">
                    Min spend {fmtEUR(tier.minAnnualSpendEUR, 0)} · {tier.discountPct}% off ·{' '}
                    {tier.earlyAccessDays}d early
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <div className="text-gray-400">Priority</div>
                  <div className="font-mono text-white">{tier.allocationPriority}/5</div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function Benefit({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/5 bg-white/[0.02] p-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-500">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-mono text-sm font-bold text-white">{value}</div>
    </div>
  )
}
