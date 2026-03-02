import { useParams } from 'react-router'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { allCropCycles } from '~/lib/mock-data/farmer'
import type { Route } from './+types/fertilizer'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Fertilizer Application | Agrolinking' }]
}

export default function Fertilizer() {
  const { cropCycleId } = useParams()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Fertilizer')
  }

  return (
    <OperationFormLayout
      title="Fertilizer Application"
      breadcrumbLabel="Fertilizer Application"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Fertilizer Application"
    >
      {/* 2-column: Operator & Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Operator Name</label>
          <input type="text" placeholder="Select or enter operator name" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Supervisor Name</label>
          <input type="text" placeholder="Select or enter supervisor name" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Fertilizer Type <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Fertilizer Type</option><option>Organic (e.g., Manure, Compost)</option><option>Inorganic (e.g., NPK, Urea)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Brand / Product Name</label>
          <input type="text" placeholder="e.g., NPK 15-15-15, Urea, etc." className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Composition / Nutrient Content (N-P-K)</label>
          <input type="text" placeholder="e.g., 15-15-15" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          <p className="mt-1 text-xs text-gray-400">Enter N-P-K ratio (e.g., 15-15-15 for balanced NPK)</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Applied <span className="text-red-500">*</span></label>
          <input type="text" required placeholder="Enter quantity" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Unit <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Unit</option><option>kg</option><option>Liters</option><option>Bags</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Application Method <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Application Method</option><option>Broadcasting</option><option>Spot Application</option><option>Foliar Spray</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Growth Stage of Crop <span className="text-red-500">*</span></label>
        <div className="relative">
          <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
            <option value="">Select Growth Stage</option><option>Pre-planting</option><option>Vegetative</option><option>Flowering/Fruiting</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Description <span className="text-red-500">*</span></label>
        <textarea rows={3} required placeholder="Describe the fertilizer application... (e.g., Applied NPK fertilizer to maize field)" className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
      </div>
    </OperationFormLayout>
  )
}
