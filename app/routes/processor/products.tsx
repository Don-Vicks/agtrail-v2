import { useState } from 'react';
import { cn } from '~/lib/utils';

// ─── Mock Data ───

const mockInventory = [
  { id: '1', name: 'Bera Flour', batch: 'BATCH-PB-20260120-0011', category: 'Fortified Flour', qty: 0, created: '1/20/2026' },
  { id: '2', name: 'Tomatoe', batch: 'BATCH-PB-20251215-0010', category: 'Processed Grains', qty: 0, created: '1/6/2026' },
  { id: '3', name: 'Tomatoe', batch: 'BATCH-PB-1765021676170', category: 'Other', qty: 0, created: '12/20/2025' },
  { id: '4', name: 'Canned Beans', batch: 'PB-1764513448874', category: 'Processed Grains', qty: '100 kg', created: '11/30/2025' },
]

const mockTransfers = [
  { id: '1', ref: 'TRF-2026-058-0002', status: 'initiated', payment: 'pending', product: 'Unknown', qty: '90 kg', price: '₦89.00', to: 'Agro Proc', date: '3/9/2026' },
  { id: '2', ref: 'TRF-2026-058-0001', status: 'initiated', payment: 'pending', product: 'Unknown', qty: '90 kg', price: '₦900,000.00', to: 'Agrolinking Platform', date: '3/9/2026' },
  { id: '3', ref: 'BCA8FB01', status: 'initiated', payment: 'pending', product: 'Unknown', qty: '20 kg', price: '₦54,000.00', to: 'Olamide Olasukanmi', date: '2/21/2026' },
  { id: '4', ref: 'TRF-2025-044-0001', status: 'initiated', payment: 'pending', product: 'Unknown', qty: '17 kg', price: '₦19,999.88', to: 'Agrolinking Platform', date: '2/13/2026' },
  { id: '5', ref: 'TRF-2025-343-0001', status: 'initiated', payment: 'pending', product: 'Unknown', qty: '200 kg', price: '₦200,000.00', to: 'Agrolinking Platform', date: '12/9/2025' },
  { id: '6', ref: 'TRF-2025-334-0002', status: 'initiated', payment: 'completed', product: 'Canned Beans', qty: '10 kg', price: '₦20,000.00', to: 'Agrolinking Platform', date: '12/6/2025' },
]

// ─── Components ───

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f1f8e9] text-brand">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
        <div className="text-xs font-medium text-gray-500">{label}</div>
      </div>
    </div>
  )
}

function InventoryTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
          value={4}
          label="Total Products"
        />
        <StatCard
          icon={<svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          value={4}
          label="Active Products"
        />
        <StatCard
          icon={<svg className="size-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
          value={0}
          label="Created"
        />
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search products by name or batch code..."
          className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Generated Products</h2>
        <div className="space-y-4">
          {mockInventory.map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-bold text-gray-900">{item.name}</h3>
                  <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md">
                    active
                  </span>
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div>Batch: {item.batch}</div>
                  <div>Category: {item.category}</div>
                  <div>Quantity: {item.qty}</div>
                  <div>Created: {item.created}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm bg-white">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  View Story
                </button>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm bg-white">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                  QR Code
                </button>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-white bg-brand hover:bg-brand-dark transition-colors py-2 px-4 rounded-lg shadow-sm">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  Transfer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TransfersTab() {
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="text-lg flex items-center gap-2 font-bold text-gray-900">
          <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Outgoing Transfers to Distributors
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Track your product transfers and payment status</p>
      </div>

      <div className="space-y-3">
        {mockTransfers.map(trf => (
          <div key={trf.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors">

            {/* Left Block */}
            <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-gray-900 text-sm">{trf.ref}</span>
                <span className="bg-[#fff8e1] text-[#f57f17] border border-[#ffecb3] px-2 py-0.5 text-[10px] font-bold lowercase tracking-wide rounded-md">
                  {trf.status}
                </span>
                <span className={cn(
                  "border px-2 py-0.5 text-[10px] font-bold lowercase tracking-wide rounded-md",
                  trf.payment === 'completed'
                    ? "bg-[#e8f5e9] text-[#2e7d32] border-[#c8e6c9]"
                    : "bg-[#fff3e0] text-[#e65100] border-[#ffe0b2]"
                )}>
                  Payment: {trf.payment}
                </span>
              </div>
              <div className="flex items-center text-sm mb-2 text-gray-500">
                <span className="w-16 block font-medium">Product:</span>
                <span className="text-gray-900 font-bold">{trf.product}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="size-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Awaiting payment from distributor
              </div>
            </div>

            {/* Middle Block */}
            <div className="flex-1 flex w-full md:w-auto items-center justify-between md:justify-around text-sm mb-4 md:mb-0">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">Quantity</span>
                <span className="text-gray-900 font-bold">{trf.qty}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium mb-1">Price</span>
                <span className="text-gray-900 font-bold">{trf.price}</span>
              </div>
            </div>

            {/* Right Block */}
            <div className="flex-1 flex w-full md:w-auto flex-row-reverse md:flex-col items-center md:items-end justify-between md:justify-center text-sm">
              <span className="text-gray-500 font-medium md:mb-2">{trf.date}</span>
              <div className="flex flex-col md:items-end">
                <span className="text-gray-500 font-medium text-xs mb-0.5">To</span>
                <span className="text-gray-900 font-bold">{trf.to}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

      <button className="w-full py-3 mt-4 text-sm font-semibold text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
        Refresh
      </button>
    </div>
  )
}

export default function ProcessorProducts() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers'>('inventory')

  return (
    <div className="max-w-[1000px] mx-auto pb-10">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand">Product Output</h1>
          <p className="text-sm text-gray-500 mt-1">Auto-generated products from completed batches with full traceability</p>
        </div>
        <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1b4332] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          New Transfer to Exporter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('inventory')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border",
            activeTab === 'inventory'
              ? "bg-white text-gray-900 border-gray-200 shadow-sm"
              : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
          )}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          Inventory
        </button>
        <button
          onClick={() => setActiveTab('transfers')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors border",
            activeTab === 'transfers'
              ? "bg-white text-gray-900 border-gray-200 shadow-sm"
              : "bg-transparent text-gray-500 border-transparent hover:bg-gray-100"
          )}
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          Outgoing Transfers
        </button>
      </div>

      {activeTab === 'inventory' ? <InventoryTab /> : <TransfersTab />}
    </div>
  )
}
