import { useState } from 'react'
import { toast } from 'sonner'
import type { OperationFormFooterValues } from '~/lib/operation-form-footer'
 
import { OperationFormLayout } from '~/components/operation-form-layout'
import { InventoryField, type InventoryOption } from '~/components/inventory-field'
import { PersonField } from '~/components/person-field'
import { OperationFormError, OperationFormLoading } from '~/components/operation-form-load-state'
import { useFarmOperationPage } from '~/hooks/use-farm-operation-page'
import type { FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { Route } from './+types/planting'

const OPERATION_SLUG = 'planting' as FarmOperationRouteSlug

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Planting | Agrolinking' }]
}

export default function Planting() {
  const { layoutCropCycle, isLoading, isError, submitLog, isPending } = useFarmOperationPage(OPERATION_SLUG)
  const [description, setDescription] = useState('')
  const [selectedSeed, setSelectedSeed] = useState<InventoryOption | undefined>(undefined)
  const [quantityUsed, setQuantityUsed] = useState('')

  if (isLoading) return <OperationFormLoading />
  if (isError || !layoutCropCycle) {
    return (
      <OperationFormError message="We could not load this crop cycle. Return to the record-operation list and try again." />
    )
  }

  const handleSubmit = async (e: React.FormEvent, footer: OperationFormFooterValues) => {
    if (!description.trim()) {
      toast.error('Description is required.')
      return
    }
    const quantity = parseFloat(quantityUsed) || 0
    const extraData = {
      materialsUsed: selectedSeed
        ? [
            {
              inventoryItemId: selectedSeed.id,
              name: selectedSeed.itemName,
              quantity,
              unit: selectedSeed.unitOfMeasurement || 'unit',
              cost: selectedSeed.unitCost * quantity,
              currency: selectedSeed.currency || 'NGN',
            },
          ]
        : [],
    }
    try {
      await submitLog(description.trim(), footer, extraData)
      toast.success('Planting logged successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to log operation: ${msg}`)
    }
  }

  return (
    <OperationFormLayout
      title="Planting"
      breadcrumbLabel="Planting"
      cropCycle={layoutCropCycle}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Log Planting Operation"
      organicWarning={layoutCropCycle.status === 'planned' ? 'This is an organic crop cycle. Non-organic seed selections may trigger warnings.' : undefined}
    >
      {/* 2-column: Operator & Supervisor */}
      <div className="grid grid-cols-2 gap-6">
        <PersonField
          id="operator-personnel-id"
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

      {/* Seed Details Component Section */}
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Seed Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InventoryField
            id="seed-item"
            label="Select Seed from Inventory"
            defaultValue=""
            onChange={(_, item) => setSelectedSeed(item)}
            placeholder="Select seed item"
            categoryFilter="Seeds"
            warnNonOrganicInventory={layoutCropCycle.status === 'planned'}
          />
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Used (kg)</label>
            <input type="number" value={quantityUsed} onChange={(e) => setQuantityUsed(e.target.value)} placeholder="Enter quantity" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
        </div>

        {/* Auto-filled fields (would be populated when seed is selected) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Brand / Supplier Name</label>
            <input type="text" value={selectedSeed?.supplierName || ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Batch Number</label>
            <input type="text" value={selectedSeed?.batchNumber || ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Unit Cost</label>
            <input type="text" value={selectedSeed?.unitCost != null ? `₦${selectedSeed.unitCost.toLocaleString()}` : ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Certification Status</label>
            <input type="text" value={selectedSeed?.certificationStatus || ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
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
              <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
                <option>Select Planting Method</option><option>Direct Seeding</option><option>Transplanting</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-900">Planting Spacing / Density (cm)</label>
            <input type="text" placeholder="e.g., 75cm x 25cm" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Seeding Rate (seeds/m²)</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white">
              <option>Select Seeding Rate</option><option>Low Density (1-5)</option><option>High Density (5+)</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
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
          required 
          placeholder="Describe the planting operation... (e.g., Planted maize seeds using manual broadcasting method)" 
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" 
        />
      </div>
    </OperationFormLayout>
  )
}
