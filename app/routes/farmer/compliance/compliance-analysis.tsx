import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Info,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
  MapPin,
  User,
  Calendar,
  History,
  Sprout,
  AlertCircle,
  Lock,
  FileSearch,
  Award,
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

import { ReportMetricsBar } from '~/components/compliance/report-metrics'
import { ReportSidebar } from '~/components/compliance/report-sidebar'
import { ReportOverview } from '~/components/compliance/report-overview'
import { ReportGeolocation } from '~/components/compliance/report-geolocation'
import { ReportRegulatory } from '~/components/compliance/report-regulatory'

import { ReadinessHeader } from '~/components/compliance/readiness-header'
import { StatusItem, VerifiedRequirementCard, ActionRequiredCard } from '~/components/compliance/common'

import type { Route } from './+types/compliance-analysis'
import { useGetFarmersCompliance } from '~/lib/api/generated/farmers/farmers'

type ComplianceStage = 'risk' | 'target-market' | 'readiness' | 'report'

type RiskRow = {
  id: string
  product: string
  batchId: string
  category: string
  origin: string
  riskLevel: 'High' | 'Medium' | 'Low' | 'N/A'
  score: number
  certifications: number
  lastAudit: string
}

const riskRows: RiskRow[] = [
  {
    id: '1',
    product: 'Maize',
    batchId: 'BATCH-8022dd4d-1770974808785',
    category: 'Agricultural Product',
    origin: 'N/A',
    riskLevel: 'Medium',
    score: 0,
    certifications: 0,
    lastAudit: 'Never'
  }
]

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance Analysis | Agrolinking' },
    { name: 'description', content: 'Deforestation checks and EUDR compliance workflow' },
  ]
}

function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1", className)}>
      {children}
    </p>
  )
}

