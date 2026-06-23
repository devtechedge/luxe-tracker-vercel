'use client'

import { useState } from 'react'
import type { ComponentType } from 'react'
import {
  Activity,
  Globe,
  Plane,
  TrendingDown,
  History,
  TrendingUp,
  Flame,
  Swords,
  AlertTriangle,
  Users,
  Crown,
  Sparkles,
  Leaf,
  Bell,
  Zap,
  Heart as HeartIcon,
} from 'lucide-react'
import { TelemetryOverview } from '@/components/features/telemetry-overview'
import { PriceMatrix } from '@/components/features/price-matrix'
import { LaunchCalendar } from '@/components/features/launch-calendar'
import { ArbitragePanel } from '@/components/features/arbitrage-panel'
import { OptimizerPanel } from '@/components/features/optimizer-panel'
import { PriceHistory } from '@/components/features/price-history'
import { FxVolatility } from '@/components/features/fx-volatility'
import { HypePredictor } from '@/components/features/hype-predictor'
import { LaunchConflicts } from '@/components/features/launch-conflicts'
import { StockRisk } from '@/components/features/stock-risk'
import { CompetitiveMatrix } from '@/components/features/competitive-matrix'
import { BrandPulse } from '@/components/features/brand-pulse'
import { RunwayPanel } from '@/components/features/runway-panel'
import { VipPanel } from '@/components/features/vip-panel'
import { SustainabilityPanel } from '@/components/features/sustainability-panel'
import { TrendForecastPanel } from '@/components/features/trend-forecast-panel'
import { DropQueuePanel } from '@/components/features/drop-queue-panel'
import { WatchlistPanel, AlertsPanel } from '@/components/features/watchlist-panel'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type PanelId =
  | 'overview'
  | 'price-matrix'
  | 'launch-calendar'
  | 'arbitrage'
  | 'optimizer'
  | 'price-history'
  | 'fx-volatility'
  | 'hype-predictor'
  | 'launch-conflicts'
  | 'stock-risk'
  | 'competitive-matrix'
  | 'brand-pulse'
  | 'runway'
  | 'vip-tier'
  | 'sustainability'
  | 'trend-forecast'
  | 'drop-queue'
  | 'watchlist'
  | 'alerts'

interface NavItem {
  id: PanelId
  label: string
  icon: ComponentType<{ className?: string }>
  category: 'Intelligence' | 'Pricing' | 'Market' | 'Luxury' | 'Personal'
}

const NAV: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: Activity, category: 'Intelligence' },
  { id: 'launch-calendar', label: 'Launch Calendar', icon: Globe, category: 'Intelligence' },
  { id: 'price-matrix', label: 'Price Matrix', icon: TrendingDown, category: 'Intelligence' },
  { id: 'arbitrage', label: 'Arbitrage Finder', icon: Plane, category: 'Pricing' },
  { id: 'optimizer', label: 'Landed Cost Optimizer', icon: TrendingDown, category: 'Pricing' },
  { id: 'price-history', label: 'Price History', icon: History, category: 'Pricing' },
  { id: 'fx-volatility', label: 'FX Volatility', icon: TrendingUp, category: 'Pricing' },
  { id: 'hype-predictor', label: 'Hype Predictor', icon: Flame, category: 'Market' },
  { id: 'launch-conflicts', label: 'Launch Conflicts', icon: Swords, category: 'Market' },
  { id: 'stock-risk', label: 'Stock-Out Risk', icon: AlertTriangle, category: 'Market' },
  { id: 'competitive-matrix', label: 'Competitive Matrix', icon: Users, category: 'Market' },
  { id: 'brand-pulse', label: 'Brand Pulse Radar', icon: Zap, category: 'Market' },
  { id: 'runway', label: 'Runway Tracker', icon: Sparkles, category: 'Luxury' },
  { id: 'vip-tier', label: 'VIP Tier Simulator', icon: Crown, category: 'Luxury' },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf, category: 'Luxury' },
  { id: 'trend-forecast', label: 'Trend Forecast', icon: Flame, category: 'Luxury' },
  { id: 'drop-queue', label: 'Drop Queue', icon: Users, category: 'Luxury' },
  { id: 'watchlist', label: 'My Watchlist', icon: HeartIcon, category: 'Personal' },
  { id: 'alerts', label: 'Alerts', icon: Bell, category: 'Personal' },
]

