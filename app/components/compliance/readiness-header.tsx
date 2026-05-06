import { Download, Badge } from 'lucide-react'
import { Button } from '~/components/ui/button'

interface ReadinessHeaderProps {
  onReport: () => void
}

export function ReadinessHeader({ onReport }: ReadinessHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between px-0">
      <div className="space-y-1 text-left">
        <h1 className="text-2xl font-bold text-[#2e7d32] tracking-tight">Compliance Readiness Review</h1>
        <p className="text-sm text-gray-500 font-medium">
          Evidence requirement summary for batch BT19237320323
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-bold px-6 rounded-md hover:bg-gray-50 text-xs uppercase tracking-widest">
          <Download className="size-4 mr-2" /> Save Draft
        </Button>
        <Button
          onClick={onReport}
          className="h-10 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold px-6 rounded-md shadow-sm transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          Generate Final Report
        </Button>
      </div>
    </div>
  )
}
