import { useState } from 'react'
import { Search, ChevronDown, Filter } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { TransferOfferCard } from './transfer-offer-card'
import { Pagination } from '~/components/pagination'
import type { TransferOffer } from '~/types/transfer'
import { usePatchTransfersIdStatus } from '~/lib/api/generated/transfers/transfers'

interface OffersPageContentProps {
  offers: TransferOffer[]
}

export function OffersPageContent({ offers }: OffersPageContentProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { mutateAsync: acceptTransfer } = usePatchTransfersIdStatus()

  const handleAccept = async (offer: TransferOffer) => {
    try {
      await acceptTransfer({
        id: offer.id,
        data: { status: 'accepted' }
      })
      alert(`Transfer accepted successfully!`)
    } catch (error) {
      console.error('Failed to accept transfer', error)
      alert(`Failed to accept transfer.`)
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
            className="pl-4 h-11 rounded-lg border-gray-200 focus:border-brand transition-all"
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
            onAccept={handleAccept}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          0 of 100 row(s) selected.
        </p>
        <Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />
      </div>
    </div>
  )
}
