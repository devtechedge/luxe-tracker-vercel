// ============================================================
// PANEL SHELL — reusable editorial wrapper for all 17 panels
// ============================================================
// Apply the same typographic hero, header, and table styles
// across every panel without repeating the markup.
// ============================================================

import type { ReactNode } from 'react'

interface PanelShellProps {
  category: string
  title: string
  subtitle?: string
  caption?: string
  children: ReactNode
}

export function PanelShell({
  category,
  title,
  subtitle,
  caption,
  children,
}: PanelShellProps) {
  return (
    <div className="fade-in">
      <header className="mb-8">
        <div className="label label-accent mb-2">{category}</div>
        <h2 className="font-display text-[28px] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[13px] text-[var(--color-ink-muted)]">
            {subtitle}
          </p>
        )}
        {caption && (
          <p className="mt-3 max-w-2xl text-[12px] leading-relaxed text-[var(--color-ink-subtle)]">
            {caption}
          </p>
        )}
      </header>
      {children}
    </div>
  )
}

// ============================================================
// SECTION — sub-section divider with optional label
// ============================================================
interface SectionProps {
  label?: string
  title?: string
  caption?: string
  children: ReactNode
  className?: string
}

export function Section({ label, title, caption, children, className = '' }: SectionProps) {
  return (
    <section className={`${className}`}>
      {(label || title || caption) && (
        <>
          <div className="rule" />
          <div className="py-4">
            {label && <div className="label mb-1">{label}</div>}
            {title && (
              <h3 className="font-display text-[18px] font-medium leading-tight tracking-tight text-[var(--color-ink)]">
                {title}
              </h3>
            )}
            {caption && (
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-subtle)]">
                {caption}
              </p>
            )}
          </div>
        </>
      )}
      {children}
    </section>
  )
}

// ============================================================
// DATA TABLE — consistent dense table styling
// ============================================================
interface DataTableProps {
  columns: { key: string; label: string; align?: 'left' | 'right'; className?: string }[]
  rows: ReactNode[]
  maxHeight?: number
  zebra?: boolean
  stickyHeader?: boolean
}

export function DataTable({
  columns,
  rows,
  maxHeight = 560,
  zebra = true,
  stickyHeader = true,
}: DataTableProps) {
  return (
    <>
      <div className="rule" />
      <div className="max-h-[var(--table-max-h)] overflow-auto" style={{ ['--table-max-h' as any]: `${maxHeight}px` }}>
        <table className="w-full text-[12px] tabular-nums">
          <thead className={stickyHeader ? 'sticky top-0 z-10 bg-[var(--color-bg)]' : ''}>
            <tr className="border-b border-[var(--color-border)]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`${c.align === 'right' ? 'px-3 text-right' : 'pl-0 pr-3 text-left'} py-3 ${c.className ?? ''}`}
                >
                  <span className="label">{c.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[var(--color-border)] data-row ${
                  zebra && i % 2 === 1 ? 'bg-[var(--color-surface)]' : ''
                }`}
              >
                {row}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rule mt-1" />
    </>
  )
}

// ============================================================
// DATA LIST — dense vertical list (for dropdowns, queues, etc.)
// ============================================================
interface DataRowProps {
  primary: ReactNode
  secondary?: ReactNode
  trailing?: ReactNode
  className?: string
}

export function DataRow({ primary, secondary, trailing, className = '' }: DataRowProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-[var(--color-border)] py-3 data-row ${className}`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-[13px] text-[var(--color-ink)]">{primary}</div>
        {secondary && (
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
            {secondary}
          </div>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  )
}

// ============================================================
// KPI STRIP — inline numerical strip used in panels
// ============================================================
interface KpiStripProps {
  items: { label: string; value: string; accent?: boolean }[]
}

export function KpiStrip({ items }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-border)] py-5 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="label mb-1">{item.label}</div>
          <div
            className={`hero-num text-[22px] ${
              item.accent ? 'text-[var(--color-accent)]' : 'text-[var(--color-ink)]'
            }`}
          >
            {item.value}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================
// CHART TOOLTIP — editorial, mono numbers
// ============================================================
interface TooltipPayload {
  active?: boolean
  payload?: Array<{ name: string; value: number; color?: string; dataKey?: string }>
  label?: string
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: TooltipPayload & { formatter?: (v: number, name?: string) => string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-2 shadow-xl">
      {label && (
        <div className="text-[10px] uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
          {label}
        </div>
      )}
      <div className="mt-1 space-y-0.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-baseline gap-2">
            {p.color && (
              <span
                className="inline-block size-1.5 rounded-full"
                style={{ background: p.color }}
              />
            )}
            <span className="font-mono text-[12px] tabular-nums text-[var(--color-ink)]">
              {formatter ? formatter(p.value, p.name) : p.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================
// EMPTY STATE — clean editorial empty-state
// ============================================================
export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex h-32 flex-col items-center justify-center text-center">
      <p className="text-[13px] text-[var(--color-ink-muted)]">{title}</p>
      {hint && (
        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[var(--color-ink-faint)]">
          {hint}
        </p>
      )}
    </div>
  )
}
