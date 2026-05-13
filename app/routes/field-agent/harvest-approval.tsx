import { useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, Archive, CheckCircle2, Clock } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import {
  getGetFieldAgentsHarvestApprovalsPendingQueryKey,
  getGetFieldAgentsHarvestApprovalsQueryKey,
  useGetFieldAgentsHarvestApprovals,
  useGetFieldAgentsHarvestApprovalsPending,
  usePostFieldAgentsHarvestApprovals,
} from '~/lib/api/generated/field-agent/field-agent'
import { CreateHarvestApprovalRequestAction } from '~/lib/api/generated/models/createHarvestApprovalRequestAction'
import type { Farm } from '~/lib/api/generated/models/farm'
import type { FarmProduct } from '~/lib/api/generated/models/farmProduct'
import type { HarvestApproval } from '~/lib/api/generated/models/harvestApproval'
import { extractFarmProductsFromFieldAgentEnvelope } from '~/lib/field-agent-utils'
import { formatFarmLocation } from '~/lib/record-operation-dashboard'
import { cn } from '~/lib/utils'
import { HarvestCard, type HarvestItem } from './harvest-approval/components/harvest-card'
import { HarvestFilters } from './harvest-approval/components/harvest-filters'
import { HarvestInspectionModal } from './harvest-approval/components/harvest-inspection-modal'

type HarvestApprovalAction =
  (typeof CreateHarvestApprovalRequestAction)[keyof typeof CreateHarvestApprovalRequestAction]

function mapFarmProductToHarvestItem(product: FarmProduct, farms: Farm[]): HarvestItem {
  const farm = farms.find((f) => f.id === product.farmId)
  const farmerId = farm?.ownerId || product.createdBy || ''
  const batchLabel =
    typeof product.batchNumber === 'string' && product.batchNumber.length > 0
      ? product.batchNumber.toUpperCase().startsWith('BATCH')
        ? product.batchNumber
        : `BATCH-${product.batchNumber}`
      : `BATCH-${product.id.slice(0, 8)}`

  return {
    id: product.id,
    farmProductId: product.id,
    farmerId,
    farmId: product.farmId,
    product: product.productName,
    batchId: batchLabel,
    farmer: farmerId ? `Farmer (${farmerId.slice(0, 8)}…)` : 'Unknown farmer',
    location: formatFarmLocation(farm),
    weight: `${product.quantityHarvested} ${product.unit ?? 'kg'}`,
    hectares: '—',
    owner: farmerId || 'Unknown',
    status: 'pending',
    canInspect: Boolean(farmerId),
  }
}

