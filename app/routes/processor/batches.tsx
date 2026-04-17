import { Link } from 'react-router';
import { useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header';
import { cn } from '~/lib/utils';
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import type { ProcessorBatch } from '~/lib/api/generated/models';
import { StatCard } from '~/components/stat-card';
import { Button } from '~/components/ui/button';
import { Badge } from '~/components/ui/badge';
import { EmptyState } from '~/components/empty-state';
import { Layers, Plus, Search, Package, Clock, Activity, CheckCircle, ArrowRight, Play, Eye } from 'lucide-react';
import { getOrganizationHeaders } from '~/lib/organization-context'

// StatItem removed as shared StatCard is now used

function BatchCard({ batch }: { batch: ProcessorBatch }) {
  // Derive button based on status
  const isCompleted = batch.status === 'completed' || batch.status === 'Passed' as any;
  let buttonLabel = 'Start Processing'
  let buttonStyle = 'bg-[#1b4332] text-white hover:bg-[#0f2e20]'
  let buttonPath = `/processor/batches/${batch.id}`

  if (isCompleted) {
    buttonLabel = 'View Product'
    buttonStyle = 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
    buttonPath = '/processor/products'
  }

  const quantity = '0kg'
  const type = batch.outputProductType || 'Other'
  const shelfLife = batch.shelfLifeDays ? `${batch.shelfLifeDays} days` : (isCompleted ? '300 days' : '120 days')
  
  const formattedDate = batch.createdAt ? new Date(batch.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'Unknown Date'

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        {/* Leaf Box Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-surface text-brand">
          <Package className="size-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-tight">{batch.outputProductName || (batch as any).productName}</h3>
            <Badge 
              variant="outline" 
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0",
                isCompleted ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
              )}
            >
              {batch.status || 'Pending'}
            </Badge>
          </div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Batch ID: {batch.batchCode || (batch as any).batchId}
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Total Quantity</span>
              <span className="text-gray-900 font-bold">{quantity}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Product Type</span>
              <span className="text-gray-900 font-bold">{type}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Projected Shelf Life</span>
              <span className="text-gray-900 font-bold">{shelfLife}</span>
            </div>
          </div>

          <div className="text-[11px] font-medium text-gray-500 mt-5 flex items-center gap-1.5 italic">
            <Clock className="size-3 text-gray-400" />
            Created on {formattedDate}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0">
        <Link to={buttonPath}>
          <Button variant={isCompleted ? "outline" : "default"} className={cn("h-10 px-5 font-bold uppercase tracking-tight text-xs", !isCompleted && "bg-[#1d3d1e] hover:bg-black")}>
            {!isCompleted ? <Play className="size-3.5 fill-current" /> : <Eye className="size-4" />}
            {buttonLabel}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function ProcessorBatches() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'product' | 'status'>('newest')
  const organizationHeaders = getOrganizationHeaders()
  const { data: batchesRaw, isLoading, isError } = useGetProcessorsBatches({
    request: { headers: organizationHeaders },
  })
  const batches: ProcessorBatch[] = batchesRaw?.data?.data || []
  const filteredBatches = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return batches
    return batches.filter((b) =>
      [b.batchCode, b.outputProductName, b.outputProductType, b.status || '']
        .join(' ')
        .toLowerCase()
        .includes(term),
    )
  }, [batches, search])

  const sortedBatches = useMemo(() => {
    const rows = [...filteredBatches]
    if (sortBy === 'newest') {
      return rows.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      })
    }
    if (sortBy === 'oldest') {
      return rows.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return aTime - bTime
      })
    }
    if (sortBy === 'status') {
      return rows.sort((a, b) =>
        String(a.status || '').localeCompare(String(b.status || '')),
      )
    }
    return rows.sort((a, b) =>
      String(a.outputProductName || '').localeCompare(String(b.outputProductName || '')),
    )
  }, [filteredBatches, sortBy])

  // Compute stats
  const total = filteredBatches.length;
  const active = filteredBatches.filter(b => (b.status || '').toLowerCase() === 'in_progress').length;
  const completed = filteredBatches.filter(b => (b.status || '').toLowerCase() === 'completed').length;
  const pending = filteredBatches.filter(b => (b.status || '').toLowerCase() === 'pending').length;

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: <Layers className="size-4 text-gray-400" />,
          },
          { label: 'Processing Batches' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Processing Batches</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track production flow from raw materials to finished products</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/processor/batches/new">
            <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
              <Plus className="size-4" />
              <span className="font-bold uppercase tracking-wide text-xs">Create New Batch</span>
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-3 grid grid-cols-3 gap-4">
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={<Package className="size-12" />}
          title="Failed to load processor batches"
          description="Processor batches could not be loaded. Confirm `X-Organization-Id` context."
          className="py-16"
        />
      ) : (
        <>
          {/* Stats Header Block */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard title="Total Batches" value={total.toString()} subtitle="Inventory scope" description="All production records" icon={<Layers className="size-4" />} />
            <StatCard title="Active WIP" value={active.toString()} subtitle="In production" description="Currently being processed" icon={<Activity className="size-4" />} trend="up" />
            <StatCard title="Completed" value={completed.toString()} subtitle="Finished goods" description="Ready for distribution" icon={<CheckCircle className="size-4" />} trend="neutral" />
            <StatCard title="Pending" value={pending.toString()} subtitle="Awaiting start" description="Incoming raw materials" icon={<Clock className="size-4" />} />
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search batches by ID, product name, or status..."
                className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white shadow-sm"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'newest' | 'oldest' | 'product' | 'status',
                )
              }
              className="rounded-xl border border-gray-200 px-3 py-3 text-sm text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="product">Sort: Product Name (A-Z)</option>
              <option value="status">Sort: Status (A-Z)</option>
            </select>
          </div>

          {/* Batches List */}
          <div className="space-y-4">
            {filteredBatches.length === 0 ? (
              <EmptyState 
                icon={<Package className="size-12" />}
                title="No batches found"
                description="Your processing queue is currently empty. Start a new batch to track production."
                className="py-16"
              />
            ) : sortedBatches.map(batch => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
