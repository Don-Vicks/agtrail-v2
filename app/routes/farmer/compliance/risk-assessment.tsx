import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Search,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
// import type { Route } from './+types/risk-assessment'

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

export function meta() {
  return [
    { title: 'Compliance Risk Assessment | Agrolinking' },
    { name: 'description', content: 'Deforestation checks and EUDR compliance workflow' },
  ]
}

function MiniStat({ title, value, icon }: { title: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-md border border-brand-surface bg-brand-surface/30 p-5 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-light">{title}</p>
        <span className="rounded-md bg-white p-2 text-brand shadow-sm">{icon}</span>
      </div>
      <p className="text-2xl font-black tracking-tight text-gray-900">{value}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-lg text-gray-600">
      {label}: <span className="font-bold text-gray-900">{value}</span>
    </p>
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
                <Badge className="mt-2 rounded-full border border-brand/20 bg-brand-surface px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand">
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

          <div className="mt-5 rounded-md border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
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
              className="h-10 border-gray-200 px-5 text-[10px] font-bold uppercase tracking-widest rounded-md"
            >
              Cancel
            </Button>
            <Button
              onClick={onRerun}
              className="h-10 bg-brand px-5 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-light rounded-md"
            >
              Re-scan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function RiskAssessmentPage() {
  const navigate = useNavigate()
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
    <div className="space-y-5 pb-8">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/farmer' },
          { label: 'Compliance Check' },
        ]}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand">Deforestation Risk Check</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Global Forest Watch - EUDR cutoff: Dec 31, 2020
            </p>
          </div>
          <div className="relative w-full max-w-[220px]">
            <select className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-10 text-sm outline-none focus:border-brand">
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

        <div className="bg-brand-lighter/5 -mx-8 px-8 py-8 rounded-md">
          <div className="rounded-md border border-brand-surface bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-tight text-gray-900">Deforestation Risk Overview</h2>
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
                    className="h-10 w-full rounded-md border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none focus:border-brand"
                  />
                </div>
                <div className="relative w-full sm:w-[140px]">
                  <select className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-9 text-sm outline-none focus:border-brand">
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
                          className="h-8 bg-brand px-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brand-light rounded-md"
                        >
                          Scan
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <CheckResultModal
          open={Boolean(selectedCheck)}
          data={selectedCheck}
          onClose={() => setSelectedCheck(null)}
          onRerun={() => {
            setSelectedCheck(null)
            navigate('/farmer/compliance/market')
          }}
        />
      </div>
    </div>
  )
}