export default function HarvestApprovalPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending')
  const [selectedHarvest, setSelectedHarvest] = useState<HarvestItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: farmsResponse } = useGetFarms()
  const farms = farmsResponse?.data?.data ?? []

  // --- Pending tab data ---
  const {
    data: pendingProducts = [],
    isLoading,
    isError,
  } = useGetFieldAgentsHarvestApprovalsPending({
    query: {
      select: (res) => extractFarmProductsFromFieldAgentEnvelope(res.data),
    },
  })

  const items = useMemo(
    () => pendingProducts.map((p) => mapFarmProductToHarvestItem(p, farms)),
    [pendingProducts, farms],
  )

  // --- History tab data ---
  const {
    data: historyResponse,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
  } = useGetFieldAgentsHarvestApprovals({
    query: {
      enabled: activeTab === 'history',
    },
  })

  const historyItems = useMemo(() => {
    const raw = historyResponse?.data
    if (!raw) return []
    // handle both { success, data: [] } and raw array shapes
    if (typeof raw === 'object' && 'data' in (raw as any)) {
      return ((raw as any).data ?? []) as HarvestApproval[]
    }
    if (Array.isArray(raw)) return raw as HarvestApproval[]
    return []
  }, [historyResponse])

  // --- Pagination (for pending tab) ---
  const totalPages = Math.max(1, Math.ceil(items.length / rowsPerPage))
  const pageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return items.slice(start, start + rowsPerPage)
  }, [items, page, rowsPerPage])

  // --- Pagination (for history tab) ---
  const historyTotalPages = Math.max(1, Math.ceil(historyItems.length / rowsPerPage))
  const historyPageItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return historyItems.slice(start, start + rowsPerPage)
  }, [historyItems, page, rowsPerPage])

  const { mutateAsync: postHarvestApproval, isPending: isSubmittingHarvest } =
    usePostFieldAgentsHarvestApprovals()

  const handleInspect = (item: HarvestItem) => {
    setSelectedHarvest(item)
    setIsModalOpen(true)
  }

  const handleSubmitDecision = async (input: {
    action: HarvestApprovalAction
    notes?: string
    flagReason?: string
  }) => {
    if (!selectedHarvest) return
    if (!selectedHarvest.farmerId) {
      toast.error('Cannot submit: farm owner is missing for this record.')
      throw new Error('missing farmer')
    }
    try {
      await postHarvestApproval({
        data: {
          farmProductId: selectedHarvest.farmProductId,
          farmerId: selectedHarvest.farmerId,
          action: input.action,
          notes: input.notes,
          flagReason: input.action === CreateHarvestApprovalRequestAction.flagged ? input.flagReason : undefined,
        },
      })
      toast.success(
        input.action === CreateHarvestApprovalRequestAction.approved ? 'Harvest approved.' : 'Harvest flagged.',
      )
      void queryClient.invalidateQueries({ queryKey: getGetFieldAgentsHarvestApprovalsPendingQueryKey() })
      void queryClient.invalidateQueries({ queryKey: getGetFieldAgentsHarvestApprovalsQueryKey() })
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Request failed.')
      throw e
    }
  }

  return (
    <div className='space-y-6 pb-10 text-left'>
      <PageHeader
        items={[
          { label: 'Field Agent', href: '/field-agent', icon: <Archive className='size-4 text-gray-400' /> },
          { label: 'Harvest approval', href: '#' },
        ]}
      />

      <div className='space-y-1'>
        <h1 className='text-2xl font-bold text-[#1a4332] tracking-tight'>Harvest approval</h1>
        <p className='text-sm text-gray-500 font-medium'>Review harvest records assigned to your field audits</p>
      </div>

      {/* Tab Bar */}
      <div className='flex items-center gap-1 border-b border-gray-100'>
        <button
          type='button'
          onClick={() => { setActiveTab('pending'); setPage(1) }}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'pending'
              ? 'border-[#1a4332] text-[#1a4332]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          )}
        >
          <Clock className='inline size-4 mr-1.5 -mt-0.5' />
          Pending
          {items.length > 0 && (
            <span className='ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded'>
              {items.length}
            </span>
          )}
        </button>
        <button
          type='button'
          onClick={() => { setActiveTab('history'); setPage(1) }}
          className={cn(
            'px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors',
            activeTab === 'history'
              ? 'border-[#1a4332] text-[#1a4332]'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          )}
        >
          <CheckCircle2 className='inline size-4 mr-1.5 -mt-0.5' />
          History
          {historyItems.length > 0 && (
            <span className='ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-500 rounded'>
              {historyItems.length}
            </span>
          )}
        </button>
      </div>

      <HarvestFilters />

      {/* ==================== PENDING TAB ==================== */}
      {activeTab === 'pending' && (
        <>
          {isError && (
            <p className='text-sm text-red-600'>Could not load pending harvest list. Refresh and try again.</p>
          )}

          {isLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-64 rounded-md border border-gray-100 bg-gray-50 animate-pulse' />
              ))}
            </div>
          ) : items.length === 0 ? (
            <p className='text-sm text-gray-500 py-12 text-center rounded-md border border-dashed border-gray-200'>
              No harvest records awaiting review.
            </p>
          ) : (
            <>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {pageItems.map((item) => (
                  <HarvestCard key={item.id} item={item} onInspect={handleInspect} />
                ))}
              </div>

              <HarvestPagination
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                totalRows={items.length}
                onPageChange={(p) => setPage(Math.min(totalPages, Math.max(1, p)))}
                onRowsPerPageChange={(n) => {
                  setRowsPerPage(n)
                  setPage(1)
                }}
              />
            </>
          )}
        </>
      )}

      {/* ==================== HISTORY TAB ==================== */}
      {activeTab === 'history' && (
        <>
          {isErrorHistory && (
            <p className='text-sm text-red-600'>Could not load approval history. Refresh and try again.</p>
          )}

          {isLoadingHistory ? (
            <div className='space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className='h-20 rounded-md border border-gray-100 bg-gray-50 animate-pulse' />
              ))}
            </div>
          ) : historyItems.length === 0 ? (
            <p className='text-sm text-gray-500 py-12 text-center rounded-md border border-dashed border-gray-200'>
              No approval history yet. Approve or flag a harvest to see it here.
            </p>
          ) : (
            <>
              <div className='rounded-md border border-gray-100 overflow-hidden'>
                <table className='w-full text-left'>
                  <thead>
                    <tr className='bg-gray-50/60'>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Product</th>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Farmer</th>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Decision</th>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Reason / Notes</th>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Evidence</th>
                      <th className='px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Date</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {historyPageItems.map((item) => {
                      // Try to find matching product info from the pending items
                      const matchedProduct = pendingProducts.find(p => p.id === item.farmProductId)
                      const productLabel = matchedProduct?.productName ?? item.farmProductId.slice(0, 12) + '…'
                      const batchNumber = matchedProduct?.batchNumber ?? ''
                      const farmerLabel = item.farmerId ? `${item.farmerId.slice(0, 8)}…` : '—'
                      const evidenceCount = item.evidencePhotos?.length ?? 0

                      return (
                        <tr key={item.id} className='hover:bg-gray-50/40 transition-colors'>
                          <td className='px-4 py-3'>
                            <div>
                              <p className='text-xs font-semibold text-gray-900'>{productLabel}</p>
                              {batchNumber && (
                                <p className='text-[10px] font-mono text-gray-400 mt-0.5'>
                                  {batchNumber.toUpperCase().startsWith('BATCH') ? batchNumber : `BATCH-${batchNumber}`}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className='px-4 py-3'>
                            <span className='text-xs font-mono text-gray-500'>{farmerLabel}</span>
                          </td>
                          <td className='px-4 py-3'>
                            {item.action === 'approved' ? (
                              <span className='inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-50 text-emerald-700 border border-emerald-100'>
                                <CheckCircle2 className='size-3' />
                                Approved
                              </span>
                            ) : (
                              <span className='inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-red-50 text-red-700 border border-red-100'>
                                <AlertTriangle className='size-3' />
                                Flagged
                              </span>
                            )}
                          </td>
                          <td className='px-4 py-3 max-w-[200px]'>
                            {item.flagReason && (
                              <p className='text-[10px] font-semibold text-red-600 mb-0.5'>
                                {item.flagReason.replace(/_/g, ' ')}
                              </p>
                            )}
                            <p className='text-xs text-gray-500 line-clamp-2'>
                              {item.notes ?? '—'}
                            </p>
                          </td>
                          <td className='px-4 py-3'>
                            <span className={cn(
                              'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded',
                              evidenceCount > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'
                            )}>
                              {evidenceCount} {evidenceCount === 1 ? 'file' : 'files'}
                            </span>
                          </td>
                          <td className='px-4 py-3'>
                            <div>
                              <p className='text-xs text-gray-600 whitespace-nowrap'>
                                {new Date(item.createdAt).toLocaleDateString()}
                              </p>
                              <p className='text-[10px] text-gray-400'>
                                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <HarvestPagination
                page={page}
                totalPages={historyTotalPages}
                rowsPerPage={rowsPerPage}
                totalRows={historyItems.length}
                onPageChange={(p) => setPage(Math.min(historyTotalPages, Math.max(1, p)))}
                onRowsPerPageChange={(n) => {
                  setRowsPerPage(n)
                  setPage(1)
                }}
              />
            </>
          )}
        </>
      )}

      <HarvestInspectionModal
        item={selectedHarvest}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedHarvest(null)
        }}
        onSubmitDecision={handleSubmitDecision}
        isSubmitting={isSubmittingHarvest}
      />
    </div>
  )
}

