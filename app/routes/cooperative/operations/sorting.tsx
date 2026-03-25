import { useParams } from 'react-router'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { allCropCycles } from '~/lib/mock-data/cooperative'
import type { Route } from './+types/sorting'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Sorting & Grading | Agrolinking' }]
}

export default function SortingAndGrading() {
  const { cropCycleId } = useParams()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted Sorting & Grading')
  }

  return (
    <OperationFormLayout
      title="Sorting & Grading"
      breadcrumbLabel="Sorting & Grading"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Sorting & Grading"
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
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Total Weight Sorted (kg)</label>
          <input type="text" placeholder="Enter weight in kg" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Grade Categories</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" multiple>
              <option>Grade A (Premium)</option>
              <option>Grade B (Standard)</option>
              <option>Grade C (Lower Quality)</option>
              <option>Rejects</option>
            </select>
            <p className="mt-1 text-[10px] text-gray-400">Hold Ctrl/Cmd to select multiple</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Sorting Method</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Manual Sorting</option>
              <option>Mechanical Sorting</option>
              <option>Color Sorting (Optical)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Rejected (kg)</label>
          <input type="text" placeholder="Enter weight of rejects" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Sorting Observations <span className="text-red-500">*</span></label>
        <textarea rows={3} placeholder="Record any observations about crop quality, size distribution, etc." className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" required />
      </div>
    </OperationFormLayout>
  )
}
