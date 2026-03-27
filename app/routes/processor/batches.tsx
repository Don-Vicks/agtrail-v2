import { Link } from 'react-router';
import { PageHeader } from '~/components/page-header';
import { cn } from '~/lib/utils';
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches';
import type { ProcessorBatch } from '~/lib/api/generated/models';

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <span className="text-3xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500 capitalize">{label}</span>
    </div>
  )
}

function BatchCard({ batch }: { batch: ProcessorBatch }) {
  // Derive button based on status
  const isCompleted = batch.status === 'completed' || batch.status === 'Passed' as any;
  let buttonLabel = 'Start Processing'
  let buttonStyle = 'bg-[#1b4332] text-white hover:bg-[#0f2e20]'
  let buttonPath = '/processor/batches/new'

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
        <div className="flex size-10 shrink-0 items-center justify-center text-brand">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="opacity-0" /> {/* Inner leaf approx */}
          </svg>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900">{batch.outputProductName || (batch as any).productName}</h3>
            <span className={cn(
              "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md",
              isCompleted ? "bg-gray-100 text-gray-600 border border-gray-200" : "bg-brand text-white"
            )}>
              {batch.status || 'Pending'}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-500 mb-3">
            Batch: {batch.batchCode || (batch as any).batchId}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-gray-900 font-bold block mb-0.5">Quantity</span>
              <span className="text-gray-500">{quantity}</span>
            </div>
            <div>
              <span className="text-gray-900 font-bold block mb-0.5">Type</span>
              <span className="text-gray-500">{type}</span>
            </div>
            <div>
              <span className="text-gray-900 font-bold block mb-0.5">Shelf Life</span>
              <span className="text-gray-500">{shelfLife}</span>
            </div>
          </div>

          <div className="text-xs font-medium text-gray-400 mt-4">
            Created on {formattedDate}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="shrink-0 flex items-center h-full">
        <Link to={buttonPath} className={cn("inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors", buttonStyle)}>
          {!isCompleted && (
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {isCompleted && (
            <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
          {buttonLabel}
        </Link>
      </div>
    </div>
  )
}

export default function ProcessorBatches() {
  const { data: batchesRaw, isLoading } = useGetProcessorsBatches()
  const batches: ProcessorBatch[] = batchesRaw?.data?.data || []

  // Compute stats
  const total = batches.length;
  const active = batches.filter(b => b.status === 'in_progress').length;
  const completed = batches.filter(b => b.status === 'completed').length;
  const pending = batches.filter(b => b.status === 'pending').length;

  return (
    <div className="pb-10">
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
          { label: 'Batches' },
        ]}
      />

      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
        <Link
          to="/processor/batches/new"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#1b4332] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Batch
        </Link>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-gray-500 animate-pulse">Loading batches...</div>
      ) : (
        <>
          {/* Stats Header Block */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem value={total} label="Batches" />
            <StatItem value={active} label="Active" />
            <StatItem value={completed} label="Completed" />
            <StatItem value={pending} label="Pending" />
          </div>

          {/* Batches List */}
          <div className="space-y-4">
            {batches.length === 0 ? (
              <div className="py-12 text-center text-gray-500 bg-white border border-gray-200 rounded-xl">No batches found. Start a new batch!</div>
            ) : batches.map(batch => (
              <BatchCard key={batch.id} batch={batch} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
