import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'

// ─── Mock Data ───
const mockProductCerts = [
  { id: '1', batchId: 'BATCH-PB-20260120-0011', name: 'Bera Flour', type: 'Processed Product', certCount: 0 },
  { id: '2', batchId: 'BATCH-PB-20251215-0010', name: 'Tomatoe', type: 'Processed Product', certCount: 0 },
  { id: '3', batchId: 'BATCH-PB-1765021676170', name: 'Tomatoe', type: 'Processed Product', certCount: 0 },
  { id: '4', batchId: 'PB-1764513448874', name: 'Canned Beans', type: 'Processed Product', certCount: 0 },
]

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
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}

function UploadCertModal({ isOpen, onClose, batchId }: { isOpen: boolean; onClose: () => void, batchId: string | null }) {
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

      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-brand uppercase tracking-tight">Certificate Upload</h2>
              <p className="mt-0.5 text-xs font-medium text-gray-500">Upload your product quality certificate.</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Type <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all">
                  <option value="">Select a Type</option>
                  {CERTIFICATION_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <ChevronDown />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Certification Organisation <span className="text-red-500">*</span></label>
              <input type="text" placeholder="e.g., NAFDAC" className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-bold" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Date Issued</label>
              <DatePicker
                value={dateIssued}
                onChange={setDateIssued}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Date Expiry</label>
              <DatePicker
                value={dateExpiry}
                onChange={setDateExpiry}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">Upload Document<span className="text-red-500">*</span></label>
            <div
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 transition-all cursor-pointer ${dragOver ? 'border-brand bg-brand/5 scale-[1.01]' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-white'}`}
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

          <button onClick={onClose} className="mt-2 flex h-12 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white shadow-lg shadow-brand/10 transition-all hover:bg-brand-dark hover:-translate-y-0.5">
            Save Product Certification
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  const openModal = (batchId: string) => {
    setSelectedBatchId(batchId)
    setIsModalOpen(true)
  }

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
        <p className="mt-1 text-sm text-gray-500 font-medium">Upload Certificate for each product</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search Farm..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-sm font-medium placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-200 bg-white px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <SearchIcon />
            Search
          </button>
          <div className="relative">
            <select className="h-10 appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-10 text-sm font-bold text-gray-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-bold">
              <option>All Products</option>
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProductCerts.map(cert => (
          <div key={cert.id} className="group rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="rounded-md border border-gray-100 p-1.5 bg-white shadow-sm ring-1 ring-gray-900/5">
                <QRCodeSVG value={cert.batchId} size={70} />
              </div>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest leading-none">
                {cert.batchId}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-brand transition-colors">{cert.name}</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{cert.type}</p>

            <div className="mt-5 mb-6 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] font-bold text-green-700 uppercase tracking-wide">
                <CertBadgeIcon />
                {cert.certCount} Certificates Uploaded
              </div>
            </div>

            <button
              onClick={() => openModal(cert.batchId)}
              className="mt-auto flex h-11 w-full items-center justify-center rounded-md bg-[#1b4332] text-sm font-bold text-white transition-all hover:bg-brand-dark shadow-sm shadow-brand/10 hover:-translate-y-0.5"
            >
              Upload Certificate
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-2 text-xs font-medium text-gray-500 mb-10">
        <span>0 of {mockProductCerts.length} row(s) selected.</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <span>Rows per page</span>
             <div className="relative">
               <select className="h-8 appearance-none rounded-md border border-gray-200 bg-white pl-3 pr-8 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all font-bold outline-none">
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

      <UploadCertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} batchId={selectedBatchId} />
    </div>
  )
}
