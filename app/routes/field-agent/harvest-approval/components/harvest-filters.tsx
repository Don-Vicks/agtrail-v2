import { Search, ChevronDown } from 'lucide-react'
import { Button } from '~/components/ui/button'

export function HarvestFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[240px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search Farm..."
          className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 bg-white text-sm outline-none focus:border-[#2e7d32] transition-all"
        />
      </div>
      <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
        <Search className="size-4 text-gray-400" />
        Search
      </Button>
      <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
        <div className="size-4 border border-gray-400 rounded-sm flex items-center justify-center text-[10px]">田</div>
        Sort by Farmer
        <ChevronDown className="size-4 text-gray-400" />
      </Button>
      <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
        <div className="size-4 border border-gray-400 rounded-sm flex items-center justify-center text-[10px]">田</div>
        Sort by Product
        <ChevronDown className="size-4 text-gray-400" />
      </Button>
    </div>
  )
}
