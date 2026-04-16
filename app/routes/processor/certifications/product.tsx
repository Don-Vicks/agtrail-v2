import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { EmptyState } from '~/components/empty-state'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { API_BASE_URL, resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import {
  getGetCertificationsQueryKey,
  useGetCertifications,
  usePostCertificationsUpload,
} from '~/lib/api/generated/certifications/certifications'
import {
  getGetProcessorsBatchesQueryKey,
  useGetProcessorsBatches,
} from '~/lib/api/generated/processors-batches/processors-batches'
import type { PostCertificationsUploadBody, ProcessorBatch } from '~/lib/api/generated/models'
import type { Route } from './+types/product'

const ITEMS_PER_PAGE = 10
const PRODUCT_PREFETCH = 30

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Product Quality Certification | Agtrail' },
    { name: 'description', content: 'Upload certificates for processor batch products' },
  ]
}

async function postBatchProductCertificateUpload(file: File): Promise<string[]> {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '')
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('agrolinking_token') : null
  const orgId =
    typeof window !== 'undefined'
      ? localStorage.getItem('agrolinking_organization_id') ||
        (import.meta.env.VITE_DEFAULT_ORGANIZATION_ID as string | undefined) ||
        undefined
      : (import.meta.env.VITE_DEFAULT_ORGANIZATION_ID as string | undefined)
  const formData = new FormData()
  formData.append('batchProductCertificate', file)
  const res = await fetch(`${cleanBase}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(orgId ? { 'X-Organization-Id': orgId } : {}),
    },
    body: formData,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Upload failed (${res.status})`)
  }
  const json = (await res.json().catch(() => ({}))) as {
    urls?: string[]
    data?: { urls?: string[] }
  }
  return json.urls ?? json.data?.urls ?? []
}

