import { useCallback, useMemo, useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { cooperativeFarms, farmPerformanceSummary } from '~/lib/mock-data/cooperative'
import { 
  Search, 
  Filter, 
  Plus, 
  Award, 
  MapPin, 
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
  Clock
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Route } from './+types/farm'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farm Certifications | Agtrail' },
    { name: 'description', content: 'Manage farm certifications and quality standards' },
  ]
}

const ITEMS_PER_PAGE = 12

export default function FarmCertificationPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)

  // Modal form state
  const [certType, setCertType] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // Unique owners
  const owners = useMemo(() => {
    const names = new Set(cooperativeFarms.map((f) => f.owner))
    return Array.from(names).sort()
  }, [])

  // Filter farms
  const filteredFarms = useMemo(() => {
    return cooperativeFarms.filter((f) => {
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesOwner = !ownerFilter || f.owner === ownerFilter
      return matchesSearch && matchesOwner
    })
  }, [searchQuery, ownerFilter])

  // Pagination
  const totalItems = filteredFarms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedFarms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFarms.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFarms, currentPage])

  const openModal = useCallback((farmId: string) => {
    setSelectedFarmId(farmId)
    setCertType('')
    setCertOrg('')
    setDateIssued('')
    setDateExpiry('')
    setUploadedFile(null)
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setSelectedFarmId(null)
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

  const selectedFarm = useMemo(() => 
    cooperativeFarms.find(f => f.id === selectedFarmId),
  [selectedFarmId])

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
          { label: 'Farm Certifications' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farm Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">Select a farm to add or manage its quality certifications</p>
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
            placeholder="Search by name, coordinates, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={ownerFilter}
              onChange={(e) => {
                setOwnerFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-11 w-full sm:w-64 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">All Owners</option>
              {owners.map((ow) => (
                <option key={ow} value={ow}>{ow}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>
          <Button variant="outline" className="h-11 px-4 border-gray-100 text-gray-400">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {paginatedFarms.map((farm) => {
          const cropsCultivatedCount = farmPerformanceSummary.filter(p => p.farmName === farm.name).length
          const certsCount = farm.name === 'Olamide Farms' ? 1 : 0

          return (
            <div
              key={farm.id}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-brand/30 hover:shadow-lg overflow-hidden flex flex-col shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="size-14 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand transition-transform group-hover:scale-110">
                  <MapPin className="size-7" />
                </div>
                <div className="text-right">
                  <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none">
                    {farm.hectares.toFixed(1)} Hectares
                  </Badge>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-left">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors line-clamp-1">
                  {farm.name}
                </h3>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest italic leading-none">
                  <MapPin className="size-3 text-brand/40" />
                  {farm.location}
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 pb-6 border-b border-gray-50 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Crops</span>
                  <span className="text-sm font-bold text-gray-900 block">{cropsCultivatedCount} Crops</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certs</span>
                   <Badge variant="outline" className={cn(
                     "text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0 shadow-none border-dashed",
                     certsCount > 0 ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-gray-50 text-gray-400 border-gray-200"
                   )}>
                    {certsCount} Cert(s)
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => openModal(farm.id)}
                className="mt-6 h-12 w-full bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] gap-2 shadow-sm transition-all active:scale-[0.98]"
              >
                <Plus className="size-4" />
                Add Certification
              </Button>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {filteredFarms.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
            <span className="text-gray-900">Total Farms: {totalItems}</span>
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
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Certification Details</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Adding new certification for {selectedFarm?.name}</p>
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
                    Standard Type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-11 w-full flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
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
                    Certification Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <Input 
                    type="text" 
                    placeholder="e.g., GLOBALG.A.P. Level A" 
                    className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Building2 className="size-3 text-brand" /> Issuing Institution <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Bureau Veritas Certification"
                  value={certOrg}
                  onChange={(e) => setCertOrg(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none"
                />
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
                    <Clock className="size-3 text-brand" /> Expiry Date
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
