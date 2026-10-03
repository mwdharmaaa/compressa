import type { ReactNode } from 'react'

export interface BadgeProps {
  children: ReactNode
  variant?: 'neutral' | 'blue' | 'green' | 'amber'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'sm', className = '' }: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size]

  const variantStyles = {
    neutral: 'bg-zinc-850 text-zinc-300 border-zinc-700/60',
    blue: 'bg-blue-950/40 text-blue-300 border-blue-800/50',
    green: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50',
    amber: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
  }[variant]

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  )
}
