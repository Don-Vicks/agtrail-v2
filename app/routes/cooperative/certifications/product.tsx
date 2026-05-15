import { useQueryClient } from '@tanstack/react-query'
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Filter,
  LayoutDashboard,
  Package,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  UploadCloud,
  X,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import { Input } from '~/components/ui/input'
import { resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import {
  getGetCertificationsQueryKey,
  useGetCertifications,
  usePostCertificationsUpload,
} from '~/lib/api/generated/certifications/certifications'
import {
  getGetCooperativesFarmsQueryKey,
  useGetCooperativesFarms,
} from '~/lib/api/generated/cooperatives/cooperatives'
import {
  getGetFarmersProductsQueryKey,
  useGetFarmersProducts,
} from '~/lib/api/generated/farm-products/farm-products'
import type { FarmProduct, PostCertificationsUploadBody } from '~/lib/api/generated/models'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { cn } from '~/lib/utils'
import type { Route } from './+types/product'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Product Certifications | Agtrail' },
    { name: 'description', content: 'Manage product certifications and quality verification' },
  ]
}

const ITEMS_PER_PAGE = 8

export default function ProductCertificationPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [farmFilter, setFarmFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { data: farmsResp } = useGetCooperativesFarms()
  const farmsMap = useMemo(() => {
    const m = new Map<string, string>()
      ; (farmsResp?.data?.data ?? []).forEach((f) => m.set(f.id, f.name || 'Unknown farm'))
    return m
  }, [farmsResp])

  const {
    data: productsResp,
    isLoading: productsLoading,
    error: productsError,
  } = useGetFarmersProducts()
  const products = useMemo(() => productsResp?.data?.data ?? [], [productsResp])

  const { data: certsResp } = useGetCertifications()
  const certList = useMemo(() => {
    const raw = certsResp?.data?.data
    return Array.isArray(raw) ? raw : []
  }, [certsResp])

  const productCertCount = useCallback(
    (productId: string) =>
      certList.filter((c) => {
        const t = (c.entityType || '').toLowerCase()
        return (t.includes('farm_product') || t.includes('product')) && c.entityId === productId
      }).length,
    [certList],
  )

  const farmNames = useMemo(() => {
    const names = new Set<string>()
    products.forEach((p) => names.add(farmsMap.get(p.farmId) || `Farm ${p.farmId.slice(0, 8)}…`))
    return Array.from(names).sort()
  }, [products, farmsMap])

  const productNames = useMemo(() => {
    const names = new Set(products.map((p) => p.productName || 'Product'))
    return Array.from(names).sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const farmName = farmsMap.get(p.farmId) || `Farm ${p.farmId.slice(0, 8)}…`
      const matchesSearch =
        !searchQuery ||
        farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFarm = !farmFilter || farmName === farmFilter
      const matchesProduct = !productFilter || (p.productName || '') === productFilter
      return matchesSearch && matchesFarm && matchesProduct
    })
  }, [products, farmsMap, searchQuery, farmFilter, productFilter])

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const updateFilters = useCallback((setter: (v: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }, [])

  const openModal = useCallback((productId: string) => {
    setSelectedProductId(productId)
    setCertType('')
    setCertOrg('')
    setDateIssued('')
    setDateExpiry('')
    setUploadedFile(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedProductId(null)
  }, [])

  const { mutateAsync: uploadCert, isPending: isSavingCertification } = usePostCertificationsUpload()
  const { mutateAsync: uploadDocument, isPending: isUploadingDocument } = usePostUpload()
  const isSaving = isSavingCertification || isUploadingDocument

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId],
  )

  const handleSave = async () => {
    if (!selectedProduct || !certType || !uploadedFile) {
      toast.error('Select certification type, product, and upload a document')
      return
    }
    try {
      const uploadResponse = await uploadDocument({
        data: { productCertificate: uploadedFile },
      })
      const uploadedUrl = uploadResponse?.data?.urls?.[0]
      const documentUrl = resolveDocumentUrlForApi(uploadedUrl)
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
          certifiedEntityType: 'farm_product',
          farmId: selectedProduct.farmId,
          farmProductId: selectedProduct.id,
          certificateNumber: certOrg || undefined,
          issueDate,
          expiryDate,
          documentUrl,
        } as PostCertificationsUploadBody,
      })

      await queryClient.invalidateQueries({ queryKey: getGetCertificationsQueryKey() })
      await queryClient.invalidateQueries({ queryKey: getGetFarmersProductsQueryKey() })
      await queryClient.invalidateQueries({ queryKey: getGetCooperativesFarmsQueryKey() })

      toast.success('Product certification saved')
      closeModal()
    } catch (e) {
      console.error(e)
      toast.error('Failed to save certification')
    }
  }

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

  if (productsError) {
    return (
      <div className="space-y-6 pb-10 px-1">
        <PageHeader
          items={[
            { label: 'Dashboard', href: '/cooperative', icon: <LayoutDashboard className="size-4 text-gray-400" /> },
            { label: 'Certifications', href: '/cooperative/certifications' },
            { label: 'Product Certifications' },
          ]}
        />
        <EmptyState
          title="Could not load products"
          description="Farm products are loaded from the products API for your session. Try again or confirm your cooperative permissions."
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Certifications', href: '/cooperative/certifications' },
          { label: 'Product Certifications' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Product Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            Farm products available to your account (same catalogue as farmer product records). Upload certificates against a specific product ID.
          </p>
        </div>
      </div>

      <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by batch, product, or farm…"
            value={searchQuery}
            onChange={(e) => updateFilters(setSearchQuery, e.target.value)}
            className="w-full h-11 rounded-md border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={farmFilter}
              onChange={(e) => updateFilters(setFarmFilter, e.target.value)}
              className="h-11 w-full sm:w-48 rounded-md border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">All farms</option>
              {farmNames.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={productFilter}
              onChange={(e) => updateFilters(setProductFilter, e.target.value)}
              className="h-11 w-full sm:w-48 rounded-md border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">All products</option>
              {productNames.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>

          <Button variant="outline" className="h-11 px-4 border-gray-100 text-gray-400" type="button" aria-label="Filters">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {productsLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-md bg-gray-100" />
          ))}
        </div>
      )}

      {!productsLoading && products.length === 0 && (
        <EmptyState
          title="No farm products"
          description="When products exist for farms in your cooperative, they appear here for certification."
        />
      )}

      {!productsLoading && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {paginatedProducts.map((batch: FarmProduct) => {
            const farmName = farmsMap.get(batch.farmId) || `Farm ${batch.farmId.slice(0, 8)}…`
            const nCerts = productCertCount(batch.id)
            const qrValue = batch.qrCodeData || batch.batchNumber || batch.id
            return (
              <div
                key={batch.id}
                className="group relative rounded-md border border-gray-100 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-lg overflow-hidden flex flex-col shadow-sm"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="rounded-md border border-gray-100 p-2 bg-white shadow-sm group-hover:scale-105 transition-transform">
                    <QRCodeSVG value={qrValue} size={64} />
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none max-w-[200px] truncate">
                      {batch.batchNumber}
                    </Badge>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Batch</span>
                  </div>
                </div>

                <div className="flex-1 space-y-2 text-left">
                  <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors">
                    {batch.productName}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">
                      <Building2 className="size-3 text-brand/40" />
                      {farmName}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-left">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certifications</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 shadow-none border-dashed flex items-center gap-1.5 w-fit',
                        nCerts > 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200',
                      )}
                    >
                      {nCerts > 0 ? <CheckCircle2 className="size-3" /> : <ShieldCheck className="size-3" />}
                      {nCerts > 0 ? `${nCerts} on file` : 'None yet'}
                    </Badge>
                  </div>

                  <Button
                    type="button"
                    onClick={() => openModal(batch.id)}
                    className="h-11 bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] px-6 gap-2 shadow-sm transition-all active:scale-[0.98]"
                  >
                    <Plus className="size-3.5" />
                    Add certification
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {filteredProducts.length === 0 && !productsLoading && products.length > 0 && (
        <EmptyState
          className="rounded-md border border-dashed border-gray-100 py-16"
          icon={<Package className="size-8 text-gray-300" />}
          title="No products match"
          description="Adjust search or farm and product filters."
          action={{
            label: 'Reset filters',
            onClick: () => {
              setSearchQuery('')
              setFarmFilter('')
              setProductFilter('')
            },
          }}
        />
      )}

      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
            <span className="text-gray-900">Total products: {totalItems}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 lowercase">
                Page {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-300"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ArrowRight className="size-4 rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-400 hover:text-brand transition-all"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-start justify-between text-left">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-md bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                  <Package className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Certification details</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {selectedProduct ? selectedProduct.productName : ''}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-md text-gray-400 hover:bg-gray-50">
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-8 space-y-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Verification type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-11 w-full flex items-center justify-between rounded-md border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                    >
                      <option value="">Select type</option>
                      {CERTIFICATION_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Issuing institution
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., NAFDAC / SON"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    className="h-11 w-full rounded-md border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Calendar className="size-3 text-brand" /> Issuance date
                  </label>
                  <DatePicker value={dateIssued} onChange={setDateIssued} className="h-11 rounded-md border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <QrCode className="size-3 text-brand" /> Expiry date
                  </label>
                  <DatePicker value={dateExpiry} onChange={setDateExpiry} className="h-11 rounded-md border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Certification document (PDF / image) <span className="text-red-500 font-bold">*</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'relative flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 transition-all cursor-pointer',
                    dragOver
                      ? 'border-brand bg-brand/5 scale-[0.98]'
                      : 'border-gray-100 bg-gray-50/30 hover:bg-white hover:border-brand/20',
                  )}
                >
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileText className="size-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{uploadedFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFile(null)
                          }}
                          className="mt-2 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                          Remove document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center gap-3">
                      <div className="size-12 rounded-md bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand">
                        <UploadCloud className="size-6" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Drop or select file</span>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Max 10MB (PDF/JPG/PNG)</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  disabled={isSaving || !certType || !uploadedFile}
                  onClick={() => void handleSave()}
                  className="h-14 w-full bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-brand/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  <CheckCircle2 className="size-5" />
                  {isSaving ? 'Saving…' : 'Save certification'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
