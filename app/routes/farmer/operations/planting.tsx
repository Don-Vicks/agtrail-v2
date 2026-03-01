import { useParams } from 'react-router'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { allCropCycles } from '~/lib/mock-data/farmer'
import type { Route } from './+types/planting'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Planting | Agrolinking' }]
}

export default function Planting() {
  const { cropCycleId } = useParams()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Planting')
  }

  return (
    <OperationFormLayout
      title="Planting"
      breadcrumbLabel="Planting"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Planting Operation"
      organicWarning={cropCycle.status === 'planning' ? 'This is an organic crop cycle. Non-organic seed selections may trigger warnings.' : undefined}
    >
      {/* 2-column: Operator & Supervisor */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Operator Name</label>
          <input type="text" placeholder="Select or enter operator name" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Supervisor Name</label>
          <input type="text" placeholder="Select or enter supervisor name" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      {/* Seed Details Component Section */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Seed Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Seed Source</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>Select seed source</option><option>Certified Seed Dealer</option><option>Saved Seed</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Brand / Supplier Name</label>
            <input type="text" placeholder="Enter Supplier Name" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Variety Name</label>
            <input type="text" placeholder="Enter variety name" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Batch Number</label>
            <input type="text" placeholder="Enter Batch Number" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Seed Certification Status</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Select Seed Certification Status</option><option>Certified Organic</option><option>Conventional</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      {/* Planting Method Section */}
      <div className="space-y-4 pt-4">
        <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Planting Method & Density</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Planting Method</label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>Select Planting Method</option><option>Direct Seeding</option><option>Transplanting</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Planting Spacing / Density (cm)</label>
            <input type="text" placeholder="e.g., 75cm x 25cm" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Seeding Rate (seeds/m²)</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Select Seeding Rate</option><option>Low Density (1-5)</option><option>High Density (5+)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Description <span className="text-red-500">*</span></label>
        <textarea rows={3} required placeholder="Describe the planting operation... (e.g., Planted maize seeds using manual broadcasting method)" className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
      </div>
    </OperationFormLayout>
  )
}
