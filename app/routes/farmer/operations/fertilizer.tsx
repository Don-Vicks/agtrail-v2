import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { InventoryField } from '~/components/inventory-field'
import { OperationFormLayout } from '~/components/operation-form-layout'
import { PersonField } from '~/components/person-field'
import { usePostFarmsIdOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import { allCropCycles } from '~/lib/mock-data/farmer'
import type { Route } from './+types/fertilizer'

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Fertilizer Application | Agrolinking' }]
}

export default function Fertilizer() {
  const { cropCycleId } = useParams()
  const navigate = useNavigate()
  const cropCycle = allCropCycles.find((c) => c.id === cropCycleId) || allCropCycles[0]

  const [description, setDescription] = useState('')
  const { mutateAsync: logOperation, isPending } = usePostFarmsIdOperations()

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
          operationType: 'fertilizer_application',
          description: description,
          operationDate: new Date().toISOString()
        }
      })
      toast.success('Fertilizer application operation logged successfully!')
      navigate('/farmer/operations/new')
    } catch (err: any) {
      toast.error(`Failed to log operation: ${err.message || 'Unknown error'}`)
    }
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
        <InventoryField
          id="fertilizer-item"
          label="Select Fertilizer from Inventory"
          defaultValue=""
          placeholder="Select fertilizer item"
          categoryFilter="Fertilizer"
        />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Applied <span className="text-red-500">*</span></label>
          <input type="text" required placeholder="Enter quantity" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      {/* Auto-filled fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Brand / Product Name</label>
          <input type="text" placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Supplier Name</label>
          <input type="text" placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Unit Cost</label>
          <input type="text" placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Batch Number</label>
          <input type="text" placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
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
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3} 
          required 
          placeholder="Describe the fertilizer application... (e.g., Applied NPK fertilizer to maize field)" 
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
        />
      </div>
    </OperationFormLayout>
  )
}
