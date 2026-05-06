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
  ChevronRight
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { FarmMap } from '~/components/farm-map.client'
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

type ComplianceStage = 'risk' | 'target-market' | 'readiness' | 'report'

type RiskRow = {
  id: string
  product: string
  farm: string
  area: string
  status: 'Eligible' | 'Needs review' | 'Blocked'
  canopyLoss: string
  lastChecked: string
}

const riskRows: RiskRow[] = [
  {
    id: 'BT19237320323',
    product: 'Maize',
    farm: 'Tunde Alaka Farms',
    area: '500MT',
    status: 'Eligible',
    canopyLoss: '0%',
    lastChecked: '23 Apr 2026',
  },
  {
    id: 'BT19237320324',
    product: 'Maize',
    farm: 'Ogun River Plots',
    area: '250MT',
    status: 'Needs review',
    canopyLoss: '2.4%',
    lastChecked: '24 Apr 2026',
  },
]

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance Analysis | Agrolinking' },
    { name: 'description', content: 'Deforestation checks and EUDR compliance workflow' },
  ]
}

function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1", className)}>
      {children}
    </p>
  )
}

function MiniStatCard({ label, value, icon, color }: { label: string; value: string; icon: ReactNode; color: 'blue' | 'green' | 'amber' | 'red' }) {
  const iconColors = {
    blue: 'text-blue-500 bg-blue-100/30',
    green: 'text-green-500 bg-green-100/30',
    amber: 'text-amber-500 bg-amber-100/30',
    red: 'text-red-500 bg-red-100/30',
  }

  return (
    <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>{label}</SectionLabel>
        <div className={cn('size-8 rounded-md flex items-center justify-center', iconColors[color])}>
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
    </div>
  )
}

function RiskStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  const [search, setSearch] = useState('')
  const [selectedCheck, setSelectedCheck] = useState<RiskRow | null>(null)

  const filteredRows = useMemo(
    () =>
      riskRows.filter((r) =>
        `${r.product} ${r.farm} ${r.id}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand tracking-tight">Deforestation Risk Check</h1>
          <p className="flex items-center gap-2 text-[12px] text-gray-500 font-medium">
            <Globe className="size-3.5" /> Global Forest Watch . EUDR cutoff: Dec 31, 2020
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="h-9 appearance-none rounded-md border border-gray-200 bg-white px-4 pr-10 text-[11px] font-bold text-gray-600 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50">
              <option>Filter: European Union</option>
              <option>Filter: United Kingdom</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold text-[11px] uppercase tracking-widest rounded-md shadow-sm px-5">
            <RefreshCcw className="size-3.5 mr-2" /> Sync Satellite
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard label="Total farms" value="12" icon={<ShieldCheck className="size-4" />} color="blue" />
        <MiniStatCard label="Eligible" value="9" icon={<CheckCircle2 className="size-4" />} color="green" />
        <MiniStatCard label="Needs review" value="2" icon={<AlertTriangle className="size-4" />} color="amber" />
        <MiniStatCard label="Blocked" value="1" icon={<ShieldAlert className="size-4" />} color="red" />
      </div>

      <div className="rounded-md border border-gray-100 bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-gray-50/20">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-tight text-gray-900">Risk Overview</h2>
            <SectionLabel>Real-time satellite analysis across plots</SectionLabel>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search farm, product or ID..."
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand shadow-sm transition-all"
              />
            </div>
            <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-bold px-5 rounded-md hover:bg-gray-50 text-xs">
              <Download className="size-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="bg-gray-50/30 border-b border-gray-100">
                {['Product & ID', 'Farm Location', 'Exportable Area', 'Status', 'Post-2020 Loss', 'Verified', ''].map((head) => (
                  <th key={head} className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRows.map((row) => (
                <tr key={row.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-900 tracking-tight text-sm uppercase">{row.product}</p>
                    <p className="text-[10px] font-bold text-brand uppercase tracking-widest">{row.id}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-bold text-gray-700">{row.farm}</p>
                    <SectionLabel>South West</SectionLabel>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-600 text-sm">{row.area}</td>
                  <td className="px-6 py-5">
                    <Badge className={cn(
                      "font-bold px-3 py-1 text-[9px] uppercase rounded-md border-none",
                      row.status === 'Eligible'
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    )}>
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">{row.canopyLoss}</span>
                      <div className="h-1.5 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={cn("h-full", row.status === 'Eligible' ? "bg-brand" : "bg-amber-500")}
                          style={{ width: row.canopyLoss === '0%' ? '5%' : row.canopyLoss }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-xs font-bold text-gray-400">{row.lastChecked}</td>
                  <td className="px-6 py-5 text-right">
                    <Button
                      onClick={() => setSelectedCheck(row)}
                      className="h-8 bg-brand text-white px-4 text-[10px] font-bold uppercase tracking-widest rounded-md hover:bg-brand/90 transition-all"
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
        className="overflow-hidden rounded-md border-none bg-white p-0 sm:max-w-[650px] shadow-2xl"
      >
        <div className="relative bg-brand p-8 text-white">
          <div className="absolute top-6 right-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <ShieldCheck className="size-7" />
            </div>
            <div className="space-y-0.5">
              <DialogTitle className="text-xl font-bold tracking-tight">Compliance Audit Result</DialogTitle>
              <DialogDescription className="text-white/60 font-bold text-[9px] uppercase tracking-[0.2em]">Satellite Tracking Active</DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 gap-x-12 gap-y-8">
            <AuditInfoItem label="Owner & Farm" value="Adebayo Okonkwo" />
            <AuditInfoItem label="Canopy Loss" value="0.0% (Verified)" status="success" />
            <AuditInfoItem label="Plot Size" value="4.2 Hectares" />
            <AuditInfoItem label="Tenure Status" value="Legally Proved" status="success" />
            <AuditInfoItem label="Location" value="Ogun State, NG" />
            <AuditInfoItem label="Data Source" value="Global Forest Watch" />
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <SectionLabel>Decision Narrative</SectionLabel>
            <div className="mt-2 bg-gray-50 rounded-md p-5 border border-gray-100 italic text-sm text-gray-700 leading-relaxed">
              "Satellite imagery analysis confirms zero canopy loss in plot polygons since the December 2020 EUDR cutoff. Land tenure documentation matches on-chain geolocation coordinates. Plot is cleared for export."
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 flex-1 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-xs"
            >
              Close
            </Button>
            <Button
              onClick={onRerun}
              className="h-12 flex-1 bg-brand hover:bg-brand/90 text-white font-bold rounded-md shadow-md transition-all active:scale-95 text-xs"
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
    <div className="space-y-1">
      <SectionLabel>{label}</SectionLabel>
      <p className={cn(
        "text-[13px] font-bold tracking-tight",
        status === 'success' ? 'text-brand' : status === 'warning' ? 'text-amber-600' : 'text-gray-900'
      )}>
        {value}
      </p>
    </div>
  )
}

function TargetMarketStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#2e7d32] tracking-tight">Select Target Market</h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          Choose your trade destination to automatically align documentation and logistics with regional trade agreements.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="size-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-sm font-bold text-gray-900">Mr. Tunde Fashola</h2>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Kaduna, Nigeria</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4">
        <StatusItem label="PRODUCT" value="Maize" valueColor="text-[#2e7d32]" />
        <StatusItem label="BATCH NUMBER" value="BT192372320323" />
        <StatusItem label="TOTAL QUANTITY" value="1,340 MT" />
        <StatusItem label="MARKET READINESS" value="94%" valueColor="text-[#2e7d32]" />
      </div>

      <div className="space-y-4">
        {[
          {
            id: 'eu',
            name: 'European Union (EU)',
            desc: 'Compliance focused on EUDR (Deforestation) and ISO quality standards. High transparency requirements.',
            icon: <Globe className="size-5" />,
            active: true,
            badge: 'ACTIVE TRADE ZONE'
          },
          {
            id: 'af',
            name: 'African Continental Free Trade Area (AfCFTA)',
            desc: 'Inter-continental trade with reduced tariffs. Requires Certificate of Origin documentation.',
            icon: <LandmarkIcon className="size-5" />,
            badge: null
          },
          {
            id: 'us',
            name: 'North America (USMCA)',
            desc: 'Labor and environmental standards focus. Requires specific phytosanitary certification.',
            icon: <Globe className="size-5" />,
            badge: null
          },
        ].map((market) => (
          <div
            key={market.id}
            className={cn(
              "group relative flex items-center gap-6 rounded-md border p-6 transition-all cursor-pointer bg-white w-full",
              market.active
                ? "border-[#2e7d32] ring-1 ring-[#2e7d32]/5 shadow-sm"
                : "border-gray-100 hover:border-[#2e7d32]/40"
            )}
            onClick={() => setStage('readiness')}
          >
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center transition-colors",
              market.active ? "bg-[#2e7d32]/5 text-[#2e7d32]" : "bg-gray-50 text-gray-400 group-hover:bg-[#2e7d32]/5 group-hover:text-[#2e7d32]"
            )}>
              {market.icon}
            </div>
            <div className="flex-1 space-y-1 text-left">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">{market.name}</h3>
                {market.badge && (
                  <Badge className="bg-[#2e7d32] text-white font-bold px-3 py-1 text-[8px] uppercase tracking-widest rounded-md border-none">
                    {market.badge}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-2xl">{market.desc}</p>
            </div>
            <div className="flex items-center justify-center ml-4">
              {market.active ? (
                <div className="size-5 rounded-full border-2 border-[#2e7d32] flex items-center justify-center shadow-[0_0_8px_rgba(38,77,16,0.1)]">
                  <div className="size-2.5 rounded-full bg-[#2e7d32]" />
                </div>
              ) : (
                <div className="size-5 rounded-full border-2 border-gray-200 group-hover:border-[#2e7d32]/40 transition-colors" />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 pt-10 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Info className="size-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-wider">Specific Regulatory Requirements</h3>
        </div>

        <div className="space-y-4">
          <SectionLabel className="text-gray-400 font-black">Mandatory for European Union (EU)</SectionLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 bg-white rounded-md border border-gray-100 shadow-sm group hover:shadow-md transition-all">
              <div className="size-10 rounded-md bg-green-50 flex items-center justify-center text-[#2e7d32] border border-green-100 shrink-0">
                <ShieldCheck className="size-6" />
              </div>
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-gray-900 tracking-tight">EU Deforestation-free regulation (EUDR)</p>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Requires geolocation coordinates of the production plots and verified satellite audit proof.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-white rounded-md border border-gray-100 shadow-sm group hover:shadow-md transition-all">
              <div className="size-10 rounded-md bg-green-50 flex items-center justify-center text-[#2e7d32] border border-green-100 shrink-0">
                <FileText className="size-6" />
              </div>
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-gray-900 tracking-tight">ISO 22005:2007</p>
                <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Traceability in the food and feed chain certification. Batch-level identification and movement log.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button
          variant="outline"
          onClick={() => setStage('risk')}
          className="h-11 px-8 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[11px] uppercase tracking-widest transition-all"
        >
          Back to Analysis
        </Button>
      </div>
    </div>
  )
}

function LandmarkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <line x1="3" y1="21" x2="21" y2="21" />
      <line x1="3" y1="7" x2="21" y2="7" />
      <line x1="10" y1="21" x2="10" y2="7" />
      <line x1="14" y1="21" x2="14" y2="7" />
      <line x1="18" y1="21" x2="18" y2="7" />
      <line x1="6" y1="21" x2="6" y2="7" />
      <path d="M12 2L3 7h18l-9-5z" />
    </svg>
  )
}

function ReadinessStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="w-full space-y-8 pb-12 text-left">
      <ReadinessHeader onReport={() => setStage('report')} />

      <div className="bg-white border-y border-gray-50 px-8 py-4 space-y-4 -mx-8">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-sm font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Kaduna, Nigeria</p>
          </div>
        </div>
        <ReportMetricsBar />
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">OVERALL READINESS</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-[#2e7d32] leading-none">94%</span>
            <span className="text-sm font-bold text-[#2e7d32] pb-1 uppercase tracking-widest">Target: 100%</span>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#2e7d32] rounded-full" style={{ width: '94%' }} />
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">14 of 15 criteria successfully met</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <VerifiedRequirementCard 
            title="EU Deforestation-free Regulation (EUDR)" 
            description="Mandatory for all timber, cocoa, and rubber exports."
            items={[
              { icon: <MapPin className="size-4" />, label: 'Geolocation Coordinates' },
              { icon: <User className="size-4" />, label: 'Plot Ownership' },
              { icon: <Calendar className="size-4" />, label: 'Time of Harvest' },
            ]}
          />
          <VerifiedRequirementCard 
            title="ISO 22005:2007 (Traceability)" 
            description="International standard for food and feed chain traceability."
            items={[
              { icon: <History className="size-4" />, label: 'Batch History' },
              { icon: <Sprout className="size-4" />, label: 'Feed Source' },
            ]}
          />

          <ActionRequiredCard icon={<FileSearch className="size-5" />} title="Lab Report" description="Phytosanitary inspection and health clearance." />
          <ActionRequiredCard icon={<Award className="size-5" />} title="GAP Certifications" description="Phytosanitary inspection and health clearance." />
          <ActionRequiredCard icon={<FileSearch className="size-5" />} title="NAFDAC Phytosanitary Certificate" description="Phytosanitary inspection and health clearance." />
        </div>

        <div className="space-y-4 pt-6">
          <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-wider">Supporting Annex</h3>
          <div className="border border-brand-surface rounded-md p-12 flex flex-col items-center justify-center bg-brand-surface/30 group hover:border-brand/20 transition-all cursor-pointer">
            <div className="size-14 rounded-md bg-white border border-brand-surface flex items-center justify-center text-brand mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="size-7" />
            </div>
            <p className="text-base font-bold text-gray-900 mb-1 text-center">Drag and drop supporting documents</p>
            <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-tighter">Accepted formats: PDF, JPG, PNG (Max 10MB each)</p>
            <p className="mt-4 text-xs font-black text-brand uppercase tracking-widest hover:underline">Browse Local Files</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="w-full space-y-6 pb-20 text-left">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-0">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black text-[#2e7d32] tracking-tight">EUDR Compliance Report</h1>
          <p className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Globe className="size-3" /> Region: South America
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 border-gray-200 text-gray-700 font-bold text-[9px] uppercase tracking-widest px-5 rounded shadow-sm hover:bg-gray-50">
            <Download className="size-3.5 mr-2" /> Download PDF
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand-light text-white font-bold text-[9px] uppercase tracking-widest px-5 rounded shadow-lg transition-all active:scale-95">
            <ExternalLink className="size-3.5 mr-2" /> Export for Regulator
          </Button>
        </div>
      </div>

      {/* User & Metrics Section - Extremely Compact */}
      <div className="bg-white border-y border-gray-100 -mx-8 px-8 py-3 space-y-3">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" alt="User" className="size-full object-cover" />
          </div>
          <div className="space-y-0">
            <h2 className="text-xs font-black text-gray-900 tracking-tight">Mr. Tunde Fashola</h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Kaduna, Nigeria</p>
          </div>
        </div>
        <ReportMetricsBar />
      </div>

      {/* Main Layout: Sidebar + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-2 items-start">
        {/* Local Sidebar */}
        <div className="lg:col-span-3 lg:sticky lg:top-24">
          <ReportSidebar />
        </div>

        {/* Report Content */}
        <div className="lg:col-span-9 space-y-12">
          <ReportOverview />
          <ReportGeolocation />
          <ReportRegulatory />
          
          <div className="flex justify-between pt-10 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={() => setStage('readiness')}
              className="h-10 px-6 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[9px] uppercase tracking-widest transition-all"
            >
              Back to Readiness
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RiskLine({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-50 pb-2 md:border-0 md:pb-0">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-[#2e7d32] uppercase tracking-widest">{status}</span>
    </div>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 space-y-1">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-gray-900 tracking-tight uppercase">{value}</p>
    </div>
  )
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5 text-left">
      <SectionLabel className="font-black text-gray-400">{label}</SectionLabel>
      <p className="text-sm font-bold text-gray-900 tracking-tight uppercase">{value}</p>
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
    <div className="pb-20">
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
