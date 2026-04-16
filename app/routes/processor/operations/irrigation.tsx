import { useState } from 'react'
import { toast } from 'sonner'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { OperationFormError, OperationFormLoading } from '~/components/operation-form-load-state'
import { useFarmOperationPage } from '~/hooks/use-farm-operation-page'
import type { FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { Route } from './+types/irrigation'

const OPERATION_SLUG = 'irrigation' as FarmOperationRouteSlug

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Irrigation | Agrolinking' }]
}

export default function Irrigation() {
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
      toast.success('Irrigation logged successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to log operation: ${msg}`)
    }
  }

  return (
    <OperationFormLayout
      title="Irrigation"
      breadcrumbLabel="Irrigation"
      cropCycle={layoutCropCycle}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Log Irrigation Operation"
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
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Irrigation Method <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Irrigation Method</option><option>Drip</option><option>Sprinkler</option><option>Surface/Furrow</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Water Source</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option value="">Select Water Source</option><option>Borehole</option><option>River/Stream</option><option>Rainwater Harvesting</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Duration of Irrigation (hours)</label>
          <input type="text" placeholder="e.g., 2.5" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          <p className="mt-1 text-xs text-gray-400">Enter duration in hours (e.g., 0.5, 1, 2.5)</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Estimated Water Volume (litres)</label>
          <input type="text" placeholder="e.g., 500" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-gray-900">Description <span className="text-red-500">*</span></label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Describe the irrigation operation... (e.g., Drip irrigation applied to tomato field)"
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </OperationFormLayout>
  )
}
