import { useState } from 'react'
import { Search, ChevronDown, Filter } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { TransferCard } from './transfer-card'
import { InitiateTransferModal } from './initiate-transfer-modal'
import { Pagination } from '~/components/pagination'
import type { ProductTransfer } from '~/types/transfer'

interface TransferPageContentProps {
  title: string
  subtitle: string
  transfers: ProductTransfer[]
}

export function TransferPageContent({ title, subtitle, transfers }: TransferPageContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductTransfer | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleInitiate = (product: ProductTransfer) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1d3d1e] uppercase tracking-tight">{title}</h1>
        <p className="text-sm text-gray-500 font-medium mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {transfers.map((transfer) => (
          <TransferCard 
            key={transfer.id} 
            transfer={transfer} 
            onAction={handleInitiate}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          0 of 100 row(s) selected.
        </p>
        <Pagination currentPage={1} totalPages={4} onPageChange={() => {}} />
      </div>

      <InitiateTransferModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={selectedProduct} 
      />
    </div>
  )
}
