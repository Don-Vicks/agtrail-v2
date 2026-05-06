import { QrCode, ChevronRight } from 'lucide-react'
import { Button } from '~/components/ui/button'

export interface HarvestItem {
  id: string
  product: string
  batchId: string
  farmer: string
  location: string
  weight: string
  hectares: string
  owner: string
  status: 'pending' | 'approved'
}

interface HarvestCardProps {
  item: HarvestItem
  onInspect: (item: HarvestItem) => void
}

export function HarvestCard({ item, onInspect }: HarvestCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className="size-20 rounded-md border border-gray-100 flex items-center justify-center p-2 bg-gray-50/30">
          <QrCode className="size-full text-[#2e7d32]" />
        </div>
        <div className="bg-[#fff7ed] px-3 py-1 rounded border border-[#ffedd5]">
          <p className="text-[10px] font-bold text-[#9a3412] tracking-wider uppercase">{item.batchId}</p>
        </div>
      </div>

      <div className="space-y-2 mb-8 text-left">
        <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">{item.product}</h3>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{item.farmer}</p>
          <ChevronRight className="size-4 text-gray-300" />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">{item.location}</p>
      </div>

      <Button 
        onClick={() => onInspect(item)}
        className="w-full h-11 bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-sm transition-all"
      >
        Inspect Harvest
      </Button>
    </div>
  )
}
