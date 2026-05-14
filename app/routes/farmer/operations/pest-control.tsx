import { useState } from 'react'
import { toast } from 'sonner'
import type { OperationFormFooterValues } from '~/lib/operation-form-footer'
 
import { OperationFormLayout } from '~/components/operation-form-layout'
import { InventoryField, type InventoryOption } from '~/components/inventory-field'
import { PersonField } from '~/components/person-field'
import { OperationFormError, OperationFormLoading } from '~/components/operation-form-load-state'
import { useFarmOperationPage } from '~/hooks/use-farm-operation-page'
import type { FarmOperationRouteSlug } from '~/lib/farm-operation-log'
import type { Route } from './+types/pest-control'

const OPERATION_SLUG = 'pest-control' as FarmOperationRouteSlug

export function meta({ }: Route.MetaArgs) {
  return [{ title: 'Pest Control | Agrolinking' }]
}

export default function PestControl() {
  const { layoutCropCycle, isLoading, isError, submitLog, isPending } = useFarmOperationPage(OPERATION_SLUG)
  const [description, setDescription] = useState('')
  const [selectedItem, setSelectedItem] = useState<InventoryOption | undefined>(undefined)
  const [quantityApplied, setQuantityApplied] = useState('')

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
    const quantity = parseFloat(quantityApplied) || 0
    const extraData = {
      materialsUsed: selectedItem
        ? [
            {
              inventoryItemId: selectedItem.id,
              name: selectedItem.itemName,
              quantity,
              unit: selectedItem.unitOfMeasurement || 'unit',
              cost: selectedItem.unitCost * quantity,
              currency: selectedItem.currency || 'NGN',
            },
          ]
        : [],
    }
    try {
      await submitLog(description.trim(), footer, extraData)
      toast.success('Pest control logged successfully.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to log operation: ${msg}`)
    }
  }

  return (
    <OperationFormLayout
      title="Pest Control"
      breadcrumbLabel="Pest Control"
      cropCycle={layoutCropCycle}
      onSubmit={handleSubmit}
      isSubmitting={isPending}
      submitLabel="Log Pest Control Operation"
      organicWarning={layoutCropCycle.status === 'planned' ? 'This is an organic crop cycle. Synthetic chemical applications may trigger warnings.' : undefined}
    >
      {/* 2-column: Operator & Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Target Pest</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Pest</option><option>Aphids</option><option>Stem Borers</option><option>Armyworms</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Control Method Type</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white" required>
              <option value="">Select Control Method</option><option>Chemical Pesticide</option><option>Biopesticide</option><option>Cultural Control</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="6 9 12 15 18 9" /></svg></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventoryField
          id="pesticide-item"
          label="Select Pesticide from Inventory"
          defaultValue=""
          onChange={(_, item) => setSelectedItem(item)}
          placeholder="Select pesticide item"
          categoryFilter="Pesticide"
          warnNonOrganicInventory={layoutCropCycle.status === 'planned'}
        />
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Quantity Applied</label>
          <input type="text" value={quantityApplied} onChange={(e) => setQuantityApplied(e.target.value)} placeholder="Enter quantity" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      {/* Auto-filled fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Brand / Product Name</label>
          <input type="text" value={selectedItem?.itemName || ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-900">Batch Number</label>
          <input type="text" value={selectedItem?.batchNumber || ''} placeholder="Auto-filled from inventory" className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 bg-gray-50" readOnly />
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
          placeholder="Describe the pest control operation... (e.g., Applied organic pesticide to control aphids)"
          className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>
    </OperationFormLayout>
  )
}
