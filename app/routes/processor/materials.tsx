import { useMemo, useState } from 'react'
import { AddMaterialModal, type NewMaterialData } from '~/components/add-material-modal'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { DatePicker } from '~/components/ui/date-picker'
import { Button } from '~/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import { Plus, Search, Filter, Download, MoreHorizontal, Package, ClipboardList, Clock, ArrowRight, ChevronDown, LayoutDashboard } from 'lucide-react'
import { EmptyState } from '~/components/empty-state'
import { Badge } from '~/components/ui/badge'
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches'
import type { ProcessorBatch } from '~/lib/api/generated/models'
import { getOrganizationHeaders } from '~/lib/organization-context'

// ─── Mock Data ───

interface Material {
  id: string
  batchId: string
  material: string
  type: string
  status?: string
  sourceType: 'platform' | 'external'
  farmerSource: string
  materialSource: string
  quantity: string
  quantityValue?: number
  unit?: string
  harvested: string
  received: string
}

const mockMaterials: Material[] = []

// ─── Shared Components moved to central directory ───

// MiniStat and TabButton removed to use global standards


export default function ProcessorMaterials() {
  const [activeTab, setActiveTab] = useState('Platform Materials')
  const [manualMaterials, setManualMaterials] = useState<Material[]>(mockMaterials)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const organizationHeaders = getOrganizationHeaders()
  const {
    data: batchesResponse,
    isLoading: isBatchesLoading,
    isError: isBatchesError,
  } = useGetProcessorsBatches({
    request: { headers: organizationHeaders },
  })

  const platformMaterials = useMemo(() => {
    const rows = (batchesResponse?.data?.data || []) as ProcessorBatch[]
    return rows.map((b) => ({
      id: b.id,
      batchId: b.batchCode,
      material: b.outputProductName || 'Batch Material',
      type: b.outputProductType || 'processed',
      status: b.status || 'pending',
      sourceType: 'platform' as const,
      farmerSource: b.createdBy || 'System',
      materialSource: b.facilityName || b.facilityLocation || 'Platform',
      quantity: 'N/A',
      harvested: b.packagingDate
        ? new Date(b.packagingDate).toLocaleDateString()
        : 'N/A',
      received: b.createdAt
        ? new Date(b.createdAt).toLocaleDateString()
        : 'N/A',
    }))
  }, [batchesResponse])

  const materials = useMemo(() => {
    if (activeTab === 'External Materials') return manualMaterials
    if (activeTab === 'Incoming Materials') {
      return platformMaterials.filter(
        (m) =>
          (m.status || '').toLowerCase() === 'pending' ||
          (m.status || '').toLowerCase() === 'in_progress',
      )
    }
    return [...platformMaterials, ...manualMaterials]
  }, [activeTab, platformMaterials, manualMaterials])

  const showPlatformFilters = activeTab === 'Platform Materials'
  const showExternalSummary = activeTab === 'External Materials'

  const parseDecimal = (value: string) => {
    const normalized = value.replace(/,/g, '').trim()
    const parsed = Number.parseFloat(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)))

  const sourceFarmerOptions = useMemo(
    () => unique(platformMaterials.map((m) => m.farmerSource)),
    [platformMaterials],
  )
  const sourceOptions = useMemo(
    () => unique(platformMaterials.map((m) => m.materialSource)),
    [platformMaterials],
  )
  const materialOptions = useMemo(
    () => unique(platformMaterials.map((m) => m.material)),
    [platformMaterials],
  )

  const platformInStockCount = useMemo(
    () =>
      platformMaterials.filter((m) => {
        const status = (m.status || '').toLowerCase()
        return status === 'completed' || status === 'approved' || status === 'done'
      }).length,
    [platformMaterials],
  )
  const platformLowStockCount = useMemo(
    () =>
      platformMaterials.filter((m) => {
        const status = (m.status || '').toLowerCase()
        return status === 'pending' || status === 'in_progress' || status === 'in transit'
      }).length,
    [platformMaterials],
  )

  const externalTotalQuantity = useMemo(
    () => manualMaterials.reduce((sum, m) => sum + (m.quantityValue || 0), 0),
    [manualMaterials],
  )
  const externalBaseUnit = manualMaterials.find((m) => m.unit)?.unit || 'kg'
  const externalInStockCount = useMemo(
    () => manualMaterials.filter((m) => (m.quantityValue || 0) > 10).length,
    [manualMaterials],
  )
  const externalLowStockCount = useMemo(
    () => manualMaterials.filter((m) => (m.quantityValue || 0) > 0 && (m.quantityValue || 0) <= 10).length,
    [manualMaterials],
  )

  const handleAddMaterial = (data: NewMaterialData) => {
    const newBatchId = data.lotBatchNumber?.trim()
      ? data.lotBatchNumber.trim()
      : `BATCH-${Math.random().toString(36).substring(2, 10)}-${Date.now()}`
    const quantityValue = parseDecimal(data.quantityPurchased)

    const formatDisplayDate = (d: string) => {
      if (!d) return ''
      const parts = d.split('-')
      if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`
      return d
    }

    const newMaterial: Material = {
      id: Math.random().toString(36).substr(2, 9),
      batchId: newBatchId,
      material: data.materialName,
      type: data.certifications || 'External Material',
      status: quantityValue > 10 ? 'in_stock' : quantityValue > 0 ? 'low_stock' : 'out_of_stock',
      sourceType: 'external',
      farmerSource: data.supplierName,
      materialSource: [data.originRegion, data.originCountry].filter(Boolean).join(', ') || data.originCountry,
      quantity: `${data.quantityPurchased} ${data.unit}`,
      quantityValue,
      unit: data.unit,
      harvested: formatDisplayDate(data.purchaseDate),
      received: formatDisplayDate(data.receivedDate || data.purchaseDate),
    }

    setManualMaterials(prev => [...prev, newMaterial])
  }

  return (
    <>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Operations' },
          { label: 'Raw Materials' },
        ]}
      />
      <div className="space-y-6 pb-10 px-1 text-left w-full overflow-x-hidden">

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Raw Materials</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your raw material intake and inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 h-11 text-gray-600 font-bold uppercase tracking-tight text-xs border-gray-200">
            <Download className="size-4" />
            <span>Export List</span>
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm"
          >
            <Plus className="size-4" />
            <span className="font-bold uppercase tracking-wide text-xs">Add Material</span>
          </Button>
        </div>
      </div>

      {/* 3 Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Cooperatives" 
          value="1" 
          subtitle="From App"
          description="Verified cooperative transfers"
          icon={<Package className="size-4" />}
        />
        <StatCard 
          title="Manual Entry" 
          value={manualMaterials.length.toString()} 
          subtitle="Offline"
          description="Manually added materials"
          icon={<ClipboardList className="size-4" />}
        />
        <StatCard 
          title="In Transit" 
          value={platformMaterials.length.toString()} 
          subtitle="Pending receipt"
          description="Incoming from cooperatives"
          icon={<Clock className="size-4" />}
          trend="neutral"
        />
      </div>

      {/* Material Sources Panel */}
      <div className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm inline-flex w-fit">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('Platform Materials')}
            className={cn(
              "px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              activeTab === 'Platform Materials'
                ? "bg-brand text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Platform Materials
          </button>
          <button
            onClick={() => setActiveTab('External Materials')}
            className={cn(
              "px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              activeTab === 'External Materials'
                ? "bg-brand text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            External Materials
          </button>
          <button
            onClick={() => setActiveTab('Incoming Materials')}
            className={cn(
              "px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
              activeTab === 'Incoming Materials'
                ? "bg-brand text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            Incoming Materials
          </button>
        </div>
      </div>

      {showPlatformFilters && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <Filter className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Filters</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Filter raw material records</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Source Farmer</label>
              <div className="relative">
                <select className="w-full h-11 rounded-lg border border-gray-200 pl-3 pr-10 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white appearance-none">
                  <option>All System Farmers</option>
                  {sourceFarmerOptions.map((farmer) => (
                    <option key={farmer} value={farmer}>
                      {farmer}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Source</label>
              <div className="relative">
                <select className="w-full h-11 rounded-lg border border-gray-200 pl-3 pr-10 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white appearance-none">
                  <option>All Sources</option>
                  {sourceOptions.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Material</label>
              <div className="relative">
                <select className="w-full h-11 rounded-lg border border-gray-200 pl-3 pr-10 text-xs font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-white appearance-none">
                  <option>All Materials</option>
                  {materialOptions.map((materialOption) => (
                    <option key={materialOption} value={materialOption}>
                      {materialOption}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[500px] mb-8">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block font-mono">Start Date</label>
              <DatePicker 
                value={startDate} 
                onChange={setStartDate} 
                placeholder="Start range"
                className="w-full text-xs font-bold uppercase tracking-wider text-gray-700 h-11 rounded-lg border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block font-mono">End Date</label>
              <DatePicker 
                value={endDate} 
                onChange={setEndDate} 
                placeholder="End range"
                className="w-full text-xs font-bold uppercase tracking-wider text-gray-700 h-11 rounded-lg border border-gray-200 focus:border-brand focus:ring-1 focus:ring-brand outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-50">
            {[
              { label: 'Total Products', value: platformMaterials.length.toString() },
              { label: 'Platform Materials', value: `${platformMaterials.length}` },
              { label: 'In Stock', value: platformInStockCount.toString() },
              { label: 'Low Stock', value: platformLowStockCount.toString() },
            ].map((stat, i) => (
              <div key={i} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showExternalSummary && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">External Materials Inventory</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Track materials sourced from external suppliers</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Total Products', value: manualMaterials.length.toString() },
              { label: 'External Materials', value: `${externalTotalQuantity.toFixed(2)} ${externalBaseUnit}` },
              { label: 'In Stock', value: externalInStockCount.toString() },
              { label: 'Low Stock', value: externalLowStockCount.toString() },
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50/50 rounded-xl p-4 border border-gray-100/50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Raw Materials */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 bg-white border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Materials</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">List of available raw materials</p>
            </div>
            <div className="relative w-full sm:w-[320px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials by batch ID or source..."
                className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isBatchesLoading ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 w-full animate-pulse rounded bg-gray-100" />
              ))}
            </div>
          ) : null}
          {isBatchesError ? (
            <EmptyState
              icon={<Package className="size-10" />}
              title="Failed to load processor materials"
              description="Could not load materials from processor batches."
              className="py-10"
            />
          ) : null}
          {!isBatchesLoading && !isBatchesError ? (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Batch ID</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Material</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Farmer Source</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Material Source</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Quantity</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Harvest Date</th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">Date Received</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {materials.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4 font-bold text-gray-900 tracking-tight">{row.batchId}</td>
                  <td className="px-5 py-4 font-bold text-gray-700">{row.material}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500 truncate max-w-[150px]">{row.type}</td>
                  <td className="px-5 py-4 text-xs font-bold text-gray-900 italic">{row.farmerSource}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500">{row.materialSource}</td>
                  <td className="px-5 py-4 font-bold text-gray-900 tracking-tight">{row.quantity}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500">{row.harvested}</td>
                  <td className="px-5 py-4 text-xs font-medium text-gray-500">{row.received}</td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-gray-900">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : null}
          {!isBatchesLoading && !isBatchesError && materials.length === 0 && (
            <EmptyState
              icon={<Package className="size-10" />}
              title="No materials found"
              description="No raw materials have been added to your inventory yet."
              action={{
                label: "Add External Material",
                onClick: () => setIsAddModalOpen(true)
              }}
            />
          )}
        </div>

        <div className="border-t border-gray-100 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total Records:</span>
            <span className="text-gray-900">{materials.length} Material Records</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Show</span>
              <select className="bg-transparent border-none outline-none text-gray-900 font-bold">
                <option>10</option>
                <option>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Page 1 / 1</span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="size-7 text-gray-300" disabled>
                  <ArrowRight className="size-3.5 rotate-180" />
                </Button>
                <Button variant="ghost" size="icon" className="size-7 text-gray-400 hover:text-brand">
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

        <AddMaterialModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={handleAddMaterial} 
        />
      </div>
    </>
  )
}
