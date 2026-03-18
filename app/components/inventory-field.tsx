import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'

import { useCallback, useState } from 'react'

// Mock inventory data - in a real app, this would come from an API or context
const mockInventory = [
  {
    id: '1',
    itemName: 'NPK 15-15-15 Fertilizer',
    category: 'Fertilizer',
    brand: 'Dangote',
    supplierName: 'Agro Supplies Ltd',
    supplierPhone: '+234 801 234 5678',
    purchaseLocation: 'Lagos Central Market',
    unitOfMeasurement: 'kg',
    quantityPurchased: 100,
    unitCost: 2500,
    totalCost: 250000,
    purchaseDate: '2024-01-15',
    invoiceNumber: 'INV-2024-001',
    batchNumber: 'BATCH-FERT-001',
    expiryDate: '2025-01-15',
    storageLocation: 'Warehouse A',
    currentStockLevel: 85,
    minimumStockLevel: 20,
    certificationStatus: 'Conventional',
    assignedFarms: ['Farm A', 'Farm B'],
    notes: 'High-quality NPK fertilizer for maize cultivation'
  },
  {
    id: '2',
    itemName: 'Maize Seed - Hybrid 1',
    category: 'Seeds',
    brand: 'Premier Seeds',
    supplierName: 'Seed Distributors Nigeria',
    supplierPhone: '+234 802 345 6789',
    purchaseLocation: 'Ibadan Seed Market',
    unitOfMeasurement: 'kg',
    quantityPurchased: 50,
    unitCost: 15000,
    totalCost: 750000,
    purchaseDate: '2024-02-01',
    invoiceNumber: 'INV-2024-002',
    batchNumber: 'BATCH-SEED-001',
    expiryDate: '2025-02-01',
    storageLocation: 'Cold Storage B',
    currentStockLevel: 45,
    minimumStockLevel: 10,
    certificationStatus: 'Organic',
    assignedFarms: ['Farm A'],
    notes: 'High-yield hybrid maize seeds'
  },
  {
    id: '3',
    itemName: 'Pesticide - Insecticide',
    category: 'Pesticide',
    brand: 'AgroChem',
    supplierName: 'Chemical Supplies Co',
    supplierPhone: '+234 803 456 7890',
    purchaseLocation: 'Kano Agro Mall',
    unitOfMeasurement: 'litres',
    quantityPurchased: 20,
    unitCost: 8000,
    totalCost: 160000,
    purchaseDate: '2024-01-20',
    invoiceNumber: 'INV-2024-003',
    batchNumber: 'BATCH-PEST-001',
    expiryDate: '2024-12-20',
    storageLocation: 'Pesticide Storage',
    currentStockLevel: 18,
    minimumStockLevel: 5,
    certificationStatus: 'Conventional',
    assignedFarms: ['Farm B'],
    notes: 'Effective against common maize pests'
  },
]

interface InventoryFieldProps {
  id: string
  label: string
  value?: string
  defaultValue?: string
  onChange?: (value: string, item?: typeof mockInventory[0]) => void
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

  const handleChange = useCallback(
    (val: string | null) => {
      if (val === null) return
      const selectedItem = mockInventory.find(item => item.itemName === val)
      if (onChange) {
        onChange(val, selectedItem)
      }
      if (value === undefined) {
        setInternalValue(val)
      }
    },
    [onChange, value]
  )

  const inputValue = value !== undefined ? value : internalValue

  // Filter inventory based on category if specified
  const filteredInventory = categoryFilter
    ? mockInventory.filter(item => item.category.toLowerCase().includes(categoryFilter.toLowerCase()))
    : mockInventory

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
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredInventory.map((item) => (
            <SelectItem key={item.id} value={item.itemName}>
              {item.itemName} - {item.brand} ({item.category})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}