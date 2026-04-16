import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { EmptyState } from '~/components/empty-state'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle, 
  Search, 
  ChevronDown, 
  FileText, 
  Download,
  LayoutDashboard,
  ShieldAlert,
  Activity,
  Filter,
  ArrowRight
} from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Route } from './+types/index'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Compliance | Agtrail' },
    { name: 'description', content: 'Monitor compliance and risks across your products' },
  ]
}

/* ─── Mock Data ─── */
const COMPLIANCE_DATA = [
  {
    id: 1,
    product: 'Maize',
    batchId: 'BATCH-8022dd4d-1770974808765',
    category: 'Agricultural Product',
    origin: 'N/A',
    riskLevel: 'Medium',
    complianceScore: 0,
    certifications: 0,
    alerts: 0,
    lastAudit: 'Never',
  }
]

export default function ComplianceAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('')

  return (
    <div className="space-y-6 pb-10 px-1">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className="size-4 text-gray-400" />,
          },
          { label: 'Compliance' },
          { label: 'Analysis' },
        ]}
      />

      {/* Page Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Compliance</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor standard adherence and risk levels across your products</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200">
            <FileText className="size-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm">
            <Download className="size-4" />
            <span className="font-bold uppercase tracking-wide text-[11px]">Export PDF</span>
          </Button>
        </div>
      </div>

      {/* High Density Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Compliance Score"
          value="0%"
          icon={<ShieldCheck className="size-5 text-blue-500" />}
          trend={{ value: 'Critical Gap', isPositive: false }}
        />
        <StatCard
          label="High Risk"
          value="0"
          icon={<ShieldAlert className="size-5 text-red-500" />}
          trend={{ value: 'Stable', isPositive: true }}
        />
        <StatCard
          label="Under Review"
          value="1"
          icon={<Activity className="size-5 text-amber-500" />}
          trend={{ value: '1 Pending', isPositive: false }}
        />
        <StatCard
          label="Verified"
          value="0"
          icon={<CheckCircle className="size-5 text-emerald-500" />}
          trend={{ value: 'Baseline', isPositive: true }}
        />
      </div>

      {/* Main Monitoring Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col lg:flex-row lg:items-center justify-between bg-white text-left gap-6">
          <div className="flex items-center gap-4">
            <div className="size-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 uppercase tracking-tight">Compliance Check</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">List of all compliance checks</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products, batches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-10 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-none"
              />
            </div>
            <div className="relative">
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="h-11 rounded-xl border border-gray-100 bg-gray-50/50 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand appearance-none min-w-[160px]"
              >
                <option value="">All Risk Levels</option>
                <option value="High">High Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="Low">Low Risk</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Compliance List */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Risk</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Score</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Certs</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right pr-6">Last Checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {COMPLIANCE_DATA.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-tight group-hover:text-brand transition-colors">{row.product}</span>
                      <span className="text-[9px] font-mono text-gray-400 mt-1 uppercase tracking-tighter">{row.batchId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-[10px] uppercase text-gray-500 tracking-wider">
                    {row.category}
                  </td>
                  <td className="px-6 py-6">
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border-gray-200 text-gray-400 shadow-none">
                      {row.origin}
                    </Badge>
                  </td>
                  <td className="px-6 py-6">
                    {row.riskLevel === 'Medium' && (
                      <Badge className="bg-amber-50 text-amber-600 border-amber-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-none flex items-center gap-1.5 w-fit">
                        <Activity className="size-3" />
                        {row.riskLevel}
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-bold text-gray-900">{row.complianceScore}%</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100 border border-gray-50">
                        <div
                          className="h-full bg-brand/30"
                          style={{ width: `${row.complianceScore}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="text-xs font-bold text-gray-400">{row.certifications}</span>
                  </td>
                  <td className="px-6 py-6 text-right pr-6">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tight italic">{row.lastAudit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {COMPLIANCE_DATA.length === 0 && (
            <EmptyState
              className="py-16"
              icon={<ShieldCheck className="size-8 text-gray-300" />}
              title="No compliance rows"
              description="Compliance data will appear here when available from the API."
            />
          )}
        </div>
      </div>
    </div>
  )
}
