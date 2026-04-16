import { useState } from 'react'
import { toast } from 'sonner'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { OperationFormError, OperationFormLoading } from '~/components/operation-form-load-state'
import { PersonField } from '~/components/person-field'
import { useFarmOperationPage } from '~/hooks/use-farm-operation-page'
import type { FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { Route } from './+types/drying'

const OPERATION_SLUG = 'drying' as FarmOperationRouteSlug

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Cleaning & Drying | Agrolinking' }]
}

export default function CleaningAndDrying() {
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
      toast.error('Drying description is required.')
      return
    }
    try {
      await submitLog(description)
      toast.success('Cleaning & drying logged successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to log operation: ${msg}`)
    }
  }

  return (
    <OperationFormLayout
      title="Cleaning & Drying"
      breadcrumbLabel="Cleaning & Drying"
      cropCycle={layoutCropCycle}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Log Cleaning & Drying"
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
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Cleaning Method</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Washing (Water)</option>
              <option>Air Blowing</option>
              <option>Manual Removal of Debris</option>
              <option>Sieving/Screening</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Drying Method</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Solar Drying (Open Air)</option>
              <option>Mechanical Dryer</option>
              <option>Greenhouse Drying</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Initial Moisture Content (%)</label>
          <input type="text" placeholder="e.g. 24" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Final Moisture Content (%)</label>
          <input type="text" placeholder="e.g. 12" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Drying Duration (hours)</label>
          <input type="text" placeholder="Total hours of drying" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Temperature Used (°C)</label>
          <input type="text" placeholder="Skip if solar drying" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Drying Observations <span className="text-red-500">*</span></label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Record any observations about drying consistency, weather changes, etc."
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          required
        />
      </div>
    </OperationFormLayout>
  )
}
