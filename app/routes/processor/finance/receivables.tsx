import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { DatePicker } from '~/components/ui/date-picker'
import { farms, products } from '~/lib/mock-data/farmer'
import type { Route } from './+types/receivables'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Receivables | Agtrail Finance' },
    { name: 'description', content: 'Log farm product receivables' },
  ]
}

/* ─── Mock Table Data ─── */
const RECENT_RECEIVABLES = [
  {
    id: 1,
    date: 'Jan 07, 2026',
    farmer: 'Olamide Olutekunbi',
    farm: 'Baba Beji Farms',
    productName: 'Sesame',
    batchId: 'BATCH-1759875835858',
    quantity: '200',
    amount: '₦5,000'
  },
  {
    id: 2,
    date: 'Jan 07, 2026',
    farmer: 'Olamide Olutekunbi',
    farm: 'Baba Beji Farms',
    productName: 'Sesame',
    batchId: 'BATCH-1759875835858',
    quantity: '20',
    amount: '₦5,000'
  }
]

export default function RecordReceivablesPage() {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('0')
  const [farm, setFarm] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState('0')
  const [description, setDescription] = useState('')

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
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
        <h1 className="mb-6 text-2xl font-bold uppercase text-brand">Record Farm Receivables</h1>

        <form className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Date */}
            <div className="space-y-1.5">
              <label htmlFor="date" className="block text-sm font-bold text-gray-900">
                Date
              </label>
              <DatePicker
                value={date}
                onChange={(val) => setDate(val)}
                placeholder="Select date"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-sm focus-within:border-brand focus-within:ring-1 focus-within:ring-brand"
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
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Farm */}
            <div className="space-y-1.5 md:col-span-1">
              <label htmlFor="farm" className="block text-sm font-bold text-gray-900">
                Farm
              </label>
              <div className="relative">
                <select
                  id="farm"
                  value={farm}
                  onChange={(e) => setFarm(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select farm</option>
                  {farms.map((f) => (
                    <option key={f.id} value={f.name}>{f.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="size-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name} ({p.batchId})</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="size-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
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
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>

          <button
            type="button"
            className="h-12 w-full rounded-lg bg-[#1b5e20] text-base font-bold text-white shadow-sm transition-colors hover:bg-[#2e7d32] active:scale-[0.99]"
          >
            Log Payment
          </button>
        </form>
      </div>

      {/* Recent Receivables Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-brand">Recent Receivables</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Farmer</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Farm</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Product</th>
                <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">Quantity</th>
                <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_RECEIVABLES.map((rec) => (
                <tr key={rec.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30">
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900">{rec.date}</td>
                  <td className="px-4 py-4">{rec.farmer}</td>
                  <td className="px-4 py-4">{rec.farm}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-gray-900">{rec.productName} <span className="text-xs font-normal text-gray-400">({rec.batchId})</span></div>
                  </td>
                  <td className="px-4 py-4 font-bold text-gray-900">{rec.quantity}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900 text-right">{rec.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
