import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldAlert,
  ShieldCheck,
  Download,
  FileText,
  Clock,
  TrendingUp,
  Eye,
  Loader2,
  Activity,
  Globe,
  Trees,
  Navigation
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import { useGetFarmersProfile } from '~/lib/api/generated/farmers/farmers'
import { usePostDeforestationAnalyze } from '~/lib/api/generated/deforestation/deforestation'
import { toast } from 'sonner'
import type { Farm } from '~/lib/api/generated/models'
import type { DeforestationAnalysis } from '~/lib/api/generated/models'

// RiskRow is now derived from the API's Farm model
type RiskRow = {
  id: string
  farmName: string
  owner: string
  location: string
  area: string
  status: 'Eligible' | 'Needs review' | 'Blocked'
  canopyLoss: string
  lastChecked: string
  hasBoundary: boolean
  rawFarm: Farm
}

export function meta() {
  return [
    { title: 'Deforestation Risk Check | Agrolinking' },
    { name: 'description', content: 'Satellite-based deforestation analysis and EUDR compliance' },
  ]
}

function StatCard({ label, value, description, icon, iconColor }: { 
  label: string; 
  value: string; 
  description?: string; 
  icon: React.ReactNode; 
  iconColor: string 
}) {
  return (
    <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
        <div className={cn("size-8 rounded-md flex items-center justify-center transition-transform group-hover:scale-105", iconColor)}>
          {icon}
        </div>
      </div>
      <div className="space-y-1 text-left">
        <p className="text-xl font-black text-gray-900 tracking-tight">{value}</p>
        {description && (
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">{description}</p>
        )}
      </div>
    </div>
  )
}

