import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo, useState } from 'react'
import { Breadcrumb } from '~/components/breadcrumb'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { products } from '~/lib/mock-data/farmer'
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

function CalendarIcon() {
  return (
    <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
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

const ITEMS_PER_PAGE = 6

export default function ProductCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [farmFilter, setFarmFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique farm names from products
  const farmNames = useMemo(() => {
    const names = new Set(products.map((p) => p.farm))
    return Array.from(names).sort()
  }, [])

  // Unique product names
  const productNames = useMemo(() => {
    const names = new Set(products.map((p) => p.name))
    return Array.from(names).sort()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.farm.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.batchId.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFarm = !farmFilter || p.farm === farmFilter
      const matchesProduct = !productFilter || p.name === productFilter
      return matchesSearch && matchesFarm && matchesProduct
    })
  }, [searchQuery, farmFilter, productFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
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
    <div>
      {/* Breadcrumb */}
      <Breadcrumb
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand">Certificate Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Upload Certificate for each product</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search Farm..."
          value={searchQuery}
          onChange={(e) => updateFilters(setSearchQuery, e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:max-w-xs"
        />

        <div className="flex items-center gap-3">
          {/* Search button */}
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SearchIcon />
            <span>Search</span>
          </button>

          {/* Farm filter */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SortIcon />
            </div>
            <select
              value={farmFilter}
              onChange={(e) => updateFilters(setFarmFilter, e.target.value)}
              className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-8 text-sm font-medium text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SortIcon />
            </div>
            <select
              value={productFilter}
              onChange={(e) => updateFilters(setProductFilter, e.target.value)}
              className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-8 text-sm font-medium text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            {/* Top row: QR + Batch ID */}
            <div className="flex items-start justify-between">
              <QRCodeSVG value={product.batchId} size={48} className="shrink-0 rounded-md" />
              <span className="text-xs font-semibold text-orange-600">
                {product.batchId}
              </span>
            </div>

            {/* Product info */}
            <div className="mt-4">
              <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-gray-700">
                <span className="font-medium">{product.farm}</span>
                <span className="text-gray-400">→</span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{product.location}</p>
            </div>

            {/* Certificate badge */}
            <div className="mt-3 flex items-center gap-1.5 text-sm">
              <CertBadgeIcon />
              <span className="font-medium text-green-700">
                {product.metrics.certifications} Certificate{product.metrics.certifications !== 1 ? 's' : ''} Uploaded
              </span>
            </div>

            {/* Upload button */}
            <button
              type="button"
              onClick={() => openModal(product.id)}
              className="mt-4 h-10 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light"
            >
              Upload Certificate
            </button>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-gray-500">No products found</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`flex size-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === currentPage
                  ? 'bg-brand text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="flex size-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Certificate Upload Modal
          ═══════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            {/* Header */}
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Certificate Upload</h2>
                <p className="mt-0.5 text-sm text-gray-500">Upload your product certificate.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Row 1: Cert Type + Organisation */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="cert-type" className="block text-sm font-semibold text-gray-900">
                    Certification Type
                  </label>
                  <div className="relative">
                    <select
                      id="cert-type"
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    >
                      <option value="">Select a Certification Type</option>
                      {CERTIFICATION_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="cert-org" className="block text-sm font-semibold text-gray-900">
                    Certification Organisation
                  </label>
                  <input
                    id="cert-org"
                    type="text"
                    placeholder="e.g. Ekirin"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              {/* Row 2: Date Issued + Date Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="date-issued" className="block text-sm font-semibold text-gray-900">
                    Date Issued
                  </label>
                  <div className="relative">
                    <input
                      id="date-issued"
                      type="date"
                      value={dateIssued}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker()
                        } catch (err) {
                          // Ignore browsers that don't support showPicker
                        }
                      }}
                      onChange={(e) => setDateIssued(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="date-expiry" className="block text-sm font-semibold text-gray-900">
                    Date Expiry
                  </label>
                  <div className="relative">
                    <input
                      id="date-expiry"
                      type="date"
                      value={dateExpiry}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker()
                        } catch (err) {
                          // Ignore browsers that don't support showPicker
                        }
                      }}
                      onChange={(e) => setDateExpiry(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                </div>
              </div>

              {/* Upload Document */}
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Upload Document<span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 transition-colors ${dragOver
                    ? 'border-brand bg-green-50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                >
                  {uploadedFile ? (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{uploadedFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setUploadedFile(null)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center gap-2">
                      <UploadIcon />
                      <span className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </span>
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

              {/* Submit */}
              <button
                type="button"
                onClick={closeModal}
                className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light"
              >
                Save Crop Information
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
