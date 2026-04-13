import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { usePostFarmsIdOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import { allCropCycles } from '~/lib/mock-data/farmer'
import type { Route } from './+types/weeding'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Weeding | Agrolinking' }]
}

export default function Weeding() {
  const { cropCycleId } = useParams()
  const navigate = useNavigate()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const [description, setDescription] = useState('')
  const { mutateAsync: logOperation } = usePostFarmsIdOperations()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description) {
      toast.error('Description is required.')
      return
    }

    try {
      await logOperation({
        id: cropCycle.farmId,
        data: {
          cropCycleId: cropCycle.id,
          operationType: 'weeding',
          description,
          operationDate: new Date().toISOString(),
        },
      })
      toast.success('Weeding operation logged successfully!')
      navigate('/farmer/operations/new')
    } catch (err: any) {
      toast.error(`Failed to log operation: ${err.message || 'Unknown error'}`)
    }
  }

  return (
    <OperationFormLayout
      title="Weeding"
      breadcrumbLabel="Weeding"
      cropCycle={cropCycle}
      onSubmit={handleSubmit}
      submitLabel="Log Weeding Operation"
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
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Weeding Method <span className="text-red-500">*</span></label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Weeding Method</option><option>Manual</option><option>Mechanical</option><option>Chemical (Herbicide)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Number of Workers</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option value="">Select Number of Workers</option><option>1-5</option><option>6-10</option><option>11+</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
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
          placeholder="Describe the weeding operation... (e.g., Manual weeding of maize field)"
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </OperationFormLayout>
  )
}