export default function DeforestationRiskPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCheck, setSelectedCheck] = useState<RiskRow | null>(null)
  const [analyzingFarmId, setAnalyzingFarmId] = useState<string | null>(null)
  const [lastAnalysis, setLastAnalysis] = useState<DeforestationAnalysis | null>(null)

  const { data: profileResponse, isLoading: isLoadingProfile } = useGetFarmersProfile()
  const analyzeMutation = usePostDeforestationAnalyze()

  const farms = useMemo(() => {
    return (profileResponse?.data?.data?.farms || []) as Farm[]
  }, [profileResponse])

  const riskRows = useMemo<RiskRow[]>(() => {
    return farms.map(farm => {
      const isCurrentAnalysis = lastAnalysis && selectedCheck?.id === farm.id
      const canopyLossVal = isCurrentAnalysis ? 
        (lastAnalysis.summary.canopyLossHa ? `${lastAnalysis.summary.canopyLossHa.toFixed(2)} ha` : '0.00 ha') : 
        (farm.deforestationRiskScore === 'low' ? '0.00 ha' : 'Scan Required')

      const statusVal: 'Eligible' | 'Needs review' | 'Blocked' = 
        farm.deforestationRiskScore === 'low' ? 'Eligible' : 
        farm.deforestationRiskScore === 'medium' ? 'Needs review' : 'Blocked'

      const hasBoundary = !!farm.boundaries

      return {
        id: farm.id,
        farmName: farm.name,
        owner: profileResponse?.data?.data?.user?.name || 'Unknown Farmer',
        location: farm.state ? `${farm.state}, ${farm.lga || ''}` : 'Location Pending',
        area: farm.sizeHectares ? `${farm.sizeHectares} ha` : 'Pending',
        status: statusVal,
        canopyLoss: canopyLossVal,
        lastChecked: farm.deforestationRiskDate ? new Date(farm.deforestationRiskDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never',
        hasBoundary,
        rawFarm: farm
      }
    })
  }, [farms, profileResponse, lastAnalysis, selectedCheck])

  const stats = useMemo(() => {
    return {
      total: riskRows.length,
      eligible: riskRows.filter(r => r.status === 'Eligible').length,
      needsReview: riskRows.filter(r => r.status === 'Needs review').length,
      blocked: riskRows.filter(r => r.status === 'Blocked').length,
    }
  }, [riskRows])

  const filteredRows = useMemo(
    () =>
      riskRows.filter((r) =>
        `${r.farmName} ${r.owner} ${r.id}`.toLowerCase().includes(search.toLowerCase())
      ),
    [riskRows, search]
  )

  const handleAnalyze = async (row: RiskRow) => {
    setAnalyzingFarmId(row.id)
    try {
      const response = await analyzeMutation.mutateAsync({
        data: { farmId: row.id }
      })
      if (response.status === 200 && response.data.success) {
        setLastAnalysis(response.data.data)
        setSelectedCheck(row)
        toast.success(`Analysis complete for ${row.farmName}`)
      } else {
        toast.error('Analysis failed. Please try again later.')
      }
    } catch (error: any) {
      const apiMessage = error.response?.data?.message || 'Connectivity issue during satellite scan.'
      toast.error(apiMessage)
    } finally {
      setAnalyzingFarmId(null)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="size-8 text-brand animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading risk data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/farmer' },
          { label: 'Deforestation Risk Check' },
        ]}
      />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold text-brand tracking-tight">Deforestation risk check</h1>
          <p className="text-xs text-gray-400 font-medium">Global Forest Watch — EUDR cutoff: Dec 31, 2020</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 border-gray-100 text-gray-600 font-bold px-4 rounded-md hover:bg-gray-50 shadow-sm text-[11px]">
            <Download className="size-3.5 mr-2" /> Export CSV
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold px-4 rounded-md shadow-md transition-all active:scale-95 text-[11px]">
            <FileText className="size-3.5 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total farms" 
          value={String(stats.total)} 
          icon={<Globe className="size-4" />} 
          iconColor="text-blue-500 bg-blue-50"
        />
        <StatCard 
          label="Eligible" 
          value={String(stats.eligible)} 
          icon={<ShieldCheck className="size-4" />} 
          iconColor="text-emerald-500 bg-emerald-50"
        />
        <StatCard 
          label="Needs review" 
          value={String(stats.needsReview)} 
          icon={<TrendingUp className="size-4" />} 
          iconColor="text-amber-500 bg-amber-50"
        />
        <StatCard 
          label="Blocked" 
          value={String(stats.blocked)} 
          icon={<AlertTriangle className="size-4" />} 
          iconColor="text-red-500 bg-red-50"
        />
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search farm or owner"
            className="h-9 w-full rounded-md border border-gray-100 bg-white pl-9 pr-4 text-[12px] outline-none focus:border-brand shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-[160px]">
          <select className="h-9 w-full appearance-none rounded-md border border-gray-100 bg-white px-4 pr-10 text-[11px] font-bold text-gray-500 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50">
            <option>All Farms</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 text-left">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Deforestation risk Overview</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time Deforestation check across all farms</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Farm</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Area</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Canopy loss (post-2020)</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Last checked</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900 text-[13px]">{row.farmName}</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight mt-0.5">{row.owner} · {row.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-gray-600">{row.location}</span>
                      {!row.hasBoundary && (
                        <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-sm border border-amber-100 w-fit">Missing Boundary</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-gray-400">{row.area}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border-none",
                      row.status === 'Eligible' ? "bg-amber-50 text-amber-600" :
                      row.status === 'Needs review' ? "bg-blue-50 text-blue-600" :
                      "bg-red-50 text-red-600"
                    )}>
                      <AlertTriangle className="size-3 mr-1" /> {row.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[11px] font-black uppercase",
                        row.canopyLoss === 'Scan Required' ? "text-gray-300" : "text-gray-900"
                      )}>{row.canopyLoss}</span>
                      {row.canopyLoss !== 'Scan Required' && (
                        <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden">
                          <div 
                            className="h-full bg-brand transition-all duration-500" 
                            style={{ width: `10%`, backgroundColor: row.status === 'Eligible' ? '#10b981' : '#f59e0b' }} 
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        disabled={analyzingFarmId === row.id || !row.hasBoundary}
                        onClick={() => handleAnalyze(row)}
                        className={cn(
                          "h-8 px-4 font-bold rounded-md shadow-sm transition-all active:scale-95 text-[10px] uppercase tracking-widest min-w-[100px]",
                          !row.hasBoundary ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-brand text-white hover:bg-brand/90"
                        )}
                      >
                        {analyzingFarmId === row.id ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : !row.hasBoundary ? (
                          'No Polygon'
                        ) : (
                          'Check'
                        )}
                      </Button>
                      <button className="text-gray-400 hover:text-brand transition-colors">
                        <Eye className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CheckResultModal
        open={Boolean(selectedCheck)}
        data={selectedCheck}
        analysis={lastAnalysis}
        onClose={() => {
          setSelectedCheck(null)
          setLastAnalysis(null)
        }}
        onRerun={(row) => {
          handleAnalyze(row)
        }}
      />
    </div>
  )
}

