import { cn } from '~/lib/utils'

interface MetricProps {
  label: string
  value: string
  valueColor?: string
}

export function ReportMetric({ label, value, valueColor = "text-gray-900" }: MetricProps) {
  return (
    <div className="space-y-0 text-left">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className={cn("text-base font-black tracking-tight uppercase", valueColor)}>{value}</p>
    </div>
  )
}

export function ReportMetricsBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-2 py-1">
      <ReportMetric label="PRODUCT" value="Maize" valueColor="text-[#2e7d32]" />
      <ReportMetric label="BATCH NUMBER" value="BT192372320323" />
      <ReportMetric label="TOTAL QUANTITY" value="1,340 MT" />
      <ReportMetric label="MARKET READINESS" value="94%" valueColor="text-[#2e7d32]" />
    </div>
  )
}
