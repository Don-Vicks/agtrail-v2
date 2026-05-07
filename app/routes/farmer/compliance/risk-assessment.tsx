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
  Loader2
} from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'

type RiskRow = {
  id: string
  farmName: string
  owner: string
  location: string
  area: string
  status: 'Eligible' | 'Needs review' | 'Blocked'
  canopyLoss: string
  lastChecked: string
}

const riskRows: RiskRow[] = [
  {
    id: 'F-001',
    farmName: 'Adeyemi Farm',
    owner: 'Taiwo Adeyemi',
    location: 'Kaduna Nigeria',
    area: '4.2 ha',
    status: 'Eligible',
    canopyLoss: '0%',
    lastChecked: '23 Apr 2026',
  },
]

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

  const filteredRows = useMemo(
    () =>
      riskRows.filter((r) =>
        `${r.farmName} ${r.owner} ${r.id}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  )

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
          value="8" 
          icon={<ShieldCheck className="size-4" />} 
          iconColor="text-blue-500 bg-blue-50"
        />
        <StatCard 
          label="Eligible" 
          value="0" 
          icon={<Clock className="size-4" />} 
          iconColor="text-red-500 bg-red-50"
        />
        <StatCard 
          label="Needs review" 
          value="1" 
          icon={<TrendingUp className="size-4" />} 
          iconColor="text-amber-500 bg-amber-50"
        />
        <StatCard 
          label="Blocked" 
          value="0" 
          icon={<ShieldCheck className="size-4" />} 
          iconColor="text-emerald-500 bg-emerald-50"
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
                    <span className="text-[11px] font-medium text-gray-600">{row.location}</span>
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
                      <span className="text-xs font-bold text-gray-900">{row.canopyLoss}</span>
                      <div className="h-1 w-16 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                          className="h-full bg-brand transition-all duration-500" 
                          style={{ width: `${Math.max(parseInt(row.canopyLoss), 5)}%`, backgroundColor: row.canopyLoss === '0%' ? '#7C2D12' : '#1B4332' }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-gray-400">{row.lastChecked}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-4">
                      <Button 
                        onClick={() => setSelectedCheck(row)}
                        className="h-8 bg-brand hover:bg-brand/90 text-white font-bold px-4 rounded-md shadow-sm transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                      >
                        Check
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
        onClose={() => setSelectedCheck(null)}
        onRerun={() => {
          setSelectedCheck(null)
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
        className="overflow-hidden rounded-md border-none bg-white p-0 sm:max-w-[500px] shadow-2xl"
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
              <DialogTitle className="text-lg font-bold tracking-tight uppercase">Satellite Scan Result</DialogTitle>
              <DialogDescription className="text-white/60 font-bold text-[8px] uppercase tracking-widest">Global Forest Watch Analysis</DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 text-left space-y-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
             <div className="space-y-0.5">
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Farm Name</p>
               <p className="text-xs font-bold text-gray-900">{data.farmName}</p>
             </div>
             <div className="space-y-0.5 text-right">
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Canopy Loss</p>
               <p className="text-xs font-bold text-emerald-600 uppercase">{data.canopyLoss} (Verified)</p>
             </div>
          </div>

          <div className="bg-gray-50 rounded-md border border-gray-100 p-4 italic text-[12px] text-gray-700 leading-relaxed">
            "The satellite imagery analysis for {data.farmName} confirms zero forest conversion since the December 2020 EUDR cutoff. The polygon data aligns with local land tenure records."
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 flex-1 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50 text-[10px] uppercase tracking-widest"
            >
              Dismiss
            </Button>
            <Button
              onClick={onRerun}
              className="h-10 flex-1 bg-brand hover:bg-brand/90 text-white font-bold rounded-md shadow-md transition-all active:scale-95 text-[10px] uppercase tracking-widest"
            >
              Re-scan Plot
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
