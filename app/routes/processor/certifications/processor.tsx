import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { DatePicker } from '~/components/ui/date-picker'
import { useGetCertifications } from '~/lib/api/generated/certifications/certifications'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'

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

function ProcessorIcon() {
  return (
    <svg className="size-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15" />
    </svg>
  )
}

function AddCertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-md bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand uppercase tracking-tight">Add Certification</h2>
              <p className="mt-0.5 text-xs font-medium text-gray-500">Upload a new facility or processing certification.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all">
                  <option value="">Select type</option>
                  {CERTIFICATION_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <ChevronDown />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., ISO 22000:2018" className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Issuing Organization <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g., Bureau Veritas" className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Issue Date</label>
              <DatePicker
                value={dateIssued}
                onChange={setDateIssued}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Expiry Date</label>
              <DatePicker
                value={dateExpiry}
                onChange={setDateExpiry}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certificate Document<span className="text-red-500">*</span></label>
            <div
              className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-8 transition-all cursor-pointer ${dragOver ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'}`}
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
                    <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }} className="text-gray-400 hover:text-red-500 transition-colors">
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
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                </label>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
            <button onClick={onClose} className="h-11 px-6 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-md transition-colors">Cancel</button>
            <button onClick={onClose} className="h-11 px-8 rounded-md bg-[#1b4332] text-sm font-bold text-white shadow-lg shadow-brand/10 transition-all hover:bg-brand-dark hover:-translate-y-0.5">Upload Certification</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProcessorCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { data: certsResp, isLoading } = useGetCertifications()

  const certifications = useMemo(() => {
    const raw = certsResp?.data?.data
    if (!Array.isArray(raw)) return []

    const formatDate = (value: unknown) => {
      if (typeof value !== 'string' || !value) return 'N/A'
      const d = new Date(value)
      if (Number.isNaN(d.getTime())) return 'N/A'
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const mapStatus = (status: string, expiryDate: unknown) => {
      const normalized = (status || '').toLowerCase()
      if (normalized.includes('expire')) return 'expired'
      if (normalized.includes('pending') || normalized.includes('review')) return 'pending'
      if (normalized.includes('active') || normalized.includes('valid') || normalized.includes('approved')) return 'active'
      if (typeof expiryDate === 'string' && expiryDate) {
        const expiryMs = new Date(expiryDate).getTime()
        if (!Number.isNaN(expiryMs) && expiryMs < Date.now()) return 'expired'
      }
      return 'pending'
    }

    return raw.map((cert: any) => ({
      id: cert.id,
      name: cert.certificationType || 'Unknown Certification',
      desc: cert.certifyingBody || cert.entityType || 'Certification record',
      type: cert.entityType || 'General',
      expires: formatDate(cert.expiryDate),
      status: mapStatus(cert.status, cert.expiryDate),
      documentUrl: cert.documentUrl || null,
    }))
  }, [certsResp])

  const filteredCerts = useMemo(() => {
    return certifications.filter((cert) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        !query ||
        cert.name.toLowerCase().includes(query) ||
        cert.desc.toLowerCase().includes(query) ||
        cert.type.toLowerCase().includes(query)

      const matchesType =
        !typeFilter || cert.type.toLowerCase() === typeFilter.toLowerCase()
      const matchesStatus = !statusFilter || cert.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [certifications, searchQuery, statusFilter, typeFilter])

  const typeOptions = useMemo(() => {
    const set = new Set(certifications.map((c) => c.type).filter(Boolean))
    return Array.from(set)
  }, [certifications])

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
          { label: 'Processor Certifications' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand uppercase tracking-tight">Processor Certifications</h1>
          <p className="text-sm text-gray-500 mt-1 font-medium">Manage your facility and processing certifications</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1b4332] px-6 text-sm font-bold text-white shadow-lg shadow-brand/10 hover:bg-brand-dark transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          Add Certification
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <SearchIcon />
            Search
          </button>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All Types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-md border border-gray-100 bg-white p-6 shadow-sm animate-pulse h-72" />
          ))
        ) : filteredCerts.map(cert => (
          <div key={cert.id} className="group flex flex-col rounded-md border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="mb-5 flex items-start justify-between">
              <div className="flex size-14 items-center justify-center rounded-md bg-brand shadow-lg shadow-brand/10">
                <ProcessorIcon />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700 uppercase tracking-wide">
                <CertBadgeIcon />
                {cert.status}
              </span>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="line-clamp-1 text-xl font-bold text-gray-900 leading-none group-hover:text-brand transition-colors lowercase first-letter:uppercase">
                {cert.name}
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{cert.type}</p>
              <div className="flex items-start gap-2 text-sm text-gray-500 font-medium h-10 mt-1">
                <svg className="size-4 shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                <span className="line-clamp-2">{cert.desc}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 border-t border-gray-50 pt-4">
                <svg className="size-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Expires: {cert.expires}
              </div>
              <button
                disabled={!cert.documentUrl}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-bold text-gray-700 transition-all hover:bg-brand hover:text-white hover:border-brand shadow-sm disabled:opacity-50 disabled:pointer-events-none"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                View Document
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2 text-xs font-medium text-gray-500">
        <span>{filteredCerts.length} certification(s) total</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span>Rows per page</span>
            <div className="relative">
              <select className="h-8 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all">
                <option>10</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg className="size-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </div>
            </div>
          </div>
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button className="size-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg></button>
            <button className="size-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 disabled:opacity-50 hover:bg-gray-50 transition-colors"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg></button>
          </div>
        </div>
      </div>

      <AddCertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
