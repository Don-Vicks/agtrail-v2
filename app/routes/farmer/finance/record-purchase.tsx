import { useQueryClient } from '@tanstack/react-query'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, Plus, Search, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import type {
  PostPurchasesBody,
  PostPurchasesBodyProductType,
} from '~/lib/api/generated/models'
import {
  useGetPurchases,
  usePostPurchases,
} from '~/lib/api/generated/purchases/purchases'
import type { Route } from './+types/record-purchase'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Purchase | Agtrail Finance' },
    { name: 'description', content: 'Log farm payments and purchases' },
  ]
}
const RECENT_PURCHASES = [
  {
    id: 1,
    date: 'Jan 07, 2026',
    farmer: 'Olamide Olutekunbi',
    farm: 'Baba Beji Farms',
    beneficiary: 'Olamide Olutekunbi',
    account: 'Cash',
    amount: '₦5,000',
  },
]
export default function RecordPurchasePage() {
  const queryClient = useQueryClient()
  const { mutateAsync: submitPurchase, isPending } = usePostPurchases()

  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [description, setDescription] = useState('')
  const [productType, setProductType] =
    useState<PostPurchasesBodyProductType>('farm_product')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [pricePerUnit, setPricePerUnit] = useState('')
  const { data: purchasesResponse, isLoading: isLoadingPurchases } =
    useGetPurchases()
  const purchases = purchasesResponse?.data?.data || []

  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [sortBy, setSortBy] = useState<string>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const tablePurchases = useMemo(() => {
    return purchases.map((p) => ({
      id: p.id,
      date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A',
      rawDate: p.createdAt ? new Date(p.createdAt).getTime() : 0,
      farmer: p.fromUserId || 'Unknown',
      farm: p.farmProductId || p.batchProductId || 'N/A',
      beneficiary: p.toUserId || 'N/A',
      account: p.productType ? p.productType.replaceAll('_', ' ') : 'N/A',
      amount:
        typeof p.totalPrice === 'number'
          ? `₦${p.totalPrice.toLocaleString()}`
          : `${p.quantityTransferred} ${p.unit}`,
      status: p.status || 'pending',
    }))
  }, [purchases])

  const filteredPurchases = useMemo(() => {
    let result = tablePurchases.filter((p) => {
      const term = search.toLowerCase()
      return (
        p.farmer.toLowerCase().includes(term) ||
        p.farm.toLowerCase().includes(term) ||
        p.beneficiary.toLowerCase().includes(term) ||
        p.amount.toLowerCase().includes(term) ||
        p.account.toLowerCase().includes(term)
      )
    })

    // Sorting
    result = [...result].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'date':
          comparison = a.rawDate - b.rawDate
          break
        case 'beneficiary':
          comparison = a.beneficiary.localeCompare(b.beneficiary)
          break
        case 'details':
          comparison = a.account.localeCompare(b.account)
          break
        case 'amount': {
          const valA = parseFloat(a.amount.replace(/[^\d.]/g, '')) || 0
          const valB = parseFloat(b.amount.replace(/[^\d.]/g, '')) || 0
          comparison = valA - valB
          break
        }
        default:
          comparison = 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return result
  }, [search, tablePurchases, sortBy, sortOrder])

  const totalPages = Math.ceil(filteredPurchases.length / rowsPerPage)
  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredPurchases.slice(start, start + rowsPerPage)
  }, [filteredPurchases, currentPage, rowsPerPage])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="size-3 ml-1 opacity-50" />
    return sortOrder === 'asc' ? (
      <ArrowUp className="size-3 ml-1 text-brand" />
    ) : (
      <ArrowDown className="size-3 ml-1 text-brand" />
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const parsedQuantity = parseFloat(quantity)
    const beneficiaryId = beneficiary.trim()
    if (
      !beneficiaryId ||
      !quantity ||
      !unit ||
      Number.isNaN(parsedQuantity) ||
      parsedQuantity <= 0
    ) {
      toast.error('Please fill in beneficiary, unit, and a positive quantity.')
      return
    }

    try {
      const payload: PostPurchasesBody = {
        productType: productType as PostPurchasesBody['productType'],
        quantityTransferred: parsedQuantity,
        unit,
        currency: 'NGN',
        toUserId: beneficiaryId, // In farmer context, beneficiary is the seller
        notes: description,
      }

      // Add price fields if provided
      const parsedPricePerUnit = parseFloat(pricePerUnit)
      if (
        pricePerUnit &&
        !Number.isNaN(parsedPricePerUnit) &&
        parsedPricePerUnit > 0
      ) {
        payload.pricePerUnit = parsedPricePerUnit
        payload.totalPrice = parsedQuantity * parsedPricePerUnit
      }

      if (date) {
        payload.expectedDeliveryDate = new Date(date).toISOString()
      }

      await submitPurchase({ data: payload })
      await queryClient.invalidateQueries({ queryKey: ['/purchases'] })
      toast.success('Purchase recorded successfully!')

      // Reset form and go to first page
      setCurrentPage(1)
      setDate('')
      setBeneficiary('')
      setDescription('')
      setQuantity('')
      setUnit('kg')
      setPricePerUnit('')
    } catch (error) {
      toast.error('Failed to record purchase. Please try again.')
    }
  }

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg
                className='size-4 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={1.5}
              >
                <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
                <line x1='9' y1='3' x2='9' y2='21' />
              </svg>
            ),
          },
          { label: 'Finance' },
          { label: 'Record Purchase' },
        ]}
      />

      {/* Page Title Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 uppercase tracking-tight'>
            Record Purchase
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Log and track farm input acquisitions and payments
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => document.getElementById('table-search')?.focus()}
            className='flex items-center gap-2 text-gray-600'
          >
            <Search className='size-4' />
            <span>Search Records</span>
          </Button>
        </div>
      </div>

      {/* Entry Form Card */}
      <div className='rounded-md border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-2 mb-6 text-left'>
          <div className='size-8 rounded-md bg-brand-surface flex items-center justify-center text-brand'>
            <Plus className='size-4' />
          </div>
          <h2 className='text-lg font-bold text-gray-900 uppercase tracking-tight'>
            New Entry
          </h2>
        </div>

        <form className='space-y-6 text-left' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Transaction Date
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                className='h-10 w-full rounded-md border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Product Type <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  value={productType}
                  onChange={(e) =>
                    setProductType(
                      e.target.value as PostPurchasesBodyProductType,
                    )
                  }
                  required
                  className='h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
                >
                  <option value='farm_product'>Farm Product</option>
                  <option value='batch_product'>Batch Product</option>
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                  <ChevronDown className='size-3 text-gray-400' />
                </div>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Merchant / Seller ID <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                required
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
                placeholder='Enter user ID'
                className='h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Quantity <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder='0'
                className='h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Unit <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className='h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
                >
                  <option value='kg'>kg</option>
                  <option value='bags'>bags</option>
                  <option value='tons'>tons</option>
                  <option value='units'>units</option>
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                  <ChevronDown className='size-3 text-gray-400' />
                </div>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Price Per Unit (₦)
              </label>
              <input
                type='number'
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder='0.00'
                className='h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
              Additional Details & Notes
            </label>
            <textarea
              rows={2}
              placeholder='Provide more context about this purchase...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full resize-none rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
            />
          </div>

          <div className='flex justify-end pt-2'>
            <Button
              type='submit'
              disabled={isPending}
              className='bg-brand hover:bg-black text-white font-bold h-11 px-8 shadow-sm transition-all active:scale-[0.98]'
            >
              {isPending ? 'Propcessing...' : 'Record Transaction'}
            </Button>
          </div>
        </form>
      </div>

      {/* History Table Card */}
      <div className='rounded-md border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col'>
        <div className='p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white text-left gap-4'>
          <div className='flex items-center gap-2'>
            <div className='size-8 rounded-md bg-gray-50 flex items-center justify-center text-gray-400'>
              <ShoppingCart className='size-4' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 uppercase tracking-tight'>
                Recent Purchases
              </h2>
              <p className='text-xs text-gray-500 mt-0.5 font-medium'>
                Audit trail of farm input acquisitions
              </p>
            </div>
          </div>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
            <input
              id='table-search'
              type='text'
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              placeholder='Search purchases...'
              className='w-full rounded-md border border-gray-200 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
            />
          </div>
        </div>

        <div className='flex-1 overflow-x-auto'>
          {isLoadingPurchases ? (
            <div className='p-6'>
              <div className='space-y-3 animate-pulse'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className='h-12 rounded-md bg-gray-100' />
                ))}
              </div>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className='size-10' />}
              title={search ? 'No matches found' : 'No purchases found'}
              description={
                search
                  ? `No records found for "${search}"`
                  : "You haven't recorded any farm purchases yet."
              }
              action={
                search
                  ? { label: 'Clear search', onClick: () => setSearch('') }
                  : undefined
              }
            />
          ) : (
            <div className='min-w-[800px]'>
              <table className='w-full text-left text-sm'>
                <thead>
                  <tr className='bg-gray-50/50 border-b border-gray-100'>
                    <th
                      className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] cursor-pointer hover:bg-gray-100/50 transition-colors'
                      onClick={() => handleSort('date')}
                    >
                      <div className='flex items-center'>
                        Date <SortIcon column='date' />
                      </div>
                    </th>
                    <th
                      className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] cursor-pointer hover:bg-gray-100/50 transition-colors'
                      onClick={() => handleSort('beneficiary')}
                    >
                      <div className='flex items-center'>
                        Merchant / Seller <SortIcon column='beneficiary' />
                      </div>
                    </th>
                    <th
                      className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] cursor-pointer hover:bg-gray-100/50 transition-colors'
                      onClick={() => handleSort('details')}
                    >
                      <div className='flex items-center'>
                        Details <SortIcon column='details' />
                      </div>
                    </th>
                    <th
                      className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] text-right cursor-pointer hover:bg-gray-100/50 transition-colors'
                      onClick={() => handleSort('amount')}
                    >
                      <div className='flex items-center justify-end'>
                        Amount <SortIcon column='amount' />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {paginatedPurchases.map((purchase) => (
                    <tr
                      key={purchase.id}
                      className='hover:bg-gray-50/50 transition-colors group'
                    >
                      <td className='px-6 py-5 whitespace-nowrap'>
                        <span className='font-bold text-gray-900 tracking-tight'>
                          {purchase.date}
                        </span>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-gray-900 group-hover:text-brand transition-colors'>
                            {purchase.beneficiary}
                          </span>
                          <span className='text-xs text-gray-500 font-medium lowercase tracking-tight'>
                            @{purchase.farm.toLowerCase().replace(/\s+/g, '')}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1.5'>
                            <span className='font-bold text-gray-900'>
                              {purchase.account}
                            </span>
                            <Badge
                              variant='outline'
                              className='text-[8px] px-1 py-0 font-bold uppercase tracking-wide bg-blue-50/50 text-blue-600 border-blue-100'
                            >
                              {purchase.status}
                            </Badge>
                          </div>
                          <span className='text-[10px] text-gray-400 font-medium'>
                            Logged by {purchase.farmer}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-5 text-right'>
                        <span className='text-lg font-bold text-gray-900 tracking-tight'>
                          {purchase.amount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className='p-4 border-t border-gray-100 bg-gray-50/30'>
          {!isLoadingPurchases && filteredPurchases.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPurchases.length}
              itemsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(count) => {
                setRowsPerPage(count)
                setCurrentPage(1)
              }}
              itemLabel='purchase(s)'
            />
          )}
        </div>
      </div>
    </div>
  )
}
