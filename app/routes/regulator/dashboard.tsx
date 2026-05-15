import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Map as MapIcon,
  ShieldCheck,
  Users
} from 'lucide-react'
import { Link } from 'react-router'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import {
  auditTrail,
  complianceByCommodity,
  dashboardStats,
  mockFarms,
  violationSummary
} from '~/lib/mock-data/regulator'
import { cn } from '~/lib/utils'

export default function RegulatorDashboardPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center justify-between">
        <h1 className="text-[14px] font-bold text-[#1a4332]">Good afternoon, Olamide</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Compliance Performance</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Real-Time Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <FileText className="size-3.5" /> Sort by Commodities <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <MapIcon className="size-3.5" /> Sort by Region <ChevronDown className="size-3" />
          </Button>
          <Button variant="outline" className="h-8 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
            <Clock className="size-3.5" /> Sort by Timeframe <ChevronDown className="size-3" />
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {dashboardStats.map((stat, i) => (
          <KPIStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            trend={stat.trend}
            sublabel={stat.sublabel}
            icon={getIcon(stat.icon)}
          />
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Map Section */}
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1a4332] tracking-tight uppercase tracking-widest">Regional Compliance Map</h3>
              <Link to="/regulator/regional-drilldown" className="text-[11px] font-bold text-brand uppercase tracking-widest hover:underline">View Details</Link>
            </div>
            <div className="rounded-md overflow-hidden h-[400px]">
              <FarmMap farms={mockFarms.map(f => ({
                ...f,
                id: f.id.toString(),
              }))} className="h-full border-none" />
            </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a4332] mb-6 uppercase tracking-widest">Compliance by Commodity</h3>
            <div className="space-y-6">
              {complianceByCommodity.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-50 overflow-hidden">
                    <div
                      className="h-full bg-[#1a4332] rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a4332] mb-6 uppercase tracking-widest">Violation Summary</h3>
            <div className="space-y-4">
              {violationSummary.map((v) => (
                <ViolationCard key={v.id} title={v.title} description={v.description} type={v.type} />
              ))}
            </div>
            <Link to="/regulator/violations" className="flex items-center justify-center gap-2 mt-6 text-[11px] font-bold text-[#1a4332] hover:underline uppercase tracking-widest">
              View All Violations <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a4332] mb-6 uppercase tracking-widest">Recent Audit Trail</h3>
            <div className="space-y-6 relative pl-4 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1.5px] before:bg-gray-100">
              {auditTrail.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[16.5px] top-1 size-2 rounded-full border-2 border-white ring-2 bg-red-500 ring-red-50" />
                  <div className="space-y-1">
                    <h4 className="text-[12px] font-bold text-gray-900 leading-tight">{item.title}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.time} • {item.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KPIStatCard({ label, value, trend, sublabel, icon }: any) {
  return (
    <div className='rounded-md border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md group'>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>{label}</p>
          <div className='size-8 rounded-md flex items-center justify-center text-gray-400 bg-gray-50 group-hover:bg-brand/10 group-hover:text-brand transition-colors'>
            {icon}
          </div>
        </div>
        <div className='space-y-1'>
          <h4 className='text-2xl font-bold text-gray-900 tracking-tight'>{value}</h4>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "text-[10px] font-bold",
              trend.startsWith('+') ? "text-green-600" : "text-red-600"
            )}>{trend}</span>
            {sublabel && <span className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>{sublabel}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

function ViolationCard({ title, description, type }: any) {
  const bgColors = {
    warning: 'bg-red-50 border-red-100',
    info: 'bg-orange-50 border-orange-100',
    success: 'bg-green-50 border-green-100'
  }
  return (
    <div className={cn("rounded-md border p-4 space-y-2", (bgColors as any)[type] || bgColors.info)}>
      <h4 className="text-[12px] font-bold text-gray-900">{title}</h4>
      <p className="text-[10px] font-medium text-gray-500 leading-relaxed">{description}</p>
      <Button variant="outline" className="h-6 text-[9px] font-bold bg-white/50 border-none shadow-none px-2.5">
        View
      </Button>
    </div>
  )
}

function getIcon(name: string) {
  switch (name) {
    case 'users': return <Users className="size-4" />
    case 'shield-check': return <ShieldCheck className="size-4" />
    case 'check-circle': return <CheckCircle2 className="size-4" />
    case 'file-text': return <FileText className="size-4" />
    default: return <Activity className="size-4" />
  }
}
