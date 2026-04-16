import { ChevronDown, Plus, Search, ShoppingCart } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import type {
  PostPurchasesBody,
  PostPurchasesBodyProductType,
} from '~/lib/api/generated/models'
import {
  usePostPurchases,
  useGetPurchases,
} from '~/lib/api/generated/purchases/purchases'
import type { ProductTransfer } from '~/lib/api/generated/models/productTransfer'
import type { Route } from './+types/purchase'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Record Purchase | Agtrail Finance' },
    { name: 'description', content: 'Log farm payments and purchases' },
  ]
}

export default function RecordPurchasePage() {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [pricePerUnit, setPricePerUnit] = useState('0')
  const [account, setAccount] = useState('')
  const [productType, setProductType] = useState('crop')
  const [toUserId, setToUserId] = useState('')
  const [farmProductId, setFarmProductId] = useState('')
  const [description, setDescription] = useState('')
  const { mutateAsync: submitPurchase, isPending } = usePostPurchases()
  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useGetPurchases()
  const purchases = (purchasesResponse?.data?.data || []) as ProductTransfer[]

  const purchaseRows = useMemo(
    () =>
      purchases.map((p) => ({
        id: p.id,
        date: p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : 'N/A',
        beneficiary: p.toUserId || 'Unknown Seller',
        merchantHandle: p.transferCode || p.fromUserId || 'transfer',
        account: p.currency || 'NGN',
        amount:
          typeof p.totalPrice === 'number'
            ? `₦${p.totalPrice.toLocaleString()}`
            : 'N/A',
        status: p.status || 'pending',
      })),
    [purchases],
  )

  const filteredPurchases = useMemo(() => {
    return purchaseRows.filter((p) => {
      const term = search.toLowerCase()
      return (
        p.beneficiary.toLowerCase().includes(term) ||
        p.merchantHandle.toLowerCase().includes(term) ||
        p.amount.includes(term)
      )
    })
  }, [purchaseRows, search])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!toUserId || !quantity || !unit) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      const payload: PostPurchasesBody = {
        productType: productType as PostPurchasesBodyProductType,
        toUserId,
        quantityTransferred: parseFloat(quantity),
        unit,
        currency: 'NGN',
        notes: description,
      }

      // Add price fields if provided
      if (pricePerUnit && parseFloat(pricePerUnit) > 0) {
        payload.pricePerUnit = parseFloat(pricePerUnit)
        payload.totalPrice = parseFloat(quantity) * parseFloat(pricePerUnit)
      }

      // Add product ID based on type
      if (productType === 'crop' && farmProductId) {
        payload.farmProductId = farmProductId
      }

      await submitPurchase({ data: payload })
      toast.success('Purchase recorded successfully!')

      // Reset form
      setDate('')
      setQuantity('')
      setUnit('kg')
      setPricePerUnit('0')
      setAccount('')
      setToUserId('')
      setFarmProductId('')
      setDescription('')
    } catch (err: any) {
      toast.error(
        `Failed to record purchase: ${err.message || 'Unknown error'}`,
      )
    }
  }

  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
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
            Acquire and log raw materials from farm produce sources
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            onClick={() => document.getElementById('table-search')?.focus()}
            className='flex items-center gap-2 text-gray-600'
          >
            <Search className='size-4' />
            <span>History Audit</span>
          </Button>
        </div>
      </div>

      {/* Entry Form Card */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex items-center gap-2 mb-6 text-left'>
          <div className='size-8 rounded-lg bg-brand-surface flex items-center justify-center text-brand'>
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
                className='h-10 w-full rounded-lg border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand focus:bg-white'
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
                  className='h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
                >
                  <option value='crop'>Crop</option>
                  <option value='livestock'>Livestock</option>
                  <option value='aquaculture'>Aquaculture</option>
                  <option value='apiary'>Apiary</option>
                  <option value='processed_batch'>Processed Batch</option>
                </select>
                <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
                  <ChevronDown className='size-3 text-gray-400' />
                </div>
              </div>
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Seller ID <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                required
                value={toUserId}
                onChange={(e) => setToUserId(e.target.value)}
                placeholder='Enter User ID'
                className='h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='md:col-span-2 space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Farm Product ID
              </label>
              <input
                type='text'
                value={farmProductId}
                onChange={(e) => setFarmProductId(e.target.value)}
                placeholder='Reference Specific Batch/Product'
                className='h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>

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
                className='h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
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
                  className='h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
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
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Price Per Unit (₦)
              </label>
              <input
                type='number'
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder='0.00'
                className='h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>

            <div className='space-y-1.5'>
              <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
                Settlement Account
              </label>
              <input
                type='text'
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder='Account Details'
                className='h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='block text-xs font-bold uppercase tracking-wider text-gray-500'>
              Transaction Notes
            </label>
            <textarea
              rows={2}
              placeholder='Additional information about this acquisition...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
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
      <div className='rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col'>
        <div className='p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between bg-white text-left gap-4'>
          <div className='flex items-center gap-2'>
            <div className='size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400'>
              <ShoppingCart className='size-4' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 uppercase tracking-tight'>
                Recent Purchases
              </h2>
              <p className='text-xs text-gray-500 mt-0.5 font-medium'>
                Audit trail of material purchases
              </p>
            </div>
          </div>
          <div className='relative w-full sm:w-64'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
            <input
              id='table-search'
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search history...'
              className='w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white'
            />
          </div>
        </div>

        <div className='flex-1 overflow-x-auto'>
          {isLoadingPurchases ? (
            <div className='space-y-3 p-6'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='h-10 w-full animate-pulse rounded bg-gray-100' />
              ))}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <EmptyState
              icon={<ShoppingCart className='size-10' />}
              title={search ? 'No matches found' : 'No acquisitions found'}
              description={
                search
                  ? `No records found for "${search}"`
                  : "You haven't recorded any processing inputs yet."
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
                    <th className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]'>
                      Date
                    </th>
                    <th className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]'>
                      Merchant / Seller
                    </th>
                    <th className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px]'>
                      Details
                    </th>
                    <th className='px-6 py-4 font-bold text-gray-500 uppercase tracking-wider text-[10px] text-right'>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {filteredPurchases.map((purchase) => (
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
                            @{purchase.merchantHandle.toLowerCase().replace(/\s+/g, '')}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-5'>
                        <div className='flex flex-col'>
                          <div className='flex items-center gap-1.5'>
                            <span className='font-bold text-gray-900'>
                              {purchase.account} Settlement
                            </span>
                            <Badge
                              variant='outline'
                              className='text-[8px] px-1 py-0 bg-blue-50/50 text-blue-600 border-blue-100 font-bold uppercase tracking-wide'
                            >
                              {purchase.status}
                            </Badge>
                          </div>
                          <span className='text-[10px] text-gray-400 font-medium tracking-wide lowercase'>
                            verified by System Agent
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

        <div className='p-4 border-t border-gray-100 bg-gray-50/30 text-xs font-medium text-gray-500 flex justify-between items-center text-left'>
          <div className='flex items-center gap-2 text-left'>
            <span className='size-2 rounded-full bg-brand/30 animate-pulse text-left' />
            <span>
              Showing audit trail for {filteredPurchases.length} record(s)
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 text-[10px] font-bold uppercase transition-all hover:bg-white hover:shadow-sm px-4'
            >
              Download PDF
            </Button>
            <Button
              variant='ghost'
              size='sm'
              className='h-7 text-[10px] font-bold uppercase transition-all hover:bg-white hover:shadow-sm px-4'
            >
              View All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
