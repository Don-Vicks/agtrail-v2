import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { usePostCertificationsUpload } from '~/lib/api/generated/certifications/certifications'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { EmptyState } from '~/components/empty-state'
import { Package, Search } from 'lucide-react'
import type { Route } from './+types/product-certification'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Upload Product Certification | Agtrail' },
    {
      name: 'description',
      content: 'Upload certificates for your farm products',
    },
  ]
}

/* ─── Icons ─── */

function SearchIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function SortIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M8 6l4-4 4 4M8 18l4 4 4-4" />
      <line x1="12" y1="2" x2="12" y2="22" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  )
}

function UploadIcon() {
  return (
    <svg className="size-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
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

/* ─── Page component ─── */

const ITEMS_PER_PAGE = 8

export default function ProductCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [farmFilter, setFarmFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const { data: farmsResp } = useGetFarms()
  const farmsMap = useMemo(() => {
    const map = new Map<string, any>()
    farmsResp?.data?.data?.forEach((f: any) => map.set(f.id, f))
    return map
  }, [farmsResp])

  const { data: productsResp, isLoading: isLoadingProducts } = useGetFarmersProducts()
  
  const uiProducts = useMemo(() => {
    const apiProducts = productsResp?.data?.data || []
    return apiProducts.map((p: any) => ({
      id: p.id,
      batchId: p.batchNumber || `BATCH-${p.id.slice(0,6).toUpperCase()}`,
      name: p.productName || 'Unknown Product',
      farm: farmsMap.get(p.farmId)?.name || 'Unknown Farm',
      location: farmsMap.get(p.farmId)?.lga || farmsMap.get(p.farmId)?.region || 'Location Not Specified',
      certificationsCount: 0 
    }))
  }, [productsResp, farmsMap])

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique farm names from products
  const farmNames = useMemo(() => {
    const names = new Set(uiProducts.map((p) => p.farm))
    return Array.from(names).sort()
  }, [uiProducts])

  // Unique product names
  const productNames = useMemo(() => {
    const names = new Set(uiProducts.map((p) => p.name))
    return Array.from(names).sort()
  }, [uiProducts])

  // Filter products
  const filteredProducts = useMemo(() => {
    return uiProducts.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batchId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFarm = !farmFilter || p.farm === farmFilter
      const matchesProduct = !productFilter || p.name === productFilter
      return matchesSearch && matchesFarm && matchesProduct
    })
  }, [searchQuery, farmFilter, productFilter, uiProducts])

  // Pagination
  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  // Reset page when filters change
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
  const isUploading = isSavingCertification || isUploadingDocument

  const handleUpload = async () => {
    if (!selectedProductId || !certType || !uploadedFile) {
      toast.error('Please fill all required fields and upload a certificate file')
      return
    }

    const originalProduct = productsResp?.data?.data?.find((p: any) => p.id === selectedProductId)
    try {
      const uploadResponse = await uploadDocument({
        data: {
          productCertificate: uploadedFile,
        },
      })

      const uploadedUrl = uploadResponse?.data?.urls?.[0]
      if (!uploadedUrl) {
        toast.error('Upload succeeded but no document URL was returned')
        return
      }

      await uploadCert({
        data: {
          certificationTypeId: certType,
          certifiedEntityType: 'farm_product',
          farmId: originalProduct?.farmId,
          farmProductId: selectedProductId,
          certificateNumber: certOrg,
          issueDate: dateIssued ? new Date(dateIssued).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          expiryDate: dateExpiry ? new Date(dateExpiry).toISOString().split('T')[0] : undefined,
          documentUrl: uploadedUrl,
        },
      })

      toast.success('Product certification uploaded successfully')
      closeModal()
    } catch (err) {
      console.error('Failed to save certification', err)
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

  return (
    <div className="space-y-6">
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
          { label: 'Product Quality Certification' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Upload Certificate for each product</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search Farm..."
            value={searchQuery}
            onChange={(e) => updateFilters(setSearchQuery, e.target.value)}
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search button */}
          <button
            type="button"
            className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <SearchIcon />
            <span>Search</span>
          </button>

          {/* Farm filter */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <SortIcon />
            </div>
            <select
              value={farmFilter}
              onChange={(e) => updateFilters(setFarmFilter, e.target.value)}
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-9 pr-10 text-sm font-bold text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All Farms</option>
              {farmNames.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <ChevronDown />
          </div>

          {/* Product filter */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <SortIcon />
            </div>
            <select
              value={productFilter}
              onChange={(e) => updateFilters(setProductFilter, e.target.value)}
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-9 pr-10 text-sm font-bold text-gray-700 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All Products</option>
              {productNames.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Product card grid */}
      {isLoadingProducts ? (
        <div className="py-12 flex flex-col items-center justify-center gap-4">
          <div className="size-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading products...</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top row: QR + Batch ID */}
              <div className="flex items-start justify-between">
                <div className="rounded-md border border-gray-100 p-1.5 bg-white">
                  <QRCodeSVG value={product.batchId} size={56} />
                </div>
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none">
                  {product.batchId}
                </span>
              </div>

              {/* Product info */}
              <div className="mt-5">
                <h3 className="text-xl font-bold text-gray-900 leading-none">{product.name}</h3>
                <button
                  type="button"
                  className="mt-2.5 flex items-center gap-1.5 text-sm font-bold text-gray-900 hover:text-brand transition-colors"
                  onClick={() => {}} // Navigate to farm details if needed
                >
                  {product.farm}
                  <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
                <p className="mt-1 text-xs text-gray-500 font-medium">{product.location}</p>
              </div>

              {/* Certificate badge */}
              <div className="mt-4 flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                  <CertBadgeIcon />
                  {product.certificationsCount} Certificate{product.certificationsCount !== 1 ? 's' : ''} Uploaded
                </div>
              </div>

              {/* Upload button */}
              <button
                type="button"
                onClick={() => openModal(product.id)}
                className="mt-6 flex h-11 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white transition-colors hover:bg-brand-dark shadow-sm"
              >
                Upload Certificate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Package className="size-10" />}
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for."
          action={{
            label: "Clear all filters",
            onClick: () => {
              setSearchQuery('')
              setFarmFilter('')
              setProductFilter('')
            }
          }}
        />
      )}



      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2">
        <p className="text-xs font-medium text-gray-500">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} row(s) selected.
        </p>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <span className="text-xs font-medium text-gray-500">Rows per page</span>
             <div className="relative">
               <select className="h-8 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all">
                 <option>10</option>
                 <option>20</option>
               </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                 <svg className="size-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-gray-900">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="flex size-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="flex size-7 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Upload Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="border-b border-gray-100 px-6 py-4">
               <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h2>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">Upload your product quality certificate.</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Certification Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    >
                      <option value="">Select a Type</option>
                      {CERTIFICATION_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Certification Organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., NAFDAC"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="date-issued" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Date Issued
                  </label>
                  <DatePicker
                    value={dateIssued}
                    onChange={setDateIssued}
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="date-expiry" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                    Date Expiry
                  </label>
                  <DatePicker
                    value={dateExpiry}
                    onChange={setDateExpiry}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Upload Document<span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-all cursor-pointer ${dragOver
                    ? 'border-brand bg-brand/5 scale-[1.01]'
                    : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'
                    }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
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
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
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
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-gray-900">Click to upload or drag and drop</span>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-widest">Max file size: 10MB (PDF, JPG, PNG)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="flex h-12 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white shadow-lg shadow-brand/10 transition-all hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isUploading ? 'Saving...' : 'Save Certification'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}


