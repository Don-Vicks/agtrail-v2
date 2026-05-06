import { useState } from 'react'
import { Search, ChevronDown, QrCode, ArrowUpRight, ClipboardList, X, Calendar } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

interface TransferItem {
  id: string
  product: string
  batchId: string
  farmer: string
  farmName: string
  location: string
  weight: string
  status: 'available' | 'ready'
}

const mockTransfers: TransferItem[] = [
  {
    id: '1',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    farmName: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    status: 'available'
  },
  {
    id: '2',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    farmName: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    status: 'available'
  },
  {
    id: '3',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    farmName: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    status: 'available'
  },
  {
    id: '4',
    product: 'Cashew',
    batchId: 'BATCH-1758814569861',
    farmer: 'Deborah Ogunyemi Farm',
    farmName: 'Deborah Ogunyemi Farm',
    location: 'Zone 16, Kute, Iwo Road',
    weight: '2,000KG',
    status: 'available'
  }
]

export default function AggregatorTransferPage() {
  const [items, setItems] = useState<TransferItem[]>(mockTransfers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<TransferItem | null>(null)

  const handleInitiate = (item: TransferItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDispatchRequest = () => {
    if (selectedItem) {
      setItems(prev => prev.map(it => it.id === selectedItem.id ? { ...it, status: 'ready' } : it))
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-10 text-left">
      <PageHeader
        items={[
          { label: 'Product' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Initiate Product</h1>
        <p className="text-sm text-gray-500 font-medium">Initiate product transfer from your stock to any stakeholders</p>
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
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-100 rounded-md p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="size-20 rounded-md border border-gray-100 flex items-center justify-center p-2 bg-gray-50/30">
                <QrCode className="size-full text-[#2e7d32]" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-[#1a4332] px-3 py-1 rounded text-white font-bold text-xs uppercase tracking-wider">
                  {item.weight}
                </div>
                <div className="bg-[#fff7ed] px-3 py-1 rounded border border-[#ffedd5]">
                  <p className="text-[10px] font-bold text-[#9a3412] tracking-wider uppercase">{item.batchId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div>
                <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">{item.product}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <p className="text-sm font-bold text-gray-900">{item.farmer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-600">{item.farmName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{item.location}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => handleInitiate(item)}
                className={cn(
                  "w-full h-11 font-bold rounded-md shadow-sm transition-all",
                  item.status === 'ready' 
                    ? "bg-[#1a4332] hover:bg-[#122e22] text-white" 
                    : "bg-[#1a4332] hover:bg-[#122e22] text-white"
                )}
              >
                {item.status === 'ready' ? 'Ready for pickup' : 'Initiate Product Transfer'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
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

      {/* Initiate Pickup Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[720px] p-0 overflow-hidden border-none shadow-2xl rounded-md bg-white">
          <div className="max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-8 pb-4 flex flex-row justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-[#1a4332] tracking-tight">Initiate Pickup Request</DialogTitle>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Fill in the details to handover goods to the transporter and secure the batch on the blockchain.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
                <X className="size-6" />
              </button>
            </DialogHeader>

            <div className="px-8 pb-8 space-y-6">
              {/* Product Badge */}
              <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-md px-4 py-2 text-[#1a4332] font-bold text-sm">
                #AG-8829 Arabica Coffee - Grade A (20.5 Tons)
              </div>

              <div className="grid grid-cols-2 gap-6">
                <FormGroup label="Quantity to Transfer*" placeholder="Enter Quantity Purchased" />
                <FormGroup label="Unit *" placeholder="Select a Unit" isSelect />
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Destination & Buyer Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <FormGroup label="Buyer *" placeholder="Select Buyer" isSelect />
                  <FormGroup label="Buyer Email" placeholder="Enter Supplier Email" />
                  <FormGroup label="Country *" placeholder="Enter Country" />
                  <FormGroup label="Region/State" placeholder="Enter Country Region" />
                  <FormGroup label="Contact Phone Number 1" placeholder="Enter Country Region" />
                  <FormGroup label="Contact Phone Number 2" placeholder="Enter Country Region" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Address</label>
                  <textarea 
                    placeholder="Enter Country Region"
                    className="w-full h-24 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 outline-none focus:border-[#2e7d32] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Price Box */}
              <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-md p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <svg className="size-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <h4 className="text-sm font-bold text-[#92400e]">Set Your Price</h4>
                </div>
                <p className="text-sm text-[#92400e] font-medium">The processor will need to pay this amount to receive the products.</p>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#92400e] uppercase tracking-widest">Price (NGN) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₦</span>
                    <input 
                      type="text"
                      defaultValue="0.00"
                      className="w-full h-11 pl-8 pr-4 rounded-md border border-gray-200 bg-white text-sm font-bold text-gray-900 outline-none"
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-400">Payment will be made to your bank wallet</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Pickup Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Scheduled Date *</label>
                    <div className="relative">
                      <input 
                        placeholder="Pick a date"
                        className="w-full h-11 pl-4 pr-10 rounded-md border border-gray-200 text-sm font-medium outline-none"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    </div>
                  </div>
                  <FormGroup label="Price per Unit" placeholder="Enter Price" />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleDispatchRequest}
                  className="flex-1 h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold rounded-md shadow-sm"
                >
                  Dispatch Request
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 h-12 border-[#1a4332] text-[#1a4332] font-bold rounded-md hover:bg-[#1a4332]/5"
                >
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function FormGroup({ label, placeholder, isSelect }: { label: string; placeholder: string; isSelect?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input 
          readOnly={isSelect}
          placeholder={placeholder}
          className={cn(
            "w-full h-11 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all",
            isSelect && "cursor-pointer bg-white"
          )}
        />
        {isSelect && (
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        )}
      </div>
    </div>
  )
}
