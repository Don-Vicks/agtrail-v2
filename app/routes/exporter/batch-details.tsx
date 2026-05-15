import {
   Activity,
   AlertTriangle,
   Award,
   Calendar,
   ChevronLeft,
   Download,
   Droplets,
   Flame,
   MapPin,
   QrCode,
   Share2,
   User
} from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function ExporterBatchDetails() {
   const [activeTab, setActiveTab] = useState('Journey')

   return (
      <div className="space-y-6 pb-12">
         <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <ChevronLeft className="size-3" /> Add Farmer
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Product Info Card */}
            <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm flex flex-col">
               <div className="p-8 space-y-8">
                  <div className="flex items-start gap-8">
                     <div className="size-48 rounded-3xl overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                        <img
                           src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=60"
                           alt="Product"
                           className="size-full object-cover rounded-md"
                        />
                     </div>
                     <div className="flex-1 space-y-4 pt-2">
                        <div className="space-y-1">
                           <h1 className="text-3xl font-black text-[#1a4332] tracking-tight uppercase">Cherry Tomatoes</h1>
                           <p className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">BATCH-1758814569861</p>
                        </div>
                        <div className="space-y-2.5">
                           <DetailItem icon={<MapPin className="size-3.5" />} text="Zone 16, Kute, Iwo Road" />
                           <DetailItem icon={<Calendar className="size-3.5" />} text="Planted: 3rd, January 2020" />
                           <div className="flex items-center justify-between">
                              <DetailItem icon={<User className="size-3.5" />} text="Field Agent: Sunday Abel" />
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100 font-bold px-3 py-1 text-[10px] uppercase tracking-widest">Approved</Badge>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <Button variant="secondary" className="flex-1 h-12 bg-[#1a4332] hover:bg-black text-white font-bold text-[11px] uppercase tracking-widest gap-2">
                        <QrCode className="size-4" /> QR Code
                     </Button>
                     <Button variant="outline" className="flex-1 h-12 border-gray-200 text-gray-600 font-bold text-[11px] uppercase tracking-widest gap-2">
                        <Download className="size-4" /> Download
                     </Button>
                     <Button variant="outline" className="flex-1 h-12 border-gray-200 text-gray-600 font-bold text-[11px] uppercase tracking-widest gap-2">
                        <Share2 className="size-4" /> Share
                     </Button>
                  </div>
               </div>
            </div>

            {/* Stats and Alerts Column */}
            <div className="space-y-4">
               {/* Deforestation Alert */}
               <div className="rounded-md bg-orange-50 border border-orange-100 p-6 flex gap-4 relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <AlertTriangle className="size-24 rotate-12" />
                  </div>
                  <div className="size-10 rounded-xl bg-orange-200/50 flex items-center justify-center shrink-0">
                     <AlertTriangle className="size-5 text-orange-700" />
                  </div>
                  <div className="space-y-1 relative z-10">
                     <h4 className="text-[14px] font-bold text-orange-900 tracking-tight leading-none">Deforestation Test Failed</h4>
                     <p className="text-[10px] font-bold text-orange-800/70 leading-relaxed uppercase tracking-tight">
                        Recorded Variance of -2.70% is outside the 2% tolerance window. A discrepancy flag has been generated automatically
                     </p>
                  </div>
               </div>

               {/* Micro Stats Grid */}
               <div className="grid grid-cols-2 gap-4">
                  <MicroStat icon={<Activity className="size-5 text-green-600" />} value="56" label="Sustainability Score" />
                  <MicroStat icon={<Flame className="size-5 text-teal-600" />} value="0.0" label="kg CO2, eq" />
                  <MicroStat icon={<Droplets className="size-5 text-blue-600" />} value="0" label="Liters Used" />
                  <MicroStat icon={<Award className="size-5 text-amber-600" />} value="2" label="Certifications" />
               </div>
            </div>
         </div>

         {/* Tabs and Timeline */}
         <div className="pt-8 space-y-8">
            <div className="flex items-center justify-center gap-2">
               {['Journey', 'Impact', 'Quality', 'People'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={cn(
                        "px-8 py-2 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all",
                        activeTab === tab ? "bg-white text-brand shadow-sm border border-gray-100" : "text-gray-400 hover:text-gray-600"
                     )}
                  >
                     {tab}
                  </button>
               ))}
            </div>

            {activeTab === 'Journey' && (
               <div className="max-w-3xl mx-auto space-y-0 relative pl-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                  <TimelineStep
                     title="Land Preparation"
                     subtitle="Clearing and preparing the land for farming"
                     date="24th September 2023"
                     time="12:00 AM"
                     description="This cycle on Plot A began with a strong focus on soil conservation and balanced fertility. Your choice of minimum tillage has already improved the soil's water holding capacity. We report tracks over four early actions including building a foundation for healthy plant growth and ensuring robust support."
                  />
                  <TimelineStep
                     title="Planting"
                     subtitle="Clearing and preparing the land for farming"
                     date="24th September 2023"
                     time="12:00 AM"
                     description="This cycle on Plot A began with a strong focus on soil conservation and balanced fertility. Your choice of minimum tillage has already improved the soil's water holding capacity. We report tracks over four early actions including building a foundation for healthy plant growth and ensuring robust support."
                  />
                  <TimelineStep
                     title="Land Preparation"
                     subtitle="Clearing and preparing the land for farming"
                     date="24th September 2023"
                     time="12:00 AM"
                     description="This cycle on Plot A began with a strong focus on soil conservation and balanced fertility. Your choice of minimum tillage has already improved the soil's water holding capacity. We report tracks over four early actions including building a foundation for healthy plant growth and ensuring robust support."
                  />
                  <TimelineStep
                     title="Certification Status"
                     subtitle="Clearing and preparing the land for farming"
                     date="24th September 2023"
                     time="12:00 AM"
                     description="This cycle on Plot A began with a strong focus on soil conservation and balanced fertility. Your choice of minimum tillage has already improved the soil's water holding capacity. We report tracks over four early actions including building a foundation for healthy plant growth and ensuring robust support."
                  />
               </div>
            )}
         </div>

         <div className="flex justify-center pt-8">
            <Button className="h-12 px-24 bg-[#1a4332] hover:bg-black text-white font-bold text-[12px] uppercase tracking-widest shadow-xl shadow-brand/20 transition-all hover:scale-[1.02]">
               Continue
            </Button>
         </div>
      </div>
   )
}