export default function Dashboard() {
  const [activePanel, setActivePanel] = useState<PanelId>('overview')

  const grouped = NAV.reduce<Record<string, NavItem[]>>((acc, item) => {
    ;(acc[item.category] = acc[item.category] || []).push(item)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-[#0a0e17]">
      {/* Subtle background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-[1700px] gap-6 p-6">
        {/* SIDEBAR */}
        <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-y-auto rounded-lg border border-white/5 bg-[#0d1220]/80 backdrop-blur-sm lg:block">
          {/* Brand */}
          <div className="border-b border-white/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 text-xl shadow-lg shadow-orange-500/20">
                👑
              </div>
              <div>
                <h1 className="text-base font-bold tracking-tight text-white">
                  LUXE TRACKER
                </h1>
                <p className="text-[10px] text-gray-500">Global Intelligence · v3.0</p>
              </div>
            </div>
          </div>

          {/* Nav by category */}
          <div className="space-y-4 p-3">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                  {category}
                </div>
                <nav className="space-y-0.5">
                  {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activePanel === item.id
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActivePanel(item.id)}
                        className={`flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-xs transition-all ${
                          isActive
                            ? 'border border-orange-500/30 bg-orange-500/10 text-orange-300'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="size-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <span className="ml-auto size-1.5 rounded-full bg-orange-400" />
                        )}
                      </button>
                    )
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer info */}
          <div className="border-t border-white/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gray-600">
              Architecture
            </div>
            <div className="mt-1.5 space-y-1 text-[11px] text-gray-500">
              <div>📦 In-memory data snapshot</div>
              <div>⚡ Zero backend · Vercel-only</div>
              <div>💾 Watchlist → localStorage</div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1 space-y-6">
          <PanelHeader panelId={activePanel} />

          <div className="space-y-6">
            {activePanel === 'overview' && <TelemetryOverview />}
            {activePanel === 'price-matrix' && <PriceMatrix />}
            {activePanel === 'launch-calendar' && <LaunchCalendar />}
            {activePanel === 'arbitrage' && <ArbitragePanel />}
            {activePanel === 'optimizer' && <OptimizerPanel />}
            {activePanel === 'price-history' && <PriceHistory />}
            {activePanel === 'fx-volatility' && <FxVolatility />}
            {activePanel === 'hype-predictor' && <HypePredictor />}
            {activePanel === 'launch-conflicts' && <LaunchConflicts />}
            {activePanel === 'stock-risk' && <StockRisk />}
            {activePanel === 'competitive-matrix' && <CompetitiveMatrix />}
            {activePanel === 'brand-pulse' && <BrandPulse />}
            {activePanel === 'runway' && <RunwayPanel />}
            {activePanel === 'vip-tier' && <VipPanel />}
            {activePanel === 'sustainability' && <SustainabilityPanel />}
            {activePanel === 'trend-forecast' && <TrendForecastPanel />}
            {activePanel === 'drop-queue' && <DropQueuePanel />}
            {activePanel === 'watchlist' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <WatchlistPanel />
                <AlertsPanel />
              </div>
            )}
            {activePanel === 'alerts' && <AlertsPanel />}
          </div>
        </main>
      </div>
    </div>
  )
}

function PanelHeader({ panelId }: { panelId: PanelId }) {
  const item = NAV.find((n) => n.id === panelId)
  if (!item) return null
  const Icon = item.icon
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{item.label}</h2>
          <p className="text-xs text-gray-500">Category: {item.category}</p>
        </div>
      </div>
      <Badge variant="outline" className="text-[10px] uppercase">
        v3.0
      </Badge>
    </div>
  )
}
