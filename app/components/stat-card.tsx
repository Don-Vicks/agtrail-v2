import { TrendingDown, TrendingUp } from 'lucide-react'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'

interface StatCardProps {
  title?: string // Backward compatibility
  label?: string // High density naming
  value: string
  subtitle?: string
  description?: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'neutral' | { value: string; isPositive: boolean }
  className?: string
  isLoading?: boolean
}

export function StatCard({
  title,
  label,
  value,
  subtitle,
  description,
  icon,
  trend = 'neutral',
  className,
  isLoading
}: StatCardProps) {
  const displayLabel = label || title

  return (
    <div className={cn(
      'rounded-md border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-full',
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 group-hover:text-brand transition-colors">
            {displayLabel}
          </span>
          <div className="text-2xl font-bold text-gray-900 tracking-tight">
            {isLoading ? <Skeleton className="h-8 w-24" /> : value}
          </div>
        </div>
        <div className="flex size-10 items-center justify-center rounded-md bg-gray-50 border border-gray-100 text-gray-400 group-hover:text-brand transition-colors">
          {icon}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50/50 mt-auto">
        <div className="flex flex-col">
          {isLoading ? (
            <Skeleton className="h-3 w-32" />
          ) : (
            <>
              {subtitle && <span className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{subtitle}</span>}
              {description && <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{description}</span>}
            </>
          )}
        </div>

        {trend && typeof trend === 'object' ? (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
            trend.isPositive ? "text-emerald-500" : "text-amber-500"
          )}>
            {trend.isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend.value}
          </div>
        ) : trend !== 'neutral' && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest",
            trend === 'up' ? "text-emerald-500" : "text-amber-500"
          )}>
            {trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
            {trend === 'up' ? 'Increase' : 'Decrease'}
          </div>
        )}
      </div>
    </div>
  )
}
