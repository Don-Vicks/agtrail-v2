import { useState } from 'react'
import { Search, ChevronDown, QrCode, ArrowUpRight, Eye, ClipboardList, X, Scissors, Droplets, FlaskConical, Wind, Sprout } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import { Dialog, DialogContent, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

interface StorageItem {
  id: string
  product: string
  warehouse: string
  batchId: string
  farmer: string
  location: string
  date: string
}

const mockStorage: StorageItem[] = [
  {
    id: '1',
    product: 'Cashew',
    warehouse: 'Warehouse A',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    date: '13 Oct, 2025 8:30am'
  },
  {
    id: '2',
    product: 'Cashew',
    warehouse: 'Warehouse A',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    date: '13 Oct, 2025 8:30am'
  },
  {
    id: '3',
    product: 'Cashew',
    warehouse: 'Warehouse A',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    date: '13 Oct, 2025 8:30am'
  },
  {
    id: '4',
    product: 'Cashew',
    warehouse: 'Warehouse A',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    date: '13 Oct, 2025 8:30am'
  }
]

export default function StorageHistoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null)
  const navigate = useNavigate()

  const handleRecordNew = (item: StorageItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleSelectOperation = (type: string) => {
    setIsModalOpen(false)
    navigate(`/aggregator/storage-history/record?type=${type}&batch=${selectedItem?.batchId}`)
  }

  return (
    <div className="space-y-6 pb-10 text-left">
      <PageHeader
        items={[
          { label: 'Product' }
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
            placeholder="Search Farm..."
            className="w-full h-10 pl-4 pr-10 rounded-md border border-gray-200 bg-white text-sm outline-none focus:border-[#2e7d32] transition-all"
          />
        </div>
        <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
          <Search className="size-4 text-[#2e7d32]" />
          Search
        </Button>
        <div className="relative">
          <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
            <ClipboardList className="size-4 text-gray-400" />
            Sort by Farmer
            <ChevronDown className="size-4 text-gray-400" />
          </Button>
        </div>
        <div className="relative">
          <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-semibold gap-2 px-4 rounded-md hover:bg-gray-50">
            <ClipboardList className="size-4 text-gray-400" />
            Sort by Product
            <ChevronDown className="size-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockStorage.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-md p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="size-20 rounded-md border border-gray-100 flex items-center justify-center p-2 bg-gray-50/30">
                <QrCode className="size-full text-[#2e7d32]" />
              </div>
              <div className="bg-[#fff7ed] px-3 py-1 rounded border border-[#ffedd5]">
                <p className="text-[10px] font-bold text-[#9a3412] tracking-wider uppercase">{item.batchId}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">
                  {item.product} <span className="text-sm font-semibold text-gray-500 ml-1">({item.warehouse})</span>
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 group/link cursor-pointer w-fit">
                  <p className="text-sm font-bold text-gray-900">{item.farmer}</p>
                  <ArrowUpRight className="size-4 text-gray-400 group-hover/link:text-[#2e7d32] transition-colors" />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 font-semibold uppercase tracking-wider">
                  <span>{item.location}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link to={`/aggregator/batch/${item.id}`}>
                <Button variant="outline" className="w-full h-11 border-gray-100 text-[#1a4332] font-semibold rounded-md hover:bg-gray-50 gap-2">
                  <Eye className="size-4" />
                  View Operations
                </Button>
              </Link>
              <Button 
                onClick={() => handleRecordNew(item)}
                className="w-full h-11 bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-sm gap-2"
              >
                <ClipboardList className="size-4" />
                Record New Operation
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <p className="text-xs font-semibold text-gray-400">0 of 100 row(s) selected.</p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Rows per page</span>
            <select className="h-8 rounded-md border border-gray-200 bg-white px-2 text-[10px] font-semibold outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Page 1 of 4</span>
            <div className="flex gap-1">
              <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-50" disabled>&laquo;</button>
              <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-50" disabled>&lsaquo;</button>
              <button className="size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold">&rsaquo;</button>
              <button className="size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold">&raquo;</button>
            </div>
          </div>
        </div>
      </div>

      {/* Select Operation Type Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[640px] p-0 overflow-hidden border-none shadow-2xl rounded-md bg-white">
          <div className="p-8 pb-4 flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold text-[#1a4332] tracking-tight">Select Operation Type</DialogTitle>
              <p className="text-sm text-gray-500 font-medium">Choose the type of farm operation you want to record</p>
            </div>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="size-6" />
            </button>
          </div>

          <div className="px-8 pb-6">
            <div className="bg-gray-50/50 border border-gray-100 rounded-md p-5 flex items-start gap-8">
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Crop Cycle</p>
                <h4 className="text-base font-bold text-[#1a4332] tracking-tight">Plantain</h4>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Planted: 4/16/2026</p>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Farm</p>
                <h4 className="text-base font-bold text-[#1a4332] tracking-tight">Biu Farm</h4>
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Abia - Ikeja</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="size-8 rounded-full bg-green-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">AD</div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Farmer</p>
                <p className="text-xs font-bold text-[#1a4332]">admin</p>
              </div>
            </div>
          </div>

          <div className="p-8 pt-2 grid grid-cols-2 gap-4">
            <OperationTypeButton 
              icon={<Scissors className="size-5 text-purple-600" />} 
              label="Cleaning" 
              desc="Tillage, plowing, and soil preparation"
              onClick={() => handleSelectOperation('Cleaning')}
              color="purple"
            />
            <OperationTypeButton 
              icon={<Droplets className="size-5 text-blue-600" />} 
              label="Drying" 
              desc="Water application to crops"
              onClick={() => handleSelectOperation('Drying')}
              color="blue"
            />
            <OperationTypeButton 
              icon={<FlaskConical className="size-5 text-pink-600" />} 
              label="Insecticide Application" 
              desc="Apply fertilizers and soil amendments"
              onClick={() => handleSelectOperation('Insecticide')}
              color="pink"
            />
            <OperationTypeButton 
              icon={<Wind className="size-5 text-cyan-600" />} 
              label="Irrigation" 
              desc="Water application to crops"
              onClick={() => handleSelectOperation('Irrigation')}
              color="cyan"
            />
            <OperationTypeButton 
              icon={<Scissors className="size-5 text-purple-600" />} 
              label="Pruning" 
              desc="Trim and shape plants"
              onClick={() => handleSelectOperation('Pruning')}
              color="purple"
            />
            <OperationTypeButton 
              icon={<Sprout className="size-5 text-amber-600" />} 
              label="Harvesting" 
              desc="Crop collection and post-harvest"
              onClick={() => handleSelectOperation('Harvesting')}
              color="amber"
            />
          </div>
        </DialogContent>
      </Dialog>
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
