import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { cn } from '~/lib/utils'

interface TrendStatCardProps {
  title: string
  value: string
  trend: {
    value: string
    isUp: boolean
  }
  description: string
  trendLabel: string
}

export function TrendStatCard({
  title,
  value,
  trend,
  description,
  trendLabel,
}: TrendStatCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          {title}
        </h3>
        <div 
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
            trend.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}
        >
          {trend.isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
          {trend.value}
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {description}
          <TrendingUp className="size-3 text-brand" />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">
          {trendLabel}
        </p>
      </div>
    </div>
  )
}
