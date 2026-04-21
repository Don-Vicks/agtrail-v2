import { useParams, Link } from 'react-router'
import { useState, useMemo } from 'react'
import { 
  Building2, 
  MapPin, 
  Users, 
  Activity, 
  History, 
  Settings2, 
  Wrench, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus
} from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { cn } from '~/lib/utils'

// Mock Data (Shared with list page for consistency)
const FACILITIES_DATA = {
  '1': {
    id: '1',
    name: 'Abuja Processing Hub',
    location: 'Gwagwalada, Abuja',
    lineType: 'Drying and Milling',
    monthlyCapacityTons: 240,
    utilization: 78,
    status: 'Operational',
    manager: 'Ibrahim Sani',
    lastMaintained: '2024-03-10',
    description: 'Our primary hub for grain processing and large-scale milling operations in the FCT region.'
  },
  '2': {
    id: '2',
    name: 'Lagos Packaging Center',
    location: 'Ikeja, Lagos',
    lineType: 'Packaging and Storage',
    monthlyCapacityTons: 160,
    utilization: 64,
    status: 'Operational',
    manager: 'Adaobi Okeke',
    lastMaintained: '2024-02-15',
    description: 'End-of-line packaging facility with temperature-controlled storage for finished goods.'
  },
  '3': {
    id: '3',
    name: 'Kano Extraction Unit',
    location: 'Nasarawa, Kano',
    lineType: 'Oil Extraction',
    monthlyCapacityTons: 130,
    utilization: 0,
    status: 'Maintenance',
    manager: 'Musa Abdullahi',
    lastMaintained: '2024-04-01',
    description: 'Specialized unit for oilseed extraction and refining services.'
  },
}

const MOCK_LOGS = [
  { id: 1, type: 'Batch Processed', description: 'Batch #B-2024-058 completed successfully', time: '2 hours ago', status: 'success' },
  { id: 2, type: 'Maintenance', description: 'Monthly inspection of milling unit #4', time: 'Yesterday', status: 'info' },
  { id: 3, type: 'Staff Assignment', description: 'Emmanuel Obi assigned to Site Operation', time: '2 days ago', status: 'info' },
  { id: 4, type: 'Error Reported', description: 'Fluctuation detected in Boiler #2', time: '3 days ago', status: 'warning' },
]

