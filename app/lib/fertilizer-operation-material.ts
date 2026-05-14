import type { InventoryOption } from '~/components/inventory-field'
import type { LogFarmOperationRequestMaterialsUsedItem } from '~/lib/api/generated/models/logFarmOperationRequestMaterialsUsedItem'

export type FertilizerTypeForOperation = 'organic' | 'inorganic'

/** Maps inventory certification to an operation fertilizer class for logging. */
export function fertilizerTypeFromInventoryItem(item: InventoryOption): FertilizerTypeForOperation {
  return item.isOrganicCertified ? 'organic' : 'inorganic'
}

export function fertilizerTypeDisplayLabel(item: InventoryOption | undefined): string {
  if (!item) return ''
  return fertilizerTypeFromInventoryItem(item) === 'organic' ? 'Organic' : 'Inorganic'
}

/**
 * `fertilizerType` is not on the published OpenAPI `LogFarmOperationRequestMaterialsUsedItem` model;
 * the farm-operations API is expected to accept it on fertilizer logs (confirm on backend).
 */
export function buildFertilizerMaterialsUsedPayload(
  selectedItem: InventoryOption,
  quantity: number,
): LogFarmOperationRequestMaterialsUsedItem {
  const fertilizerType = fertilizerTypeFromInventoryItem(selectedItem)
  return {
    inventoryItemId: selectedItem.id,
    name: selectedItem.itemName,
    quantity,
    unit: selectedItem.unitOfMeasurement || 'unit',
    cost: selectedItem.unitCost * quantity,
    currency: selectedItem.currency || 'NGN',
    fertilizerType,
  } as LogFarmOperationRequestMaterialsUsedItem
}
