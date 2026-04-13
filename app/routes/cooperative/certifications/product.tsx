import { QRCodeSVG } from 'qrcode.react'
import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { farmPerformanceSummary } from '~/lib/mock-data/cooperative'
import { 
  Search, 
  Filter, 
  Plus, 
  Award, 
  Package, 
  Calendar, 
  ShieldCheck, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Building2,
  FileText,
  ChevronDown,
  ArrowRight,
  ClipboardList,
  UploadCloud,
  QrCode
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Route } from './+types/product'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Product Certifications | Agtrail' },
    { name: 'description', content: 'Manage product certifications and quality verification' },
  ]
}

const ITEMS_PER_PAGE = 8

export default function ProductCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [farmFilter, setFarmFilter] = useState('')
  const [productFilter, setProductFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null)

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique farm names from summary
  const farmNames = useMemo(() => {
    const names = new Set(farmPerformanceSummary.map((p) => p.farmName))
    return Array.from(names).sort()
  }, [])

  // Unique product names
  const productNames = useMemo(() => {
    const names = new Set(farmPerformanceSummary.map((p) => p.product))
    return Array.from(names).sort()
  }, [])

  // Filter batches
  const filteredBatches = useMemo(() => {
    return farmPerformanceSummary.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.farmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFarm = !farmFilter || p.farmName === farmFilter
      const matchesProduct = !productFilter || p.product === productFilter
      return matchesSearch && matchesFarm && matchesProduct
    })
  }, [searchQuery, farmFilter, productFilter])

  // Pagination
  const totalItems = filteredBatches.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedBatches = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBatches.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBatches, currentPage])

  // Reset page when filters change
  const updateFilters = useCallback((setter: (v: string) => void, value: string) => {
    setter(value)
    setCurrentPage(1)
  }, [])

  const openModal = useCallback((batchId: string) => {
    setSelectedBatchId(batchId)
    setCertType('')
    setCertOrg('')
    setDateIssued('')
    setDateExpiry('')
    setUploadedFile(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedBatchId(null)
  }, [])

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setUploadedFile(file)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }, [])

  const selectedBatch = useMemo(() => 
    farmPerformanceSummary.find(b => b.id === selectedBatchId),
  [selectedBatchId])

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Certifications', href: '/cooperative/certifications' },
          { label: 'Product Certifications' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Product Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage quality certifications and audits for products and batches</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
            <ClipboardList className="size-4" />
            View All
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by batch ID, product, or farm..."
            value={searchQuery}
            onChange={(e) => updateFilters(setSearchQuery, e.target.value)}
            className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={farmFilter}
              onChange={(e) => updateFilters(setFarmFilter, e.target.value)}
              className="h-11 w-full sm:w-48 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">Origin: All</option>
              {farmNames.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={productFilter}
              onChange={(e) => updateFilters(setProductFilter, e.target.value)}
              className="h-11 w-full sm:w-48 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">Product: All</option>
              {productNames.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>
          
          <Button variant="outline" className="h-11 px-4 border-gray-100 text-gray-400">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {paginatedBatches.map((batch) => (
          <div
            key={batch.id}
            className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-lg overflow-hidden flex flex-col shadow-sm"
          >
            {/* Top row: QR + Batch ID */}
            <div className="flex items-start justify-between mb-6">
              <div className="rounded-2xl border border-gray-100 p-2 bg-white shadow-sm group-hover:scale-105 transition-transform">
                <QRCodeSVG value={batch.id} size={64} />
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none">
                  Batch ID: {batch.id.slice(0, 12)}...
                </Badge>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">Tracked Batch</span>
              </div>
            </div>

            {/* Product info */}
            <div className="flex-1 space-y-2 text-left">
              <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors">{batch.product}</h3>
              <div className="flex items-center gap-3">
                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">
                  <Building2 className="size-3 text-brand/40" />
                  {batch.farmName}
                </div>
                <span className="size-1 rounded-full bg-gray-200" />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Certification Body</span>
              </div>
            </div>

            {/* Verification Status */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certification Status</span>
                 <Badge variant="outline" className={cn(
                   "text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 shadow-none border-dashed flex items-center gap-1.5 w-fit",
                   batch.id.includes('8022') ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"
                 )}>
                  {batch.id.includes('8022') ? <CheckCircle2 className="size-3" /> : <ShieldCheck className="size-3" />}
                  {batch.id.includes('8022') ? 'Verified' : 'Pending Certification'}
                </Badge>
              </div>
              
              <Button
                onClick={() => openModal(batch.id)}
                className="h-11 bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[10px] px-6 gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Plus className="size-3.5" />
                Add Certification
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredBatches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="size-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
             <Package className="size-10 text-gray-200" />
          </div>
          <h3 className="text-base font-bold text-gray-400 uppercase tracking-widest italic">No Products Found</h3>
          <p className="text-[10px] text-gray-300 uppercase tracking-tight mt-2">Try adjusting your filters or search terms</p>
          <Button variant="ghost" className="mt-6 text-brand font-bold uppercase tracking-widest text-[10px]" onClick={() => { setSearchQuery(''); setFarmFilter(''); setProductFilter('') }}>Reset Filters</Button>
        </div>
      )}

      {/* Pagination */}
      {filteredBatches.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
            <span className="text-gray-900">Total Products: {totalItems}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 lowercase">Page {currentPage} / {totalPages}</span>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-gray-300" 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ArrowRight className="size-4 rotate-180" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-8 text-gray-400 hover:text-brand transition-all" 
                  disabled={currentPage >= totalPages} 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 flex items-start justify-between text-left">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                  <Award className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Certification Details</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adding certification for {selectedBatch?.product}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl text-gray-400 hover:bg-gray-50">
                <X className="size-5" />
              </Button>
            </div>

            {/* Form Body */}
            <div className="p-8 space-y-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Verification Type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-11 w-full flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none font-bold"
                    >
                      <option value="">Select Type</option>
                      {CERTIFICATION_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Issuing Institution <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., NAFDAC / SON"
                    value={certOrg}
                    onChange={(e) => setCertOrg(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Calendar className="size-3 text-brand" /> Issuance Date
                  </label>
                  <DatePicker value={dateIssued} onChange={setDateIssued} className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <QrCode className="size-3 text-brand" /> Expiry Date
                  </label>
                  <DatePicker value={dateExpiry} onChange={setDateExpiry} className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Certification Document (PDF / IMAGE) <span className="text-red-500 font-bold">*</span>
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer",
                    dragOver ? "border-brand bg-brand/5 scale-[0.98]" : "border-gray-100 bg-gray-50/30 hover:bg-white hover:border-brand/20"
                  )}
                >
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileText className="size-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900 group-hover:text-brand transition-colors">{uploadedFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null) }}
                          className="mt-2 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                          Remove Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center gap-3">
                      <div className="size-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand">
                        <UploadCloud className="size-6" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Drop or Select File</span>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Max file size: 10MB (PDF/JPG/PNG)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  onClick={closeModal}
                  className="h-14 w-full bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-brand/20 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                  <CheckCircle2 className="size-5" />
                  Save Certification
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
