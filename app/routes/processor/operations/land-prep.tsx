import { useState } from 'react'
import { toast } from 'sonner'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { OperationFormError, OperationFormLoading } from '~/components/operation-form-load-state'
import { useFarmOperationPage } from '~/hooks/use-farm-operation-page'
import type { FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { Route } from './+types/land-prep'

const OPERATION_SLUG = 'land-prep' as FarmOperationRouteSlug

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Land Preparation | Agrolinking' }]
}

export default function LandPreparation() {
  const { layoutCropCycle, isLoading, isError, submitLog, isPending } = useFarmOperationPage(OPERATION_SLUG)
  const [description, setDescription] = useState('')

  if (isLoading) return <OperationFormLoading />
  if (isError || !layoutCropCycle) {
    return (
      <OperationFormError message="We could not load this crop cycle. Return to the record-operation list and try again." />
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) {
      toast.error('Description is required.')
      return
    }
    try {
      await submitLog(description)
      toast.success('Land preparation logged successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to log operation: ${msg}`)
    }
  }

  return (
    <OperationFormLayout
      title="Land Preparation"
      breadcrumbLabel="Land Preparation"
      cropCycle={layoutCropCycle}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Log Land Preparation"
      organicWarning={layoutCropCycle.status === 'planned' ? 'This is an organic crop cycle. Some synthetic inputs may trigger warnings.' : undefined}
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

      {/* Primary Tillage Method */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Primary Tillage Method</label>
        <div className="relative">
          <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
            <option>Select Tillage Method</option>
            <option>Conventional Tillage</option>
            <option>Conservation Tillage</option>
            <option>Zero Tillage</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* Field Preparation Activities (Checkboxes) */}
      <div>
        <label className="mb-2.5 block text-sm font-semibold text-gray-900">Field Preparation Activities</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Plowing', 'Harrowing', 'Ridging', 'Leveling', 'Mulching', 'Terracing', 'Planting of Cover Crops', 'Construction of Bunds', 'Contour Farming'].map((activity) => (
            <label key={activity} className="flex cursor-pointer border border-gray-200 rounded-md p-3 items-center gap-3 hover:bg-gray-50">
              <input type="checkbox" className="size-4 rounded border-gray-300 text-brand focus:ring-brand" />
              <span className="text-sm font-medium text-gray-700">{activity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pre-Plant Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Pre-Plant Inputs Applied</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Select Pre-plant inputs</option>
              <option>Compost</option>
              <option>Manure</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity per Hectare</label>
          <input type="text" placeholder="Enter quantity" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Unit</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Select unit</option>
              <option>kg</option>
              <option>tons</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Clearing Method */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Clearing Method</label>
        <div className="relative">
          <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
            <option>Select Clearing Method</option>
            <option>Manual</option>
            <option>Mechanical</option>
            <option>Chemical</option>
            <option>Slash and Burn</option>
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Description <span className="text-red-500">*</span></label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3} 
          placeholder="Describe the land preparation... (e.g., Plowed and harrowed field for maize planting)" className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" required />
      </div>
    </OperationFormLayout>
  )
}
