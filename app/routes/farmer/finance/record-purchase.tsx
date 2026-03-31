import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { DatePicker } from '~/components/ui/date-picker'
import { farms } from '~/lib/mock-data/farmer'
import type { Route } from './+types/record-purchase'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Record Purchase | Agtrail Finance' },
    { name: 'description', content: 'Log farm payments and purchases' },
  ]
}

/* ─── Mock Table Data ─── */
const RECENT_PURCHASES = [
  {
    id: 1,
    date: 'Jan 07, 2026',
    farmer: 'Olamide Olutekunbi',
    farm: 'Baba Beji Farms',
    beneficiary: 'Olamide Olutekunbi',
    account: 'Cash',
    amount: '₦5,000'
  }
]

export default function RecordPurchasePage() {
  const [date, setDate] = useState('')
  const [amount, setAmount] = useState('0')
  const [account, setAccount] = useState('')
  const [farm, setFarm] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="space-y-8 pb-10">
      {/* Breadcrumbs */}
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Finance' },
          { label: 'Record Purchase' },
        ]}
      />

      {/* Main Form Section */}
      <div>
        <h1 className="mb-6 text-2xl font-bold uppercase text-brand">Record Farm Purchase</h1>

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
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            {/* Payment Account */}
            <div className="space-y-1.5 md:col-span-1">
              <label htmlFor="account" className="block text-sm font-bold text-gray-900">
                Payment Account
              </label>
              <div className="relative">
                <select
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                >
                  <option value="">Select account</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Mobile Money">Mobile Money</option>
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

            {/* Beneficiary */}
            <div className="space-y-1.5">
              <label htmlFor="beneficiary" className="block text-sm font-bold text-gray-900">
                Beneficiary
              </label>
              <input
                id="beneficiary"
                type="text"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
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

      {/* Recent Purchases Table */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-bold text-brand">Recent Purchases</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Farmer</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Farm</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Beneficiary</th>
                <th className="px-4 py-3 font-semibold text-gray-900">Account</th>
                <th className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_PURCHASES.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30">
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900">{purchase.date}</td>
                  <td className="px-4 py-4">{purchase.farmer}</td>
                  <td className="px-4 py-4">{purchase.farm}</td>
                  <td className="px-4 py-4">{purchase.beneficiary}</td>
                  <td className="px-4 py-4">{purchase.account}</td>
                  <td className="whitespace-nowrap px-4 py-4 font-bold text-gray-900 text-right">{purchase.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
