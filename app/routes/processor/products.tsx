import { useState, useMemo } from 'react'
import { cn } from '~/lib/utils'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { EmptyState } from '~/components/empty-state'
import {
  Search,
  Plus,
  Send,
  Package,
  CheckCircle,
  Clock,
  Trash2,
  QrCode,
  Eye,
  ArrowRight,
  Filter,
  ChevronDown,
  Activity,
  LayoutDashboard,
  Boxes as BoxesIcon,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { Route } from './+types/products'
import { useGetProcessorsBatches } from '~/lib/api/generated/processors-batches/processors-batches'
import type { ProcessorBatch } from '~/lib/api/generated/models'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Product Output | Agtrail' },
    {
      name: 'description',
      content: 'Traceable products generated from verified processing batches',
    },
  ]
}

// ─── Mock Data ───

const mockTransfers = [
  {
    id: '1',
    ref: 'TRF-2026-058-0002',
    status: 'initiated',
    payment: 'pending',
    product: 'Unknown',
    qty: '90 kg',
    price: '₦89.00',
    to: 'Agro Proc',
    date: '3/9/2026',
  },
  {
    id: '2',
    ref: 'TRF-2026-058-0001',
    status: 'initiated',
    payment: 'pending',
    product: 'Unknown',
    qty: '90 kg',
    price: '₦900,000.00',
    to: 'Agrolinking Platform',
    date: '3/9/2026',
  },
  {
    id: '3',
    ref: 'BCA8FB01',
    status: 'initiated',
    payment: 'pending',
    product: 'Unknown',
    qty: '20 kg',
    price: '₦54,000.00',
    to: 'Olamide Olasukanmi',
    date: '2/21/2026',
  },
  {
    id: '4',
    ref: 'TRF-2025-044-0001',
    status: 'initiated',
    payment: 'pending',
    product: 'Unknown',
    qty: '17 kg',
    price: '₦19,999.88',
    to: 'Agrolinking Platform',
    date: '2/13/2026',
  },
  {
    id: '5',
    ref: 'TRF-2025-343-0001',
    status: 'initiated',
    payment: 'pending',
    product: 'Unknown',
    qty: '200 kg',
    price: '₦200,000.00',
    to: 'Agrolinking Platform',
    date: '12/9/2025',
  },
  {
    id: '6',
    ref: 'TRF-2025-334-0002',
    status: 'initiated',
    payment: 'completed',
    product: 'Canned Beans',
    qty: '10 kg',
    price: '₦20,000.00',
    to: 'Agrolinking Platform',
    date: '12/6/2025',
  },
]

// ─── Components ───