function DetailItem({ icon, text }: any) {
   return (
      <div className="flex items-center gap-2.5">
         <div className="size-7 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
            {icon}
         </div>
         <span className="text-[13px] font-bold text-gray-900 tracking-tight">{text}</span>
      </div>
   )
}

function MicroStat({ icon, value, label }: any) {
   return (
      <div className="rounded-md border border-gray-50 bg-white p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-sm group hover:shadow-md transition-all border-b-2 hover:border-b-brand/40">
         <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
            {icon}
         </div>
         <div className="space-y-0.5">
            <p className="text-xl font-black text-[#1a4332] tracking-tight leading-none">{value}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
         </div>
      </div>
   )
}

function TimelineStep({ title, subtitle, date, time, description }: any) {
   return (
      <div className="relative pb-12 last:pb-0 group">
         <div className="absolute -left-[24.5px] top-1.5 size-4 rounded-full border-4 border-white ring-2 ring-gray-100 bg-brand/40 group-hover:bg-brand transition-colors z-10 shadow-sm" />

         <div className="rounded-md border border-gray-50 bg-white p-6 shadow-sm space-y-4 group-hover:shadow-md transition-all border-l-4 border-l-brand/10 group-hover:border-l-brand">
            <div className="flex items-start justify-between">
               <div className="space-y-0.5">
                  <h4 className="text-[14px] font-black text-[#1a4332] tracking-tight uppercase leading-none">{title}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{subtitle}</p>
               </div>
               <div className="flex items-center gap-3">
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-gray-900 uppercase tracking-tight">{date}</p>
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{time}</p>
                  </div>
               </div>
            </div>
            <div className="space-y-3">
               <p className="text-[12px] font-medium text-gray-500 leading-relaxed italic">
                  "{description}"
               </p>
               <div className="pt-2 border-t border-gray-50 space-y-2">
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Operations Details</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">Primary Tillage: Minimum tillage</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">Conservation Structures: Contour Ploughing</span>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight italic">Preparation Technique: Manual</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
