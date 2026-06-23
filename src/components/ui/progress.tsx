'use client'

import { cn } from '@/lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-white/5', className)}>
      <div
        className={cn('h-full bg-orange-500 transition-all duration-300', indicatorClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