function StatCard({ label, value, description, progress, icon, iconColor }: { 
  label: string; 
  value: string; 
  description?: string; 
  progress?: number; 
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
      <div className="space-y-1.5 text-left">
        <p className="text-xl font-black text-gray-900 tracking-tight">{value}</p>
        {description && (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{description}</p>
        )}
        {progress !== undefined && (
          <div className="pt-1">
             <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ width: `${Math.max(progress, 5)}%`, backgroundColor: progress === 0 ? '#7C2D12' : '#1B4332' }} 
                />
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RiskStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  const [search, setSearch] = useState('')
  const [selectedCheck, setSelectedCheck] = useState<RiskRow | null>(null)

  const { data: complianceResponse } = useGetFarmersCompliance()
  const overallScore = complianceResponse?.data?.data?.percentage || 0

  const filteredRows = useMemo(
    () =>
      riskRows.filter((r) =>
        `${r.product} ${r.id}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold text-brand tracking-tight">Compliance Analysis</h1>
          <p className="text-xs text-gray-400 font-medium text-left">Risk assessment and compliance status across your products</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select className="h-9 appearance-none rounded-md border border-gray-100 bg-white px-4 pr-10 text-[11px] font-bold text-gray-500 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50 min-w-[160px]">
              <option>Select Destination</option>
              <option>European Union</option>
              <option>North America</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Button variant="outline" className="h-9 border-gray-100 text-gray-600 font-bold px-4 rounded-md hover:bg-gray-50 shadow-sm text-[11px]">
            <Download className="size-3.5 mr-2" /> Export CSV
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold px-4 rounded-md shadow-md transition-all active:scale-95 text-[11px]">
            <FileText className="size-3.5 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Overall Compliance" 
          value={`${overallScore}%`} 
          progress={overallScore}
          icon={<ShieldCheck className="size-4" />} 
          iconColor="text-blue-500 bg-blue-50"
        />
        <StatCard 
          label="High Risk" 
          value="0" 
          description="Products need attention"
          icon={<Clock className="size-4" />} 
          iconColor="text-red-500 bg-red-50"
        />
        <StatCard 
          label="Medium Risk" 
          value="1" 
          description="Under review"
          icon={<TrendingUp className="size-4" />} 
          iconColor="text-amber-500 bg-amber-50"
        />
        <StatCard 
          label="Low Risk" 
          value="0" 
          description="Compliant"
          icon={<ShieldCheck className="size-4" />} 
          iconColor="text-emerald-500 bg-emerald-50"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-9 w-full rounded-md border border-gray-100 bg-white pl-9 pr-4 text-[12px] outline-none focus:border-brand shadow-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative w-full sm:w-[160px]">
          <select className="h-9 w-full appearance-none rounded-md border border-gray-100 bg-white px-4 pr-10 text-[11px] font-bold text-gray-500 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50">
            <option>All Risk Levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50 text-left">
          <h3 className="text-base font-bold text-gray-900 tracking-tight">Product Compliance Overview</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Real-time status analysis</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Risk Level</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Score</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Certs</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Audit</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-[13px]">{row.product}</p>
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-tight mt-0.5">{row.batchId.slice(0, 15)}...</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[11px] font-medium text-gray-600">{row.category}</span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-gray-400">{row.origin}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border-none",
                      row.riskLevel === 'High' ? "bg-red-50 text-red-600" :
                      row.riskLevel === 'Medium' ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    )}>
                      {row.riskLevel}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{row.score}%</span>
                      <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-brand transition-all duration-500" 
                          style={{ width: `${Math.max(row.score, 5)}%`, backgroundColor: row.score === 0 ? '#7C2D12' : '#1B4332' }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-emerald-600">{row.certifications}</span>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-gray-400">{row.lastAudit}</td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      onClick={() => setSelectedCheck(row)}
                      className="h-8 bg-brand hover:bg-brand/90 text-white font-bold px-4 rounded-md shadow-sm transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                    >
                      Audit Check
                    </Button>
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
        onClose={() => setSelectedCheck(null)}
        onRerun={() => {
          setSelectedCheck(null)
          setStage('target-market')
        }}
      />
    </div>
  )
}

function CheckResultModal({
  open,
  data,
  onClose,
  onRerun,
}: {
  open: boolean
  data: RiskRow | null
  onClose: () => void
  onRerun: () => void
}) {
  if (!data) return null

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden rounded-md border-none bg-white p-0 sm:max-w-[550px] shadow-2xl"
      >
        <div className="relative bg-brand p-6 text-white text-left">
          <div className="absolute top-5 right-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-0">
              <DialogTitle className="text-lg font-bold tracking-tight uppercase">Audit Result</DialogTitle>
              <DialogDescription className="text-white/60 font-bold text-[8px] uppercase tracking-widest">Satellite tracking verified</DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 text-left">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <AuditInfoItem label="Owner & Farm" value="Adebayo Okonkwo" />
            <AuditInfoItem label="Canopy Loss" value="0.0% (Verified)" status="success" />
            <AuditInfoItem label="Plot Size" value="4.2 Hectares" />
            <AuditInfoItem label="Tenure Status" value="Legally Proved" status="success" />
            <AuditInfoItem label="Location" value="Ogun State, NG" />
            <AuditInfoItem label="Data Source" value="Global Forest Watch" />
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <SectionLabel>Decision Narrative</SectionLabel>
            <div className="mt-2 bg-gray-50 rounded-md p-4 border border-gray-100 italic text-[12px] text-gray-700 leading-relaxed">
              "Satellite analysis confirms zero canopy loss since Dec 2020. Land tenure matches geolocation coordinates. Plot is cleared for export."
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 flex-1 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[10px] uppercase tracking-widest"
            >
              Close
            </Button>
            <Button
              onClick={onRerun}
              className="h-10 flex-1 bg-brand hover:bg-brand/90 text-white font-bold rounded-md shadow-md transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              Proceed to Market
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AuditInfoItem({ label, value, status }: { label: string; value: string; status?: 'success' | 'warning' }) {
  return (
    <div className="space-y-0.5 text-left">
      <SectionLabel>{label}</SectionLabel>
      <p className={cn(
        "text-xs font-bold tracking-tight uppercase",
        status === 'success' ? 'text-brand' : status === 'warning' ? 'text-amber-600' : 'text-gray-900'
      )}>
        {value}
      </p>
    </div>
  )
}

function TargetMarketStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-8 text-left">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-brand tracking-tight">Select Target Market</h1>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Choose your trade destination to automatically align documentation with regional trade agreements.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
        </div>
        <div className="space-y-0">
          <h2 className="text-[13px] font-bold text-gray-900">Mr. Tunde Fashola</h2>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Kaduna, Nigeria</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2 border-y border-gray-50">
        <StatusItem label="PRODUCT" value="Maize" valueColor="text-brand" />
        <StatusItem label="BATCH NUMBER" value="BT1923..." />
        <StatusItem label="QUANTITY" value="1,340 MT" />
        <StatusItem label="READINESS" value="94%" valueColor="text-brand" />
      </div>

      <div className="space-y-3">
        {[
          {
            id: 'eu',
            name: 'European Union (EU)',
            desc: 'Compliance focused on EUDR (Deforestation) and ISO quality standards.',
            icon: <Globe className="size-4" />,
            active: true,
            badge: 'ACTIVE ZONE'
          },
          {
            id: 'af',
            name: 'AfCFTA',
            desc: 'Inter-continental trade with reduced tariffs. Requires Origin documentation.',
            icon: <Globe className="size-4" />,
            badge: null
          },
          {
            id: 'us',
            name: 'North America (USMCA)',
            desc: 'Labor and environmental standards focus. Requires phytosanitary cert.',
            icon: <Globe className="size-4" />,
            badge: null
          },
        ].map((market) => (
          <div
            key={market.id}
            className={cn(
              "group relative flex items-center gap-4 rounded-md border p-4 transition-all cursor-pointer bg-white w-full",
              market.active
                ? "border-brand ring-1 ring-brand/5 shadow-sm"
                : "border-gray-100 hover:border-brand/40"
            )}
            onClick={() => setStage('readiness')}
          >
            <div className={cn(
              "size-8 rounded-md flex items-center justify-center transition-colors",
              market.active ? "bg-brand/5 text-brand" : "bg-gray-50 text-gray-400"
            )}>
              {market.icon}
            </div>
            <div className="flex-1 space-y-0.5 text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-tight">{market.name}</h3>
                {market.badge && (
                  <Badge className="bg-brand text-white font-bold px-2 py-0.5 text-[7px] uppercase tracking-widest rounded-md border-none">
                    {market.badge}
                  </Badge>
                )}
              </div>
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{market.desc}</p>
            </div>
            <div className="flex items-center justify-center ml-2">
              {market.active ? (
                <div className="size-4 rounded-full border border-brand flex items-center justify-center">
                  <div className="size-2 rounded-full bg-brand" />
                </div>
              ) : (
                <div className="size-4 rounded-full border border-gray-200" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6">
        <Button
          variant="outline"
          onClick={() => setStage('risk')}
          className="h-10 px-6 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[10px] uppercase tracking-widest transition-all"
        >
          Back to Analysis
        </Button>
      </div>
    </div>
  )
}

function ReadinessStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="w-full space-y-8 pb-12 text-left">
      <ReadinessHeader onReport={() => setStage('report')} />

      <div className="bg-white border-y border-gray-50 px-8 py-4 space-y-4 -mx-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0">
            <h2 className="text-[13px] font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Kaduna, Nigeria</p>
          </div>
        </div>
        <ReportMetricsBar />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">OVERALL READINESS</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-brand leading-none">94%</span>
            <span className="text-[10px] font-bold text-brand pb-1 uppercase tracking-widest">Target: 100%</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full" style={{ width: '94%' }} />
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">14 of 15 criteria successfully met</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <VerifiedRequirementCard 
            title="EU Deforestation-free Regulation (EUDR)" 
            description="Mandatory for all timber, cocoa, and rubber exports."
            items={[
              { icon: <MapPin className="size-3.5" />, label: 'Coordinates' },
              { icon: <User className="size-3.5" />, label: 'Ownership' },
              { icon: <Calendar className="size-3.5" />, label: 'Harvest' },
            ]}
          />
          <VerifiedRequirementCard 
            title="ISO 22005:2007 (Traceability)" 
            description="International standard for food traceability."
            items={[
              { icon: <History className="size-3.5" />, label: 'History' },
              { icon: <Sprout className="size-3.5" />, label: 'Source' },
            ]}
          />

          <ActionRequiredCard icon={<FileSearch className="size-4" />} title="Lab Report" description="Phytosanitary inspection and health clearance." />
        </div>

        <div className="space-y-4 pt-6">
          <SectionLabel>Supporting Documents</SectionLabel>
          <div className="border border-dashed border-gray-100 rounded-md p-8 flex flex-col items-center justify-center bg-gray-50/50 group hover:border-brand/20 transition-all cursor-pointer">
            <div className="size-10 rounded-md bg-white border border-gray-100 flex items-center justify-center text-brand mb-3 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="size-5" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Upload supporting documents</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">PDF, JPG, PNG (Max 10MB)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="w-full space-y-6 pb-20 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0">
          <h1 className="text-2xl font-black text-brand tracking-tight uppercase">EUDR Report</h1>
          <p className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <Globe className="size-3" /> Region: South America
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-9 border-gray-100 text-gray-700 font-bold text-[9px] uppercase tracking-widest px-4 rounded-md shadow-sm hover:bg-gray-50">
            <Download className="size-3.5 mr-2" /> PDF
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold text-[9px] uppercase tracking-widest px-4 rounded-md shadow-lg transition-all active:scale-95">
            <ExternalLink className="size-3.5 mr-2" /> Export
          </Button>
        </div>
      </div>

      <div className="bg-white border-y border-gray-50 -mx-8 px-8 py-3 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0">
            <h2 className="text-[11px] font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Kaduna, Nigeria</p>
          </div>
        </div>
        <ReportMetricsBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-start">
        <div className="lg:col-span-3 lg:sticky lg:top-24">
          <ReportSidebar />
        </div>

        <div className="lg:col-span-9 space-y-10">
          <ReportOverview />
          <ReportGeolocation />
          <ReportRegulatory />
          
          <div className="flex justify-between pt-8 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setStage('readiness')}
              className="h-10 px-6 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[9px] uppercase tracking-widest transition-all"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ComplianceAnalysisPage() {
  const [stage, setStage] = useState<ComplianceStage>('risk')

  const breadcrumbLabel = useMemo(() => {
    if (stage === 'target-market') return 'Select Target Market'
    if (stage === 'readiness') return 'Compliance Readiness'
    if (stage === 'report') return 'Compliance Document'
    return 'Deforestation Analysis'
  }, [stage])

  return (
    <div className="pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
          },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="mt-6">
        {stage === 'risk' ? <RiskStage setStage={setStage} /> : null}
        {stage === 'target-market' ? <TargetMarketStage setStage={setStage} /> : null}
        {stage === 'readiness' ? <ReadinessStage setStage={setStage} /> : null}
        {stage === 'report' ? <ReportStage setStage={setStage} /> : null}
      </div>
    </div>
  )
}
