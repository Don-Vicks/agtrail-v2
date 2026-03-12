import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Link } from 'react-router'

// ─── Mock Data ───
const mockProductCerts = [
  { id: '1', batchId: 'BATCH-PB-20260120-0011', name: 'Bera Flour', type: 'Processed Product', certCount: 0 },
  { id: '2', batchId: 'BATCH-PB-20251215-0010', name: 'Tomatoe', type: 'Processed Product', certCount: 0 },
  { id: '3', batchId: 'BATCH-PB-1765021676170', name: 'Tomatoe', type: 'Processed Product', certCount: 0 },
  { id: '4', batchId: 'PB-1764513448874', name: 'Canned Beans', type: 'Processed Product', certCount: 0 },
]

// ─── Shared Components ───

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/processor" className="flex items-center gap-1 hover:text-gray-900 transition-colors">
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Dashboard
      </Link>
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      <span className="text-gray-900 font-medium">Product Quality Certification</span>
    </div>
  )
}

function UploadCertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight border-b-2 border-transparent inline-block">Certificate Upload</h2>
            <p className="text-sm text-gray-500 mt-1">Upload your product certificate.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Certification Type</label>
              <div className="relative">
                <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                  <option>Select a Certification Type</option>
                </select>
                <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Certification Organisation</label>
              <input type="text" placeholder="Ekirin" className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Date Issued</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                <input type="text" placeholder="Pick a date" className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Date Expiry</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                <input type="text" placeholder="Pick a date" className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-sm font-semibold text-gray-900 mb-2 block">Upload Document<span className="text-brand">*</span></span>
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:bg-gray-50 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="text-brand">
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-sm text-gray-500">
                  Click to upload or drag and drop
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center pt-2">
          <button onClick={onClose} className="rounded-md bg-[#1b4332] px-8 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0f2e20] transition-colors">
            Save Crop Information
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <Breadcrumb />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand">Certificate Upload</h1>
        <p className="text-sm text-gray-500 mt-1">Upload Certificate for each product</p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between">
        <div className="w-[300px] relative">
          <input
            type="text"
            placeholder="Search Farm..."
            className="w-full rounded-md border border-gray-200 px-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-md bg-white text-gray-500 hover:text-gray-700 shadow-sm">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            </button>
            <div className="relative">
              <select className="w-[160px] appearance-none rounded-md border border-gray-200 bg-white pl-4 pr-9 py-2 text-sm font-medium text-gray-700 shadow-sm focus:border-brand outline-none hover:bg-gray-50">
                <option>All Products</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockProductCerts.map(cert => (
          <div key={cert.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-6">
              <div className="rounded-lg overflow-hidden border border-gray-100 p-1">
                <QRCodeSVG
                  value={`https://agrolinking.com/product/${cert.id}`}
                  size={80}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <span className="text-xs font-bold text-[#e65100]">
                {cert.batchId}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-gray-900 mb-1">{cert.name}</h3>
            <p className="text-sm text-gray-500 font-medium mb-3">{cert.type}</p>

            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 bg-[#e8f5e9] text-[#2e7d32] px-2.5 py-1 text-xs font-bold rounded-full">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {cert.certCount} Certificates Uploaded
              </span>
            </div>

            <div className="mt-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b4332] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Upload Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 mb-6">
        <span>0 of 4 row(s) selected.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2">
            Rows per page
            <div className="relative">
              <select className="appearance-none border border-gray-200 rounded py-1 pl-3 pr-7 bg-white outline-none focus:border-brand shadow-sm hover:bg-gray-50">
                <option>10</option>
              </select>
              <svg className="absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </span>
          <span>Page 1 of 1</span>
          <div className="flex items-center gap-1">
            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800 bg-white shadow-sm"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg></button>
            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800 bg-white shadow-sm"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800 bg-white shadow-sm"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
            <button className="p-1 border border-gray-200 rounded text-gray-400 hover:text-gray-800 bg-white shadow-sm"><svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7" /></svg></button>
          </div>
        </div>
      </div>

      <UploadCertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
