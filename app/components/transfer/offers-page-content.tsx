import { ChevronDown, Filter, Search } from 'lucide-react'
import { useState } from 'react'
import { Pagination } from '~/components/pagination'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { getGetTransfersAvailablePickupsQueryKey, usePostTransfersIdAccept } from '~/lib/api/generated/transfers/transfers'
import type { TransferOffer } from '~/types/transfer'
import { TransferOfferCard } from './transfer-offer-card'
import { AcceptTransferModal } from './accept-transfer-modal'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface OffersPageContentProps {
  offers: TransferOffer[]
}

export function OffersPageContent({ offers }: OffersPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<TransferOffer | null>(null)
  
  const { mutateAsync: acceptTransfer } = usePostTransfersIdAccept()
  const queryClient = useQueryClient()

  const handleOpenAcceptModal = (offer: TransferOffer) => {
    setSelectedOffer(offer)
    setIsAcceptModalOpen(true)
  }

  const handleConfirmAccept = async (data: { assignedDriverName?: string; assignedDriverPersonnelId?: string }) => {
    if (!selectedOffer) return

    try {
      await acceptTransfer({
        id: selectedOffer.id,
        data: {
          assignedDriverName: data.assignedDriverName,
          assignedDriverPersonnelId: data.assignedDriverPersonnelId
        }
      })
      toast.success(`Transfer offer accepted!`)
      void queryClient.invalidateQueries({ queryKey: getGetTransfersAvailablePickupsQueryKey() })
      setIsAcceptModalOpen(false)
    } catch (error) {
      console.error('Failed to accept transfer', error)
      toast.error(`Failed to accept transfer.`)
      throw error // Re-throw to keep modal open if needed or let modal handle its state
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1d3d1e] uppercase tracking-tight">Transfer Offers</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">Here's a list of your tasks for this month!</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search Farm..."
            className="pl-4 h-11 rounded-md border-gray-200 focus:border-brand transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 px-6 border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
          <Search className="size-4" />
          Search
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-11 px-4 border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Filter className="size-4" />
            Sort by Farmer
            <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-11 px-4 border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <Filter className="size-4" />
            Sort by Product
            <ChevronDown className="size-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <TransferOfferCard
            key={offer.id}
            offer={offer}
            onAccept={handleOpenAcceptModal}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          0 of 100 row(s) selected.
        </p>
        <Pagination 
          currentPage={1} 
          totalPages={4} 
          onPageChange={() => { }} 
          totalItems={40} 
          itemsPerPage={10} 
        />
      </div>

      <AcceptTransferModal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        onConfirm={handleConfirmAccept}
        offer={selectedOffer}
      />
    </div>
  )
}
