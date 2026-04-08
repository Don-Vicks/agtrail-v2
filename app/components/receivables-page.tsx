import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { Pagination } from '~/components/pagination'
import { DatePicker } from '~/components/ui/date-picker'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetPaymentsReceivables } from '~/lib/api/generated/payments/payments'
import { normalizeReceivables } from '~/lib/receivables'

interface ReceivablesPageProps {
  dashboardHref: string
  dashboardLabel?: string
}

export function ReceivablesPage({ dashboardHref, dashboardLabel = 'Dashboard' }: ReceivablesPageProps) {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('0')
  const [farm, setFarm] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [description, setDescription] = useState('')

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: farmsResponse, isLoading: isLoadingFarms } = useGetFarms()
  const { data: productsResponse, isLoading: isLoadingProducts } = useGetFarmersProducts()
  const { data: receivablesResponse, isLoading: isLoadingReceivables } = useGetPaymentsReceivables()

  const farms = farmsResponse?.data?.data || []
  const products = productsResponse?.data?.data || []
  const receivables = useMemo(
    () => normalizeReceivables(receivablesResponse?.data?.data, { farms, products }),
    [farms, products, receivablesResponse?.data?.data],
  )

  const isLoading = isLoadingFarms || isLoadingProducts || isLoadingReceivables

  const totalPages = Math.max(1, Math.ceil(receivables.length / rowsPerPage))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedReceivables = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return receivables.slice(startIndex, startIndex + rowsPerPage)
  }, [receivables, currentPage, rowsPerPage])

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          {
            label: dashboardLabel,
            href: dashboardHref,
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Finance' },
          { label: 'Record Receivables' },
        ]}
      />

      {/* Main Form Section */}
      <div>
        <h1 className="mb-6 text-2xl font-bold uppercase text-[#255220]">Record Farm Receivables</h1>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="block text-sm font-bold text-gray-900">
                Date
              </label>
              <DatePicker
                value={date}
                onChange={setDate}
                placeholder="Select a date"
                className="h-11 w-full rounded-lg border border-gray-100 shadow-sm bg-white px-3 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Payment Amount */}
            <div className="space-y-1.5">
              <label htmlFor="amount" className="block text-sm font-bold text-gray-900">
                Payment Amount
              </label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-100 shadow-sm bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            {/* Farm */}
            <div className="space-y-1.5">
              <label htmlFor="farm" className="block text-sm font-bold text-gray-900">
                Farm
              </label>
              <div className="relative">
                <select
                  id="farm"
                  value={farm}
                  onChange={(e) => setFarm(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-100 shadow-sm bg-white px-3 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select farm</option>
                  {farms.map((f: any) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="hidden md:block"></div>

            {/* Product */}
            <div className="space-y-1.5">
              <label htmlFor="product" className="block text-sm font-bold text-gray-900">
                Product
              </label>
              <div className="relative">
                <select
                  id="product"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-100 shadow-sm bg-white px-3 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select product</option>
                  {products.map((p: any) => (
                    <option key={p.id} value={p.productName}>{p.productName}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-900">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-100 shadow-sm bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-sm font-bold text-gray-900">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full rounded-lg border border-[#255220] shadow-sm bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#255220] focus:outline-none focus:ring-1 focus:ring-[#255220]"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-lg bg-[#255220] py-3 text-sm font-bold text-white hover:bg-[#1a3a16] shadow-md transition-colors"
          >
            Log Payment
          </button>
        </form>
      </div>

      {/* Recent Receivables Table */}
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-[#255220]">Recent Receivables</h2>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-gray-500">Loading receivables...</div>
        ) : receivables.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-500">No receivables currently recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-500">Date</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Farmer</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Farm</th>
                  <th className="px-4 py-3 font-semibold text-gray-500">Product</th>
                  <th className="px-4 py-3 font-semibold text-gray-500 whitespace-nowrap">Quantity</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-500 whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReceivables.map((receivable) => (
                  <tr key={receivable.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30">
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900">{receivable.date}</td>
                    <td className="px-4 py-4 font-bold text-gray-900">{receivable.payer || 'Olamide Olutekunbi'}</td>
                    <td className="px-4 py-4 font-bold text-gray-900">{receivable.farm}</td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-gray-900">{receivable.productName}</div>
                      {receivable.batchId && <div className="text-[10px] font-medium text-gray-400">({receivable.batchId})</div>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900">{receivable.quantity}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-gray-900">{receivable.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={receivables.length}
              itemsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(count) => {
                setRowsPerPage(count)
                setCurrentPage(1)
              }}
              itemLabel="receivable(s)"
            />
          </div>
        )}
      </div>
    </div>
  )
}
