'use client'

import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getLaunchesCalendar, getLaunches } from '@/lib/analytics'
import { fmtNum } from '@/lib/utils'

const STATUS_COLORS: Record<string, 'default' | 'success' | 'warning' | 'destructive' | 'secondary'> = {
  upcoming: 'default',
  confirmed: 'success',
  rumored: 'warning',
  'sold-out': 'destructive',
}

export function LaunchCalendar() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const calendar = useMemo(() => getLaunchesCalendar(), [])
  const sortedMonths = Object.keys(calendar).sort()
  const upcoming = useMemo(
    () =>
      getLaunches()
        .filter((l) => new Date(l.launchDate).getTime() > Date.now())
        .slice(0, 20),
    [],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>📅 Launch Calendar</CardTitle>
            <p className="mt-1 text-xs text-gray-500">
              {fmtNum(upcoming.length)} upcoming launches across all regions
            </p>
          </div>
          <div className="flex gap-1 rounded-md border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setView('list')}
              className={`rounded px-2 py-0.5 text-xs ${view === 'list' ? 'bg-orange-500/15 text-orange-300' : 'text-gray-400 hover:text-white'}`}
            >
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`rounded px-2 py-0.5 text-xs ${view === 'calendar' ? 'bg-orange-500/15 text-orange-300' : 'text-gray-400 hover:text-white'}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[560px] overflow-y-auto">
          {view === 'list' ? (
            <div className="divide-y divide-white/[0.02]">
              {upcoming.map((l) => {
                const date = new Date(l.launchDate)
                const daysOut = Math.ceil((date.getTime() - Date.now()) / 86400000)
                return (
                  <div
                    key={l.id}
                    className="flex items-center gap-3 px-5 py-2.5 transition-colors hover:bg-white/[0.02]"
                  >
                    <div className="flex w-16 flex-col items-center">
                      <div className="text-[10px] uppercase text-gray-500">
                        {date.toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="font-mono text-lg font-bold text-white">{date.getDate()}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white truncate">
                          {l.product.name}
                        </span>
                        <Badge variant="secondary">{l.region}</Badge>
                      </div>
                      <div className="mt-0.5 text-[11px] text-gray-500">
                        {l.brand.name} · {l.launchType} · {fmtNum(l.expectedUnits)} units
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={STATUS_COLORS[l.status]}>{l.status}</Badge>
                      <div className="mt-1 font-mono text-[11px] text-gray-400">
                        {daysOut > 0 ? `T-${daysOut}d` : 'past'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="space-y-4 p-5">
              {sortedMonths.map((month) => {
                const launches = calendar[month]
                return (
                  <div key={month}>
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white">
                        {new Date(month + '-01').toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </h4>
                      <span className="text-[11px] text-gray-500">
                        {launches.length} launches
                      </span>
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {Array.from({ length: new Date(month + '-01').getDay() }).map((_, i) => (
                        <div key={`pad-${i}`} />
                      ))}
                      {launches.map((l) => {
                        const day = new Date(l.launchDate).getDate()
                        const dateKey = `${month}-${String(day).padStart(2, '0')}`
                        const sameDay = launches.filter(
                          (x) => x.launchDate.slice(0, 10) === dateKey,
                        ).length
                        return (
                          <div
                            key={l.id}
                            className="flex flex-col items-center rounded-md border border-white/5 bg-white/[0.02] p-1.5"
                            title={l.product.name}
                          >
                            <div className="text-[10px] text-gray-500">{day}</div>
                            <div className="mt-0.5 size-1.5 rounded-full bg-orange-500" />
                            {sameDay > 1 && (
                              <div className="text-[8px] text-orange-300">×{sameDay}</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
