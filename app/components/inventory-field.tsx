import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { SuppliesInventory } from '~/lib/api/generated/models'
import { useGetSuppliesInventory } from '~/lib/api/generated/supplies-inventory/supplies-inventory'

import { useCallback, useState } from 'react'

export type InventoryOption = {
  id: string
  itemName: string
  category: string
  supplierName: string
  unitOfMeasurement: string
  unitCost: number
  currency: string
  batchNumber: string
  currentStockLevel: number
  certificationStatus: string
}

const categoryMap: Record<string, string> = {
  seeds: 'seed',
  seed: 'seed',
  fertilizer: 'fertilizer',
  pesticide: 'pesticide',
}

function toInventoryOption(item: SuppliesInventory): InventoryOption {
  const unitCost = Number(item.unitCost ?? 0)
  const currentStockLevel = Number(item.currentLevel ?? 0)
  return {
    id: item.id,
    itemName: item.itemName,
    category: item.category,
    supplierName: item.supplierName ?? 'N/A',
    unitOfMeasurement: item.unit,
    unitCost: Number.isFinite(unitCost) ? unitCost : 0,
    currency: item.unitCostCurrency ?? 'NGN',
    batchNumber: `BATCH-${item.id.slice(0, 6).toUpperCase()}`,
    currentStockLevel: Number.isFinite(currentStockLevel) ? currentStockLevel : 0,
    certificationStatus: item.certification === 'organic' ? 'Organic' : 'Conventional',
  }
}

interface InventoryFieldProps {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onChange?: (value: string, item?: InventoryOption) => void
  placeholder?: string
  className?: string
  categoryFilter?: string // Optional filter for specific categories like 'Seeds', 'Fertilizer'
}

export function InventoryField({
  id,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = "Select inventory item",
  className,
  categoryFilter,
}: InventoryFieldProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const { data } = useGetSuppliesInventory()
  const inventory = (data?.data?.data ?? []).map(toInventoryOption)

  const handleChange = useCallback(
    (val: string | null) => {
      if (val === null) return
      const selectedItem = inventory.find(item => item.id === val)
      if (onChange) {
        onChange(val, selectedItem)
      }
      if (value === undefined) {
        setInternalValue(val)
      }
    },
    [inventory, onChange, value]
  )

  const inputValue = value !== undefined ? value : internalValue

  // Filter inventory based on category if specified
  const filteredInventory = categoryFilter
    ? (() => {
        const apiCategory = categoryMap[categoryFilter.toLowerCase()]
        if (!apiCategory) return inventory
        const exactMatch = inventory.filter(
          (item) => String(item.category).toLowerCase() === apiCategory.toLowerCase(),
        )
        // Keep dropdown populated even if category naming differs in backend data.
        return exactMatch.length > 0 ? exactMatch : inventory
      })()
    : inventory
  const selectedItem = inventory.find((item) => item.id === inputValue)
  const selectedLabel = selectedItem
    ? `${selectedItem.itemName} - ${selectedItem.supplierName} (${selectedItem.category})`
    : undefined

  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-gray-900">
        {label}
      </Label>
      <Select
        id={id}
        value={inputValue}
        onValueChange={handleChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {filteredInventory.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.itemName} - {item.supplierName} ({item.category})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <input type="hidden" name={id} value={inputValue} />
    </div>
  )
}