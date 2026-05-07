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
    value?: string
    onChange?: (value: string) => void
    isLoading?: boolean
  }[]
  onGenerate?: () => void
  isGenerating?: boolean
}

export function ReportFilter({ filters, onGenerate, isGenerating }: ReportFilterProps) {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {filters.map((filter, idx) => (
          <div key={idx} className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              {filter.label}
            </label>
            <div className="relative">
              <select 
                value={filter.value || ''}
                onChange={(e) => filter.onChange?.(e.target.value)}
                disabled={filter.isLoading}
                className="w-full h-9 rounded-md border border-gray-200 bg-gray-50/50 pl-4 pr-10 text-[10px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none transition-all disabled:opacity-50"
              >
                <option value="">{filter.isLoading ? 'Loading...' : filter.placeholder}</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* Date Range - Simplified for now */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Start Date
            </label>
            <div className="relative">
              <input 
                type="date"
                className="w-full h-9 rounded-md border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-[10px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              End Date
            </label>
            <div className="relative">
              <input 
                type="date"
                className="w-full h-9 rounded-md border border-gray-200 bg-gray-50/50 pl-10 pr-4 text-[10px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
              />
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <Button 
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-brand hover:bg-brand/90 text-white font-bold uppercase tracking-widest text-[10px] h-9 px-6 rounded-md shadow-sm disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>
    </div>
  )
}
