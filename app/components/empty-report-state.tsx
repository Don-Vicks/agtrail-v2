import { FileText, Search, BarChart3, ArrowRight } from 'lucide-react'

interface EmptyReportStateProps {
  title: string
  description: string
  icon?: 'search' | 'chart' | 'file'
}

export function EmptyReportState({ 
  title, 
  description, 
  icon = 'file' 
}: EmptyReportStateProps) {
  const Icon = {
    search: Search,
    chart: BarChart3,
    file: FileText
  }[icon]

  return (
    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-md bg-gray-50/30 px-6 text-center">
      <div className="relative mb-6">
        <div className="size-20 rounded-full bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center animate-bounce-subtle">
          <Icon className="size-8 text-brand" />
        </div>
        <div className="absolute -bottom-2 -right-2 size-8 rounded-full bg-brand flex items-center justify-center text-white shadow-lg">
          <ArrowRight className="size-4" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed font-medium">
        {description}
      </p>

      <div className="mt-10 flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
          <div className="size-2 rounded-full bg-brand" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Parameters</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
          <div className="size-2 rounded-full bg-gray-200" />
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generate Report</span>
        </div>
      </div>
    </div>
  )
}
