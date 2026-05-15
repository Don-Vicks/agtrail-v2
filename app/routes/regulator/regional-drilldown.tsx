import {
  Activity,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Filter,
  Maximize,
  Plus,
  Search
} from 'lucide-react'
import { Link } from 'react-router'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import { mockFarms } from '~/lib/mock-data/regulator'
import { cn } from '~/lib/utils'

export default function RegulatorRegionalDrilldownPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-bold text-[#1a4332]">Good afternoon, Olamide</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Regional Compliance Drill-Down</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Visualizing deforestation risk and batch-level integrity for the Ogun State agricultural cluster. Data synchronized from 14 verified local hubs.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <FileText className="size-3.5" /> Sort by Commodities <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <Activity className="size-3.5" /> Sort by Risk Level <ChevronDown className="size-3" />
          </Button>
          <Button className="h-8 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-1.5 px-3 rounded-md">
            <Plus className="size-3.5" /> Create a New Violation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Interactive Map */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative aspect-video lg:aspect-3/2 rounded-md overflow-hidden border border-gray-100 bg-gray-100 shadow-sm">
            <div className="rounded-md overflow-hidden h-full">
              <FarmMap farms={mockFarms.map(f => ({
                ...f,
                id: f.id.toString(),
              }))} className="h-full border-none" />
            </div>

            {/* Map UI Elements */}
            <div className="absolute top-6 left-6 p-4 bg-white/90 backdrop-blur rounded-md shadow-lg border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Region Insight</p>
              <div className="flex gap-6">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Verified Area</p>
                  <p className="text-sm font-bold text-[#1a4332]">12,480 Ha</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Active Plots</p>
                  <p className="text-sm font-bold text-[#1a4332]">342</p>
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <button className="size-8 rounded-md bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 border border-gray-100">
                <Maximize className="size-4" />
              </button>
              <div className="flex flex-col rounded-md bg-white shadow-md border border-gray-100 overflow-hidden">
                <button className="size-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-b border-gray-100">
                  <Plus className="size-4" />
                </button>
                <button className="size-8 flex items-center justify-center text-gray-600 hover:bg-gray-50">
                  <div className="w-3 h-0.5 bg-gray-600 rounded-full" />
                </button>
              </div>
            </div>

            {/* Specific Plot Detail Card on Map */}
            <div className="absolute bottom-10 left-10 w-64 bg-white rounded-md shadow-xl border border-gray-100 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[12px] font-bold text-[#1a4332]">Ogun Cocoa Coop-A</h4>
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">VERIFIED</span>
              </div>
              <div className="space-y-1 mb-4">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: OG-CC-4291</p>
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">EUDR Risk Score</p>
                  <p className="text-[10px] font-bold text-green-600">Low (0.04)</p>
                </div>
                <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[15%]" />
                </div>
              </div>
              <Button variant="outline" className="w-full h-8 text-[10px] font-bold border-gray-100 text-gray-600">
                View Plot Details
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Insights */}
        <div className="space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a4332] mb-6">EUDR Compliance Distribution</h3>
            <div className="space-y-4">
              <ComplianceRow label="Compliant" count={298} type="success" percentage={87} />
              <ComplianceRow label="Pending Review" count={34} type="warning" percentage={10} />
              <ComplianceRow label="Non-Compliant" count={10} type="error" percentage={3} />
            </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#1a4332]">Recent Audit Activity</h3>
              <Link to="#" className="text-[10px] font-bold text-[#1a4332] hover:underline">View History</Link>
            </div>
            <div className="space-y-4">
              <AuditCard
                title="Satellite Validation Success"
                desc="Batch #OG-2024-C81 verified against forest cover 2020 baseline."
                time="2 hours ago"
                type="success"
              />
              <AuditCard
                title="On-Site Inspection Triggered"
                desc="Anomaly detected in farm boundaries for plot PL-442 (Ilaro Hub)."
                time="5 hours ago"
                type="warning"
              />
              <AuditCard
                title="Regulator Signature Applied"
                desc="State Commissioner signed off on Hub-Level 12 Certificate."
                time="Yesterday"
                type="info"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1a4332]">Active Regional Batches</h3>
            <p className="text-[11px] text-gray-500 font-medium">Individual batch tracking with Digital Product Passport (DPP) integration.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search Batch ID..."
                className="h-9 w-64 pl-10 pr-4 rounded-md bg-gray-50 border border-transparent focus:bg-white focus:border-brand/20 transition-all text-xs font-bold focus:outline-none"
              />
            </div>
            <Button variant="outline" className="h-9 w-9 p-0 border-gray-100">
              <Filter className="size-4 text-gray-500" />
            </Button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
              <th className="px-6 py-4">Batch ID</th>
              <th className="px-6 py-4">Cooperative / Estate</th>
              <th className="px-6 py-4 text-center">EUDR Risk</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Volume</th>
              <th className="px-6 py-4 text-right">Last Audit</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <RegionalBatchRow
              id="#OG-2024-C81"
              name="Abeokuta North Cocoa Cooperative"
              risk="0.04 (Low)"
              status="VERIFIED"
              volume="12.5 MT"
              date="Oct 24, 2023"
              riskType="low"
            />
            <RegionalBatchRow
              id="#OG-2024-P22"
              name="Shagamu Palm Estates"
              risk="0.42 (Med)"
              status="PENDING"
              volume="48.2 MT"
              date="Oct 23, 2023"
              riskType="med"
            />
            <RegionalBatchRow
              id="#OG-2024-C99"
              name="Ilaro Smallholder Hub"
              risk="0.89 (High)"
              status="FLAGGED"
              volume="2.1 MT"
              date="Oct 22, 2023"
              riskType="high"
            />
            <RegionalBatchRow
              id="#OG-2024-R04"
              name="Ota Rubber Collective"
              risk="0.12 (Low)"
              status="VERIFIED"
              volume="114.0 MT"
              date="Oct 20, 2023"
              riskType="low"
            />
          </tbody>
        </table>
        <div className="p-6 border-t border-gray-50 flex items-center justify-between">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Showing 1-10 of 342 active batches</p>
          <div className="flex items-center gap-1">
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronLeft className="size-4" /></button>
            <button className="size-8 rounded-md bg-[#1a4332] text-white flex items-center justify-center text-[11px] font-bold">1</button>
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-500 hover:bg-gray-50">2</button>
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-500 hover:bg-gray-50">3</button>
            <button className="size-8 rounded-md border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ComplianceRow({ label, count, type, percentage }: any) {
  const colors = {
    success: 'bg-green-500',
    warning: 'bg-orange-500',
    error: 'bg-red-500'
  }
  const bgColors = {
    success: 'bg-green-50',
    warning: 'bg-orange-50',
    error: 'bg-red-50'
  }
  const textColors = {
    success: 'text-green-700',
    warning: 'text-orange-700',
    error: 'text-red-700'
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("size-8 rounded-md flex items-center justify-center", (bgColors as any)[type])}>
            <CheckCircle2 className={cn("size-4", (textColors as any)[type])} />
          </div>
          <span className="text-[11px] font-bold text-gray-700">{label}</span>
        </div>
        <span className="text-[12px] font-bold text-gray-900">{count} Farms</span>
      </div>
      <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", (colors as any)[type])} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

