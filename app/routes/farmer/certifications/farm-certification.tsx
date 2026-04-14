import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { usePostCertificationsUpload } from '~/lib/api/generated/certifications/certifications'
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
    <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

const ITEMS_PER_PAGE = 10

/* ─── Page Component ─── */
export default function FarmCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)

  const { data: farmsResp, isLoading: isLoadingFarms } = useGetFarms()
  const apiFarms = useMemo(() => farmsResp?.data?.data || [], [farmsResp])

  const { data: productsResp } = useGetFarmersProducts()
  const apiProducts = useMemo(() => productsResp?.data?.data || [], [productsResp])

  const uiFarms = useMemo(() => {
    return apiFarms.map((f: any) => ({
      id: f.id,
      name: f.name || 'Unnamed Farm',
      owner: f.owner || 'Unknown Owner',
      location: f.lga || f.region || 'Location Not Specified',
      hectares: Number(f.sizeHectares) || 0,
    }))
  }, [apiFarms])

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique owners
  const owners = useMemo(() => {
    const names = new Set(uiFarms.map((f) => f.owner))
    return Array.from(names).sort()
  }, [uiFarms])

  // Filter farms
  const filteredFarms = useMemo(() => {
    return uiFarms.filter((f) => {
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesOwner = !ownerFilter || f.owner === ownerFilter
      return matchesSearch && matchesOwner
    })
  }, [uiFarms, searchQuery, ownerFilter])

  // Pagination
  const totalItems = filteredFarms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
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

  const { mutate: uploadCert, isPending: isUploading } = usePostCertificationsUpload()

  const handleUpload = () => {
    if (!selectedFarmId || !certType) {
      alert('Please fill down required fields (Certification Type, Farm)')
      return
    }

    uploadCert(
      {
        data: {
          certificationTypeId: certType,
          certifiedEntityType: 'farm',
          farmId: selectedFarmId,
          certificateNumber: certOrg, // using certOrg input temporarily for cert number/name since schema lacks both
          issueDate: dateIssued ? new Date(dateIssued).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          expiryDate: dateExpiry ? new Date(dateExpiry).toISOString().split('T')[0] : undefined,
          documentUrl: 'https://example.com/certificate.pdf', // Dummy document upload string
        },
      },
      {
        onSuccess: () => {
          closeModal()
          // Optionally refetch certifications or show toast
        },
        onError: (err) => {
          console.error('Failed to upload', err)
          alert('Failed to upload certification')
        }
      }
    )
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
          { label: 'Farm Certification' },
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h1>
        <p className="mt-1 text-sm text-gray-500">Upload Certificate for farm</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search Farm..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-bold"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-bold">
            <SearchIcon />
            Search
          </button>

          {/* <div className="relative">
            <select
              value={ownerFilter}
              onChange={(e) => {
                setOwnerFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All Owners</option>
              {owners.map((ow) => (
                <option key={ow} value={ow}>{ow}</option>
              ))}
            </select>
            <ChevronDown />
          </div> */}
        </div>
      </div>

      {/* Farm Grid */}
      {isLoadingFarms ? (
        <div className="py-12 text-center text-sm font-medium text-gray-500">Loading farms...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedFarms.map((farm) => {
            const cropsCultivatedCount = apiProducts.filter((p: any) => p.farmId === farm.id).length
            const certsCount = 0 // Update when certifications model has farm linkages

            return (
              <div
                key={farm.id}
                className="group flex flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="flex size-14 items-center justify-center rounded-lg bg-brand shadow-lg shadow-brand/10">
                    <HomeIcon />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                    {farm.hectares.toFixed(1)} Hectares
                  </span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <h3 className="line-clamp-1 text-xl font-bold text-gray-900 leading-none group-hover:text-brand transition-colors">
                    {farm.name}
                  </h3>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-brand transition-colors text-left"
                  >
                    {farm.location}
                    <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    {cropsCultivatedCount} Crops Cultivated
                  </p>
                  <div className="inline-flex max-w-fit items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                    <CertBadgeIcon />
                    {certsCount} Certificates Uploaded
                  </div>
                </div>

                <button
                  onClick={() => openModal(farm.id)}
                  className="mt-8 flex h-11 w-full items-center justify-center rounded-md border border-gray-200 bg-white py-2.5 text-sm font-bold text-brand transition-all hover:bg-brand hover:text-white hover:border-brand shadow-sm shadow-gray-100"
                >
                  Upload Certificate
                </button>
              </div>
            )
          })}
        </div>
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
                  <h2 className="text-xl font-bold text-brand uppercase tracking-tight">Add Certification</h2>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">Upload a new farm certification.</p>
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      id="cert-type"
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                    >
                      <option value="">Select type</option>
                      {CERTIFICATION_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <ChevronDown />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Name <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="e.g., GLOBALG.A.P." className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Issuing Organization <span className="text-red-500">*</span></label>
                <input
                  id="cert-org"
                  type="text"
                  placeholder="e.g., Bureau Veritas"
                  value={certOrg}
                  onChange={(e) => setCertOrg(e.target.value)}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                />
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
                className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white shadow-lg shadow-brand/10 transition-all hover:bg-brand-dark hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isUploading ? 'Saving...' : 'Save Farm Certification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
