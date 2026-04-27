import { useMemo, useState, type ReactNode } from 'react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileText,
  LayoutDashboard,
  MapPin,
  Search,
  ShieldAlert,
  ShieldCheck,
  Upload,
} from 'lucide-react'
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
]

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance Analysis | Agrolinking' },
    { name: 'description', content: 'Deforestation checks and EUDR compliance workflow' },
  ]
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
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2e7d32]">Deforestation Risk Check</h1>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            Global Forest Watch - EUDR cutoff: Dec 31, 2020
          </p>
        </div>
        <div className="relative w-full max-w-[220px]">
          <select className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-brand">
            <option>Select Destination</option>
            <option>European Union</option>
            <option>United Kingdom</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat title="Total farms" value="8" icon={<ShieldCheck className="size-4 text-blue-500" />} />
        <MiniStat title="Eligible" value="0" icon={<CheckCircle2 className="size-4 text-green-500" />} />
        <MiniStat title="Needs review" value="1" icon={<AlertTriangle className="size-4 text-amber-500" />} />
        <MiniStat title="Blocked" value="0" icon={<ShieldAlert className="size-4 text-red-500" />} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-tight text-gray-900">Deforestation Risk Overview</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Real-time deforestation checks across all farms
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-[270px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search farm or owner"
                className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand"
              />
            </div>
            <div className="relative w-full sm:w-[140px]">
              <select className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 pr-9 text-sm outline-none focus:border-brand">
                <option>All Farms</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                {['Product', 'Farm', 'Area', 'Status', 'Canopy Loss (post-2020)', 'Last Checked', 'Action'].map((head) => (
                  <th key={head} className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-3 py-3">
                    <p className="font-bold uppercase tracking-tight text-gray-900">{row.product}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{row.id}</p>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{row.farm}</td>
                  <td className="px-3 py-3 text-gray-700">{row.area}</td>
                  <td className="px-3 py-3">
                    <Badge className="border border-amber-200 bg-amber-50 text-[10px] font-bold uppercase text-amber-700">
                      <AlertTriangle className="size-3" />
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{row.canopyLoss}</span>
                      <div className="h-1.5 w-14 rounded-full bg-gray-200" />
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-700">{row.lastChecked}</td>
                  <td className="px-3 py-3 text-right">
                    <Button
                      onClick={() => setSelectedCheck(row)}
                      className="h-8 bg-brand px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90"
                    >
                      Check
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
        className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-0 sm:max-w-[650px]"
      >
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="size-12 overflow-hidden rounded-full bg-gray-100 ring-1 ring-gray-200">
                <img
                  src="/favicon.ico"
                  alt="Farmer profile"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-brand">Adebayo Okonkwo</p>
                <p className="text-xl font-semibold tracking-tight text-brand">adebayo@ogunfarm.ng</p>
                <Badge className="mt-2 rounded-full border border-green-200 bg-green-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-green-700">
                  Active
                </Badge>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-2xl font-bold tracking-tight text-gray-900">Account Information</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
              <InfoRow label="Owner" value="Taiwo Adeyemi" />
              <InfoRow label="Area" value="4.2 ha" />
              <InfoRow label="Last checked" value={data.lastChecked} />
              <InfoRow label="Total loss score" value="3%" />
              <InfoRow label="Data source" value="Global Forest Watch" />
              <InfoRow label="Country risk tier" value="Standard (Nigeria)" />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
            <h4 className="text-2xl font-bold tracking-tight text-gray-900">Decision Narrative</h4>
            <p className="mx-auto mt-2 max-w-3xl text-lg italic leading-relaxed text-gray-800">
              "Geolocation verified and the farm is eligible. No forest conversion detected
              since 2018. Full land tenure documents verified."
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 border-gray-200 px-5 text-[10px] font-bold uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={onRerun}
              className="h-10 bg-brand px-5 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90"
            >
              Re-Run Check
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-lg text-gray-600">
      {label}: <span className="font-bold text-gray-900">{value}</span>
    </p>
  )
}

function TargetMarketStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2e7d32]">Select Target Market</h1>
        <p className="mt-1 text-sm text-gray-500">
          Choose your trade destination to automatically align documentation and logistics with regional trade agreements.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-tight text-gray-900">Markets</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Select one destination to continue</p>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            { name: 'European Union (EUDR)', desc: 'Deforestation and product traceability compliance.' },
            { name: 'United Kingdom', desc: 'Import documentation and due diligence checks.' },
            { name: 'United States', desc: 'Food safety and shipment compliance checks.' },
            { name: 'ECOWAS', desc: 'Regional standards and movement documentation.' },
          ].map((market) => (
            <button
              key={market.name}
              type="button"
              onClick={() => setStage('readiness')}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-left transition-colors hover:border-brand hover:bg-brand-surface/20"
            >
              <p className="text-sm font-bold text-gray-900">{market.name}</p>
              <p className="mt-1 text-xs text-gray-500">{market.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStage('risk')}
          className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest"
        >
          Back
        </Button>
      </div>
    </div>
  )
}

function ReadinessStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#2e7d32]">Compliance Readiness</h1>
        <p className="mt-1 text-sm text-gray-500">
          Destination-specific readiness summary and required compliance evidence.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm lg:grid-cols-4">
          <StageMetric label="Product" value="Maize" />
          <StageMetric label="Batch Number" value="BT19237320323" />
          <StageMetric label="Total Quantity" value="1,340 MT" />
          <StageMetric label="Market Readiness" value="94%" highlight />
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Overall readiness</p>
          <p className="text-3xl font-bold text-brand">94%</p>
          <div className="mt-2 h-2 rounded-full bg-gray-100">
            <div className="h-full w-[94%] rounded-full bg-brand" />
          </div>
        </div>
      </div>

      <RequirementCard title="EU Deforestation-free Regulation (EUDR)" status="verified">
        {['Geolocation Coordinates', 'Plot Ownership', 'Time of Harvest'].map((item) => (
          <CheckItem key={item} label={item} />
        ))}
      </RequirementCard>

      <RequirementCard title="ISO 22005:2007 (Traceability)" status="verified">
        <CheckItem label="Batch History" />
        <CheckItem label="Feed Source" />
      </RequirementCard>

      <RequirementCard title="Lab Report" status="action">
        <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2">
          <p className="text-sm text-gray-700">Pending Laboratory Result Upload</p>
          <Button className="h-8 bg-brand px-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90">
            Resolve
          </Button>
        </div>
      </RequirementCard>

      <div>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-tight text-gray-900">Supporting Annex</h3>
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-lg bg-green-100 text-brand">
            <Upload className="size-5" />
          </div>
          <p className="text-sm font-bold text-gray-800">Drag and drop supporting documents</p>
          <p className="text-xs text-gray-500">PDF, JPG, PNG (max 10MB each)</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStage('target-market')}
          className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest"
        >
          Back
        </Button>
        <Button
          onClick={() => setStage('report')}
          className="h-9 bg-brand px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90"
        >
          Generate Report
        </Button>
      </div>
    </div>
  )
}

function ReportStage({ setStage }: { setStage: (value: ComplianceStage) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={() => setStage('readiness')}
            className="h-8 px-3 text-[10px] font-bold uppercase tracking-widest"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-[#2e7d32]">EUDR Compliance Report</h1>
          <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <MapPin className="size-3" /> Region: South America
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 text-[10px] font-bold uppercase tracking-widest">
            <Download className="size-4" /> Download PDF
          </Button>
          <Button className="h-9 bg-brand text-[10px] font-bold uppercase tracking-widest hover:bg-brand/90">
            <FileText className="size-4" /> Export For Regulator
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[220px_1fr_240px]">
        <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Report Sections</p>
          <div className="mt-2 space-y-1 text-sm">
            <SectionButton active>Overview</SectionButton>
            <SectionButton>Geolocation Data</SectionButton>
            <SectionButton>Deforestation Analysis</SectionButton>
            <SectionButton>Ownership Verification</SectionButton>
            <SectionButton>Ledger Proof</SectionButton>
          </div>
          <div className="mt-4 rounded-lg border border-blue-100 bg-white p-2">
            <p className="text-xs font-bold text-gray-900">Immutable Status</p>
            <p className="text-[11px] text-gray-500">This document is hashed on the AgTrail Public Ledger.</p>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-gray-900">Summary of Compliance</h3>
            <p className="mt-1 text-sm text-gray-600">
              This batch meets EU due-diligence requirements and no deforestation activity was detected after the cutoff date.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
            <PanelStat label="Target Market" value="European Union" />
            <PanelStat label="Product Type" value="Coffee (Raw)" />
            <PanelStat label="Issue Date" value="2023-10-24" />
            <PanelStat label="Status" value="Compliant" />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-tight text-gray-900">Geolocation Analysis</h4>
              <Button variant="ghost" className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest text-brand">
                Expand GIS View
              </Button>
            </div>
            <div className="h-44 rounded-lg border border-gray-200 bg-gray-50 p-3 text-[11px] text-gray-500">
              Lat: -18.3515 | Lng: 46.2772
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="mb-2 text-sm font-bold uppercase tracking-tight text-gray-900">Risk Assessment</p>
            {['Deforestation', 'Human Rights', 'Tax Compliance'].map((line) => (
              <div key={line} className="mb-1 flex items-center justify-between text-sm">
                <span className="text-gray-600">{line}</span>
                <span className="font-bold text-brand">Passed</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Satellite Verification</p>
            <p className="text-2xl font-bold text-brand">100%</p>
            <p className="text-xs text-gray-500">Field polygons validated across satellite imagery.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniStat({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</p>
        <span className="rounded-lg bg-gray-50 p-2">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
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
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex items-start justify-between rounded-lg bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="size-4 text-brand" />
          <p className="text-sm font-bold text-gray-900">{title}</p>
        </div>
        <Badge className={status === 'verified' ? 'bg-green-100 text-[10px] font-bold uppercase text-green-700' : 'bg-amber-100 text-[10px] font-bold uppercase text-amber-700'}>
          {status === 'verified' ? 'Verified' : 'Action Required'}
        </Badge>
      </div>
      <div className="grid gap-2 md:grid-cols-3">{children}</div>
    </div>
  )
}

function CheckItem({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">{label}</div>
  )
}

function StageMetric({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className={`font-bold ${highlight ? 'text-brand' : 'text-gray-900'}`}>{value}</p>
    </div>
  )
}

function SectionButton({ active = false, children }: { active?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      className={`w-full rounded-md px-2 py-1.5 text-left ${
        active ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 p-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-sm font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default function ComplianceAnalysisPage() {
  const [stage, setStage] = useState<ComplianceStage>('risk')

  const breadcrumbLabel = useMemo(() => {
    if (stage === 'target-market') return 'Select Target Market'
    if (stage === 'readiness') return 'Compliance Readiness'
    if (stage === 'report') return 'EUDR Compliance Report'
    return 'Compliance Check'
  }, [stage])

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
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
