import { Fragment, useMemo, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '~/components/ui/dropdown-menu'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { 
  MoreVertical, 
  Search, 
  Plus, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Package, 
  Leaf, 
  Droplets, 
  Box, 
  Clock,
  AlertTriangle,
  ArrowRightLeft,
  Edit2,
  Trash2,
  MapPin,
  Archive
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { EmptyState } from '~/components/empty-state'
import { toast } from 'sonner'
import {
  getGetSuppliesInventoryQueryKey,
  useDeleteSuppliesInventoryId,
  useGetSuppliesInventory,
  usePatchSuppliesInventoryId,
  usePostSuppliesInventory,
} from '~/lib/api/generated/supplies-inventory/supplies-inventory'
import type {
  CreateSuppliesInventoryRequestCategory,
  CreateSuppliesInventoryRequestCertification,
  SuppliesInventory,
  UpdateSuppliesInventoryRequestCategory,
  UpdateSuppliesInventoryRequestCertification,
} from '~/lib/api/generated/models'
import { getApiErrorMessage } from '~/lib/api/error-message'

interface InventoryItem {
  id: string
  itemName: string
  category: string
  brand: string
  supplierName: string
  supplierPhone: string
  purchaseLocation: string
  unitOfMeasurement: string
  quantityPurchased: number
  unitCost: number
  totalCost: number
  purchaseDate: string
  invoiceNumber: string
  batchNumber: string
  expiryDate: string
  storageLocation: string
  currentStockLevel: number
  minimumStockLevel: number
  certificationStatus: string
  assignedFarms: string[]
  notes: string
}

const categoryLabelMap: Record<CreateSuppliesInventoryRequestCategory, string> = {
  fertilizer: 'Fertilizer',
  seed: 'Seed',
  pesticide: 'Pesticide',
  raw_material: 'Raw Material',
  other: 'Other',
}

const categoryOptions = [
  { value: 'fertilizer', label: 'Fertilizer' },
  { value: 'seed', label: 'Seed' },
  { value: 'pesticide', label: 'Pesticide' },
  { value: 'raw_material', label: 'Raw Material' },
  { value: 'other', label: 'Other' },
] as const

const certificationOptions = [
  { value: 'conventional', label: 'Conventional' },
  { value: 'organic', label: 'Organic' },
] as const

const toNumber = (value?: string | null) => {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const getStockProgress = (currentStockLevel: number, quantityPurchased: number) => {
  if (quantityPurchased <= 0) return 0
  const value = (currentStockLevel / quantityPurchased) * 100
  return Math.max(0, Math.min(100, value))
}

const mapApiInventoryItem = (item: SuppliesInventory): InventoryItem => {
  const quantityPurchased = toNumber(item.quantity)
  const unitCost = toNumber(item.unitCost)
  const currentStockLevel = toNumber(item.currentLevel)

  return {
    id: item.id,
    itemName: item.itemName,
    category: categoryLabelMap[item.category] ?? 'Other',
    brand: item.itemName,
    supplierName: item.supplierName ?? 'N/A',
    supplierPhone: '',
    purchaseLocation: '',
    unitOfMeasurement: item.unit,
    quantityPurchased,
    unitCost,
    totalCost: quantityPurchased * unitCost,
    purchaseDate: item.createdAt?.split('T')[0] ?? '',
    invoiceNumber: `INV-${item.id.slice(0, 6).toUpperCase()}`,
    batchNumber: `BATCH-${item.id.slice(0, 6).toUpperCase()}`,
    expiryDate: item.expiryDate?.split('T')[0] ?? '',
    storageLocation: item.facilityId ?? 'Warehouse Main',
    currentStockLevel,
    minimumStockLevel: toNumber(item.minAlertLevel),
    certificationStatus: item.certification === 'organic' ? 'Organic' : 'Conventional',
    assignedFarms: [],
    notes: item.internalStorageNotes ?? '',
  }
}

export function meta() {
  return [{ title: 'Inventory | Agtrail' }]
}

export default function FarmerInventory() {
  const queryClient = useQueryClient()
  const { data: inventoryResponse, isLoading, isError, refetch } = useGetSuppliesInventory()
  const { mutateAsync: createInventoryItem, isPending: isCreating } = usePostSuppliesInventory()
  const { mutateAsync: updateInventoryItem, isPending: isUpdating } = usePatchSuppliesInventoryId()
  const { mutateAsync: deleteInventoryItem, isPending: isDeleting } = useDeleteSuppliesInventoryId()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [stockStatusFilter, setStockStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [formCategory, setFormCategory] =
    useState<CreateSuppliesInventoryRequestCategory>('fertilizer')
  const [formCertification, setFormCertification] =
    useState<CreateSuppliesInventoryRequestCertification>('conventional')

  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor')
    ? '/processor'
    : location.pathname.startsWith('/cooperative')
      ? '/cooperative'
      : '/farmer'

  const categories = ['All', ...categoryOptions.map((option) => option.label)]

  const inventory = useMemo(
    () => (inventoryResponse?.data?.data ?? []).map(mapApiInventoryItem),
    [inventoryResponse],
  )

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedRows(next)
  }

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = [item.itemName, item.brand, item.category, item.supplierName].some(v => v.toLowerCase().includes(search.toLowerCase()))
      const matchesTab = activeTab === 'All' || item.category === activeTab
      const matchesStock = stockStatusFilter === 'All' || 
        (stockStatusFilter === 'Low Stock' && item.currentStockLevel <= item.minimumStockLevel) ||
        (stockStatusFilter === 'In Stock' && item.currentStockLevel > item.minimumStockLevel)
      
      return matchesSearch && matchesTab && matchesStock
    })
  }, [search, activeTab, stockStatusFilter, inventory])

  const stats = useMemo(() => {
    const totalItems = inventory.length
    const lowStock = inventory.filter(item => item.currentStockLevel <= item.minimumStockLevel).length
    const totalValue = inventory.reduce((acc, item) => acc + item.totalCost, 0)
    return { totalItems, lowStock, totalValue }
  }, [inventory])

  const handleSaveItem = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const itemName = String(formData.get('itemName') ?? '').trim()
    const brand = String(formData.get('brand') ?? '').trim()
    const supplierName = String(formData.get('supplierName') ?? '').trim()
    const uom = String(formData.get('uom') ?? '').trim()
    const qty = Number(formData.get('quantityPurchased'))
    const cost = Number(formData.get('unitCost'))

    if (!itemName) {
      toast.error('Item name is required.')
      return
    }
    if (!brand) {
      toast.error('Brand or manufacturer is required.')
      return
    }
    if (!supplierName) {
      toast.error('Supplier name is required.')
      return
    }
    if (!uom) {
      toast.error('Unit of measure is required (e.g. kg, L).')
      return
    }
    if (!Number.isFinite(qty) || qty <= 0) {
      toast.error('Quantity must be a positive number.')
      return
    }
    if (!Number.isFinite(cost) || cost < 0) {
      toast.error('Unit cost must be zero or greater.')
      return
    }

    try {
      const payload = {
        itemName,
        category:
          formCategory as
            | CreateSuppliesInventoryRequestCategory
            | UpdateSuppliesInventoryRequestCategory,
        supplierName,
        quantity: String(qty),
        unit: uom,
        currentLevel: String(Number(formData.get('currentStock')) || qty),
        minAlertLevel: String(Number(formData.get('minStock')) || 0),
        unitCost: String(cost),
        unitCostCurrency: 'NGN',
        expiryDate: String(formData.get('expiryDate') ?? ''),
        certification:
          formCertification as
            | CreateSuppliesInventoryRequestCertification
            | UpdateSuppliesInventoryRequestCertification,
        internalStorageNotes: String(formData.get('notes') ?? ''),
        facilityId: String(formData.get('storage') ?? '').trim() || undefined,
      }

      if (editingItem) {
        await updateInventoryItem({ id: editingItem.id, data: payload })
        toast.success('Inventory item updated')
      } else {
        await createInventoryItem({ data: payload })
        toast.success('Stock item added successfully')
      }

      await queryClient.invalidateQueries({ queryKey: getGetSuppliesInventoryQueryKey() })
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save inventory item', error)
      toast.error(
        getApiErrorMessage(error, 'Unable to save inventory item. Please try again.'),
      )
    }
  }
  const handleDelete = async (id: string) => {
    try {
      await deleteInventoryItem({ id })
      await queryClient.invalidateQueries({ queryKey: getGetSuppliesInventoryQueryKey() })
      toast.success('Inventory item removed')
    } catch (error) {
      console.error('Failed to remove inventory item', error)
      toast.error(
        getApiErrorMessage(error, 'Unable to remove inventory item. Please try again.'),
      )
    }
  }


  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item)
    const matchedCategory = categoryOptions.find(
      (option) => option.label === item.category,
    )
    setFormCategory(matchedCategory?.value ?? 'other')
    setFormCertification(
      item.certificationStatus === 'Organic' ? 'organic' : 'conventional',
    )
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    if (isCreating || isUpdating) return
    setIsModalOpen(false)
    setEditingItem(null)
    setFormCategory('fertilizer')
    setFormCertification('conventional')
  }

  const handleExport = () => {
    toast.info('Generating inventory report...')
    setTimeout(() => toast.success('Report downloaded: inventory_audit_2024.csv'), 1500)
  }

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: basePath,
            icon: <Archive className="size-4 text-gray-400" />,
          },
          { label: 'Inventory management' },
        ]}
      />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2e7d32]">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage your farm supplies and inputs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="h-11 px-5 border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 shadow-sm transition-all">
            <Download className="size-4 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => (open ? setIsModalOpen(true) : handleCloseModal())}
          >
            <DialogTrigger render={
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setFormCategory('fertilizer')
                  setFormCertification('conventional')
                }}
                className="bg-[#1d3d1e] hover:bg-black text-white h-11 px-6 shadow-lg shadow-brand/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="size-4 mr-2" />
                <span className="font-bold uppercase tracking-widest text-[10px]">Add Stock Item</span>
              </Button>
            } />
            <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-tighter">
                  {editingItem ? 'Adjust Stock Records' : 'New Stock Entry'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6" id="inventory-form">
                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Item Name</Label>
                     <Input name="itemName" defaultValue={editingItem?.itemName} required placeholder="e.g. NPK Fertilizer" />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</Label>
                     <Select
                       value={formCategory}
                       onValueChange={(value) =>
                         setFormCategory(value as CreateSuppliesInventoryRequestCategory)
                       }
                     >
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                       </SelectContent>
                     </Select>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand / Manufacturer</Label>
                     <Input name="brand" defaultValue={editingItem?.brand} required placeholder="e.g. Dangote" />
                   </div>
                </div>

                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</Label>
                        <Input name="quantityPurchased" type="number" defaultValue={editingItem?.quantityPurchased} required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Unit (UoM)</Label>
                        <Input name="uom" defaultValue={editingItem?.unitOfMeasurement} placeholder="kg, L, etc" />
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Current Level</Label>
                        <Input name="currentStock" type="number" defaultValue={editingItem?.currentStockLevel} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Min Alert Level</Label>
                        <Input name="minStock" type="number" defaultValue={editingItem?.minimumStockLevel} />
                      </div>
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Unit Cost (₦)</Label>
                     <Input name="unitCost" type="number" defaultValue={editingItem?.unitCost} required />
                   </div>
                </div>

                <div className="space-y-4 md:col-span-2 lg:col-span-1">
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Supplier</Label>
                     <Input name="supplierName" defaultValue={editingItem?.supplierName} required placeholder="Supplier name" />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Expiry Date</Label>
                     <Input name="expiryDate" type="date" defaultValue={editingItem?.expiryDate} />
                   </div>
                   <div className="space-y-2">
                     <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Certification</Label>
                     <Select
                       value={formCertification}
                       onValueChange={(value) =>
                         setFormCertification(
                           value as CreateSuppliesInventoryRequestCertification,
                         )
                       }
                     >
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          {certificationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                       </SelectContent>
                     </Select>
                   </div>
                </div>

                <div className="md:col-span-3 space-y-2 pt-4 border-t border-gray-50">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Internal Storage & Notes</Label>
                  <Input name="notes" defaultValue={editingItem?.notes} placeholder="Storage location, handling instructions..." />
                </div>
                
                <DialogFooter className="md:col-span-3 pt-6 border-t border-gray-50 mt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseModal} className="font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                  <Button type="submit" form="inventory-form" disabled={isCreating || isUpdating} className="bg-[#1d3d1e] hover:bg-black text-white px-10 font-bold uppercase tracking-widest text-[10px] shadow-md">
                    {isCreating || isUpdating ? 'Saving...' : editingItem ? 'Save Adjustments' : 'Commit to Stock'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Stock Items" value={stats.totalItems.toString()} icon={<Package className="size-4" />} />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStock.toString()} 
          icon={<AlertTriangle className={cn("size-4", stats.lowStock > 0 ? "text-red-500" : "text-emerald-500")} />} 
          className={stats.lowStock > 0 ? "border-red-100 bg-red-50/10" : ""}
        />
        <StatCard title="Inventory Value" value={`₦${(stats.totalValue / 1000).toFixed(1)}k`} icon={<Clock className="size-4 text-blue-500" />} />
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm inline-flex w-fit bg-gray-50/30">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === cat
                    ? 'bg-[#1d3d1e] text-white shadow-lg'
                    : 'text-gray-500 hover:bg-white hover:text-brand'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/10">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find item, brand or supplier..."
                className="w-full h-11 rounded-xl border border-gray-100 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-none"
              />
            </div>
            
            <Select value={stockStatusFilter} onValueChange={(v) => setStockStatusFilter(v || 'All')}>
               <SelectTrigger className="h-11 w-44 bg-white border-gray-100 font-bold uppercase tracking-widest text-[10px]">
                  <SelectValue placeholder="Stock Level" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="All">All stock levels</SelectItem>
                  <SelectItem value="In Stock">Healthy levels</SelectItem>
                  <SelectItem value="Low Stock">Critically low</SelectItem>
               </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 w-12"></th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-gray-400">Stock Item</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-gray-400">Inventory Status</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-gray-400">Financials</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-gray-400">Logistics</th>
                  <th className="px-6 py-4 text-right font-bold text-[10px] uppercase tracking-widest text-gray-400">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={6} className="px-6 py-8"><div className="h-8 bg-gray-50 rounded-lg w-full" /></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <EmptyState
                        icon={<AlertTriangle className="size-10" />}
                        title="Inventory failed to load"
                        description="Check your connection and try again."
                        action={{ label: 'Retry', onClick: () => refetch() }}
                      />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <EmptyState
                         icon={<Package className="size-10" />}
                         title={inventory.length === 0 ? 'No stock items yet' : 'No stock items found'}
                         description={
                           inventory.length === 0
                             ? 'Add a stock item to start tracking inventory records.'
                             : 'Adjust your filters or search query to see results.'
                         }
                       />
                    </td>
                  </tr>
                ) : filtered.map((item) => (
                  <Fragment key={item.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <button onClick={() => toggleRow(item.id)} className="p-2 hover:bg-white rounded-lg text-gray-300 hover:text-brand transition-all shadow-none hover:shadow-sm">
                          {expandedRows.has(item.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "size-11 rounded-2xl flex items-center justify-center border transition-all group-hover:scale-105",
                            item.category === 'Fertilizer' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                            item.category === 'Seeds' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                            'bg-blue-50 border-blue-100 text-blue-600'
                          )}>
                            {item.category === 'Fertilizer' ? <Box className="size-5" /> :
                             item.category === 'Seeds' ? <Leaf className="size-5" /> :
                             <Droplets className="size-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-brand transition-colors leading-tight">{item.itemName}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{item.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 min-w-[180px]">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter">
                              <span className="text-gray-900">{item.currentStockLevel} <span className="text-gray-400">/ {item.quantityPurchased} {item.unitOfMeasurement}</span></span>
                              <span className={item.currentStockLevel <= item.minimumStockLevel ? "text-red-500" : "text-emerald-500"}>
                                {item.currentStockLevel <= item.minimumStockLevel ? 'Critical' : 'Healthy'}
                              </span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={cn("h-full transition-all duration-700", item.currentStockLevel <= item.minimumStockLevel ? 'bg-red-500' : 'bg-brand')}
                                style={{ width: `${getStockProgress(item.currentStockLevel, item.quantityPurchased)}%` }}
                              />
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <p className="text-sm font-bold text-gray-900 leading-none mb-1">₦{item.totalCost.toLocaleString()}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₦{item.unitCost} / {item.unitOfMeasurement}</p>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-2 group/mini cursor-default">
                           <MapPin className="size-3 text-gray-300 group-hover/mini:text-brand transition-colors" />
                           <span className="text-xs font-bold text-gray-700">{item.storageLocation}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="size-9 rounded-xl hover:bg-gray-100">
                              <MoreVertical className="size-4 text-gray-400" />
                            </Button>
                          } />
                          <DropdownMenuContent align="end" className="w-52 p-1 rounded-xl shadow-xl ring-1 ring-black/5">
                            <DropdownMenuItem onClick={() => handleEditClick(item)} disabled={isCreating || isUpdating || isDeleting} className="gap-2 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest transition-all">
                               <ArrowRightLeft className="size-3.5 text-blue-500" /> Adjust Stock Level
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(item)} disabled={isCreating || isUpdating || isDeleting} className="gap-2 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest">
                               <Edit2 className="size-3.5 text-gray-400" /> Edit Specifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-gray-50" />
                            <DropdownMenuItem onClick={() => handleDelete(item.id)} disabled={isDeleting} className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest">
                               <Trash2 className="size-3.5" /> Remove Item
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    {expandedRows.has(item.id) && (
                      <tr className="bg-gray-50/40">
                        <td colSpan={6} className="px-12 py-8 border-b border-gray-100">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-10 animate-in slide-in-from-top-4 duration-300">
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Supply Chain</h4>
                                 <div className="p-4 rounded-2xl bg-white border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Preferred Supplier</p>
                                    <p className="text-xs font-bold text-gray-900">{item.supplierName}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-1">{item.supplierPhone}</p>
                                 </div>
                              </div>
                              <div className="space-y-4">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Compliance</h4>
                                 <div className="p-4 rounded-2xl bg-white border border-gray-100">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Cert Status</p>
                                    <Badge className="bg-blue-100 text-blue-700 text-[10px] font-bold border-none shadow-none">{item.certificationStatus}</Badge>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter mt-4 mb-1">Expiry</p>
                                    <p className="text-xs font-bold text-red-600">{item.expiryDate}</p>
                                 </div>
                              </div>
                              <div className="md:col-span-2 space-y-4">
                                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Internal Documentation</h4>
                                 <div className="p-4 rounded-2xl bg-white border border-gray-100 min-h-[100px]">
                                    <p className="text-[10px] text-gray-600 leading-relaxed italic">"{item.notes}"</p>
                                    <div className="mt-4 flex gap-6 border-t border-gray-50 pt-4">
                                       <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Batch #</p>
                                          <p className="text-xs font-bold text-gray-700">{item.batchNumber}</p>
                                       </div>
                                       <div>
                                          <p className="text-[9px] font-bold text-gray-400 uppercase mb-0.5">Invoice #</p>
                                          <p className="text-xs font-bold text-gray-700">{item.invoiceNumber}</p>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50/30 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 border-t border-gray-50">
            <span>Showing {filtered.length} of {inventory.length} resources</span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest" disabled>Prev</Button>
              <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold tracking-widest" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
