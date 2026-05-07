import { useState } from 'react'
import { Package, Search, Plus, ExternalLink, History, Truck } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { useGetPurchases } from '~/lib/api/generated/purchases/purchases'
import { useGetSuppliesInventory } from '~/lib/api/generated/supplies-inventory/supplies-inventory'
import type { ProductTransfer } from '~/lib/api/generated/models/productTransfer'
import type { AddInputMaterialRequestMaterialType } from '~/lib/api/generated/models/addInputMaterialRequestMaterialType'

interface BatchMaterialSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (material: any) => void
}

type MaterialSource = 'platform' | 'inventory' | 'external'

export function BatchMaterialSelectorModal({ isOpen, onClose, onAdd }: BatchMaterialSelectorModalProps) {
  const [source, setSource] = useState<MaterialSource>('platform')
  const [search, setSearch] = useState('')
  
  // Data fetching
  const { data: purchasesResponse, isLoading: isLoadingPurchases } = useGetPurchases()
  const { data: inventoryResponse, isLoading: isLoadingInventory } = useGetSuppliesInventory()

  const purchases = (purchasesResponse?.data?.data || []) as ProductTransfer[]
  const inventory = inventoryResponse?.data?.data || []

  // Filtered lists
  const filteredPurchases = purchases.filter(p => 
    p.transferCode?.toLowerCase().includes(search.toLowerCase()) ||
    p.productType?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredInventory = inventory.filter(i => 
    i.itemName?.toLowerCase().includes(search.toLowerCase()) ||
    i.category?.toLowerCase().includes(search.toLowerCase())
  )

  // External material state
  const [externalData, setExternalData] = useState({
    name: '',
    supplier: '',
    quantity: '',
    unit: 'kg',
    lotNumber: '',
  })

  const handleAddPlatform = (p: ProductTransfer) => {
    const quantity = prompt(`Enter quantity to use (Max ${p.quantityTransferred} ${p.unit}):`, p.quantityTransferred?.toString())
    if (!quantity) return

    const parsedQuantity = parseFloat(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > (p.quantityTransferred || 0)) {
      toast.error('Invalid quantity')
      return
    }

    // Determine if it's a farm product or a batch product (from another processor)
    const isFarmProduct = !!p.farmProductId;
    
    onAdd({
      materialType: (isFarmProduct ? 'farm_product' : 'batch_product') as AddInputMaterialRequestMaterialType,
      sourceFarmProductId: p.farmProductId || undefined,
      sourceBatchProductId: p.batchProductId || undefined,
      quantityUsed: parsedQuantity,
      unit: p.unit,
      notes: `From transfer ${p.transferCode}`
    })
    onClose()
  }

  const handleAddInventory = (item: any) => {
    const quantity = prompt(`Enter quantity to use (Max ${item.quantity} ${item.unit}):`, item.quantity?.toString())
    if (!quantity) return

    const parsedQuantity = parseFloat(quantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0 || parsedQuantity > (item.quantity || 0)) {
      toast.error('Invalid quantity')
      return
    }

    onAdd({
      materialType: 'inventory_item' as AddInputMaterialRequestMaterialType,
      inventoryItemId: item.id,
      quantityUsed: parsedQuantity,
      unit: item.unit,
      notes: `From inventory: ${item.itemName}`
    })
    onClose()
  }

  const handleAddExternal = () => {
    if (!externalData.name || !externalData.quantity) {
      toast.error('Please fill in required fields')
      return
    }

    onAdd({
      materialType: 'external_material' as AddInputMaterialRequestMaterialType,
      externalMaterialName: externalData.name,
      externalSupplierName: externalData.supplier,
      quantityUsed: parseFloat(externalData.quantity),
      unit: externalData.unit,
      lotNumber: externalData.lotNumber,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px] p-0 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-100 bg-gray-50/50 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Source Type</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSource('platform')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                  source === 'platform' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Truck className="size-4" />
                Platform Transfers
              </button>
              <button
                onClick={() => setSource('inventory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                  source === 'inventory' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Package className="size-4" />
                Internal Inventory
              </button>
              <button
                onClick={() => setSource('external')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-semibold transition-all ${
                  source === 'external' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <ExternalLink className="size-4" />
                External Supplier
              </button>
            </div>

            <div className="mt-12 p-4 rounded-md bg-brand/5 border border-brand/10">
              <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Quick Tip</p>
              <p className="text-xs text-brand-dark/70 leading-relaxed">
                Platform transfers include products received from farmers and cooperatives.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-white">
            <DialogHeader className="px-8 pt-8 pb-4">
              <DialogTitle className="text-xl font-bold tracking-tight text-gray-900 uppercase">
                {source === 'platform' && 'Platform Transfers'}
                {source === 'inventory' && 'Internal Inventory'}
                {source === 'external' && 'Add External Material'}
              </DialogTitle>
              <DialogDescription>
                {source === 'platform' && 'Select from items transferred to your organization'}
                {source === 'inventory' && 'Select from items currently in your stock'}
                {source === 'external' && 'Manually record materials from outside the platform'}
              </DialogDescription>
            </DialogHeader>

            {source !== 'external' && (
              <div className="px-8 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Search materials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 h-10 border-gray-100 bg-gray-50/50"
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-8 pb-8">
              {source === 'platform' && (
                <div className="space-y-3">
                  {isLoadingPurchases ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-20 w-full animate-pulse rounded-md bg-gray-50" />
                    ))
                  ) : filteredPurchases.length === 0 ? (
                    <div className="py-12 text-center">
                      <History className="size-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">No transfers found</p>
                    </div>
                  ) : (
                    filteredPurchases.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleAddPlatform(p)}
                        className="group flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-brand/30 hover:bg-brand/5 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-brand transition-colors">
                            <Truck className="size-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{p.productType?.replace('_', ' ') || 'Unknown Product'}</div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.transferCode}</span>
                              <Badge variant="outline" className="text-[8px] px-1 py-0 font-black uppercase bg-white">{p.status}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-gray-900">{p.quantityTransferred} {p.unit}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {source === 'inventory' && (
                <div className="space-y-3">
                  {isLoadingInventory ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="h-20 w-full animate-pulse rounded-md bg-gray-50" />
                    ))
                  ) : filteredInventory.length === 0 ? (
                    <div className="py-12 text-center">
                      <Package className="size-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">No inventory items found</p>
                    </div>
                  ) : (
                    filteredInventory.map((item: any) => (
                      <div
                        key={item.id}
                        onClick={() => handleAddInventory(item)}
                        className="group flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-brand/30 hover:bg-brand/5 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-brand transition-colors">
                            <Package className="size-5" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900">{item.itemName}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{item.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-black text-gray-900">{item.quantity} {item.unit}</div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Stock</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {source === 'external' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Material Name *</Label>
                      <Input
                        placeholder="e.g. Sacks"
                        value={externalData.name}
                        onChange={e => setExternalData(prev => ({ ...prev, name: e.target.value }))}
                        className="h-11 rounded-md border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supplier</Label>
                      <Input
                        placeholder="e.g. Global Supplies Ltd"
                        value={externalData.supplier}
                        onChange={e => setExternalData(prev => ({ ...prev, supplier: e.target.value }))}
                        className="h-11 rounded-md border-gray-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={externalData.quantity}
                        onChange={e => setExternalData(prev => ({ ...prev, quantity: e.target.value }))}
                        className="h-11 rounded-md border-gray-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit</Label>
                      <Select
                        value={externalData.unit}
                        onValueChange={v => setExternalData(prev => ({ ...prev, unit: v }))}
                      >
                        <SelectTrigger className="h-11 rounded-md border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                          <SelectItem value="liters">liters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lot/Batch Number</Label>
                    <Input
                      placeholder="e.g. BATCH-001"
                      value={externalData.lotNumber}
                      onChange={e => setExternalData(prev => ({ ...prev, lotNumber: e.target.value }))}
                      className="h-11 rounded-md border-gray-200"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={handleAddExternal}
                      className="w-full h-11 bg-brand hover:bg-black text-white font-bold uppercase tracking-widest text-[10px]"
                    >
                      Add Material to Batch
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