function InventoryTab() {
  const { data: batchesResp, isLoading } = useGetProcessorsBatches()
  const batches = batchesResp?.data?.data || []

  // Pagination & Filtering state
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredBatches = useMemo(() => {
    return batches.filter((b: any) => {
      const matchesSearch = !search || 
        b.outputProductName?.toLowerCase().includes(search.toLowerCase()) || 
        b.batchCode?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || 
        b.status?.toLowerCase() === statusFilter.toLowerCase()
        
      return matchesSearch && matchesStatus
    })
  }, [batches, search, statusFilter])

  const totalPages = Math.ceil(filteredBatches.length / rowsPerPage) || 1
  const paginatedBatches = filteredBatches.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const hasActiveFilters = search.length > 0 || statusFilter !== 'all'

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          label='Total Batches'
          value={isLoading ? '...' : batches.length.toString()}
          icon={<BoxesIcon className='size-5 text-blue-500' />}
          trend={{ value: 'Active', isPositive: true }}
        />
        <StatCard
          label='Available'
          value={
            isLoading
              ? '...'
              : batches
                  .filter((b) => b.status?.toLowerCase() === 'completed')
                  .length.toString()
          }
          icon={<CheckCircle className='size-5 text-emerald-500' />}
          trend={{ value: 'Verified', isPositive: true }}
        />
        <StatCard
          label='Pending'
          value={
            isLoading
              ? '...'
              : batches
                  .filter((b) => b.status?.toLowerCase() !== 'completed')
                  .length.toString()
          }
          icon={<Clock className='size-5 text-amber-500' />}
          trend={{ value: 'Stable', isPositive: true }}
        />
      </div>

      {/* Advanced Toolbar */}
      <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4'>
        <div className='relative w-full lg:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search products by name or batch identity...'
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className='w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none'
          />
        </div>

        <div className='flex flex-wrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0'>
          <div className='flex items-center gap-2'>
            <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1'>
              Status
            </span>
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                className='h-11 rounded-xl border border-gray-100 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]'
              >
                <option value='all'>All Status</option>
                <option value='completed'>Completed</option>
                <option value='pending'>Pending</option>
                <option value='draft'>Draft</option>
                <option value='in_progress'>In Progress</option>
              </select>
              <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none' />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant='ghost'
              className='h-11 px-4 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 gap-2'
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className='space-y-4'>
        {isLoading && (
          <div className='flex justify-center p-8'>
            <span className='text-gray-400 text-sm animate-pulse'>
              Loading batches...
            </span>
          </div>
        )}
        {!isLoading && filteredBatches.length === 0 ? (
          <EmptyState
            icon={<Package className="size-8" />}
            title={hasActiveFilters ? "No batches match your filters" : "No batches found"}
            description={hasActiveFilters ? "Try adjusting your search or filters to find what you're looking for." : "You haven't created any processing batches yet."}
            action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
          />
        ) : (
          paginatedBatches.map((item) => (
            <div
              key={item.id}
              className='group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-lg overflow-hidden flex flex-col sm:flex-row sm:items-center gap-6 shadow-sm'
            >
              <div className='absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none'>
                <Package className='size-20' />
              </div>

              <div className='flex-shrink-0 size-14 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand transition-transform group-hover:scale-110'>
                <Package className='size-7' />
              </div>

              <div className='flex-1 min-w-0 relative z-10 space-y-1'>
                <div className='flex items-center gap-3 mb-1'>
                  <h3 className='text-lg font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors'>
                    {item.outputProductName}
                  </h3>
                  <Badge
                    className={cn(
                      'px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest border shadow-none',
                      item.status?.toLowerCase() === 'completed'
                        ? 'border-green-200 bg-green-50 text-emerald-600'
                        : 'border-amber-200 bg-amber-50 text-amber-600',
                    )}
                  >
                    {item.status || 'Draft'}
                  </Badge>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic pt-2 border-t border-gray-50'>
                  <div className='space-y-1'>
                    <span className='text-gray-300 block'>Batch ID</span>
                    <span className='text-gray-900 block truncate'>
                      {item.batchCode}
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-gray-300 block'>Category</span>
                    <span className='text-gray-900 block'>
                      {item.outputProductType}
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-gray-300 block'>Quantity</span>
                    <span className='text-gray-900 block italic opacity-50'>
                      N/A
                    </span>
                  </div>
                  <div className='space-y-1'>
                    <span className='text-gray-300 block'>Date</span>
                    <span className='text-gray-900 block'>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className='relative z-10 flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-10 px-3 text-[10px] font-bold uppercase tracking-widest text-brand hover:bg-brand/5 gap-2'
                >
                  <Eye className='size-3.5' />
                  View Story
                </Button>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-10 px-3 text-[10px] font-bold uppercase tracking-widest text-brand hover:bg-brand/5 gap-2'
                >
                  <QrCode className='size-3.5' />
                  Identity Card
                </Button>
                <Button
                  size='sm'
                  className='bg-[#1b3d1e] hover:bg-black text-white h-10 px-5 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-sm'
                >
                  <Send className='size-3.5' />
                  Transfer
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && filteredBatches.length > 0 && (
        <div className="mt-8 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total Batches:</span>
            <span className="text-gray-900">{filteredBatches.length} items</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Show</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="bg-transparent border-none outline-none text-gray-900 font-bold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Page {currentPage} / {totalPages}</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 text-gray-300" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ArrowRight className="size-3.5 rotate-180" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 text-gray-400 hover:text-brand"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TransfersTab() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredTransfers = useMemo(() => {
    return mockTransfers.filter((trf) => {
      const matchesSearch = !search ||
        trf.ref?.toLowerCase().includes(search.toLowerCase()) ||
        trf.product?.toLowerCase().includes(search.toLowerCase()) ||
        trf.to?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' ||
        trf.status?.toLowerCase() === statusFilter.toLowerCase()
        
      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter])

  const totalPages = Math.ceil(filteredTransfers.length / rowsPerPage) || 1
  const paginatedTransfers = filteredTransfers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  const hasActiveFilters = search.length > 0 || statusFilter !== 'all'

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center gap-4 text-left'>
          <div className='size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600'>
            <Activity className='size-5' />
          </div>
          <div>
            <h2 className='text-base font-bold text-gray-900 uppercase tracking-tight'>
              Outgoing Transfers to Distributors
            </h2>
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5'>
              Track your product transfers and payment status
            </p>
          </div>
        </div>
      </div>

      {/* Transfers Toolbar */}
      <div className='rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4'>
        <div className='relative w-full lg:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search transfers by reference or product...'
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            className='w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none'
          />
        </div>

        <div className='flex flex-wrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0'>
          <div className='flex items-center gap-2'>
            <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1'>
              Status
            </span>
            <div className='relative'>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1) }}
                className='h-11 rounded-xl border border-gray-100 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[140px]'
              >
                <option value='all'>All Status</option>
                <option value='completed'>Completed</option>
                <option value='pending'>Pending</option>
                <option value='initiated'>Initiated</option>
              </select>
              <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none' />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant='ghost'
              className='h-11 px-4 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-50 gap-2'
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className='space-y-3'>
        {filteredTransfers.length === 0 ? (
          <EmptyState
            icon={<Activity className="size-8" />}
            title={hasActiveFilters ? "No transfers match your filters" : "No transfers found"}
            description={hasActiveFilters ? "Try adjusting your search or filters to find what you're looking for." : "You haven't initiated any product transfers yet."}
            action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
          />
        ) : (
          paginatedTransfers.map((trf) => (
            <div
              key={trf.id}
              className='flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-brand/20 transition-all group gap-6'
            >
              <div className='flex-1 w-full md:w-auto'>
                <div className='flex items-center gap-3 mb-3'>
                  <span className='text-xs font-bold text-gray-900 uppercase tracking-tight'>
                    {trf.ref}
                  </span>
                  <Badge className='bg-amber-50 text-amber-600 border-amber-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none'>
                    {trf.status} status
                  </Badge>
                  <Badge
                    className={cn(
                      'text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none border',
                      trf.payment === 'completed'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-orange-50 text-orange-600 border-orange-100',
                    )}
                  >
                    payment {trf.payment}
                  </Badge>
                </div>
                <div className='space-y-1'>
                  <span className='text-[10px] text-gray-300 font-bold uppercase tracking-widest block'>
                    Category
                  </span>
                  <span className='text-sm font-bold text-gray-900 block uppercase tracking-tight group-hover:text-brand transition-colors'>
                    {trf.product}
                  </span>
                </div>
              </div>

              <div className='flex-1 flex w-full md:w-auto items-center justify-between md:justify-around text-sm py-4 md:py-0 border-y md:border-y-0 border-gray-50'>
                <div className='space-y-1'>
                  <span className='text-[10px] text-gray-300 font-bold uppercase tracking-widest block'>
                    Quantity
                  </span>
                  <span className='text-sm font-bold text-gray-900 block'>
                    {trf.qty}
                  </span>
                </div>
                <div className='space-y-1'>
                  <span className='text-[10px] text-gray-300 font-bold uppercase tracking-widest block'>
                    Price
                  </span>
                  <span className='text-sm font-bold text-gray-900 block'>
                    {trf.price}
                  </span>
                </div>
              </div>

              <div className='flex-1 flex w-full md:w-auto flex-row-reverse md:flex-col items-center md:items-end justify-between md:justify-center'>
                <span className='text-[10px] font-bold text-gray-300 mb-2 uppercase tracking-widest italic'>
                  {trf.date}
                </span>
                <div className='flex flex-col md:items-end'>
                  <span className='text-[10px] text-gray-300 font-bold uppercase tracking-widest mb-0.5'>
                    Recipient
                  </span>
                  <span className='text-xs font-bold text-gray-900 uppercase tracking-tight'>
                    {trf.to}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      {filteredTransfers.length > 0 && (
        <div className="mt-8 border-t border-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Total Transfers:</span>
            <span className="text-gray-900">{filteredTransfers.length} items</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300">Show</span>
              <select 
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1) }}
                className="bg-transparent border-none outline-none text-gray-900 font-bold"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300">Page {currentPage} / {totalPages}</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 text-gray-300" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ArrowRight className="size-3.5 rotate-180" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-7 text-gray-400 hover:text-brand"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProcessorProducts() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transfers'>(
    'inventory',
  )

  return (
    <>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
            icon: <LayoutDashboard className='size-4 text-gray-400' />,
          },
          { label: 'Inventory' },
          { label: 'Products' },
        ]}
      />
      <div className='space-y-6 pb-10 px-1 text-left w-full overflow-x-hidden'>
        {/* Header Row */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 text-left'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 uppercase tracking-tight'>
              Products
            </h1>
            <p className='text-sm text-gray-500 mt-1'>
              Manage your processed products and inventory
            </p>
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            {/* Tabs */}
            <div className='inline-flex rounded-xl bg-gray-50/80 p-1 border border-gray-100 shadow-sm'>
              <button
                onClick={() => setActiveTab('inventory')}
                className={cn(
                  'flex h-9 items-center justify-center rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all',
                  activeTab === 'inventory'
                    ? 'bg-white text-gray-900 shadow-sm font-bold'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('transfers')}
                className={cn(
                  'flex h-9 items-center justify-center rounded-lg px-6 text-[10px] font-bold uppercase tracking-widest transition-all',
                  activeTab === 'transfers'
                    ? 'bg-white text-gray-900 shadow-sm font-bold'
                    : 'text-gray-400 hover:text-gray-600',
                )}
              >
                Outgoing Transfers
              </button>
            </div>

            <Button className='bg-[#1b3d1e] hover:bg-black text-white h-11 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-sm ml-auto sm:ml-0'>
              <Plus className='size-4' />
              Transfer to Exporter
            </Button>
          </div>
        </div>

        {activeTab === 'inventory' ? <InventoryTab /> : <TransfersTab />}
      </div>
    </>
  )
}
