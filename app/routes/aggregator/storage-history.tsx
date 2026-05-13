import { useState } from 'react'
import { Search, ChevronDown, QrCode, ArrowUpRight, Eye, ClipboardList, X, Scissors, Droplets, FlaskConical, Wind, Sprout, Loader2, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import { useGetAggregatorLots } from '~/lib/api/generated/aggregator/aggregator'
import { StorageModal } from './lot-consolidation/components/storage-modal'

export default function StorageHistoryPage() {
  const { data: lotsResponse, isLoading: isLoadingLots } = useGetAggregatorLots()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLot, setSelectedLot] = useState<any>(null)
  const navigate = useNavigate()

  const lots = lotsResponse?.data?.data ?? []

  const handleRecordNew = (lot: any) => {
    setSelectedLot(lot)
    setIsModalOpen(true)
  }

  const handleSaveEntry = () => {
    setIsModalOpen(false)
    // Refresh handled by storage modal internal invalidate
  }

  if (isLoadingLots) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 text-left">
      <PageHeader
        items={[
          { label: 'Aggregator', href: '/aggregator' },
          { label: 'Storage History' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Storage History</h1>
        <p className="text-sm text-gray-500 font-medium">Manage and track all your products throughout their journey</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <input
            type="text"
            placeholder="Search Lots..."
            className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-200 bg-white text-sm outline-none focus:border-[#2e7d32] transition-all"
          />
        </div>
        <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
          <Search className="size-4 text-[#2e7d32]" />
          Search
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lots.map((lot) => (
          <div key={lot.id} className="bg-white border border-gray-100 rounded-md p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="size-20 rounded-md border border-gray-100 flex items-center justify-center p-2 bg-gray-50/30">
                <QrCode className="size-full text-[#2e7d32]" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-[#1a4332] px-3 py-1 rounded text-white font-bold text-xs uppercase tracking-wider">
                  {lot.actualWeight || lot.declaredTotalWeight} {lot.weightUnit || 'KG'}
                </div>
                <div className="bg-[#fff7ed] px-3 py-1 rounded border border-[#ffedd5]">
                  <p className="text-[10px] font-bold text-[#9a3412] tracking-wider uppercase">{lot.lotId || `#LOT-${lot.id.slice(-6)}`}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">
                  Consolidated Lot
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-gray-400" />
                  <p className="text-sm font-bold text-gray-900">{lot.status.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span>{new Date(lot.createdAt).toLocaleDateString()}</span>
                  <span>{lot.compositionTree?.length || 0} Batches</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link to={`/aggregator/storage-history`}>
                <Button variant="outline" className="w-full h-11 border-gray-100 text-[#1a4332] font-semibold rounded-md hover:bg-gray-50 gap-2">
                  <Eye className="size-4" />
                  View Composition
                </Button>
              </Link>
              <Button 
                onClick={() => handleRecordNew(lot)}
                className="w-full h-11 bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-sm gap-2"
              >
                <ClipboardList className="size-4" />
                Log Storage condition
              </Button>
            </div>
          </div>
        ))}
        {lots.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No storage history found.</p>
          </div>
        )}
      </div>

      <StorageModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSave={handleSaveEntry}
        lotId={selectedLot?.id}
      />
    </div>
  )
}

function OperationTypeButton({ icon, label, desc, onClick, color }: { icon: React.ReactNode; label: string; desc: string; onClick: () => void; color: string }) {
  const bgColors: Record<string, string> = {
    purple: 'bg-purple-50 group-hover:bg-purple-100',
    blue: 'bg-blue-50 group-hover:bg-blue-100',
    pink: 'bg-pink-50 group-hover:bg-pink-100',
    cyan: 'bg-cyan-50 group-hover:bg-cyan-100',
    amber: 'bg-amber-50 group-hover:bg-amber-100'
  }

  return (
    <button 
      onClick={onClick}
      className="flex items-start gap-4 p-5 rounded-md border border-gray-100 bg-white hover:border-[#2e7d32] hover:shadow-md transition-all text-left group"
    >
      <div className={cn("size-10 rounded-md flex items-center justify-center shrink-0 transition-colors", bgColors[color])}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-[#1a4332] tracking-tight">{label}</h4>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </button>
  )
}
