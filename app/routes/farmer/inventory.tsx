import { Fragment, useMemo, useState } from 'react'
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
import { MoreVertical, Search, Plus, Filter, Download, ChevronDown, ChevronRight, Package, Leaf, Droplets, Box, Clock } from 'lucide-react'
import { cn } from '~/lib/utils'
import { EmptyState } from '~/components/empty-state'

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
  const [activeTab, setActiveTab] = useState('All')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [stockStatusFilter, setStockStatusFilter] = useState('All')
  const [certificationFilter, setCertificationFilter] = useState('All')

  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor')
    ? '/processor'
    : location.pathname.startsWith('/cooperative')
      ? '/cooperative'
      : '/farmer'

  const categories = ['All', 'Fertilizer', 'Seeds', 'Pesticide']

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedRows(next)
  }

  const filtered = useMemo(() => {
    return mockInventory.filter((item) => {
      const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase())

      const matchesTab = activeTab === 'All' || item.category === activeTab

      const matchesStock = stockStatusFilter === 'All' || 
        (stockStatusFilter === 'Low Stock' && item.currentStockLevel <= item.minimumStockLevel) ||
        (stockStatusFilter === 'In Stock' && item.currentStockLevel > item.minimumStockLevel) ||
        (stockStatusFilter === 'Expired' && new Date(item.expiryDate) < new Date())

      const matchesCert = certificationFilter === 'All' || item.certificationStatus === certificationFilter
      
      return matchesSearch && matchesTab && matchesStock && matchesCert
    })
  }, [search, activeTab, stockStatusFilter, certificationFilter])

  const stockStats = useMemo(() => {
    const totalItems = mockInventory.length
    const lowStock = mockInventory.filter(item => item.currentStockLevel <= item.minimumStockLevel).length
    const totalValue = mockInventory.reduce((acc, item) => acc + item.totalCost, 0)
    return { totalItems, lowStock, totalValue }
  }, [])

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: basePath,
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Inventory' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">INVENTORY MANAGEMENT</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage farm inputs, seeds, and chemicals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="size-4 text-gray-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2">
            <Plus className="size-4" />
            <span>Add Stock Item</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Items"
          value={stockStats.totalItems.toString()}
          subtitle="Across all categories"
          description="Total stocked input types"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>}
        />
        <StatCard
          title="Low Stock Alert"
          value={stockStats.lowStock.toString()}
          subtitle={stockStats.lowStock > 0 ? "Requires replenishment" : "All levels healthy"}
          description="Items below minimum level"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>}
          className={stockStats.lowStock > 0 ? "border-red-100 bg-red-50/10" : ""}
        />
        <StatCard
          title="Total Value"
          value={`₦${(stockStats.totalValue / 1000).toFixed(1)}k`}
          subtitle="Estimated investment"
          description="Current inventory valuation"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm inline-flex w-fit">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === cat
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
          {/* Filters Header */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand or category..."
                className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={cn("flex items-center gap-2", (stockStatusFilter !== 'All' || certificationFilter !== 'All') && "border-brand text-brand")}>
                    <Filter className="size-4" />
                    <span>Advanced Filter</span>
                    {(stockStatusFilter !== 'All' || certificationFilter !== 'All') && <div className="size-2 rounded-full bg-brand" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Stock Status</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                      <DropdownMenuRadioItem value="All">All Levels</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="In Stock">In Stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Low Stock">Low Stock</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Expired">Expired</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Certification</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={certificationFilter} onValueChange={setCertificationFilter}>
                      <DropdownMenuRadioItem value="All">All Certs</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Conventional">Conventional</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Organic">Organic</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                  {(stockStatusFilter !== 'All' || certificationFilter !== 'All') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => { setStockStatusFilter('All'); setCertificationFilter('All') }}
                        className="text-center justify-center font-bold text-brand"
                      >
                        Reset Filters
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-semibold text-gray-600 w-10"></th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Item Details</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Brand & Source</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Inventory Status</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Valuation</th>
                  <th className="px-6 py-4 font-semibold text-gray-600">Expiry</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => (
                  <Fragment key={item.id}>
                    <tr className="hover:bg-gray-50/80 transition-colors group border-b border-gray-50">
                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand transition-colors"
                        >
                          {expandedRows.has(item.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-xl flex items-center justify-center border ${item.category === 'Fertilizer' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                              item.category === 'Seeds' ? 'bg-green-50 border-green-100 text-green-600' :
                                'bg-blue-50 border-blue-100 text-blue-600'
                            }`}>
                            {item.category === 'Fertilizer' ? <Box className="size-5" /> :
                              item.category === 'Seeds' ? <Leaf className="size-5" /> :
                                <Droplets className="size-5" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 group-hover:text-brand transition-colors leading-tight">{item.itemName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wider px-1.5 py-0 bg-gray-50 text-gray-500 font-bold border-gray-200">{item.category}</Badge>
                              <Badge className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0 ${item.certificationStatus === 'Organic' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {item.certificationStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs space-y-0.5">
                          <p className="text-gray-700 font-bold">{item.brand}</p>
                          <p className="text-gray-400 font-medium">{item.supplierName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col min-w-[120px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-gray-900">
                              {item.currentStockLevel} <span className="text-gray-400 font-medium">/ {item.quantityPurchased}</span> {item.unitOfMeasurement}
                            </span>
                            <Badge variant={item.currentStockLevel <= item.minimumStockLevel ? 'destructive' : 'secondary'} className="text-[9px] h-4 font-bold uppercase tracking-tighter sm:tracking-normal">
                              {item.currentStockLevel <= item.minimumStockLevel ? 'Low Stock' : 'In Stock'}
                            </Badge>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${item.currentStockLevel <= item.minimumStockLevel ? 'bg-red-500' : 'bg-brand'}`}
                              style={{ width: `${(item.currentStockLevel / item.quantityPurchased) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-xs">
                          <p className="text-gray-900 font-bold text-sm">₦{item.totalCost.toLocaleString()}</p>
                          <p className="text-gray-400 font-medium">₦{item.unitCost} <span className="text-[10px]">per {item.unitOfMeasurement}</span></p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className={`text-xs font-bold ${new Date(item.expiryDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>
                          {item.expiryDate}
                          {new Date(item.expiryDate) < new Date() && <span className="block text-[9px] uppercase">Expired</span>}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                              <MoreVertical className="size-4 text-gray-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer font-medium">Adjust Stock</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer font-medium">Edit Item Info</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer font-medium text-red-600">Remove from System</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                    {/* Expanded View */}
                    {expandedRows.has(item.id) && (
                      <tr className="bg-gray-50/50">
                        <td colSpan={7} className="px-6 py-0">
                          <div className="py-6 border-b border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                              {/* Supplier Details */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Supplier Info</h4>
                                <div className="space-y-2.5">
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Supplier Name</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.supplierName}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Contact Phone</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.supplierPhone}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Purchase Location</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.purchaseLocation}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Storage & Logistics */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Logistics</h4>
                                <div className="space-y-2.5">
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Storage Facility</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.storageLocation}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Batch Number</p>
                                    <p className="text-sm font-semibold text-gray-900">{item.batchNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">Invoice Number</p>
                                    <p className="text-sm font-semibold text-gray-900 font-mono">{item.invoiceNumber}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Resource Allocation */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Allocation</h4>
                                <div>
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight mb-2">Assigned Farms</p>
                                  <div className="flex flex-wrap gap-2">
                                    {item.assignedFarms.map(farm => (
                                      <Badge key={farm} variant="outline" className="bg-white text-gray-900 font-bold text-[10px]">
                                        {farm}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Notes & Audit */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200 pb-1">Additional Notes</h4>
                                <div>
                                  <p className="text-sm text-gray-600 italic bg-white p-3 rounded-lg border border-gray-100 shadow-sm leading-relaxed">
                                    "{item.notes}"
                                  </p>
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
            {filtered.length === 0 && (
              <EmptyState
                icon={<Package className="size-10" />}
                title="No inventory items found"
                description="Try adjusting your search or filters to find what you're looking for."
                action={{
                  label: "Clear all filters",
                  onClick: () => {
                    setSearch('')
                    setActiveTab('All')
                    setStockStatusFilter('All')
                    setCertificationFilter('All')
                  }
                }}
              />
            )}
          </div>

          {/* Table Footer */}
          <div className="p-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <p>Showing 1 to {filtered.length} of {filtered.length} total entries</p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-8 px-3" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
