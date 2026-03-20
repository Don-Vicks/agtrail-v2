import { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
import { Breadcrumb } from '~/components/breadcrumb'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

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

export function meta() {
  return [{ title: 'Inventory | Agtrail' }]
}

export default function FarmerInventory() {
  const [search, setSearch] = useState('')
  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor') 
    ? '/processor' 
    : location.pathname.startsWith('/cooperative') 
      ? '/cooperative' 
      : '/farmer'

  const filtered = useMemo(() => {
    return mockInventory.filter((item) =>
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return (
    <div className="space-y-6 pb-10">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: basePath },
          { label: 'Inventory' },
        ]}
      />

      <div>
        <h1 className="text-2xl font-bold text-brand">Inventory</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your farm inputs and stocked items</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
            />
          </div>
          <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark">
            <span>Add stock</span>
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{item.itemName}</h3>
                    <Badge variant="outline">{item.category}</Badge>
                    <Badge variant={item.certificationStatus === 'Organic' ? 'default' : 'secondary'}>
                      {item.certificationStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Brand:</span>
                      <p className="text-gray-900">{item.brand}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Supplier:</span>
                      <p className="text-gray-900">{item.supplierName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Supplier Phone:</span>
                      <p className="text-gray-900">{item.supplierPhone}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Purchase Location:</span>
                      <p className="text-gray-900">{item.purchaseLocation}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Unit:</span>
                      <p className="text-gray-900">{item.unitOfMeasurement}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Quantity Purchased:</span>
                      <p className="text-gray-900">{item.quantityPurchased} {item.unitOfMeasurement}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Unit Cost:</span>
                      <p className="text-gray-900">₦{item.unitCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Cost:</span>
                      <p className="text-gray-900">₦{item.totalCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Current Stock:</span>
                      <p className="text-gray-900">{item.currentStockLevel} {item.unitOfMeasurement}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <span className="font-medium text-gray-700">Assigned Farms:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.assignedFarms.map((farm) => (
                          <Badge key={farm} variant="outline" className="text-xs">
                            {farm}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Purchase Date:</span>
                      <p className="text-gray-900">{item.purchaseDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Expiry Date:</span>
                      <p className="text-gray-900">{item.expiryDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Batch Number:</span>
                      <p className="text-gray-900">{item.batchNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Invoice:</span>
                      <p className="text-gray-900">{item.invoiceNumber}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Storage Location:</span>
                      <p className="text-gray-900">{item.storageLocation}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Min Stock Level:</span>
                      <p className="text-gray-900">{item.minimumStockLevel} {item.unitOfMeasurement}</p>
                    </div>
                  </div>

                  {item.notes && (
                    <div>
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-900 text-sm mt-1">{item.notes}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">Adjust Stock</Button>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-10">No inventory items found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
