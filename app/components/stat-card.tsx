import { cn } from '~/lib/utils'
import { Skeleton } from '~/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string
  subtitle: string
  description: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  isLoading?: boolean
}

export function StatCard({ title, value, subtitle, description, icon, trend = 'neutral', className, isLoading }: StatCardProps) {
  return (
    <div className={cn('rounded-md border border-gray-200 bg-white p-4', className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="flex items-center gap-1">
          <span className="flex size-7 items-center justify-center rounded-md bg-brand-surface text-brand-light">
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
      <div className="text-2xl font-bold text-gray-900 mb-0.5">
        {isLoading ? <Skeleton className="h-8 w-24" /> : value}
      </div>
      <div className="text-xs text-gray-500">
        {isLoading ? (
          <div className="space-y-1 mt-1">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        ) : (
          <>
            <span className="font-medium">{subtitle}</span>
            <br />
            <span className="text-gray-400">{description}</span>
          </>
        )}
      </div>
    </div>
  )
}