export default function FacilityDetailPage() {
  const { id } = useParams()
  const facility = FACILITIES_DATA[id as keyof typeof FACILITIES_DATA] || FACILITIES_DATA['1']

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/processor' },
          { label: 'Facilities', href: '/processor/facilities' },
          { label: facility.name },
        ]}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-brand/5 blur-3xl" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className={cn(
              "size-16 rounded-2xl flex items-center justify-center shadow-inner",
              facility.status === 'Operational' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            )}>
              <Building2 className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{facility.name}</h1>
                <Badge className={cn(
                  "uppercase tracking-widest font-bold text-[10px] px-3 py-1 rounded-full",
                  facility.status === 'Operational' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {facility.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="size-4 text-brand" />
                  <span className="font-medium text-gray-700">{facility.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="size-4 text-blue-500" />
                  <span className="font-bold uppercase tracking-widest text-[10px]">{facility.lineType}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px]">
               <Settings2 className="size-4 mr-2" />
               Edit Site
            </Button>
            <Button className="bg-[#1d3d1e] hover:bg-black text-white h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-brand/20 transition-all hover:scale-[1.02]">
               <Wrench className="size-4 mr-2" />
               Log Maintenance
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Stats & Info) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             <StatCard 
               title="Current Utilization" 
               value={`${facility.utilization}%`} 
               icon={<Activity className="size-5 text-brand" />}
               description="Real-time throughput"
             />
             <StatCard 
               title="Monthly Capacity" 
               value={`${facility.monthlyCapacityTons}T`} 
               icon={<ArrowUpRight className="size-5 text-blue-500" />}
               description="Max target output"
             />
             <StatCard 
               title="Next Maintenance" 
               value="14 Days" 
               icon={<Calendar className="size-5 text-amber-500" />}
               description="Scheduled inspection"
             />
          </div>

          {/* About & Performance */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-50 pb-4">Facility Overview</h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl">
              {facility.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Capacity Distribution</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                         <span>Milling Line</span>
                         <span className="text-brand">85%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-brand" style={{ width: '85%' }} />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-gray-400">
                         <span>Drying Storage</span>
                         <span className="text-blue-500">42%</span>
                       </div>
                       <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                         <div className="h-full bg-blue-500" style={{ width: '42%' }} />
                       </div>
                    </div>
                  </div>
               </div>
               
               <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Facility Manager</h3>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg ring-4 ring-white shadow-sm">
                       {facility.manager.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{facility.manager}</p>
                      <p className="text-xs text-brand font-medium">Head of Operations</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-3xl border border-gray-100 bg-white p-8">
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Audit & Logs</h2>
               <Button variant="ghost" size="sm" className="text-[10px] font-bold uppercase tracking-widest text-brand hover:bg-brand/5">View History</Button>
            </div>
            
            <div className="relative space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-gray-100">
              {MOCK_LOGS.map((log) => (
                <div key={log.id} className="relative flex items-start gap-6 pl-12 group transition-all">
                  <div className={cn(
                    "absolute left-0 top-1 size-8 rounded-lg flex items-center justify-center ring-4 ring-white transition-all group-hover:scale-110",
                    log.status === 'success' ? "bg-emerald-50 text-emerald-600" :
                    log.status === 'warning' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {log.type === 'Batch Processed' ? <CheckCircle2 className="size-4" /> :
                     log.type === 'Maintenance' ? <Wrench className="size-4" /> : <Clock className="size-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-900">{log.type}</span>
                      <span className="text-[10px] font-medium text-gray-400">• {log.time}</span>
                    </div>
                    <p className="text-sm text-gray-500">{log.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (Personnel & Details) */}
        <div className="space-y-8">
           {/* Personnel List */}
           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Assigned Staff</h3>
                   <p className="text-[10px] text-gray-500 font-medium">Active personnel at site</p>
                </div>
                <Button size="icon" variant="ghost" className="size-8 rounded-full bg-gray-50 hover:bg-brand hover:text-white transition-all">
                   <Plus className="size-4" />
                </Button>
             </div>
             
             <div className="space-y-4">
                {[
                  { name: 'Emmanuel Obi', role: 'Line Operator', status: 'On Shift' },
                  { name: 'Sarah Ahmed', role: 'QA Inspector', status: 'On Shift' },
                  { name: 'John Doe', role: 'Security', status: 'Off Duty' },
                ].map((staff, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">{staff.name}</p>
                        <p className="text-[10px] text-gray-500 font-medium">{staff.role}</p>
                      </div>
                    </div>
                    <Badge variant="ghost" className={cn(
                      "text-[8px] font-bold uppercase tracking-tight",
                      staff.status === 'On Shift' ? "text-emerald-600" : "text-gray-400"
                    )}>
                      {staff.status}
                    </Badge>
                  </div>
                ))}
             </div>
             
             <Link to="/processor/personnel" className="block text-center mt-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest text-brand hover:bg-brand/5 transition-colors">
                View All Personnel
             </Link>
           </div>

           {/* Technical Specs */}
           <div className="rounded-3xl border border-gray-100 bg-white p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 border-b border-gray-50 pb-4">Technical Specifications</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Line Type', value: facility.lineType, icon: <Activity className="size-4" /> },
                   { label: 'Last Maintenance', value: facility.lastMaintained, icon: <History className="size-4" /> },
                   { label: 'Power Source', value: 'National Grid / Backup Solar', icon: <ArrowUpRight className="size-4" /> },
                   { label: 'Certification', value: 'ISO 22000 Certified', icon: <CheckCircle2 className="size-4" /> },
                 ].map((spec, i) => (
                   <div key={i} className="flex items-start gap-4">
                      <div className="size-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                         {spec.icon}
                      </div>
                      <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">{spec.label}</p>
                         <p className="text-xs font-bold text-gray-900">{spec.value}</p>
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
