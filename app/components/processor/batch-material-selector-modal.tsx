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
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState('')
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

  const handleItemSelect = (item: any) => {
    setSelectedItem(item)
    setSelectedQuantity(item.quantityTransferred?.toString() || item.quantity?.toString() || '')
  }

  const confirmAdd = () => {
    const parsedQuantity = parseFloat(selectedQuantity)
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      toast.error('Invalid quantity')
      return
    }

    const max = selectedItem.quantityTransferred || selectedItem.quantity || Infinity
    if (parsedQuantity > max) {
      toast.error(`Quantity exceeds available stock (${max})`)
      return
    }

    if (source === 'platform') {
      const isFarmProduct = !!selectedItem.farmProductId;
      onAdd({
        materialType: (isFarmProduct ? 'farm_product' : 'batch_product') as AddInputMaterialRequestMaterialType,
        sourceFarmProductId: selectedItem.farmProductId || undefined,
        sourceBatchProductId: selectedItem.batchProductId || undefined,
        quantityUsed: parsedQuantity,
        unit: selectedItem.unit,
        notes: `From transfer ${selectedItem.transferCode}`
      })
    } else if (source === 'inventory') {
      onAdd({
        materialType: 'inventory_item' as AddInputMaterialRequestMaterialType,
        inventoryItemId: selectedItem.id,
        quantityUsed: parsedQuantity,
        unit: selectedItem.unit,
        notes: `From inventory: ${selectedItem.itemName}`
      })
    }
    
    setSelectedItem(null)
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
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose()
        setSelectedItem(null)
      }
    }}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[800px] p-0 overflow-hidden flex flex-col sm:flex-row">
        {/* Sidebar / Top Tabs */}
        <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-100 bg-gray-50/50 p-4 sm:p-6 shrink-0">
          <h2 className="hidden sm:block text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Source Type</h2>
          <div className="flex sm:flex-col gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => { setSource('platform'); setSelectedItem(null); }}
              className={`flex-1 sm:w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                source === 'platform' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Truck className="size-4" />
              Platform
            </button>
            <button
              onClick={() => { setSource('inventory'); setSelectedItem(null); }}
              className={`flex-1 sm:w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                source === 'inventory' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Package className="size-4" />
              Inventory
            </button>
            <button
              onClick={() => { setSource('external'); setSelectedItem(null); }}
              className={`flex-1 sm:w-full flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 sm:py-3 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                source === 'external' ? 'bg-white text-brand shadow-sm ring-1 ring-gray-200' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <ExternalLink className="size-4" />
              External
            </button>
          </div>

          <div className="hidden sm:block mt-12 p-4 rounded-md bg-brand/5 border border-brand/10">
            <p className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Quick Tip</p>
            <p className="text-xs text-brand-dark/70 leading-relaxed">
              Platform transfers include products received from farmers and cooperatives.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-white min-w-0 h-[500px] sm:h-[600px]">
          <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4">
            <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 uppercase">
              {source === 'platform' && 'Platform Transfers'}
              {source === 'inventory' && 'Internal Inventory'}
              {source === 'external' && 'Add External Material'}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {source === 'platform' && 'Select from items transferred to your organization'}
              {source === 'inventory' && 'Select from items currently in your stock'}
              {source === 'external' && 'Manually record materials from outside the platform'}
            </DialogDescription>
          </DialogHeader>

          {selectedItem ? (
            <div className="flex-1 flex flex-col px-6 sm:px-8 pb-8 animate-in fade-in slide-in-from-right-4 duration-200">
               <button 
                onClick={() => setSelectedItem(null)}
                className="mb-4 flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-brand transition-colors"
              >
                <Plus className="size-3 rotate-45" /> Back to list
              </button>
              
              <div className="flex-1 space-y-6">
                <div className="p-4 rounded-md bg-gray-50 border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Item</div>
                  <div className="font-bold text-gray-900">{selectedItem.productType?.replace('_', ' ') || selectedItem.itemName}</div>
                  <div className="text-xs text-gray-500 mt-1">Available: {selectedItem.quantityTransferred || selectedItem.quantity} {selectedItem.unit}</div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity to Use ({selectedItem.unit})</Label>
                    <Input
                      type="number"
                      autoFocus
                      placeholder="0.00"
                      value={selectedQuantity}
                      onChange={e => setSelectedQuantity(e.target.value)}
                      className="h-12 text-lg font-black border-gray-200 focus:border-brand focus:ring-brand/20"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={confirmAdd}
                      className="w-full h-12 bg-brand hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand/20"
                    >
                      Add to Batch
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {source !== 'external' && (
                <div className="px-6 sm:px-8 mb-4">
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

              <div className="flex-1 overflow-y-auto px-6 sm:px-8 pb-8">
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
                          onClick={() => handleItemSelect(p)}
                          className="group flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-brand/30 hover:bg-brand/5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="size-9 sm:size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-brand transition-colors shrink-0">
                              <Truck className="size-4 sm:size-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 truncate text-sm sm:text-base">{p.productType?.replace('_', ' ') || 'Unknown Product'}</div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{p.transferCode}</span>
                                <Badge variant="outline" className="text-[7px] sm:text-[8px] px-1 py-0 font-black uppercase bg-white shrink-0">{p.status}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-black text-gray-900">{p.quantityTransferred} {p.unit}</div>
                            <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available</div>
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
                          onClick={() => handleItemSelect(item)}
                          className="group flex items-center justify-between p-4 rounded-md border border-gray-100 hover:border-brand/30 hover:bg-brand/5 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="size-9 sm:size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-brand transition-colors shrink-0">
                              <Package className="size-4 sm:size-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 truncate text-sm sm:text-base">{item.itemName}</div>
                              <div className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate">{item.category}</div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs sm:text-sm font-black text-gray-900">{item.quantity} {item.unit}</div>
                            <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">In Stock</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {source === 'external' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                        className="w-full h-11 bg-brand hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-brand/20"
                      >
                        Add Material to Batch
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
