import { useState } from 'react'
import { Link } from 'react-router'
import { cn } from '~/lib/utils'

// ─── Mock Data ───

interface Material {
  id: string
  batchId: string
  material: string
  type: string
  farmerSource: string
  materialSource: string
  quantity: string
  harvested: string
  received: string
}

const mockMaterials: Material[] = [
  {
    id: '1',
    batchId: 'BATCH-fe228318-1764512695673',
    material: 'Beans',
    type: 'Agricultural Product',
    farmerSource: 'Abdullahi Bashir',
    materialSource: 'Sunshine Farms',
    quantity: '0kg',
    harvested: '11/30/2025',
    received: '11/30/2025',
  }
]

// ─── Shared Components ───

function StatCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
    </div>
  )
}

function MiniStat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-100 flex flex-col items-center justify-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 font-medium text-center leading-snug">{label}</div>
    </div>
  )
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors",
        active ? "bg-white text-brand shadow-sm border border-gray-200/60" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
      )}
    >
      {label}
    </button>
  )
}


export default function ProcessorMaterials() {
  const [activeTab, setActiveTab] = useState('Platform Materials')

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">

      {/* Top Back Link */}
      <Link to="/processor" className="inline-flex items-center gap-2 text-brand font-medium hover:text-brand-dark transition-colors">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /> {/* Decorative mock icon */}
        </svg>
        Add New Material
      </Link>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-brand">Materials Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage platform transfers and external materials in one place</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4332] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add External Material
        </button>
      </div>

      {/* 3 Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard value={1} label="Platform Materials" />
        <StatCard value={4} label="External Materials" />
        <StatCard value={8} label="Pending Transfers" />
      </div>

      {/* Material Sources Panel */}
      <div>
        <h2 className="text-base font-bold text-gray-900">Material Sources</h2>
        <p className="text-xs text-gray-500 mb-3">System-wide issues requiring attention</p>
        <div className="flex p-1 bg-gray-50 border border-gray-200 rounded-lg">
          <TabButton label="Platform Materials" active={activeTab === 'Platform Materials'} onClick={() => setActiveTab('Platform Materials')} />
          <TabButton label="External Material" active={activeTab === 'External Material'} onClick={() => setActiveTab('External Material')} />
          <TabButton label="Incoming Materials" active={activeTab === 'Incoming Materials'} onClick={() => setActiveTab('Incoming Materials')} />
        </div>
      </div>

      {/* Raw Materials Inventory Filter Panel */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">Raw Materials Inventory</h2>
        <p className="text-xs text-gray-500 mb-5">Track available raw materials received from farmers for processing</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Source Name</label>
            <select className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand">
              <option>All Sources</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Select Material Source</label>
            <select className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand">
              <option>All Sources</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Select Material</label>
            <select className="w-full rounded-md border border-gray-200 py-2 px-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand">
              <option>All Materials</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-[500px] mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date Range</label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
              <input type="text" placeholder="Select a date" className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
            </div>
          </div>
          <div>
            <div className="mt-6 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
              <input type="text" placeholder="Select a date" className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MiniStat value={1} label="Total Products" />
          <MiniStat value="0 kg" label="Platform Materials" />
          <MiniStat value={0} label="In Stock" />
          <MiniStat value={0} label="Low Stock" />
        </div>
      </div>

      {/* Data Table block */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm overflow-hidden flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Available Raw Materials</h2>
            <p className="text-xs text-gray-500 mt-1">Materials ready for batch processing</p>
          </div>
          <div className="relative w-full sm:w-[250px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search materials..."
              className="w-full rounded-md border border-gray-200 pl-9 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left text-sm text-gray-600 min-w-[900px]">
            <thead className="border-b border-gray-100 text-xs font-semibold text-brand">
              <tr>
                <th className="py-3 font-medium">Batch ID</th>
                <th className="py-3 font-medium flex items-center gap-1">Material <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg></th>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3 font-medium">Farmer/Source</th>
                <th className="py-3 font-medium">Material Source</th>
                <th className="py-3 font-medium flex items-center gap-1">Quantity <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg></th>
                <th className="py-3 font-medium">Harvested</th>
                <th className="py-3 font-medium">Received</th>
                <th className="py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockMaterials.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-medium text-brand">{row.batchId}</td>
                  <td className="py-4 text-brand">{row.material}</td>
                  <td className="py-4 text-brand font-medium max-w-[120px]">{row.type}</td>
                  <td className="py-4 text-brand max-w-[120px]">{row.farmerSource}</td>
                  <td className="py-4 text-brand max-w-[120px]">{row.materialSource}</td>
                  <td className="py-4 text-brand font-bold">{row.quantity}</td>
                  <td className="py-4 text-gray-500">{row.harvested}</td>
                  <td className="py-4 text-gray-500">{row.received}</td>
                  <td className="py-4 text-center">
                    <button className="text-gray-400 hover:text-gray-800">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 mt-2">
          <span>0 of 1 row(s) selected.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              Rows per page
              <select className="border-none bg-transparent outline-none font-medium">
                <option>10</option>
              </select>
            </span>
            <span>Page 1 of 1</span>
            <div className="flex items-center gap-1">
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg></button>
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
              <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800"><svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" /></svg></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
