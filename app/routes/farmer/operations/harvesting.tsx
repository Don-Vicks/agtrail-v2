import { useParams } from 'react-router'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { allCropCycles } from '~/lib/mock-data/farmer'
import type { Route } from './+types/harvesting'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Harvesting | Agrolinking' }]
}

export default function Harvesting() {
  const { cropCycleId } = useParams()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Harvesting')
  }

  // Harvesting requires hiding some common bottom fields and appending its own. 
  // We'll pass children, but the Figma shows it has its own Weather Conditions/Costs/Inputs BEFORE the bottom. 
  // BUT Figma also shows Area Covered/Cost/Weather/Energy right after description. 
  // Let's use the layout but pass specific children to match the harvesting flow.

  return (
    <OperationFormLayout
      title="Harvesting"
      breadcrumbLabel="Harvesting"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Harvesting Operation"
      organicWarning="This is an organic crop cycle."
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Harvested</label>
          <input type="text" placeholder="Enter Quantity Harvested" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Unit</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option value="">Select Unit</option><option>kg</option><option>tons</option><option>bags</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Is this a partial or final harvest?</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select</option><option>Partial</option><option>Final</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Harvesting Method</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option value="">Select Harvesting Method</option><option>Manual</option><option>Mechanical</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Initial Quality Assessment</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Quality</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Post-Harvest Handling</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option value="">Select Post-Harvest Handling</option><option>Dried</option><option>Stored locally</option><option>Transported immediately</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Description <span className="text-red-500">*</span></label>
        <textarea rows={3} required placeholder="Describe the harvesting operation... (e.g., Harvested maize from the northern section of the farm)" className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Equipment Used</label>
          <input type="text" placeholder="e.g., Harvester, Sickle, Baskets (comma-separated)" className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
          <p className="mt-1 text-xs text-gray-500">Separate multiple items with commas</p>
        </div>
        {/* Area is handled by layout now... BUT the design for Harvesting shows Equipment next to Area Covered. We will just use the Layout's area for now to keep things DRY unless strict overrides are required */}
      </div>

    </OperationFormLayout>
  )
}
