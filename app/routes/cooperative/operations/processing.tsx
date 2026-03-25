import { useParams } from 'react-router'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { allCropCycles } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/processing'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Processing | Agrolinking' }]
}

export default function Processing() {
  const { cropCycleId } = useParams()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Processing')
  }

  return (
    <OperationFormLayout
      title="Processing"
      breadcrumbLabel="Processing"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Processing"
    >
      {/* 2-column: Operator & Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PersonField
          id="operator-name"
          label="Operator Name"
          defaultValue=""
          placeholder="Select operator"
          roleFilter="Operator"
        />
        <PersonField
          id="supervisor-name"
          label="Supervisor Name"
          defaultValue=""
          placeholder="Select supervisor"
          roleFilter="Supervisor"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Processing Type</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Milling</option>
              <option>Threshing</option>
              <option>Shelling</option>
              <option>De-husking</option>
              <option>Secondary Processing (e.g. Turning into flour)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Equipment Used</label>
          <input type="text" placeholder="e.g. Milling Machine Model X" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Input Quantity (kg)</label>
          <input type="text" placeholder="Weight before processing" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Output Quantity (kg)</label>
          <input type="text" placeholder="Weight after processing" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Processing Yield (%)</label>
          <input type="text" placeholder="Auto-calculate if possible" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50 focus:outline-none" readOnly />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Waste / By-product Quantity (kg)</label>
          <input type="text" placeholder="Quantity of bran, husks, etc." className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Processing Details <span className="text-red-500">*</span></label>
        <textarea rows={3} placeholder="Any specific details regarding the processing quality or issues encountered." className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" required />
      </div>
    </OperationFormLayout>
  )
}
