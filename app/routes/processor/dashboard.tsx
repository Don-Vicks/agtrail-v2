import { Link } from 'react-router';
import { cn } from '~/lib/utils';
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import { useGetProcessorsDashboardStats } from '~/lib/api/generated/processors-dashboard/processors-dashboard';
import type { ProcessorBatch } from '~/lib/api/generated/models';

/* ─── Components ─── */

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
      <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
  )
}

function ActionButton({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) {
  return (
    <Link to={to} className="flex w-full items-center gap-3 rounded-md border border-gray-200 bg-white p-2 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#e8f5e9] text-[#2e7d32]">
        {icon}
      </div>
      {label}
    </Link>
  )
}

function StatusBadge({ status }: { status: string | undefined }) {
  const getBadgeStyle = () => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'passed': 
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
      case 'cancelled':
      case 'failed': 
        return 'bg-red-50 text-red-700 ring-1 ring-red-600/10'
      case 'in_progress':
      case 'pending': 
        return 'bg-yellow-50 text-yellow-800 ring-1 ring-yellow-600/20'
      default: 
        return 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/10'
    }
  }

  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-inset uppercase", getBadgeStyle())}>
      {status || 'UNKNOWN'}
    </span>
  )
}

function BatchTable({ title, count, data, emptyMessage }: { title: string; count: number; data: ProcessorBatch[]; emptyMessage?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <svg className="size-5 text-[#f59e0b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-base font-bold text-gray-900">{title} <span className="text-gray-500 font-normal">({count})</span></h2>
        </div>

        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by batch ID, product, or farm..."
            className="w-full rounded-md border border-gray-200 pl-9 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-gray-50 mb-3">
            <svg className="size-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-xs text-gray-500 max-w-[200px]">Start processing incoming batches to see them here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="border-b border-gray-100 bg-white text-xs font-semibold text-brand">
              <tr>
                <th className="px-4 py-3 font-medium">Batch ID</th>
                <th className="px-4 py-3 font-medium">Product Name</th>
                <th className="px-4 py-3 font-medium flex items-center gap-1">Farm Name <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg></th>
                <th className="px-4 py-3 font-medium">Farmer Name</th>
                <th className="px-4 py-3 font-medium">Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-brand">{row.batchCode}</td>
                  <td className="px-4 py-3 text-brand">{row.outputProductName}</td>
                  <td className="px-4 py-3 text-gray-500">{row.facilityName || '-'}</td>
                  <td className="px-4 py-3 text-gray-500">-</td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between text-xs text-gray-500">
            <button className="flex items-center gap-1 hover:text-gray-800 disabled:opacity-50">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Previous
            </button>
            <span>Page 1 of 2</span>
            <button className="flex items-center gap-1 text-gray-900 font-medium hover:text-gray-600">
              Next
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Main Route ─── */

export default function ProcessorDashboard() {
  const { data: statsResponse, isLoading: isStatsLoading } = useGetProcessorsDashboardStats()
  const { data: batchesResponse, isLoading: isBatchesLoading } = useGetProcessorsBatches()

  const statsData: any = statsResponse?.data?.data || {}
  const allBatches = batchesResponse?.data?.data || []

  const incomingBatches = allBatches.filter((b: ProcessorBatch) => b.status === 'pending')
  const wipBatches = allBatches.filter((b: ProcessorBatch) => b.status === 'in_progress')
  const completedBatches = allBatches.filter((b: ProcessorBatch) => b.status === 'completed')

  return (
    <div className="space-y-6 pb-10">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <Link
          to="/processor/batches/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#1b4332] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Start New Batch
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isStatsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="mt-3 h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="mt-2 h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard title="Finished Goods" value={statsData.totalFinishedGoods ?? completedBatches.length} subtitle="Batches Ready for Distribution" />
            <StatCard title="Quality Control" value={statsData.totalQcHold ?? 0} subtitle="Batch on QA Hold" />
            <StatCard title="Work In Progress (WIP)" value={statsData.totalWip ?? wipBatches.length} subtitle="Batches in Production" />
            <StatCard title="Incoming Goods" value={statsData.totalIncoming ?? incomingBatches.length} subtitle="Batches Awaiting Receipt" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tables */}
        <div className="lg:col-span-2 space-y-6">
          {isBatchesLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="size-5 rounded-full bg-gray-200 animate-pulse"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-9 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <BatchTable title="Incoming (Awaiting Processing)" count={incomingBatches.length} data={incomingBatches} />
              <BatchTable title="In Production (WIP)" count={wipBatches.length} data={wipBatches} emptyMessage="No batches in production" />
              <BatchTable title="Completed (Ready for Dispatch)" count={completedBatches.length} data={completedBatches} />
            </>
          )}
        </div>

        {/* Right Column: Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <ActionButton
                icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
                label="Receive Harvest Batch"
                to="/processor/materials"
              />
              <ActionButton
                icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>}
                label="Start New Batch"
                to="/processor/batches/new"
              />
              <ActionButton
                icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                label="QA/QC Test"
                to="/processor/certifications/readiness"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Full Width Chart Area */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm mt-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Production Output (Tonnes)</h2>
            <p className="text-xs text-gray-500 mt-1">Shows the total quantity of finished goods produced each day for the current quarter.</p>
          </div>
          <select className="rounded-md border border-gray-200 py-1.5 pl-3 pr-8 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand">
            <option>Quarter</option>
          </select>
        </div>

        {/* Dummy Chart Grid */}
        <div className="relative h-[250px] w-full mt-4">
          <div className="absolute inset-0 flex flex-col justify-between pt-2 pb-6">
            {[4, 3, 2, 1, 0].map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="w-6 text-xs text-gray-400 font-medium">{val}</span>
                <div className="ml-2 w-full border-b border-dashed border-gray-200" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-gray-400">
            <span>Jan 1</span>
            <span>Jan 8</span>
            <span>Jan 17</span>
            <span>Jan 25</span>
            <span>Feb 2</span>
            <span>Feb 10</span>
            <span>Feb 18</span>
            <span>Feb 25</span>
            <span>Mar 6</span>
          </div>
        </div>
      </div>
    </div>
  )
}
