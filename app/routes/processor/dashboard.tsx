import { Link } from 'react-router';
import type { ProcessorBatch } from '~/lib/api/generated/models';
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import { useGetProcessorsDashboardStats } from '~/lib/api/generated/processors-dashboard/processors-dashboard';
import { cn } from '~/lib/utils';
import { StatCard } from '~/components/stat-card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { EmptyState } from '~/components/empty-state';
import { PageHeader } from '~/components/page-header';
import {
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Layers,
  Activity,
  ClipboardList,
  ArrowRight,
  LayoutDashboard
} from 'lucide-react';

/* ─── Components ─── */
// Local StatCard and ActionButton removed as shared components are now used

function StatusBadge({ status }: { status: string | undefined }) {
  const isCompleted = status?.toLowerCase() === 'completed' || status?.toLowerCase() === 'passed'
  const isPending = status?.toLowerCase() === 'pending' || status?.toLowerCase() === 'incoming'
  const isWip = status?.toLowerCase() === 'in_progress'

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider px-2 py-0",
        isCompleted ? "bg-green-50 text-green-700 border-green-200" :
          isPending ? "bg-amber-50 text-amber-700 border-amber-200" :
            isWip ? "bg-blue-50 text-blue-700 border-blue-200" :
              "bg-gray-50 text-gray-600 border-gray-200"
      )}
    >
      {status || 'UNKNOWN'}
    </Badge>
  )
}

function BatchTable({ title, count, data, emptyMessage }: { title: string; count: number; data: ProcessorBatch[]; emptyMessage?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="border-b border-gray-100 p-5 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-amber-500">
            <Layers className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">{title}</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{count} ACTIVE BATCHES</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by batch ID, product, or farm..."
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
          />
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={<Package className="size-10" />}
          title={emptyMessage || "No batches found"}
          description="Start processing incoming batches to see them here."
          className="py-12"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/50">
              <tr>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Batch ID</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Product Name</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farm Source</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farmer</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-5 py-4 font-bold text-gray-900 tracking-tight">{row.batchCode}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{row.outputProductName}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500 italic">{row.facilityName || 'Global Source'}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500">-</td>
                  <td className="px-5 py-4"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between text-[11px] text-gray-500 font-bold uppercase tracking-tight bg-gray-50/30">
            <button className="flex items-center gap-1 hover:text-brand disabled:opacity-50 transition-colors">
              <ArrowRight className="size-3.5 rotate-180" />
              Previous
            </button>
            <span className="text-gray-400">Page 1 of 2</span>
            <button className="flex items-center gap-1 text-gray-900 hover:text-brand transition-colors">
              Next
              <ArrowRight className="size-3.5" />
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
    <div className="space-y-6 pb-10 px-1 text-left w-full overflow-x-hidden">

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Processor Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your production batches and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Start New Batch</span>
          </Button>
        </div>
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
            <StatCard
              title="Finished Goods"
              value={statsData.totalFinishedGoods ?? completedBatches.length}
              subtitle="Completed production"
              description="Batches Ready for Distribution"
              icon={<Package className="size-4" />}
            />
            <StatCard
              title="Quality Control"
              value={statsData.totalQcHold ?? 0}
              subtitle="Verification status"
              description="Batch on QA Hold"
              icon={<CheckCircle className="size-4" />}
              trend="neutral"
            />
            <StatCard
              title="Work In Progress"
              value={statsData.totalWip ?? wipBatches.length}
              subtitle="Active production"
              description="Batches in Production"
              icon={<Activity className="size-4" />}
              trend="up"
            />
            <StatCard
              title="Incoming Goods"
              value={statsData.totalIncoming ?? incomingBatches.length}
              subtitle="Awaiting receipt"
              description="Batches Awaiting Receipt"
              icon={<Clock className="size-4" />}
            />
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
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight mb-5">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/processor/materials" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 font-bold text-gray-700 hover:text-brand transition-all border-gray-200">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-surface text-brand">
                    <Package className="size-4" />
                  </div>
                  <span className="text-xs uppercase tracking-tight">Receive Harvest</span>
                </Button>
              </Link>
              <Link to="/processor/batches/new" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 font-bold text-gray-700 hover:text-brand transition-all border-gray-200">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Plus className="size-4" />
                  </div>
                  <span className="text-xs uppercase tracking-tight">Start New Batch</span>
                </Button>
              </Link>
              <Link to="/processor/certifications/readiness" className="block">
                <Button variant="outline" className="w-full justify-start gap-3 h-12 font-bold text-gray-700 hover:text-brand transition-all border-gray-200">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <AlertCircle className="size-4" />
                  </div>
                  <span className="text-xs uppercase tracking-tight">QA/QC Test</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Production Output Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Production Summary</h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">Overview of your batch processing</p>
          </div>
          <select className="rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white">
            <option>Current Month</option>
            <option>Last 3 Months</option>
            <option>Last Year</option>
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-gray-100 p-5 bg-gray-50/50">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Batches</p>
            <p className="text-2xl font-bold text-gray-900 tracking-tight">{allBatches.length}</p>
            <p className="text-[10px] text-gray-500 mt-2 font-medium">Active processing batches</p>
          </div>
          <div className="rounded-xl border-2 border-green-100/50 p-5 bg-green-50/30">
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-700 tracking-tight">{completedBatches.length}</p>
            <p className="text-[10px] text-green-600/70 mt-2 font-medium">Ready for dispatch</p>
          </div>
          <div className="rounded-xl border border-blue-100/50 p-5 bg-blue-50/30">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-700 tracking-tight">{wipBatches.length}</p>
            <p className="text-[10px] text-blue-600/70 mt-2 font-medium">Currently processing</p>
          </div>
          <div className="rounded-xl border border-amber-100/50 p-5 bg-amber-50/30">
            <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mb-1">Incoming</p>
            <p className="text-2xl font-bold text-amber-700 tracking-tight">{incomingBatches.length}</p>
            <p className="text-[10px] text-amber-600/70 mt-2 font-medium">Awaiting processing</p>
          </div>
        </div>

        {/* Production Health */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Production Performance</h3>

          <div className="space-y-3">
            {/* Completion Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-700">Batch Completion Rate</p>
                <p className="text-xs font-bold text-gray-900">{allBatches.length > 0 ? Math.round((completedBatches.length / allBatches.length) * 100) : 0}%</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: allBatches.length > 0 ? `${(completedBatches.length / allBatches.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* WIP Ratio */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-700">Work In Progress Rate</p>
                <p className="text-xs font-bold text-gray-900">{allBatches.length > 0 ? Math.round((wipBatches.length / allBatches.length) * 100) : 0}%</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: allBatches.length > 0 ? `${(wipBatches.length / allBatches.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-medium text-gray-700">Pending/Incoming Rate</p>
                <p className="text-xs font-bold text-gray-900">{allBatches.length > 0 ? Math.round((incomingBatches.length / allBatches.length) * 100) : 0}%</p>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 rounded-full transition-all"
                  style={{ width: allBatches.length > 0 ? `${(incomingBatches.length / allBatches.length) * 100}%` : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
