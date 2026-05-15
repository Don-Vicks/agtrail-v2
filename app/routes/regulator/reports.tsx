import {
  Calendar,
  ChevronDown,
  Eye,
  FileBarChart,
  FileText,
  Filter,
  Info,
  Search
} from 'lucide-react'
import { useState } from 'react'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import { mockFarms, mockReports } from '~/lib/mock-data/regulator'
import { cn } from '~/lib/utils'

export default function RegulatorReportsPage() {
  const [reportType, setReportType] = useState('Compliance Summary')
  const [scope, setScope] = useState('National Level')
  const [format, setFormat] = useState('PDF')

  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-bold text-[#1a4332]">Good afternoon, Olamide</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Reports</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Generate and manage regulatory compliance summaries, regional analysis, and stakeholder audits.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <FileText className="size-3.5" /> Sort by Commodities <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <ActivityIcon className="size-3.5" /> Sort by Risk Level <ChevronDown className="size-3" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report Generator Section */}
        <div className="lg:col-span-3">
          <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-md bg-green-50 flex items-center justify-center text-green-700">
                <FileBarChart className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1a4332] tracking-tight">Create New Report</h3>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Configure your reporting parameters below</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Report Type</label>
                  <div className="relative">
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option>Compliance Summary</option>
                      <option>Deforestation Analysis</option>
                      <option>Stakeholder Audit</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Range</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      defaultValue="Jan 1, 2024 - Mar 31, 2024"
                      className="w-full h-12 pl-12 pr-4 rounded-md border border-gray-100 bg-white text-sm font-bold text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scope</label>
                  <div className="relative">
                    <select
                      value={scope}
                      onChange={(e) => setScope(e.target.value)}
                      className="w-full h-12 pl-4 pr-10 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option>National Level</option>
                      <option>Regional Cluster</option>
                      <option>Single Cooperative</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Format</label>
                  <div className="grid grid-cols-3 gap-3">
                    <FormatCard
                      id="PDF"
                      label="PDF"
                      sublabel="Formal"
                      active={format === 'PDF'}
                      onClick={() => setFormat('PDF')}
                    />
                    <FormatCard
                      id="CSV"
                      label="CSV"
                      sublabel="Data Raw"
                      active={format === 'CSV'}
                      onClick={() => setFormat('CSV')}
                    />
                    <FormatCard
                      id="Excel"
                      label="Excel"
                      sublabel="Analysis"
                      active={format === 'Excel'}
                      onClick={() => setFormat('Excel')}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-5 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Info className="size-3 text-gray-400" />
                </div>
                <p className="text-[11px] font-bold text-gray-400 uppercase">Estimates 2.4MB file size</p>
              </div>
              <Button className="h-12 px-10 bg-[#1a4332] hover:bg-[#1a4332]/90 text-white font-bold rounded-md shadow-lg shadow-[#1a4332]/10 transition-all active:scale-95">
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Regional Risk Map Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6 h-full">
            <div>
              <h3 className="text-sm font-bold text-[#1a4332] tracking-tight">Regional Risk Map</h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">Active corridors in Nigeria</p>
            </div>

            <div className="rounded-md overflow-hidden h-[300px]">
              <FarmMap farms={mockFarms.map(f => ({
                ...f,
                id: f.id.toString(),
              }))} className="h-full border-none" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <RiskLegend color="green" label="Low Risk" />
              <RiskLegend color="orange" label="Moderate" />
              <RiskLegend color="red" label="High Risk" />
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Report Registry */}
      <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/5">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#1a4332] tracking-tight">Intelligence Report Registry</h3>
            <p className="text-[11px] text-gray-500 font-medium tracking-tight">Recent supply chain audits and compliance checks</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="size-9 p-0 border-transparent hover:bg-gray-50">
              <Search className="size-4 text-gray-400" />
            </Button>
            <Button variant="outline" className="size-9 p-0 border-transparent hover:bg-gray-50">
              <Filter className="size-4 text-gray-400" />
            </Button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/10">
              <th className="px-6 py-4">Report Name</th>
              <th className="px-6 py-4">Batch ID</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Compliance</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockReports.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </tbody>
        </table>
        <div className="p-6 text-center border-t border-gray-50">
          <button className="text-[11px] font-bold text-[#1a4332] hover:underline uppercase tracking-widest">
            View All Reports
          </button>
        </div>
      </div>
    </div>
  )
}

function FormatCard({ id, label, sublabel, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 p-3 rounded-md border transition-all",
        active ? "border-[#1a4332] bg-[#1a4332]/5 ring-1 ring-[#1a4332]" : "border-gray-100 bg-white hover:bg-gray-50"
      )}
    >
      <span className="text-[11px] font-bold text-gray-900 leading-none">{label}</span>
      <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight leading-none">{sublabel}</span>
    </button>
  )
}

function ReportRow({ report }: any) {
  const statusColors = {
    'Finalized': 'bg-green-50 text-green-700 border-green-100',
    'Pending': 'bg-orange-50 text-orange-700 border-orange-100',
    'Non-compliant': 'bg-red-50 text-red-700 border-red-100'
  }
  const barColors = {
    'Finalized': 'bg-green-500',
    'Pending': 'bg-orange-500',
    'Non-compliant': 'bg-red-500'
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="size-8 rounded-md bg-gray-50 border border-gray-100 flex items-center justify-center">
            <FileText className="size-4 text-gray-400" />
          </div>
          <span className="text-[12px] font-bold text-gray-900 tracking-tight">{report.name}</span>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className="text-[11px] font-bold text-brand hover:underline cursor-pointer">{report.batchId}</span>
      </td>
      <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{report.region}</td>
      <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{report.date}</td>
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-gray-900 w-8">{report.compliance}%</span>
          <div className="h-1.5 w-16 rounded-full bg-gray-50 overflow-hidden shrink-0">
            <div
              className={cn("h-full rounded-full transition-all duration-500", (barColors as any)[report.status] || 'bg-gray-400')}
              style={{ width: `${report.compliance}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <span className={cn(
          "px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest",
          (statusColors as any)[report.status] || 'bg-gray-50 text-gray-500'
        )}>
          {report.status}
        </span>
      </td>
      <td className="px-6 py-5 text-right">
        <button className="text-gray-300 hover:text-brand transition-colors p-1">
          <Eye className="size-4" />
        </button>
      </td>
    </tr>
  )
}

function MapMarker({ color, className }: any) {
  const colors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  }
  return (
    <div className={cn("size-3 rounded-full border-2 border-white shadow-lg relative", (colors as any)[color], className)}>
      <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", (colors as any)[color])} />
    </div>
  )
}

function RiskLegend({ color, label }: any) {
  const colors = {
    red: 'bg-red-500',
    green: 'bg-green-500',
    orange: 'bg-orange-500'
  }
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn("size-2 rounded-full", (colors as any)[color])} />
      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{label}</span>
    </div>
  )
}

function ActivityIcon({ className }: any) {
  return (
    <svg className={className} fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
    </svg>
  )
}
