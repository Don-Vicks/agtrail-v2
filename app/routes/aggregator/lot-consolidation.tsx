import { useState } from 'react'
import { 
  Plus, 
  QrCode, 
  Eye,
  FileText,
  Search,
  MoreVertical,
  User
} from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

// Mock Data
const mockBatches = [
  {
    id: '#BT - 98442',
    farmer: 'Marcus Chen',
    farmerId: 'F - 006',
    origin: 'Takoradi, GHA',
    harvested: '2025-04-13',
    weight: '250.00 Kg'
  },
  {
    id: '#BT - 98442',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 004',
    origin: 'Soubre, CV',
    harvested: '2025-04-13',
    weight: '250.00 Kg'
  },
  {
    id: '#BT - 98442',
    farmer: 'Alex Jenkins',
    farmerId: 'F - 002',
    origin: 'Kumasi, GHA',
    harvested: '2025-04-13',
    weight: '250.00 Kg'
  },
  {
    id: '#BT - 98442',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 008',
    origin: 'Kumasi, GHA',
    harvested: '2025-04-13',
    weight: '250.00 Kg'
  },
  {
    id: '#BT - 98442',
    farmer: 'Sarah Rogers',
    farmerId: 'F - 007',
    origin: 'Kumasi, GHA',
    harvested: '2025-04-13',
    weight: '250.00 Kg'
  }
]

export default function AggregatorLotConsolidationPage() {
  const [selectedBatches, setSelectedBatches] = useState<string[]>([])

  const toggleBatch = (id: string) => {
    setSelectedBatches(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const selectedCount = selectedBatches.length
  const totalWeight = selectedCount * 250 // Mocking 250kg per batch

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/aggregator',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          { label: 'Add Farmer' }
        ]}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">INBOUND CONSOLIDATION - DRAFT-2026-04-22</p>
          <h1 className="text-2xl font-extrabold text-[#2e7d32] tracking-tight">Consolidate the harvest</h1>
          <p className="text-[13px] text-gray-500 font-medium">Merge farmer batches into sealed aggregators lots with an immutable composition</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            disabled={selectedCount < 2}
            className="rounded-lg border-gray-200 bg-[#1a4332] text-white hover:bg-[#122e22] h-10 px-4 text-xs font-bold gap-2 disabled:opacity-50"
          >
            <Plus className="size-4" />
            New Consolidation {selectedCount > 0 && `(${selectedCount})`}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Available Batches" value="8" />
        <StatCard label="Lots Sealed" value={selectedCount > 1 ? "1" : "0"} />
        <StatCard label="Total KG Consolidated" value={`${totalWeight} kg`} />
        <StatCard label="Anomalies Flagged" value="0" />
      </div>

      {/* Sealed Lots Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">Sealed lots <span className="text-gray-300 ml-1">({selectedCount > 1 ? 1 : 0})</span></h2>
        
        {selectedCount > 1 ? (
          <div className="rounded-2xl border border-[#2e7d32]/20 bg-[#e8f5e9]/5 p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-xl bg-white border border-[#2e7d32]/10 flex items-center justify-center text-[#2e7d32] shadow-sm">
                  <QrCode className="size-6" />
               </div>
               <div>
                  <h3 className="text-sm font-extrabold text-[#1a4332] tracking-tight">LOT-2025-TEMP-01</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{selectedCount} Batches Consolidated</p>
               </div>
            </div>
            <div className="flex items-center gap-6">
               <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Net Weight</p>
                  <p className="text-sm font-extrabold text-[#2e7d32] tracking-tight">{totalWeight}.00 Kg</p>
               </div>
               <Button variant="outline" className="size-9 p-0 rounded-lg border-gray-100">
                  <Eye className="size-4 text-gray-300" />
               </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-20 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
            <div className="size-10 rounded-lg bg-gray-50 flex items-center justify-center text-[#2e7d32]">
              <QrCode className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">No lots yet</h3>
              <p className="text-[11px] text-gray-400 font-medium max-w-[280px]">Select two or more available farmer batches to create your first sealed lot.</p>
            </div>
          </div>
        )}
      </div>

      {/* Available Farmer Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-gray-900 tracking-tight">Available Farmer</h2>
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="w-12 px-6"></th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider">Batch Identifier</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider">Farmer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider">Origin</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider">Harvested</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#2e7d32] uppercase tracking-wider">Weight</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockBatches.map((batch, idx) => {
                const isSelected = selectedBatches.includes(batch.id + idx)
                return (
                  <tr 
                    key={idx} 
                    onClick={() => toggleBatch(batch.id + idx)}
                    className={cn(
                      "group hover:bg-gray-50/30 transition-colors cursor-pointer",
                      isSelected && "bg-[#e8f5e9]/10"
                    )}
                  >
                    <td className="px-6 py-5">
                       <div className={cn(
                          "size-5 rounded border-2 transition-all flex items-center justify-center",
                          isSelected ? "bg-[#2e7d32] border-[#2e7d32]" : "border-gray-100 bg-gray-50 group-hover:border-gray-200"
                       )}>
                          {isSelected && <CheckCircle2 className="size-3 text-white" />}
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-extrabold text-[#2e7d32] tracking-tight">{batch.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-extrabold text-[#2e7d32] tracking-tight">{batch.farmer}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{batch.farmerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight">
                      {batch.origin}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight">
                      {batch.harvested}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-500 tracking-tight">
                      {batch.weight}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-300">
                        <Eye className="size-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-2">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900 tracking-tighter">{value}</p>
    </div>
  )
}
