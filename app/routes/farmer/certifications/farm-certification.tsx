import { useCallback, useMemo, useState } from 'react'
import { Link } from 'react-router'

import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { farms, products } from '~/lib/mock-data/farmer'
import type { Route } from './+types/farm-certification'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Certification | Agtrail' },
    { name: 'description', content: 'Upload certificates for your farms' },
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

/* ─── Additional Icons ─── */
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
    <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  )
}

const ITEMS_PER_PAGE = 6

/* ─── Page Component ─── */
export default function FarmCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique owners
  const owners = useMemo(() => {
    const names = new Set(farms.map((f) => f.owner))
    return Array.from(names).sort()
  }, [])

  // Filter farms
  const filteredFarms = useMemo(() => {
    return farms.filter((f) => {
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesOwner = !ownerFilter || f.owner === ownerFilter
      return matchesSearch && matchesOwner
    })
  }, [searchQuery, ownerFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredFarms.length / ITEMS_PER_PAGE))
  const paginatedFarms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFarms.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFarms, currentPage])

  const openModal = useCallback((farmId: string) => {
    setSelectedFarmId(farmId)
    setCertType('')
    setCertOrg('')
    setDateIssued('')
    setDateExpiry('')
    setUploadedFile(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedFarmId(null)
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
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/farmer" className="flex items-center gap-1 hover:text-gray-900">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
          Dashboard
        </Link>
        <span>›</span>
        <span className="text-gray-900">Farm Certification</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand">Certificate Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Upload Certificate for farm</p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex flex-1 items-center max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search Farm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <SearchIcon />
            Search
          </button>

          {/* Settings/Sort button */}
          <button className="flex h-10 size-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">
            <SortIcon />
          </button>

          {/* Owner Filter */}
          <div className="relative">
            <select
              value={ownerFilter}
              onChange={(e) => {
                setOwnerFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              <option value="">All Owners</option>
              {owners.map((ow) => (
                <option key={ow} value={ow}>{ow}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Farm Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedFarms.map((farm) => {
          // Compute crops cultivated dynamically mapping from product mock data
          const relatedProducts = products.filter(p => p.farm === farm.name)
          const cropsCultivatedCount = relatedProducts.length

          // Mocking certifications based on the mock data
          const certificationsUploaded = Math.floor(farm.hectares % 2) // Just a visual mock like the screenshot 0s and 1s

          return (
            <div
              key={farm.id}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
            >
              {/* Header: Icon & Hectares */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-14 items-center justify-center rounded-lg bg-brand">
                  <HomeIcon />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-orange-500">
                    {farm.hectares.toFixed(1)} Hectares
                  </span>
                </div>
              </div>

              {/* Farm Title & Location */}
              <div className="mb-4 space-y-1">
                <h3 className="line-clamp-1 text-xl font-bold text-gray-900 group-hover:text-brand">
                  {farm.name}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <p className="line-clamp-1 truncate">{farm.location || 'Location Not Specified'}</p>
                  <svg className="size-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>

              {/* Stats & Badge */}
              <div className="mb-6 space-y-3">
                <p className="text-sm text-gray-600">
                  {cropsCultivatedCount} Crops Cultivated
                </p>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-brand ring-1 ring-inset ring-brand/20">
                  <CertBadgeIcon />
                  {certificationsUploaded} Certificates Uploaded
                </div>
              </div>

              {/* Upload Button */}
              <button
                onClick={() => openModal(farm.id)}
                className="mt-auto w-full rounded-lg border border-brand/40 bg-white py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                Upload Certificate
              </button>
            </div>
          )
        })}
      </div>

      {filteredFarms.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-gray-500">No farms matched your search.</p>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredFarms.length)} of {filteredFarms.length} item(s) selected.
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Rows per page</span>
              <div className="relative">
                <select className="h-8 appearance-none rounded-md border border-gray-200 bg-white px-2 py-1 pr-6 focus:border-brand focus:outline-none">
                  <option>6</option>
                  <option>12</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg className="size-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <span className="text-gray-600">Page {currentPage} of {totalPages}</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════
          Certificate Upload Modal
          ═══════════════════════════════════════════ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Certificate Upload</h2>
                <p className="mt-1 text-sm text-gray-500">Upload your farm certificate.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-5">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="date-issued" className="block text-sm font-semibold text-gray-900">
                    Date Issued
                  </label>
                  <input
                    id="date-issued"
                    type="date"
                    value={dateIssued}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker()
                      } catch (err) { }
                    }}
                    onChange={(e) => setDateIssued(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="date-expiry" className="block text-sm font-semibold text-gray-900">
                    Date Expiry
                  </label>
                  <input
                    id="date-expiry"
                    type="date"
                    value={dateExpiry}
                    onClick={(e) => {
                      try {
                        e.currentTarget.showPicker()
                      } catch (err) { }
                    }}
                    onChange={(e) => setDateExpiry(e.target.value)}
                    className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-900">
                  Upload Document<span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 transition-colors ${dragOver
                    ? 'border-brand bg-brand/5'
                    : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50'
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
                    <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                      <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5">
                        <UploadIcon />
                      </div>
                      <span className="text-sm font-medium text-brand hover:text-brand-light">Click to upload</span>
                      <span className="text-xs text-gray-500">or drag and drop</span>
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
                onClick={closeModal}
                className="mt-2 h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light active:scale-[0.98]"
              >
                Save Farm Certification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
