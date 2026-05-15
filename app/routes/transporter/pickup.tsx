import { Camera, Key, MapPin, QrCode, Scan, ShieldCheck } from 'lucide-react'
import { FarmMap } from '~/components/farm-map.client'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function PickupVerificationPage() {
   return (
      <div className="space-y-8 pb-10">
         <PageHeader
            items={[
               { label: 'Transporter', href: '/transporter' },
               { label: 'Pickup Verification', href: '#' },
            ]}
         />

         <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            {/* Left Column: Details & Map */}
            <div className="flex-1 space-y-8">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h1 className="text-2xl font-bold text-brand tracking-tight">Pickup Verification</h1>
                     <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">Driver Session: Gate 4A - Northern Grain Silos</p>
                  </div>
                  <Badge className="bg-brand-dark text-white font-semibold text-[11px] uppercase tracking-widest px-4 py-2 rounded-md border-none shadow-md">
                     Blockchain Pending
                  </Badge>
               </div>

               {/* Batch & Stats Row */}
               <div className="flex gap-6">
                  <div className="flex-1 rounded-md border border-gray-100 bg-white p-6 shadow-sm">
                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Active Batch</p>
                     <p className="text-2xl font-bold text-gray-900 tracking-tight">#BTCH-2024-0892</p>
                  </div>
                  <div className="w-[240px] rounded-md border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                     <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-right">Weight (EST)</p>
                     <p className="text-3xl font-bold text-gray-900 tracking-tight text-right">300 Kg</p>
                  </div>
               </div>

               {/* Specifications Grid */}
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <div className="size-4 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                           <QrCode className="size-3" />
                        </div>
                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Product Specification</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-md border border-gray-50 bg-gray-50/30 p-4 space-y-1">
                           <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Commodity</p>
                           <p className="text-sm font-bold text-emerald-900">Hard Red Feed Corn</p>
                        </div>
                        <div className="rounded-md border border-gray-50 bg-gray-50/30 p-4 space-y-1">
                           <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Grade / Quality</p>
                           <p className="text-sm font-bold text-emerald-900">Grade A1 | 14.5% Moisture</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <div className="size-4 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                           <ShieldCheck className="size-3" />
                        </div>
                        <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Compliance Data</h3>
                     </div>
                     <div className="grid grid-cols-1 gap-4">
                        <div className="rounded-md border border-gray-50 bg-gray-50/30 p-4 space-y-1">
                           <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Origin Node</p>
                           <p className="text-sm font-bold text-emerald-900">Akure, Nigeria</p>
                        </div>
                        <div className="rounded-md border border-gray-50 bg-gray-50/30 p-4 flex gap-4">
                           <div className="flex-1 space-y-1">
                              <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Certifications</p>
                              <div className="flex gap-2">
                                 <Badge variant="outline" className="text-[10px] font-medium text-emerald-600 border-gray-200 rounded-md">Organic</Badge>
                                 <Badge variant="outline" className="text-[10px] font-medium text-emerald-600 border-gray-200 rounded-md">Fair-Trade</Badge>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Map Section */}
               <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-emerald-600" />
                        <h3 className="text-[13px] font-medium text-gray-900">Farm Crops Locations</h3>
                     </div>
                     <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[10px] uppercase tracking-widest rounded-md px-3">GPRS Active</Badge>
                  </div>
                  <div className="h-[300px] relative">
                     <FarmMap
                        farms={[
                           {
                              id: 'pickup-node',
                              name: 'Northern Grain Silos',
                              location: 'Akure, Nigeria',
                              region: 'Ondo State',
                              hectares: 120,
                              lat: 7.2507,
                              lng: 5.2103
                           }
                        ]}
                     />
                  </div>
               </div>
            </div>

            {/* Right Column: Scan & Timeline */}
            <div className="w-[380px] space-y-8">
               <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm text-center space-y-8">
                  <div className="size-48 mx-auto border-2 border-dashed border-gray-100 rounded-md flex items-center justify-center p-6 bg-gray-50/30 relative">
                     <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-brand rounded-tl-xl"></div>
                     <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-brand rounded-tr-xl"></div>
                     <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-brand rounded-bl-xl"></div>
                     <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-brand rounded-br-xl"></div>
                     <QrCode className="size-24 text-brand-dark opacity-10" />
                     <Scan className="size-32 text-brand absolute animate-pulse" />
                  </div>
                  <div className="space-y-2">
                     <p className="text-xs text-gray-500 leading-relaxed font-medium">Scan the farm terminal QR code to finalize pickup and trigger blockchain immutable record.</p>
                  </div>
                  <Button className="w-full h-12 bg-brand-dark hover:bg-black text-white font-bold text-[14px] uppercase tracking-widest rounded-md shadow-xl active:scale-95 transition-all">
                     Scan & Verify
                  </Button>
                  <div className="relative">
                     <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                     </div>
                     <div className="relative flex justify-center">
                        <span className="bg-white px-4 text-[9px] font-semibold text-gray-300 uppercase tracking-widest">or manual verification</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Button variant="outline" className="h-14 border-gray-100 rounded-md flex flex-col items-center justify-center gap-1.5 py-2 group hover:bg-gray-50">
                        <Camera className="size-4 text-gray-400 group-hover:text-brand" />
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand uppercase tracking-widest">Snapshot</span>
                     </Button>
                     <Button variant="outline" className="h-14 border-gray-100 rounded-md flex flex-col items-center justify-center gap-1.5 py-2 group hover:bg-gray-50">
                        <Key className="size-4 text-gray-400 group-hover:text-brand" />
                        <span className="text-[10px] font-bold text-gray-400 group-hover:text-brand uppercase tracking-widest">Key</span>
                     </Button>
                  </div>
               </div>

               <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6 text-left">
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Chain Sequence</h3>
                  <div className="space-y-8 relative">
                     <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                     <TimelineItem
                        title="Manifest Generation"
                        time="08:45 AM"
                        meta="Block #49281"
                        status="completed"
                     />
                     <TimelineItem
                        title="Inbound Gate Cleared"
                        time="09:12 AM"
                        meta="Sensor Triggered"
                        status="completed"
                     />
                     <TimelineItem
                        title="Driver Verification Required"
                        time="Awaiting Scan..."
                        meta=""
                        status="active"
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

function TimelineItem({ title, time, meta, status }: { title: string, time: string, meta: string, status: 'completed' | 'active' }) {
   return (
      <div className="flex gap-6 items-start relative z-10">
         <div className={cn(
            "size-6 rounded-full border-2 flex items-center justify-center shrink-0",
            status === 'completed' ? "bg-emerald-900 border-emerald-900 text-white" : "bg-white border-emerald-900 text-emerald-900"
         )}>
            {status === 'completed' ? <div className="size-1.5 rounded-full bg-white"></div> : <div className="size-2 rounded-full border-2 border-emerald-900"></div>}
         </div>
         <div className="space-y-1">
            <p className={cn("text-[11px] font-bold tracking-tight", status === 'completed' ? "text-gray-900" : "text-emerald-900")}>{title}</p>
            <div className="flex items-center gap-3">
               <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{meta}</p>
               <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest">{time}</p>
            </div>
         </div>
      </div>
   )
}
