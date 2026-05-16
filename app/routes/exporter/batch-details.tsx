import {
   CheckCircle2,
   ChevronRight,
   Leaf,
   TrendingUp,
   Users,
   ShieldCheck,
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
import { PageHeader } from '~/components/page-header'

export default function ExporterBatchDetails() {
   const [activeTab, setActiveTab] = useState('Journey')

   return (
      <div className="space-y-6 pb-12">
         <PageHeader
            items={[
               { label: 'Exporter', href: '/exporter' },
               { label: 'Batch Details' },
            ]}
         />

         <div className="grid grid-cols-1 gap-8">
            <div className="rounded-md border border-gray-100 bg-white p-6 md:p-12 flex flex-col md:flex-row gap-10 shadow-sm">
               <div className="w-full md:w-[360px] aspect-square rounded-md overflow-hidden border border-gray-100 bg-gray-50 shadow-inner group shrink-0">
                  <img
                     src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=60"
                     alt="Product"
                     className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
               </div>
               
               <div className="flex-1 flex flex-col justify-center py-2">
                  <div className="space-y-6 md:space-y-8">
                     <div>
                        <h1 className="text-4xl md:text-5xl font-black text-[#1d3d1e] tracking-tight uppercase leading-tight">Cherry Tomatoes</h1>
                        <p className="text-[11px] md:text-xs font-black text-gray-400 uppercase tracking-[0.25em] mt-3">BATCH: BATCH-1758814569861</p>
                     </div>
                     
                     <div className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-4 text-gray-600">
                           <div className="size-10 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              <MapPin className="size-5" />
                           </div>
                           <span className="text-sm md:text-base font-extrabold tracking-tight">Zone 16, Kute, Iwo Road</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                           <div className="size-10 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                              <Calendar className="size-5" />
                           </div>
                           <span className="text-sm md:text-base font-extrabold tracking-tight">Planted: 3rd, January 2020</span>
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-2 pt-4">
                        <div className="flex flex-wrap items-center gap-3">
                           <Button className="flex-1 md:flex-none bg-[#1d3d1e] hover:bg-black text-white px-8 h-12 gap-2 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-brand/10 rounded-md">
                              <QrCode className="size-5 shrink-0" />
                              <span className="flex flex-col items-start gap-0.5 leading-tight text-left">
                                 <span>View passport</span>
                                 <span className="text-[9px] font-bold normal-case tracking-normal text-white/70">QR & link</span>
                              </span>
                           </Button>
                           <Button variant="outline" className="flex-1 md:flex-none h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-2 rounded-md">
                              <Download className="size-5" />
                              Download
                           </Button>
                           <Button variant="outline" className="w-full md:w-auto h-12 px-8 border-gray-200 text-gray-700 hover:bg-gray-50 font-black uppercase tracking-widest text-[10px] gap-2 rounded-md">
                              <Share2 className="size-5 shrink-0" />
                              Share
                           </Button>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-xl pl-0.5 mt-2">
                           Tap View passport or Share to see the public digital passport (QR code).
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
               <div className="rounded-md border border-gray-100 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 md:gap-3">
                  <div className="text-[#1d3d1e] opacity-80"><Leaf className="size-6 md:size-8" /></div>
                  <div>
                     <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">56</p>
                     <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sustainability Score</p>
                  </div>
               </div>
               <div className="rounded-md border border-gray-100 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 md:gap-3">
                  <div className="text-[#1d3d1e] opacity-80"><Flame className="size-6 md:size-8" /></div>
                  <div>
                     <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">0.0</p>
                     <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">kg CO2, eq</p>
                  </div>
               </div>
               <div className="rounded-md border border-gray-100 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 md:gap-3">
                  <div className="text-[#1d3d1e] opacity-80"><Droplets className="size-6 md:size-8" /></div>
                  <div>
                     <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">0</p>
                     <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Liters Used</p>
                  </div>
               </div>
               <div className="rounded-md border border-gray-100 bg-white p-4 md:p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 md:gap-3">
                  <div className="text-[#1d3d1e] opacity-80"><ShieldCheck className="size-6 md:size-8" /></div>
                  <div>
                     <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">2</p>
                     <p className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Certifications</p>
                  </div>
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

            {activeTab === 'Impact' && (
               <div className="max-w-4xl mx-auto space-y-8">
                  <div className="rounded-md border border-gray-100 bg-white p-8 md:p-16 shadow-sm">
                     <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight uppercase">SAFA Sustainability Assessment</h2>
                        <p className="text-xs md:text-sm text-gray-500 mt-3 font-bold uppercase tracking-widest opacity-60">Full verified transparency across all dimensions.</p>
                     </div>
                     <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
                        <CircularGauge score={85} label="Total Score" />
                        <div className="flex-1 w-full max-w-md space-y-8 md:space-y-10">
                           <ImpactProgress label="Environmental" score={88} color="emerald-500" icon={<Leaf className="size-4" />} />
                           <ImpactProgress label="Economic" score={82} color="blue-500" icon={<TrendingUp className="size-4" />} />
                           <ImpactProgress label="Social" score={90} color="orange-500" icon={<Users className="size-4" />} />
                           <ImpactProgress label="Governance" score={80} color="purple-500" icon={<ShieldCheck className="size-4" />} />
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'Quality' && (
               <div className="max-w-4xl mx-auto rounded-md border border-gray-100 bg-white p-8 md:p-16 shadow-sm">
                  <div className="text-center mb-10 md:mb-16">
                     <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Quality & Compliance</h2>
                     <p className="text-xs md:text-sm text-gray-500 mt-3 font-bold uppercase tracking-widest opacity-60">Safety standards and regulatory compliance status.</p>
                  </div>
                  <div className="flex justify-center gap-12 md:gap-24 mb-12 md:mb-20">
                     <CircularGauge score={95} label="Quality Score" size="large" />
                     <CircularGauge score={100} label="Compliance Rate" size="large" />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                     <div className="space-y-8">
                        <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-tight">
                           <Activity className="size-5 md:size-6 text-emerald-500" />
                           Quality Test Results
                        </h3>
                        <div className="space-y-4">
                           <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-md border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all gap-6">
                              <div className="flex items-center gap-5 min-w-0 flex-1">
                                 <div className="size-12 rounded-md bg-white flex items-center justify-center text-emerald-600 shadow-sm border border-gray-100 shrink-0">
                                    <CheckCircle2 className="size-6" />
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate md:whitespace-normal">
                                       Harvesting: Grade A
                                    </h4>
                                    <p className="text-[11px] text-gray-500 mt-1 font-bold italic opacity-70">
                                       "Passed all quality parameters. Excellent condition."
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="pt-10 border-t border-gray-50 lg:pt-0 lg:border-t-0 lg:border-l lg:pl-10">
                        <h3 className="text-base md:text-lg font-black text-gray-900 flex items-center gap-3 mb-6 uppercase tracking-tight">
                           <ShieldCheck className="size-5 md:size-6 text-blue-500" />
                           Compliance Standards
                        </h3>
                        <div className="space-y-4">
                           <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-md border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-blue-100 hover:shadow-sm transition-all gap-6">
                              <div className="flex items-center gap-5 min-w-0 flex-1">
                                 <div className="size-12 rounded-md bg-white flex items-center justify-center text-blue-600 shadow-sm border border-gray-100 shrink-0">
                                    <ShieldCheck className="size-6" />
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight truncate md:whitespace-normal">EUDR CERTIFICATION</h4>
                                    <p className="text-[11px] text-gray-500 mt-1 font-bold uppercase tracking-widest opacity-60">Issuing Body: Global GAP</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'People' && (
               <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">
                  <div className="text-center mb-10 md:mb-12">
                     <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">People Involved</h2>
                     <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-bold uppercase tracking-widest opacity-60">Everyone who contributed to this product's journey</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:gap-6">
                     <div className="flex flex-col md:flex-row md:items-center justify-between p-5 md:p-6 rounded-md border border-gray-100 bg-white shadow-sm gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                           <div className="size-14 md:size-16 rounded-full flex items-center justify-center shadow-inner ring-1 ring-gray-100 shrink-0 bg-emerald-50 text-emerald-600">
                              <User className="size-6 md:size-7" />
                           </div>
                           <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                 <h4 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Sunday Abel</h4>
                                 <Badge variant="outline" className="text-[9px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 shadow-none bg-emerald-100 text-emerald-700 border-emerald-200">FARMER</Badge>
                              </div>
                              <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">Zone 16, Kute, Iwo Road</p>
                              <p className="text-xs text-gray-400 font-medium leading-relaxed">Source farm details tracked via operations</p>
                           </div>
                        </div>
                     </div>
                  </div>
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

function CircularGauge({ score, label, size = "large" }: { score: number; label: string; size?: "large" | "small" }) {
   const radius = size === "large" ? 45 : 35
   const circumference = 2 * Math.PI * radius
   const offset = circumference - (score / 100) * circumference

   return (
      <div className="flex flex-col items-center gap-3 md:gap-4">
         <div className="relative inline-flex items-center justify-center">
            <svg className={cn(size === "large" ? "size-24 md:size-32" : "size-20 md:size-24", "-rotate-90")}>
               <circle
                  className="text-gray-100"
                  strokeWidth={size === "large" ? "8" : "6"}
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50%"
                  cy="50%"
               />
               <circle
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  strokeWidth={size === "large" ? "8" : "6"}
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="50%"
                  cy="50%"
               />
            </svg>
            <div className="absolute flex flex-col items-center">
               <span className={cn("font-bold text-gray-900 tracking-tight", size === "large" ? "text-2xl md:text-3xl" : "text-lg md:text-xl")}>{score}</span>
               <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Score</span>
            </div>
         </div>
         <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest">{label}</p>
      </div>
   )
}

function ImpactProgress({ label, score, color, icon }: { label: string; score: number; color: string; icon: React.ReactNode }) {
   return (
      <div className="space-y-2">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className={`text-${color}`}>{icon}</div>
               <span className="text-sm font-bold text-gray-700">{label}</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{score}/100</span>
         </div>
         <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
               className={`h-full rounded-full transition-all duration-1000 bg-${color}`}
               style={{ width: `${score}%` }}
            />
         </div>
      </div>
   )
}

