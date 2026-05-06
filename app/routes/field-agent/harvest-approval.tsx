import { useState } from 'react'
import { Archive } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { HarvestFilters } from './harvest-approval/components/harvest-filters'
import { HarvestCard, type HarvestItem } from './harvest-approval/components/harvest-card'
import { HarvestInspectionModal } from './harvest-approval/components/harvest-inspection-modal'

const mockHarvests: HarvestItem[] = [
  {
    id: '1',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    hectares: '0 Gross Hectares',
    owner: 'admin@agrolinking.com',
    status: 'pending'
  },
  {
    id: '2',
    product: 'Maize',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '3,000KG',
    hectares: '0 Gross Hectares',
    owner: 'admin@agrolinking.com',
    status: 'pending'
  },
  {
    id: '3',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    hectares: '0 Gross Hectares',
    owner: 'admin@agrolinking.com',
    status: 'pending'
  },
  {
    id: '4',
    product: 'Maize',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '3,000KG',
    hectares: '0 Gross Hectares',
    owner: 'admin@agrolinking.com',
    status: 'pending'
  }
]

export default function HarvestApprovalPage() {
  const [items] = useState<HarvestItem[]>(mockHarvests)
  const [selectedHarvest, setSelectedHarvest] = useState<HarvestItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleInspect = (item: HarvestItem) => {
    setSelectedHarvest(item)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6 pb-10 text-left">
      <PageHeader
        items={[
          { label: 'Farm Certification', href: '/field-agent', icon: <Archive className='size-4 text-gray-400' /> },
          { label: 'Harvest Approval' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Harvest Approval</h1>
        <p className="text-sm text-gray-500 font-medium">Upload Certificate for each product</p>
      </div>

      <HarvestFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <HarvestCard 
            key={item.id} 
            item={item} 
            onInspect={handleInspect} 
          />
        ))}
      </div>

      <HarvestPagination />

      <HarvestInspectionModal 
        item={selectedHarvest}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

function HarvestPagination() {
  return (
    <div className="flex items-center justify-between pt-8 border-t border-gray-50">
      <p className="text-xs font-semibold text-gray-400 tracking-tight">0 of 100 row(s) selected.</p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Rows per page</span>
          <select className="h-8 rounded-md border border-gray-200 bg-white px-2 text-[10px] font-bold outline-none">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Page 1 of 4</span>
          <div className="flex gap-1">
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-50" disabled>&laquo;</button>
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-300 disabled:opacity-50" disabled>&lsaquo;</button>
            <button className="size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold">&rsaquo;</button>
            <button className="size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold">&raquo;</button>
          </div>
        </div>
      </div>
    </div>
  )
}