function HarvestPagination({
  page,
  totalPages,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: {
  page: number
  totalPages: number
  rowsPerPage: number
  totalRows: number
  onPageChange: (p: number) => void
  onRowsPerPageChange: (n: number) => void
}) {
  return (
    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8 border-t border-gray-50'>
      <p className='text-xs font-semibold text-gray-400 tracking-tight'>
        Showing {Math.min(totalRows, (page - 1) * rowsPerPage + 1)}–
        {Math.min(totalRows, page * rowsPerPage)} of {totalRows}
      </p>
      <div className='flex flex-wrap items-center gap-6'>
        <div className='flex items-center gap-2'>
          <span className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className='h-8 rounded-md border border-gray-200 bg-white px-2 text-[10px] font-bold outline-none'
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
            Page {page} of {totalPages}
          </span>
          <div className='flex gap-1'>
            <button
              type='button'
              className='size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-40'
              disabled={page <= 1}
              onClick={() => onPageChange(1)}
            >
              &laquo;
            </button>
            <button
              type='button'
              className='size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-600 disabled:opacity-40'
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              &lsaquo;
            </button>
            <button
              type='button'
              className='size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold disabled:opacity-40'
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              &rsaquo;
            </button>
            <button
              type='button'
              className='size-8 rounded-md border border-gray-200 bg-white flex items-center justify-center text-gray-600 font-semibold disabled:opacity-40'
              disabled={page >= totalPages}
              onClick={() => onPageChange(totalPages)}
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
