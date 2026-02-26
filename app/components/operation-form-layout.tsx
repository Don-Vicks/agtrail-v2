import { useNavigate } from 'react-router'
import { Breadcrumb } from '~/components/breadcrumb'
import type { CropCycle } from '~/lib/mock-data/farmer'

interface OperationFormLayoutProps {
  title: string
  cropCycle: CropCycle
  breadcrumbLabel: string
  children: React.ReactNode
  onSubmit: (e: React.FormEvent) => void
  submitLabel: string
  organicWarning?: string
}

export function OperationFormLayout({
  title,
  cropCycle,
  breadcrumbLabel,
  children,
  onSubmit,
  submitLabel,
  organicWarning,
}: OperationFormLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
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
          { label: 'Record Operation', href: '/farmer/operations/new' },
          { label: breadcrumbLabel },
        ]}
      />

      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate('/farmer/operations/new')}
          className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Crop Cycles
        </button>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold uppercase text-[#2b5314] tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">Record farm operation details</p>
      </div>

      {/* Operation Context Card */}
      <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A]">OPERATION CONTEXT</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Crop Cycle */}
          <div className="rounded-xl bg-[#F8FCF9] p-5">
            <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">CROP CYCLE</p>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-base font-bold text-gray-900">{cropCycle.productName}</span>
              <span className="flex items-center gap-1 rounded-full border border-green-200 bg-[#Edf8f0] px-2 py-[2px] text-[10px] font-medium text-[#166534]">
                <svg className="size-2.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C22 3 21 8 17 8ZM11.95 18C9.52 18 7.15 17 5.25 15.34C6.56 12.3 9.4 6 20 5C19.78 12.06 16.57 18 11.95 18Z" />
                </svg>
                Organic
              </span>
            </div>
            <p className="mb-4 text-xs font-normal text-gray-500">Variety: <span className="font-semibold text-gray-900">{cropCycle.variety || 'N/A'}</span></p>
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs text-gray-500">
              <span className="font-normal">Planted:</span><span className="text-right font-semibold text-gray-900">{cropCycle.plantedDate || 'N/A'}</span>
              <span className="font-normal">Area:</span><span className="text-right font-semibold text-gray-900">{cropCycle.area} hectares</span>
              <span className="font-normal">Season:</span><span className="text-right font-semibold text-gray-900">{cropCycle.season ? cropCycle.season.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'}</span>
            </div>
          </div>

          {/* Farm */}
          <div className="rounded-xl bg-[#F8F9FD] p-5">
            <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">FARM</p>
            <p className="text-base font-bold text-gray-900">{cropCycle.farmName}</p>
            <p className="mt-1 text-sm font-normal text-gray-600">{cropCycle.farmLocation || 'Bagary Coconot Area'}</p>
          </div>

          {/* Farmer */}
          <div className="rounded-xl bg-[#FDFCF6] p-5">
            <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">FARMER</p>
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm" style={{ backgroundColor: cropCycle.farmerColor || '#1B5E20' }}>
                {cropCycle.farmerInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{cropCycle.farmer}</p>
                <p className="text-[10px] font-normal text-gray-500">3cf2b8af-478b-4c40-b99d-a7f303dce8a1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Organic Warning Banner */}
        {organicWarning && (
          <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3">
            <p className="text-sm font-medium text-[#166534]">{organicWarning}</p>
          </div>
        )}

        {/* Specific Form Fields */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Common Footer Sections */}
        <div className="space-y-6 border-t border-gray-100 pt-6">
          {/* Energy & Waste */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">Do you use renewable energy?</label>
              <select className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>No - Traditional energy</option>
                <option>Yes - Solar</option>
                <option>Yes - Wind</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-gray-900">What is your main energy source?</label>
              <select className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>Select energy source</option>
                <option>Grid Electricity</option>
                <option>Diesel Generator</option>
              </select>
            </div>
          </div>

          {/* Weather Conditions */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Weather Conditions</h3>
              <button type="button" className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-[#1f3c0f] transition-colors">
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Refresh
              </button>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="mb-4 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Temperature</p>
                  <p className="font-semibold text-gray-900">34°C</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Humidity</p>
                  <p className="font-semibold text-gray-900">13%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Wind</p>
                  <p className="font-semibold text-gray-900">10 km/h</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-500">Source</p>
                  <p className="font-semibold text-gray-900">Farm coordinates</p>
                </div>
              </div>
              <select className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
              </select>
            </div>
          </div>

          {/* Area & Cost */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Area Covered (hectares)</label>
              <div className="mb-2 flex items-center gap-2">
                <button type="button" className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3.5 py-1.5 text-sm font-medium text-[#2563EB] hover:bg-blue-100 transition-colors">
                  Use crop cycle area ({cropCycle.area} ha)
                </button>
                <button type="button" className="rounded-full border border-[#bbf7d0] bg-white px-3.5 py-1.5 text-sm font-medium text-[#16A34A] hover:bg-green-50 transition-colors">
                  Use full farm area
                </button>
                <button type="button" className="flex items-center gap-1.5 rounded-full border border-[#fbd5a1] bg-[#FFF7ED] px-3.5 py-1.5 text-sm font-medium text-[#EA580C] hover:bg-orange-100 transition-colors">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  Draw custom area
                </button>
              </div>
              <input type="text" placeholder="Enter area in hectares" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">Cost (₦)</label>
              <input type="text" placeholder="Enter cost" className="mt-7 w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Additional Notes</label>
            <textarea rows={3} placeholder="Any additional observations..." className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
          </div>

          {/* Submit */}
          <button type="submit" className="w-full rounded-lg bg-[#2b5314] py-3 text-sm font-bold text-white hover:bg-[#1f3c0f] shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-brand/20">
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  )
}
