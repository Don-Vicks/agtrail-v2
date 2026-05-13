import { useState } from 'react'
import { Search, ChevronDown, QrCode, ArrowUpRight, ClipboardList, X, Calendar, Loader2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import { useGetAggregatorLots, usePostAggregatorLotsLotIdCustodyTransfers } from '~/lib/api/generated/aggregator/aggregator'
import { useGetUsersByRole } from '~/lib/api/generated/users/users'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function AggregatorTransferPage() {
  const queryClient = useQueryClient()
  const { data: lotsResponse, isLoading: isLoadingLots } = useGetAggregatorLots()
  const { data: processorsResponse } = useGetUsersByRole({ role: 'processor' })
  const transferMutation = usePostAggregatorLotsLotIdCustodyTransfers()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLot, setSelectedLot] = useState<any>(null)
  
  // Form state
  const [receiverId, setReceiverId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split('T')[0])
  const [price, setPrice] = useState('0.00')

  const lots = lotsResponse?.data?.data ?? []
  const processors = (processorsResponse?.data as any)?.data ?? []

  const handleInitiate = (lot: any) => {
    setSelectedLot(lot)
    setQuantity(lot.actualWeight || lot.declaredTotalWeight || '0')
    setIsModalOpen(true)
  }

  const handleDispatchRequest = async () => {
    if (!selectedLot || !receiverId || !quantity) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      await transferMutation.mutateAsync({
        lotId: selectedLot.id,
        data: {
          receiverId,
          quantityTransferred: Number(quantity),
          transferDate: new Date(transferDate).toISOString(),
          weightUnit: selectedLot.weightUnit || 'kg'
        }
      })
      queryClient.invalidateQueries({ queryKey: [`/aggregator/lots`] })
      toast.success('Transfer initiated successfully')
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Failed to initiate transfer')
    }
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
          { label: 'Product Transfer' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Initiate Product Transfer</h1>
        <p className="text-sm text-gray-500 font-medium">Initiate product transfer from your stock to any stakeholders</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lots.filter(l => l.status === 'finalised' || l.status === 'received').map((lot) => (
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

            <div className="space-y-4 mb-8 text-left">
              <div>
                <h3 className="text-xl font-bold text-[#1a4332] tracking-tight">
                  Consolidated Lot
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="size-4 text-gray-400" />
                  <p className="text-sm font-bold text-gray-900">{lot.compositionTree?.length || 0} Batches Included</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-gray-400" />
                  <p className="text-sm font-semibold text-gray-600">Created: {new Date(lot.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => handleInitiate(lot)}
                className="w-full h-11 font-bold rounded-md shadow-sm bg-[#1a4332] hover:bg-[#122e22] text-white"
              >
                Initiate Product Transfer
              </Button>
            </div>
          </div>
        ))}
        {lots.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-md border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No available lots for transfer. Finalize a draft lot first.</p>
          </div>
        )}
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
                {selectedLot?.lotId || `#LOT-${selectedLot?.id?.slice(-6)}`} - {selectedLot?.actualWeight || selectedLot?.declaredTotalWeight} {selectedLot?.weightUnit || 'KG'}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Quantity to Transfer*</label>
                  <input 
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter Quantity"
                    className="w-full h-11 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Receiver (Processor)*</label>
                  <select 
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    className="w-full h-11 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all bg-white"
                  >
                    <option value="">Select Processor</option>
                    {processors.map((p: any) => (
                      <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                    ))}
                  </select>
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
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full h-11 pl-8 pr-4 rounded-md border border-gray-200 bg-white text-sm font-bold text-gray-900 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-gray-900 tracking-tight">Pickup Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Scheduled Date *</label>
                    <div className="relative">
                      <input 
                        type="date"
                        value={transferDate}
                        onChange={(e) => setTransferDate(e.target.value)}
                        className="w-full h-11 pl-4 pr-10 rounded-md border border-gray-200 text-sm font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button 
                  onClick={handleDispatchRequest}
                  disabled={transferMutation.isPending}
                  className="flex-1 h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold rounded-md shadow-sm gap-2"
                >
                  {transferMutation.isPending && <Loader2 className="size-4 animate-spin" />}
                  Dispatch Request
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 border-[#1a4332] text-[#1a4332] font-bold rounded-md hover:bg-[#1a4332]/5"
                >
                  Cancel
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