async function fetchProcessorBatchProducts(batchId: string) {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '')
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('agrolinking_token') : null
  const orgId =
    typeof window !== 'undefined'
      ? localStorage.getItem('agrolinking_organization_id') ||
        (import.meta.env.VITE_DEFAULT_ORGANIZATION_ID as string | undefined) ||
        undefined
      : (import.meta.env.VITE_DEFAULT_ORGANIZATION_ID as string | undefined)
  const res = await fetch(
    `${cleanBase}/processors/batches/${encodeURIComponent(batchId)}/products`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(orgId ? { 'X-Organization-Id': orgId } : {}),
      },
    },
  )
  if (res.status === 404 || res.status === 405) return []
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to load batch products (${res.status})`)
  }
  const json = (await res.json().catch(() => ({}))) as { data?: unknown }
  const rows = json?.data
  if (!Array.isArray(rows)) return []
  return rows as { id: string; productName?: string; batchNumber?: string }[]
}

/* ─── Icons ─── */
function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function CertBadgeIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function UploadCertModal({
  isOpen,
  onClose,
  batchId,
  batchLabel,
}: {
  isOpen: boolean
  onClose: () => void
  batchId: string | null
  batchLabel?: string
}) {
  const queryClient = useQueryClient()
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { data: products = [], isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['processor-batch-products', batchId],
    queryFn: () => fetchProcessorBatchProducts(batchId!),
    enabled: isOpen && !!batchId,
  })

  const { mutateAsync: uploadCert, isPending: isSavingCertification } = usePostCertificationsUpload()
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const isUploading = isSavingCertification || isUploadingFile

  useEffect(() => {
    if (!isOpen) {
      setDragOver(false)
      setUploadedFile(null)
      setCertType('')
      setCertOrg('')
      setDateIssued('')
      setDateExpiry('')
      setSelectedProductId(null)
      return
    }
    setSelectedProductId(null)
  }, [isOpen, batchId])

  useEffect(() => {
    if (!isOpen || productsLoading) return
    if (products.length === 1) setSelectedProductId(products[0].id)
  }, [isOpen, products, productsLoading])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }, [])

  const handleSave = async () => {
    if (!batchId || !certType || !uploadedFile || !selectedProductId) {
      toast.error('Select a batch product, certification type, and file')
      return
    }
    try {
      setIsUploadingFile(true)
      const urls = await postBatchProductCertificateUpload(uploadedFile)
      const documentUrl = resolveDocumentUrlForApi(urls[0])
      if (!documentUrl) {
        toast.error('Upload succeeded but no document URL was returned')
        return
      }

      const issueDate = dateIssued
        ? new Date(dateIssued).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      const expiryDate = dateExpiry
        ? new Date(dateExpiry).toISOString().split('T')[0]
        : undefined

      await uploadCert({
        data: {
          certificationTypeId: certType,
          certifiedEntityType: 'batch_product',
          farmProductId: selectedProductId,
          certificateNumber: certOrg || undefined,
          issueDate,
          expiryDate,
          documentUrl,
        } as PostCertificationsUploadBody,
      })

      await queryClient.invalidateQueries({ queryKey: getGetCertificationsQueryKey() })
      await queryClient.invalidateQueries({ queryKey: getGetProcessorsBatchesQueryKey() })
      await queryClient.invalidateQueries({ queryKey: ['processor-batch-products', batchId] })

      toast.success('Product certification saved')
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save certification')
    } finally {
      setIsUploadingFile(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h2>
              <p className="mt-0.5 text-xs font-medium text-gray-500">
                {batchLabel ? `Batch: ${batchLabel}` : 'Upload a certificate for a finished batch product.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {productsLoading && (
            <p className="text-sm text-gray-500">Loading batch products…</p>
          )}
          {productsError && (
            <p className="text-sm text-red-600">
              Could not load products for this batch. You can still try again, or add products to the batch first.
            </p>
          )}
          {!productsLoading && products.length === 0 && (
            <p className="text-sm text-gray-600">
              No finished products are listed for this batch yet. Add a product output to the batch, then return here
              to attach a certificate.
            </p>
          )}
          {products.length > 1 && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Batch product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedProductId ?? ''}
                  onChange={(e) => setSelectedProductId(e.target.value || null)}
                  className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.productName || 'Product'} ({p.batchNumber || p.id.slice(0, 8)})
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Certification Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value)}
                  className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                >
                  <option value="">Select a Type</option>
                  {CERTIFICATION_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Certification organisation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={certOrg}
                onChange={(e) => setCertOrg(e.target.value)}
                placeholder="e.g., NAFDAC"
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Date Issued</label>
              <DatePicker value={dateIssued} onChange={setDateIssued} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Date Expiry</label>
              <DatePicker value={dateExpiry} onChange={setDateExpiry} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Upload Document<span className="text-red-500">*</span>
            </label>
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-all cursor-pointer ${dragOver ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'}`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
            >
              {uploadedFile ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2.5">
                    <svg className="size-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <span>{uploadedFile.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setUploadedFile(null)
                      }}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <CloseIcon />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex w-full cursor-pointer flex-col items-center gap-3">
                  <div className="rounded-full bg-white p-3 shadow-sm border border-gray-100">
                    <svg className="size-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold text-gray-900">Click to upload or drag and drop</span>
                    <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest">
                      Max file size: 10MB (PDF, JPG, PNG)
                    </p>
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                </label>
              )}
            </div>
          </div>

          <button
            type="button"
            disabled={
              isUploading ||
              productsLoading ||
              !products.length ||
              !selectedProductId ||
              !certType ||
              !uploadedFile
            }
            onClick={() => void handleSave()}
            className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white shadow-lg shadow-brand/10 transition-all hover:bg-brand-dark hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isUploading ? 'Saving…' : 'Save product certification'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<ProcessorBatch | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: batchesResp, isLoading: batchesLoading } = useGetProcessorsBatches()
  const batches = useMemo(() => batchesResp?.data?.data ?? [], [batchesResp])

  const { data: certsResp } = useGetCertifications()
  const certList = useMemo(() => {
    const raw = certsResp?.data?.data
    return Array.isArray(raw) ? raw : []
  }, [certsResp])

  const cappedIds = useMemo(
    () => batches.slice(0, PRODUCT_PREFETCH).map((b) => b.id),
    [batches],
  )

  const productQueries = useQueries({
    queries: cappedIds.map((id) => ({
      queryKey: ['processor-batch-products', id] as const,
      queryFn: () => fetchProcessorBatchProducts(id),
      staleTime: 60_000,
    })),
  })

  const certCountByBatchId = useMemo(() => {
    const map = new Map<string, number>()
    batches.forEach((batch, index) => {
      const productIds =
        index < PRODUCT_PREFETCH
          ? (productQueries[index]?.data ?? []).map((p) => p.id)
          : []
      const related = new Set<string>([batch.id, ...productIds])
      map.set(
        batch.id,
        certList.filter((c) => related.has(c.entityId)).length,
      )
    })
    return map
  }, [batches, certList, productQueries])

  const productTypes = useMemo(() => {
    const s = new Set<string>()
    batches.forEach((b) => {
      if (b.outputProductType) s.add(b.outputProductType)
    })
    return Array.from(s).sort()
  }, [batches])

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const q = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !q ||
        b.batchCode.toLowerCase().includes(q) ||
        b.outputProductName.toLowerCase().includes(q) ||
        (b.outputProductType || '').toLowerCase().includes(q)
      const matchesType = !typeFilter || b.outputProductType === typeFilter
      return matchesSearch && matchesType
    })
  }, [batches, searchQuery, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / ITEMS_PER_PAGE))
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBatches.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBatches, currentPage])

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const openModal = (batch: ProcessorBatch) => {
    setSelectedBatch(batch)
    setIsModalOpen(true)
  }

  const start = filteredBatches.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredBatches.length)

  return (
    <div className="space-y-6 pb-10">
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
          { label: 'Product Quality Certification' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h1>
        <p className="mt-1 text-sm text-gray-500 font-medium">Upload certificates for finished products on each processing batch</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by batch code or product…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 min-w-[160px] appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All product types</option>
              {productTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {batchesLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      )}

      {!batchesLoading && batches.length === 0 && (
        <EmptyState
          title="No processing batches"
          description="Create a batch under Product Output, then attach quality certificates here."
        />
      )}

      {!batchesLoading && batches.length > 0 && filteredBatches.length === 0 && (
        <EmptyState title="No matches" description="Try a different search or product type filter." />
      )}

      {!batchesLoading && filteredBatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginated.map((batch) => {
            const qrValue = batch.qrCodeData || batch.batchCode
            const certCount = certCountByBatchId.get(batch.id) ?? 0
            return (
              <div
                key={batch.id}
                className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="rounded-md border border-gray-100 p-1.5 bg-white shadow-sm ring-1 ring-gray-900/5">
                    <QRCodeSVG value={qrValue} size={70} />
                  </div>
                  <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none text-right max-w-[55%] break-all">
                    {batch.batchCode}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-brand transition-colors">
                  {batch.outputProductName}
                </h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                  {batch.outputProductType || 'Processed product'}
                </p>

                <div className="mt-5 mb-6 flex items-center gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700 uppercase tracking-wide">
                    <CertBadgeIcon />
                    {certCount} certificate{certCount === 1 ? '' : 's'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openModal(batch)}
                  className="mt-auto flex h-11 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white transition-all hover:bg-brand-dark shadow-sm shadow-brand/10 hover:-translate-y-0.5"
                >
                  Upload certificate
                </button>
              </div>
            )
          })}
        </div>
      )}

      {!batchesLoading && filteredBatches.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2 text-xs font-medium text-gray-500 mb-10">
          <span>
            Showing {start}–{end} of {filteredBatches.length} batch(es)
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="size-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="size-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <UploadCertModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedBatch(null)
        }}
        batchId={selectedBatch?.id ?? null}
        batchLabel={selectedBatch ? `${selectedBatch.batchCode} — ${selectedBatch.outputProductName}` : undefined}
      />
    </div>
  )
}