function AuditCard({ title, desc, time, type }: any) {
  const borderColors = {
    success: 'border-l-green-500',
    warning: 'border-l-orange-500',
    info: 'border-l-brand'
  }
  return (
    <div className={cn("p-4 rounded-md border border-gray-100 border-l-4 bg-gray-50/30 space-y-2", (borderColors as any)[type])}>
      <div className="flex items-start justify-between">
        <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{title}</h4>
        <span className="text-[9px] font-bold text-gray-400 uppercase">{time}</span>
      </div>
      <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{desc}</p>
    </div>
  )
}

function RegionalBatchRow({ id, name, risk, status, volume, date, riskType }: any) {
  const riskColors = {
    low: 'text-green-600',
    med: 'text-orange-600',
    high: 'text-red-600'
  }
  const statusColors = {
    VERIFIED: 'bg-green-50 text-green-700 border-green-100',
    PENDING: 'bg-orange-50 text-orange-700 border-orange-100',
    FLAGGED: 'bg-red-50 text-red-700 border-red-100'
  }
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-5 text-[11px] font-bold text-[#1a4332] tracking-tight underline underline-offset-4 cursor-pointer">{id}</td>
      <td className="px-6 py-5">
        <p className="text-[12px] font-bold text-gray-900">{name}</p>
      </td>
      <td className="px-6 py-5 text-center">
        <span className={cn("text-[10px] font-bold uppercase", (riskColors as any)[riskType])}>{risk}</span>
      </td>
      <td className="px-6 py-5 text-center">
        <span className={cn("px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest", (statusColors as any)[status])}>{status}</span>
      </td>
      <td className="px-6 py-5 text-center text-[12px] font-bold text-gray-900">{volume}</td>
      <td className="px-6 py-5 text-right text-[11px] font-bold text-gray-500">{date}</td>
      <td className="px-6 py-5 text-right">
        <Link to="#" className="text-[10px] font-bold text-[#1a4332] flex items-center justify-end gap-1 hover:underline">
          Open DPP <ExternalLink className="size-3" />
        </Link>
      </td>
    </tr>
  )
}