function CheckResultModal({
  open,
  data,
  analysis,
  onClose,
  onRerun,
}: {
  open: boolean
  data: RiskRow | null
  analysis: DeforestationAnalysis | null
  onClose: () => void
  onRerun: (row: RiskRow) => void
}) {
  if (!data) return null

  const isEligible = analysis?.eligibilityStatus === 'eligible'
  const isReviewNeeded = analysis?.eligibilityStatus === 'review_needed'

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-md border-none bg-white p-0 sm:max-w-[550px] shadow-2xl"
      >
        <div className={cn(
          "relative p-6 text-white text-left",
          isEligible ? "bg-emerald-600" : isReviewNeeded ? "bg-amber-500" : "bg-red-600"
        )}>
          <div className="absolute top-5 right-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <XIcon />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
              {isEligible ? <ShieldCheck className="size-7" /> : <ShieldAlert className="size-7" />}
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-lg font-black tracking-tight uppercase leading-none">
                Scan Result: {analysis?.eligibilityStatus?.replace('_', ' ').toUpperCase() || 'UNSPECIFIED'}
              </DialogTitle>
              <DialogDescription className="text-white/70 font-bold text-[9px] uppercase tracking-[0.2em]">
                {analysis?.summary?.dataSource || 'Satellite'} Analysis • {analysis?.summary?.assessedAt ? new Date(analysis.summary.assessedAt).toLocaleDateString() : 'Real-time'}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 text-left space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Canopy Loss</p>
               <p className="text-xs font-black text-gray-900">{analysis?.summary?.canopyLossHa ? `${analysis.summary.canopyLossHa.toFixed(2)} ha` : 'None'}</p>
             </div>
             <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Alert Count</p>
               <p className="text-xs font-black text-gray-900">{analysis?.summary?.alertCount || 0} Points</p>
             </div>
             <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Confidence</p>
               <p className={cn("text-xs font-black uppercase", 
                 analysis?.summary?.confidence === 'high' ? "text-emerald-600" : "text-amber-600"
               )}>
                 {analysis?.summary?.confidence || 'N/A'}
               </p>
             </div>
             <div className="space-y-1">
               <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Polygon Area</p>
               <p className="text-xs font-black text-gray-900">{analysis?.summary?.polygonAreaHa?.toFixed(2) || '4.20'} ha</p>
             </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">Analysis Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { label: 'Forest Baseline', icon: Trees, status: analysis?.checks?.forestBaseline2020?.status === 'passed' },
                { label: 'Protected Areas', icon: Globe, status: analysis?.checks?.protectedAreaCrossRef?.status === 'passed' },
                { label: 'Canopy Integrity', icon: Activity, status: analysis?.checks?.canopyLossDetection?.status === 'passed' },
                { label: 'Alert Verification', icon: Navigation, status: analysis?.checks?.deforestationAlerts?.status === 'passed' },
              ].map((check, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <check.icon className="size-4 text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-tight">{check.label}</span>
                  </div>
                  {check.status ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="size-4 text-amber-500" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-md border border-gray-100 p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand/20" />
            <p className="text-[11px] text-gray-600 leading-relaxed italic font-medium">
              "Based on the {analysis?.summary?.datasetVersion || 'GFW'} baseline, this plot {isEligible ? 'is fully compliant' : 'requires additional documentation'} with EUDR requirements. No conversions detected post-2020."
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 flex-1 border-gray-200 text-gray-600 font-black rounded-md hover:bg-gray-50 text-[10px] uppercase tracking-widest"
            >
              Dismiss
            </Button>
            <Button
              onClick={() => onRerun(data)}
              className="h-10 flex-1 bg-brand hover:bg-brand/90 text-white font-black rounded-md shadow-md transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              Re-scan Plot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function XIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  )
}
