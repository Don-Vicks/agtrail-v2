import { MapPin, Clock, Navigation, Thermometer, Fuel, MessageSquare, CheckCircle2, RotateCcw, Package } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

export default function ActiveTransitPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          { label: 'Product', href: '#' },
        ]}
      />

      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 text-left">
           <div className="flex items-center gap-3">
              <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold text-[9px] uppercase tracking-widest rounded-md px-3 py-1">Active Transit</Badge>
              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">TRK-8829-X</span>
           </div>
           <h1 className="text-3xl font-bold text-emerald-900 tracking-tight">Corn Silage Transit</h1>
           <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest flex items-center gap-2">
             Route: Green Valley Farm <Navigation className="size-3" /> Central Bio-Processor
           </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm min-w-[200px] h-28 flex flex-col justify-between">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">ETA</p>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">14:45</p>
           </div>
           <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm min-w-[200px] h-28 flex flex-col justify-between">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Distance</p>
              <p className="text-4xl font-bold text-gray-900 tracking-tight">32.4 <span className="text-lg font-semibold text-gray-300">KM</span></p>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Large Map Area */}
         <div className="flex-1 rounded-md border border-gray-100 bg-white overflow-hidden shadow-sm relative">
            <div className="absolute top-6 left-6 z-10 flex gap-2">
               <div className="bg-white/90 backdrop-blur-md p-3 rounded-md border border-gray-100 shadow-xl flex items-center gap-3">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Live Telemetry Active</span>
               </div>
            </div>
            <div className="h-[600px] bg-gray-50 grayscale contrast-125 opacity-90">
               <img src="/map-placeholder-large.png" className="w-full h-full object-cover" alt="Transit Map" />
               <div className="absolute inset-0 bg-brand/5 pointer-events-none"></div>
            </div>
         </div>

         {/* Sidebar Controls */}
         <div className="w-[420px] space-y-8">
            {/* Activity Log */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-8">
               <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Activity Log</h3>
               <div className="space-y-10 relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                  
                  <ActivityItem 
                    title="In Transit" 
                    desc="Crossing State Hwy 12. Speed: 54 mph" 
                    time="Current" 
                    icon={<RotateCcw className="size-4 animate-spin-slow" />}
                    status="active"
                  />
                  <ActivityItem 
                    title="Quality Checked" 
                    desc="Moisture content: 68.2% (Target: 65-70%)" 
                    time="11:32 AM" 
                    icon={<CheckCircle2 className="size-4" />}
                    status="completed"
                  />
                  <ActivityItem 
                    title="Loaded at Farm" 
                    desc="Green Valley Farm - Bay 4. 22 Tons." 
                    time="11:15 AM" 
                    icon={<Package className="size-4" />}
                    status="completed"
                  />
               </div>
            </div>

            {/* Live Telemetry */}
            <div className="space-y-4">
               <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest px-1">Live Telemetry</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                     <div className="flex items-center gap-2">
                        <Thermometer className="size-3.5 text-emerald-600" />
                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Cargo Temp</span>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-lg font-bold text-gray-900 tracking-tight">18.4°C</p>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-600 w-[65%]"></div>
                        </div>
                     </div>
                  </div>
                  <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm space-y-4">
                     <div className="flex items-center gap-2">
                        <Fuel className="size-3.5 text-emerald-600" />
                        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Fuel</span>
                     </div>
                     <div className="space-y-1.5">
                        <p className="text-lg font-bold text-gray-900 tracking-tight">78%</p>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-600 w-[78%]"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Dispatcher Card */}
            <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-gray-50 transition-all">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-gray-900 flex items-center justify-center overflow-hidden">
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde" className="size-8 grayscale brightness-150" alt="Dispatcher" />
                  </div>
                  <div className="space-y-0.5">
                     <p className="text-[13px] font-bold text-gray-900 tracking-tight">Tunde & Co</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Primary Dispatch</p>
                  </div>
               </div>
               <div className="size-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand transition-colors">
                  <MessageSquare className="size-4" />
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}

function ActivityItem({ title, desc, time, icon, status }: { title: string, desc: string, time: string, icon: React.ReactNode, status: 'completed' | 'active' }) {
  return (
    <div className="flex gap-6 items-start relative z-10">
       <div className={cn(
         "size-8 rounded-full border flex items-center justify-center shrink-0 shadow-sm",
         status === 'active' ? "bg-emerald-900 border-emerald-900 text-white" : "bg-white border-gray-100 text-gray-400"
       )}>
          {icon}
       </div>
       <div className="space-y-1 text-left flex-1">
          <div className="flex items-center justify-between">
             <p className={cn("text-[13px] font-bold tracking-tight", status === 'active' ? "text-emerald-900" : "text-gray-900")}>{title}</p>
             <span className={cn("text-[9px] font-bold uppercase tracking-widest", status === 'active' ? "text-emerald-600" : "text-gray-300")}>{time}</span>
          </div>
          <p className="text-[11px] font-medium text-gray-400 leading-relaxed">{desc}</p>
       </div>
    </div>
  )
}
