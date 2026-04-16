import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { EmptyState } from '~/components/empty-state'
import { CERTIFICATION_TYPES } from '~/lib/data/certification-types'
import { DatePicker } from '~/components/ui/date-picker'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import {
  getGetCertificationsQueryKey,
  useGetCertifications,
  usePostCertificationsUpload,
} from '~/lib/api/generated/certifications/certifications'
import {
  getGetCooperativesFarmsQueryKey,
  useGetCooperativesFarms,
} from '~/lib/api/generated/cooperatives/cooperatives'
import type { PostCertificationsUploadBody } from '~/lib/api/generated/models'
import { resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  ShieldCheck,
  X,
  CheckCircle2,
  LayoutDashboard,
  Building2,
  FileText,
  ChevronDown,
  ArrowRight,
  UploadCloud,
  Clock,
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

type UiFarm = {
  id: string
  name: string
  location: string
  hectares: number
}

export default function FarmCertificationPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null)

  const [certType, setCertType] = useState('')
  const [certName, setCertName] = useState('')
  const [certOrg, setCertOrg] = useState('')
  const [dateIssued, setDateIssued] = useState('')
  const [dateExpiry, setDateExpiry] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const { data: farmsResp, isLoading: farmsLoading, error: farmsError } = useGetCooperativesFarms()
  const apiFarms = useMemo(() => farmsResp?.data?.data ?? [], [farmsResp])

  const uiFarms: UiFarm[] = useMemo(
    () =>
      apiFarms.map((f) => ({
        id: f.id,
        name: f.name || 'Unnamed farm',
        location: f.state?.trim() || 'Location not specified',
        hectares: Number(f.totalArea) || 0,
      })),
    [apiFarms],
  )

  const { data: certsResp } = useGetCertifications()
  const certList = useMemo(() => {
    const raw = certsResp?.data?.data
    return Array.isArray(raw) ? raw : []
  }, [certsResp])

  const farmCertCount = useCallback(
    (farmId: string) =>
      certList.filter((c) => {
        const t = (c.entityType || '').toLowerCase()
        if (t.includes('farm_product') || t.includes('product') || t.includes('batch')) return false
        return t.includes('farm') && c.entityId === farmId
      }).length,
    [certList],
  )

  const states = useMemo(() => {
    const s = new Set(uiFarms.map((f) => f.location).filter(Boolean))
    return Array.from(s).sort()
  }, [uiFarms])

  const filteredFarms = useMemo(() => {
    return uiFarms.filter((f) => {
      const matchesSearch =
        !searchQuery ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.location.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesState = !stateFilter || f.location === stateFilter
      return matchesSearch && matchesState
    })
  }, [searchQuery, stateFilter, uiFarms])

  const totalItems = filteredFarms.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const paginatedFarms = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredFarms.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredFarms, currentPage])

  const openModal = useCallback((farmId: string) => {
    setSelectedFarmId(farmId)
    setCertType('')
    setCertName('')
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

  const { mutateAsync: uploadCert, isPending: isSavingCertification } = usePostCertificationsUpload()
  const { mutateAsync: uploadDocument, isPending: isUploadingDocument } = usePostUpload()
  const isSaving = isSavingCertification || isUploadingDocument

  const handleSave = async () => {
    if (!selectedFarmId || !certType || !uploadedFile) {
      toast.error('Select certification type, farm, and upload a document')
      return
    }
    try {
      const uploadResponse = await uploadDocument({
        data: { farmCertificate: uploadedFile },
      })
      const uploadedUrl = uploadResponse?.data?.urls?.[0]
      const documentUrl = resolveDocumentUrlForApi(uploadedUrl)
      if (!documentUrl) {
        toast.error('Upload succeeded but no document URL was returned')
        return
      }

      const issueDate = dateIssued
        ? new Date(dateIssued).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
      const expiryDate = dateExpiry
        ? new Date(dateExpiry).toISOString().split('T')[0]
        : undefined

      await uploadCert({
        data: {
          certificationTypeId: certType,
          certifiedEntityType: 'farm',
          farmId: selectedFarmId,
          certificateNumber: certName || certOrg || undefined,
          issueDate,
          expiryDate,
          documentUrl,
        } as PostCertificationsUploadBody,
      })

      await queryClient.invalidateQueries({ queryKey: getGetCertificationsQueryKey() })
      await queryClient.invalidateQueries({ queryKey: getGetCooperativesFarmsQueryKey() })

      toast.success('Farm certification saved')
      closeModal()
    } catch (e) {
      console.error(e)
      toast.error('Failed to save certification')
    }
  }

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

  const selectedFarm = useMemo(
    () => uiFarms.find((f) => f.id === selectedFarmId),
    [selectedFarmId, uiFarms],
  )

  if (farmsError) {
    return (
      <div className="space-y-6 pb-10 px-1">
        <PageHeader
          items={[
            { label: 'Dashboard', href: '/cooperative', icon: <LayoutDashboard className="size-4 text-gray-400" /> },
            { label: 'Certifications', href: '/cooperative/certifications' },
            { label: 'Farm Certifications' },
          ]}
        />
        <EmptyState title="Could not load farms" description="Check your connection and try again." />
      </div>
    )
  }

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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Farm Certifications</h1>
          <p className="text-sm text-gray-500 mt-1">Select a farm to upload a quality or audit certificate</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by farm name or state…"
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
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="h-11 w-full sm:w-64 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
            >
              <option value="">All locations</option>
              {states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
          </div>
          <Button variant="outline" className="h-11 px-4 border-gray-100 text-gray-400" type="button" aria-label="Filters">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {farmsLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      )}

      {!farmsLoading && uiFarms.length === 0 && (
        <EmptyState
          title="No farms in this cooperative"
          description="When farms are registered, you can attach certifications here."
        />
      )}

      {!farmsLoading && uiFarms.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedFarms.map((farm) => {
            const certsCount = farmCertCount(farm.id)
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
                      {farm.hectares.toFixed(1)} ha
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
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</span>
                    <span className="text-sm font-bold text-gray-900 block">{farm.hectares.toFixed(1)} ha</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Certs</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0 shadow-none border-dashed',
                        certsCount > 0
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200',
                      )}
                    >
                      {certsCount} on file
                    </Badge>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => openModal(farm.id)}
                  className="mt-6 h-12 w-full bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] gap-2 shadow-sm transition-all active:scale-[0.98]"
                >
                  <Plus className="size-4" />
                  Add certification
                </Button>
              </div>
            )
          })}
        </div>
      )}

      {filteredFarms.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-10 border-t border-gray-50 text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-brand/30 animate-pulse" />
            <span className="text-gray-900">Total farms: {totalItems}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-300 lowercase">
                Page {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-300"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ArrowRight className="size-4 rotate-180" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-gray-400 hover:text-brand transition-all"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={closeModal} />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-8 border-b border-gray-50 flex items-start justify-between text-left">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center text-brand">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Certification details</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {selectedFarm ? `Farm: ${selectedFarm.name}` : ''}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal} className="rounded-xl text-gray-400 hover:bg-gray-50">
                <X className="size-5" />
              </Button>
            </div>

            <div className="p-8 space-y-8 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Standard type <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={certType}
                      onChange={(e) => setCertType(e.target.value)}
                      className="h-11 w-full flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none"
                    >
                      <option value="">Select type</option>
                      {CERTIFICATION_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    Certificate name / ID
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., GLOBALG.A.P. Level A"
                    value={certName}
                    onChange={(e) => setCertName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Building2 className="size-3 text-brand" /> Issuing institution <span className="text-red-500 font-bold">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Bureau Veritas"
                  value={certOrg}
                  onChange={(e) => setCertOrg(e.target.value)}
                  className="h-11 w-full rounded-xl border border-gray-100 bg-gray-50/50 px-4 text-sm font-bold uppercase text-gray-700 focus:border-brand shadow-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Calendar className="size-3 text-brand" /> Issuance date
                  </label>
                  <DatePicker value={dateIssued} onChange={setDateIssued} className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Clock className="size-3 text-brand" /> Expiry date
                  </label>
                  <DatePicker value={dateExpiry} onChange={setDateExpiry} className="h-11 rounded-xl border-gray-100 bg-gray-50/50 shadow-none border" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Certification document (PDF / image) <span className="text-red-500 font-bold">*</span>
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault()
                    setDragOver(true)
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  className={cn(
                    'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer',
                    dragOver
                      ? 'border-brand bg-brand/5 scale-[0.98]'
                      : 'border-gray-100 bg-gray-50/30 hover:bg-white hover:border-brand/20',
                  )}
                >
                  {uploadedFile ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <FileText className="size-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-gray-900">{uploadedFile.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setUploadedFile(null)
                          }}
                          className="mt-2 text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                        >
                          Remove document
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex w-full cursor-pointer flex-col items-center gap-3">
                      <div className="size-12 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand">
                        <UploadCloud className="size-6" />
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Drop or select file</span>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Max 10MB (PDF/JPG/PNG)</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                    </label>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="button"
                  disabled={isSaving || !certType || !uploadedFile}
                  onClick={() => void handleSave()}
                  className="h-14 w-full bg-[#1b3d1e] hover:bg-black text-white font-bold uppercase tracking-widest text-[11px] gap-3 shadow-xl shadow-brand/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                >
                  <CheckCircle2 className="size-5" />
                  {isSaving ? 'Saving…' : 'Save certification'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
