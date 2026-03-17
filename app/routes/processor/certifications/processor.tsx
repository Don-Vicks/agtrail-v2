import { useState } from 'react';
import { Breadcrumb } from '~/components/breadcrumb';

// ─── Mock Data ───
const mockProcessorCerts = [
  { id: '1', name: 'rainforest', desc: 'sdsd', type: 'System Certification', expires: 'Feb 25, 2026', status: 'active' },
  { id: '2', name: 'global_gap', desc: 'w', type: 'Safety Certification', expires: 'Feb 24, 2026', status: 'active' },
  { id: '3', name: 'ISO-233-2323', desc: 'Food Safety Certification', type: 'SON Nigeria', expires: 'Dec 12, 2026', status: 'active' },
]
function AddCertModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            <h2 className="text-xl font-bold text-gray-900">Add Certification</h2>
            <p className="text-sm text-gray-500 mt-1">Upload a new facility or processing certification</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Certification Type <span className="text-brand">*</span></label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand">
                <option>Select type</option>
              </select>
              <svg className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Certification Name <span className="text-brand">*</span></label>
            <input type="text" placeholder="e.g., ISO 22000:2018" className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Issuing Organization <span className="text-brand">*</span></label>
            <input type="text" placeholder="e.g., Bureau Veritas" className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Issue Date</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                <input type="text" placeholder="Pick date" className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Expiry Date</label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
                <input type="text" placeholder="Pick date" className="w-full rounded-md border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-sm font-semibold text-gray-900 mb-2 block">Certificate Document</span>
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:bg-gray-50 flex flex-col items-center justify-center">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-green-50 text-[#1b4332]">
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <div className="text-left flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">Choose File</span>
                  <span className="text-sm text-gray-500">No file chosen</span>
                </div>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500">PDF, JPG, or PNG (max 10MB)</p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
          <button onClick={onClose} className="rounded-md px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button onClick={onClose} className="rounded-md bg-[#1b4332] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f2e20] transition-colors">
            Upload Certification
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProcessorCertifications() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="pb-10">
      <div className="mb-6">
        <Breadcrumb
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
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand">Processor Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your facility and processing certifications</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1b4332] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Certification
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search certifications..."
            className="w-full rounded-md border border-gray-200 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            Search
          </button>

          <div className="relative">
            <select className="w-[160px] appearance-none rounded-md border border-gray-200 bg-white px-9 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-brand outline-none hover:bg-gray-50">
              <option>All Types</option>
            </select>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>

          <div className="relative">
            <select className="w-[160px] appearance-none rounded-md border border-gray-200 bg-white px-9 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-brand outline-none hover:bg-gray-50">
              <option>All Statuses</option>
            </select>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProcessorCerts.map(cert => (
          <div key={cert.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#f1f8e9] text-brand">
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] px-2.5 py-0.5 text-[11px] font-bold lowercase tracking-wide rounded-full">
                {cert.status}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 mb-2 truncate">{cert.name}</h3>

            <div className="text-sm text-gray-500 mb-4 flex items-start gap-2 h-10">
              <svg className="size-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="line-clamp-2">{cert.desc}</span>
            </div>

            {cert.expires && (
              <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Expires: {cert.expires}
              </div>
            )}
            {!cert.expires && (
              <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                {cert.type}
              </div>
            )}

            <div className="mt-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                View Document
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500">
        <span>3 certification(s) total</span>
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

      <AddCertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
