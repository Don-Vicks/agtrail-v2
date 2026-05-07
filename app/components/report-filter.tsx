import { ChevronDown, Calendar } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface FilterOption {
  label: string
  value: string
}

interface ReportFilterProps {
  filters: {
    label: string
    placeholder: string
    options: FilterOption[]
  }[]
  onGenerate?: () => void
}

export function ReportFilter({ filters, onGenerate }: ReportFilterProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {filters.map((filter, idx) => (
          <div key={idx} className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              {filter.label}
            </label>
            <div className="relative">
              <select className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50/50 pl-4 pr-10 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none transition-all">
                <option value="">{filter.placeholder}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* Date Range - Simplified for now */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Start Date
            </label>
            <div className="relative">
              <input 
                type="date"
                className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              End Date
            </label>
            <div className="relative">
              <input 
                type="date"
                className="w-full h-11 rounded-lg border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={onGenerate}
          className="bg-brand hover:bg-brand/90 text-white font-bold uppercase tracking-widest text-[11px] h-11 px-8 rounded-lg shadow-sm"
        >
          Generate Report
        </Button>
      </div>
    </div>
  )
}
