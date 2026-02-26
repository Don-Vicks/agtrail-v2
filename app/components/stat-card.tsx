import { cn } from '~/lib/utils'

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  description: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function StatCard({ title, value, subtitle, description, icon, trend = 'neutral', className }: StatCardProps) {
  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="flex items-center gap-1">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand-surface text-brand-light">
            {icon}
          </span>
          {trend === 'up' && (
            <svg className="size-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
              <polyline points="17 6 23 6 23 12" />
            </svg>
          )}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-xs text-gray-500">
        <span className="font-medium">{subtitle}</span>
        <br />
        <span className="text-gray-400">{description}</span>
      </div>
    </div>
  )
}
