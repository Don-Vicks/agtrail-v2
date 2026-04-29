import { useMemo, useState, type ReactNode } from 'react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileText,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Globe,
  RefreshCcw,
  Zap,
  ExternalLink,
  ArrowRight,
  Info,
  Circle,
  CheckCircle
} from 'lucide-react'
import type { Route } from './+types/compliance-analysis'
import { FarmMap } from '~/components/farm-map.client'
import { cn } from '~/lib/utils'

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
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>{label}</SectionLabel>
        <div className={cn('size-8 rounded-lg flex items-center justify-center', iconColors[color])}>
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
            <select className="h-9 appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-[11px] font-bold text-gray-600 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50">
              <option>Filter: European Union</option>
              <option>Filter: United Kingdom</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          </div>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold text-[11px] uppercase tracking-widest rounded-lg shadow-sm px-5">
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

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
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
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none focus:border-brand shadow-sm transition-all"
              />
            </div>
            <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-bold px-5 rounded-lg hover:bg-gray-50 text-xs">
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
                      "font-bold px-3 py-1 text-[9px] uppercase rounded-lg border-none",
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
                      className="h-8 bg-brand text-white px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-brand/90 transition-all"
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
        className="overflow-hidden rounded-xl border-none bg-white p-0 sm:max-w-[650px] shadow-2xl"
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
            <div className="size-14 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
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
            <div className="mt-2 bg-gray-50 rounded-xl p-5 border border-gray-100 italic text-sm text-gray-700 leading-relaxed">
              "Satellite imagery analysis confirms zero canopy loss in plot polygons since the December 2020 EUDR cutoff. Land tenure documentation matches on-chain geolocation coordinates. Plot is cleared for export."
            </div>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-12 flex-1 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 text-xs"
            >
              Close
            </Button>
            <Button
              onClick={onRerun}
              className="h-12 flex-1 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-xs"
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
        <h1 className="text-2xl font-bold text-brand tracking-tight">Select Target Market</h1>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">
          Choose your trade destination to automatically align documentation and logistics with regional trade agreements.
        </p>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-3">
        <div className="size-10 overflow-hidden rounded-full border-2 border-brand/20">
          <img src="https://github.com/shadcn.png" alt="Profile" className="size-full object-cover" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900 tracking-tight">Mr. Tunde Fashola</h3>
          <p className="text-[10px] font-medium text-gray-400">Kano, Nigeria</p>
        </div>
      </div>

      {/* Metrics Row - Horizontal Flex */}
      <div className="flex flex-wrap items-start gap-x-16 gap-y-6 py-2 border-b border-gray-50 pb-8">
        <div className="space-y-1">
          <SectionLabel className="text-gray-400 font-black">Product</SectionLabel>
          <p className="text-2xl font-black text-brand tracking-tighter">Maize</p>
        </div>
        <div className="space-y-1">
          <SectionLabel className="text-gray-400 font-black">Batch Number</SectionLabel>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">BT192372320323</p>
        </div>
        <div className="space-y-1">
          <SectionLabel className="text-gray-400 font-black">Total Quantity</SectionLabel>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">1,340 MT</p>
        </div>
        <div className="space-y-1">
          <SectionLabel className="text-gray-400 font-black">Market Readiness</SectionLabel>
          <p className="text-2xl font-black text-brand tracking-tighter">94%</p>
        </div>
      </div>

      {/* Market List - Vertical Stack (NO GRID) */}
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
              "group relative flex items-center gap-6 rounded-xl border p-6 transition-all cursor-pointer bg-white w-full",
              market.active 
                ? "border-brand ring-1 ring-brand/5 shadow-sm" 
                : "border-gray-100 hover:border-brand/40"
            )}
            onClick={() => setStage('readiness')}
          >
            <div className={cn(
              "size-10 rounded-full flex items-center justify-center transition-colors",
              market.active ? "bg-brand/5 text-brand" : "bg-gray-50 text-gray-400 group-hover:bg-brand/5 group-hover:text-brand"
            )}>
              {market.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-gray-900 tracking-tight">{market.name}</h3>
                {market.badge && (
                  <Badge className="bg-brand text-white font-bold px-3 py-1 text-[8px] uppercase tracking-widest rounded-lg border-none">
                    {market.badge}
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed max-w-2xl">{market.desc}</p>
            </div>
            <div className="flex items-center justify-center ml-4">
               {market.active ? (
                 <div className="size-5 rounded-full border-2 border-brand flex items-center justify-center shadow-[0_0_8px_rgba(38,77,16,0.1)]">
                    <div className="size-2.5 rounded-full bg-brand" />
                 </div>
               ) : (
                 <div className="size-5 rounded-full border-2 border-gray-200 group-hover:border-brand/40 transition-colors" />
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Regulatory Requirements */}
      <div className="space-y-6 pt-10 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Info className="size-5" />
          </div>
          <h3 className="text-base font-bold text-gray-900 tracking-tight uppercase tracking-wider">Specific Regulatory Requirements</h3>
        </div>
        
        <div className="space-y-4">
           <SectionLabel className="text-gray-400 font-black">Mandatory for European Union (EU)</SectionLabel>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center text-brand border border-green-100 shrink-0">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-gray-900 tracking-tight">EU Deforestation-free regulation (EUDR)</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Requires geolocation coordinates of the production plots and verified satellite audit proof.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm group hover:shadow-md transition-all">
                <div className="size-10 rounded-lg bg-green-50 flex items-center justify-center text-brand border border-green-100 shrink-0">
                  <FileText className="size-6" />
                </div>
                <div className="space-y-1">
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
          className="h-11 px-8 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 text-[11px] uppercase tracking-widest transition-all"
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-brand tracking-tight">Compliance Readiness Review</h1>
          <p className="text-[12px] text-gray-500 font-medium flex items-center gap-2">
            <Badge className="bg-brand/10 text-brand font-bold px-3 py-1 text-[9px] uppercase rounded-lg border-none">European Union</Badge>
            Evidence requirement summary for batch BT19237320323
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-bold px-6 rounded-xl hover:bg-gray-50 text-xs">
            <Download className="size-4 mr-2" /> Save Draft
          </Button>
          <Button
            onClick={() => setStage('report')}
            className="h-10 bg-brand hover:bg-brand/90 text-white font-bold px-6 rounded-xl shadow-sm transition-all active:scale-95 text-xs"
          >
            Generate Final Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RequirementCard title="EU Deforestation Regulation (EUDR)" status="verified">
            {['Geolocation Coordinates', 'Plot Ownership Proof', 'Harvest Timestamp', 'Deforestation Check'].map((item) => (
              <CheckItem key={item} label={item} />
            ))}
          </RequirementCard>

          <RequirementCard title="ISO 22005:2007 Standards" status="verified">
            {['Batch History Log', 'Feed Source Verification', 'Processing Logs'].map((item) => (
              <CheckItem key={item} label={item} />
            ))}
          </RequirementCard>

          <RequirementCard title="Market Specific Lab Testing" status="action">
            <div className="flex items-center justify-between p-5 rounded-xl border border-amber-100 bg-amber-50/20">
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900 tracking-tight">Heavy Metal Analysis Required</p>
                <p className="text-xs text-gray-500 font-medium">Laboratory result upload is pending for this target market.</p>
              </div>
              <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-bold px-5 rounded-lg shadow-sm text-[10px] uppercase tracking-widest">
                Upload Result
              </Button>
            </div>
          </RequirementCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm space-y-8">
            <div className="space-y-3">
              <SectionLabel>Overall Readiness</SectionLabel>
              <div className="flex items-end gap-2">
                <p className="text-5xl font-black text-brand tracking-tighter">94<span className="text-2xl font-bold">%</span></p>
                <Badge className="bg-green-50 text-green-600 font-bold text-[10px] mb-2 border-none">+12%</Badge>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-50 overflow-hidden border border-gray-100/50">
                <div className="h-full w-[94%] bg-brand shadow-[0_0_8px_rgba(38,77,16,0.2)]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <PanelStat label="Product" value="Maize" />
              <PanelStat label="Batch ID" value="BT1923..." />
              <PanelStat label="Quantity" value="1,340 MT" />
              <PanelStat label="Risk Level" value="Low" />
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center space-y-5">
            <div className="size-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-brand mx-auto">
              <Upload className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-gray-900 tracking-tight">Supporting Annex</p>
              <p className="text-xs text-gray-500 font-medium">Drag & drop certification PDFs or results</p>
            </div>
            <Button variant="outline" className="h-10 w-full bg-white border-gray-200 text-gray-600 font-bold rounded-xl text-[10px] uppercase tracking-widest">
              Browse Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-1">
            <button onClick={() => setStage('readiness')} className="text-gray-400 hover:text-brand transition-colors">
              <ChevronDown className="size-5 rotate-90" />
            </button>
            <h1 className="text-xl font-bold text-brand tracking-tight">Compliance Document Preview</h1>
          </div>
          <p className="text-[12px] text-gray-500 font-medium flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" /> Document ID: AGT-REP-2026-X992
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border-gray-200 text-gray-600 font-bold px-6 rounded-xl hover:bg-gray-50 text-xs">
            <Download className="size-4 mr-2" /> Download PDF
          </Button>
          <Button className="h-10 bg-brand hover:bg-brand/90 text-white font-bold px-6 rounded-xl shadow-md transition-all active:scale-95 text-xs">
            <ExternalLink className="size-4 mr-2" /> Share with Regulator
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-1.5">
          <SectionLabel>Navigation</SectionLabel>
          <SectionButton active>Executive Summary</SectionButton>
          <SectionButton>Geolocation Proof</SectionButton>
          <SectionButton>Deforestation Audit</SectionButton>
          <SectionButton>Human Rights Check</SectionButton>
          <SectionButton>On-Chain Hash Log</SectionButton>
          
          <div className="mt-10 p-6 rounded-2xl bg-brand text-white space-y-5 relative overflow-hidden">
            <ShieldCheck className="size-10 opacity-20 absolute -right-2 -bottom-2" />
            <div className="space-y-1.5 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Immutable Status</p>
              <p className="text-[11px] opacity-80 leading-relaxed font-medium">This report is hashed on the AgTrail Public Ledger. Tamper-evident proof is publicly verifiable.</p>
            </div>
            <Button className="w-full h-9 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg border border-white/20 relative z-10">
              Verify Hash
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1.5 bg-brand" />
            <div className="p-12 space-y-12">
              <div className="flex items-start justify-between border-b border-gray-100 pb-10">
                <div className="space-y-5">
                  <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-inner">
                    <FileText className="size-7 text-brand" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">EUDR Compliance Report</h2>
                    <SectionLabel>Generated: April 29, 2026 - 10:42 AM</SectionLabel>
                  </div>
                </div>
                <div className="text-right space-y-3">
                  <Badge className="bg-green-100 text-green-700 font-bold px-4 py-1.5 text-[10px] uppercase rounded-lg border-none shadow-sm">
                    Certified Compliant
                  </Badge>
                  <p className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">0x92f...a1b2</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                <PanelStat label="Origin" value="Ogun, Nigeria" />
                <PanelStat label="Product" value="Maize (Grain)" />
                <PanelStat label="Target Market" value="European Union" />
                <PanelStat label="Consignment" value="1,340 MT" />
              </div>

              <div className="space-y-4">
                <SectionLabel>Audit Summary</SectionLabel>
                <p className="text-gray-700 leading-relaxed font-medium text-sm">
                  The consignment identified as batch BT19237320323 has been subjected to rigorous on-chain and satellite audit. Analysis of plot polygons using high-resolution satellite imagery (Sentinel-2) confirms no forest conversion since Dec 31, 2020. Geolocation accuracy is verified within &lt;5m tolerance.
                </p>
              </div>

              <div className="space-y-6">
                <SectionLabel>Polygon Geolocation</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                  <div className="space-y-4">
                    <CoordinateItem label="LAT" value="7.1475° N" />
                    <CoordinateItem label="LONG" value="3.3619° E" />
                    <CoordinateItem label="ALTITUDE" value="42m MSL" />
                  </div>
                  <div className="h-48 rounded-2xl bg-gray-100 border border-gray-100 shadow-inner overflow-hidden relative">
                     <FarmMap farms={[]} className="size-full grayscale opacity-80" />
                     <div className="absolute inset-0 bg-brand/5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-brand flex items-center justify-center text-white font-black text-sm shadow-lg shadow-brand/20">
                    AL
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-bold text-gray-900 tracking-tight uppercase">AgTrail Compliance Engine</p>
                    <SectionLabel>Digital Handoff Verified</SectionLabel>
                  </div>
                </div>
                <img src="/logo.png" alt="Logo" className="h-7 opacity-20 grayscale" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CoordinateItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-gray-50 bg-gray-50/30 font-mono text-xs">
      <span className="text-gray-400 uppercase font-bold tracking-widest">{label}</span>
      <span className="text-gray-900 font-bold">{value}</span>
    </div>
  )
}

function RequirementCard({
  title,
  status,
  children,
}: {
  title: string
  status: 'verified' | 'action'
  children: ReactNode
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center",
            status === 'verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
          )}>
            <ClipboardCheck className="size-4" />
          </div>
          <p className="text-sm font-bold text-gray-900 tracking-tight">{title}</p>
        </div>
        <Badge className={cn(
          "font-bold px-3 py-1 text-[9px] uppercase rounded-lg border-none shadow-sm",
          status === 'verified' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
        )}>
          {status === 'verified' ? 'Verified' : 'Action Required'}
        </Badge>
      </div>
      <div className="p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-2">{children}</div>
    </div>
  )
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-50 bg-gray-50/30 group hover:border-brand/20 hover:bg-white transition-all shadow-sm hover:shadow-md">
      <div className="size-6 rounded-full bg-green-50 flex items-center justify-center text-brand border border-green-100">
        <CheckCircle2 className="size-3.5" />
      </div>
      <span className="text-xs font-bold text-gray-700 tracking-tight">{label}</span>
    </div>
  )
}

function SectionButton({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "w-full rounded-xl px-5 py-3.5 text-left transition-all text-xs font-bold flex items-center gap-3",
        active 
          ? "bg-brand text-white shadow-lg shadow-brand/20" 
          : "text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-100"
      )}
    >
      <div className={cn(
        "size-2 rounded-full",
        active ? "bg-white" : "bg-gray-200"
      )} />
      {children}
    </button>
  )
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <SectionLabel>{label}</SectionLabel>
      <p className="text-sm font-bold text-gray-900 tracking-tight">{value}</p>
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
    <div className="space-y-6 pb-20">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          { label: breadcrumbLabel },
        ]}
      />

      {stage === 'risk' ? <RiskStage setStage={setStage} /> : null}
      {stage === 'target-market' ? <TargetMarketStage setStage={setStage} /> : null}
      {stage === 'readiness' ? <ReadinessStage setStage={setStage} /> : null}
      {stage === 'report' ? <ReportStage setStage={setStage} /> : null}
    </div>
  )
}
