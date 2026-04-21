import { Fragment, useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
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
  Filter, 
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
  History,
  Archive
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { EmptyState } from '~/components/empty-state'
import { toast } from 'sonner'

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

const INITIAL_INVENTORY: InventoryItem[] = [
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
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY)
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [stockStatusFilter, setStockStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)

  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor')
    ? '/processor'
    : location.pathname.startsWith('/cooperative')
      ? '/cooperative'
      : '/farmer'

  const categories = ['All', 'Fertilizer', 'Seeds', 'Pesticide']

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedRows(next)
  }

  const filtered = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = [item.itemName, item.brand, item.category].some(v => v.toLowerCase().includes(search.toLowerCase()))
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

  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
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

    const data = {
      itemName,
      category: formData.get('category') as string,
      brand,
      supplierName,
      unitOfMeasurement: uom,
      quantityPurchased: qty,
      unitCost: cost,
      totalCost: qty * cost,
      currentStockLevel: Number(formData.get('currentStock')) || qty,
      minimumStockLevel: Number(formData.get('minStock')) || 0,
      expiryDate: formData.get('expiryDate') as string,
      storageLocation: formData.get('storage') as string || 'Warehouse Main',
      certificationStatus: formData.get('certification') as string || 'Conventional',
      purchaseDate: formData.get('purchaseDate') as string || new Date().toISOString().split('T')[0],
      assignedFarms: editingItem ? editingItem.assignedFarms : [],
      notes: formData.get('notes') as string,
    }

    if (editingItem) {
      setInventory(inventory.map(p => p.id === editingItem.id ? { ...p, ...data } : p))
      toast.success('Inventory item updated')
    } else {
      const newItem: InventoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        supplierPhone: '',
        purchaseLocation: '',
        invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
        batchNumber: `BATCH-${Date.now().toString().slice(-4)}`,
        ...data,
      }
      setInventory([newItem, ...inventory])
      toast.success('Stock item added successfully')
    }
    handleCloseModal()
  }

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Stock & Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track consumables, materials, and warehouse stock</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExport} className="h-11 px-5 border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 shadow-sm transition-all">
            <Download className="size-4 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger render={
              <Button onClick={() => setEditingItem(null)} className="bg-[#1d3d1e] hover:bg-black text-white h-11 px-6 shadow-lg shadow-brand/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
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
                     <Select name="category" defaultValue={editingItem?.category || 'Fertilizer'}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          {categories.slice(1).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
                     <Select name="certification" defaultValue={editingItem?.certificationStatus || 'Conventional'}>
                       <SelectTrigger><SelectValue /></SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Conventional">Conventional</SelectItem>
                          <SelectItem value="Organic">Organic</SelectItem>
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
                  <Button type="submit" form="inventory-form" className="bg-[#1d3d1e] hover:bg-black text-white px-10 font-bold uppercase tracking-widest text-[10px] shadow-md">
                    {editingItem ? 'Save Adjustments' : 'Commit to Stock'}
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
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                       <EmptyState icon={<Package className="size-10" />} title="No stock items found" description="Adjust your filters or add a new entry" />
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
                                style={{ width: `${(item.currentStockLevel / item.quantityPurchased) * 100}%` }}
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
                            <DropdownMenuItem onClick={() => handleEditClick(item)} className="gap-2 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest transition-all">
                               <ArrowRightLeft className="size-3.5 text-blue-500" /> Adjust Stock Level
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(item)} className="gap-2 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest">
                               <Edit2 className="size-3.5 text-gray-400" /> Edit Specifications
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-gray-50" />
                            <DropdownMenuItem className="gap-2 text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-bold py-2.5 px-3 rounded-lg text-[10px] uppercase tracking-widest">
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
