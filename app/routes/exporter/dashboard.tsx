import {
   AlertTriangle,
   ArrowUpRight,
   Award,
   Clock,
   Download,
   Filter,
   PlusCircle,
   ShieldCheck,
   Upload
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
   alertCenter,
   availableShipments,
   exporterStats,
   exportVolumeTrends,
   recentActivity,
   revenueByDestination,
   shipmentStatusOverview
} from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterDashboard() {
   return (
      <div className="space-y-6 pb-12">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h1 className="text-[14px] font-bold text-[#1a4332]">Good Morning</h1>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="size-3" /> Friday, May 1, 2026
               </p>
            </div>
            <div className="size-10 rounded-full border border-gray-100 flex items-center justify-center overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" className="size-8" />
            </div>
         </div>

         {/* KPI Stats */}
         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {exporterStats.map((stat, i) => (
               <KPIStatCard key={i} {...stat} />
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
               {/* Shipment Status Overview */}
               <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Shipment Status Overview</h3>
                     <button className="text-[11px] font-bold text-brand hover:underline uppercase tracking-widest flex items-center gap-1">
                        View Details <ArrowUpRight className="size-3" />
                     </button>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                     {shipmentStatusOverview.map((status, i) => (
                        <div key={i} className="space-y-3">
                           <div className="flex items-center justify-between px-2">
                              <span className="text-[14px] font-black text-[#1a4332]">{status.value.toString().padStart(2, '0')}</span>
                           </div>
                           <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", status.color)} style={{ width: '40%' }} />
                           </div>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-2">{status.label}</p>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Available Shipment Table */}
               <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/10">
                     <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Available Shipment</h3>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-8 text-[10px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
                           <Filter className="size-3" /> Filter
                        </Button>
                        <Button variant="outline" className="h-8 text-[10px] font-bold border-gray-200 text-gray-600 gap-1.5 px-3">
                           <Download className="size-3" /> Export CSV
                        </Button>
                     </div>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/5">
                           <th className="px-6 py-4">Batch Identifier</th>
                           <th className="px-6 py-4">Farmer</th>
                           <th className="px-6 py-4">Commodity</th>
                           <th className="px-6 py-4">Departure</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Weight</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {availableShipments.map((shipment, i) => (
                           <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                              <td className="px-6 py-5">
                                 <span className="text-[12px] font-bold text-brand uppercase tracking-tight">{shipment.batchId}</span>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="space-y-0.5">
                                    <p className="text-[12px] font-bold text-[#1a4332] leading-none">{shipment.farmer.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{shipment.farmer.location}</p>
                                 </div>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="space-y-0.5">
                                    <p className="text-[12px] font-bold text-[#1a4332] leading-none">{shipment.commodity}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{shipment.quantity}</p>
                                 </div>
                              </td>
                              <td className="px-6 py-5 text-[11px] font-bold text-gray-500">{shipment.departure}</td>
                              <td className="px-6 py-5">
                                 <span className={cn(
                                    "px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest",
                                    shipment.status === 'In Transit' ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-red-50 text-red-600 border-red-100"
                                 )}>{shipment.status}</span>
                              </td>
                              <td className="px-6 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                                       <div className="h-full bg-brand rounded-full" style={{ width: `${shipment.weight}%` }} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-900">{shipment.weight}%</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Export Volume Trends */}
                  <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                     <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Export Volume Trends</h3>
                     <div className="h-[200px] flex items-end gap-2 px-2">
                        {exportVolumeTrends.map((trend, i) => (
                           <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                              <div
                                 className="w-full bg-gray-50 rounded-t-sm group-hover:bg-[#1a4332]/80 transition-all cursor-pointer relative"
                                 style={{ height: `${trend.value}%` }}
                              >
                                 <div className={cn("absolute inset-0 bg-[#1a4332]/20 group-hover:bg-transparent", i === 5 && "bg-[#1a4332]")} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trend.month}</span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Revenue by Destination */}
                  <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-8">
                     <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Revenue by Destination</h3>
                     <div className="space-y-6">
                        {revenueByDestination.map((dest, i) => (
                           <div key={i} className="space-y-2">
                              <div className="flex items-center justify-between text-[11px] font-bold">
                                 <span className="text-gray-900">{dest.destination}</span>
                                 <span className="text-gray-900">{dest.revenue}</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                 <div className="h-full bg-[#1a4332] rounded-full" style={{ width: `${dest.percentage}%` }} />
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
               {/* Quick Actions */}
               <div className="rounded-md bg-[#1a4332] p-6 shadow-lg space-y-4">
                  <h3 className="text-[14px] font-bold text-white tracking-tight mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                     <ActionCard icon={<PlusCircle className="size-4" />} title="Create Shipment" />
                     <ActionCard icon={<Upload className="size-4" />} title="Upload Docs" />
                     <ActionCard icon={<ShieldCheck className="size-4" />} title="Verify Compliance" />
                     <ActionCard icon={<Award className="size-4" />} title="Product Passport" />
                  </div>
               </div>

               {/* Alert Center */}
               <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between mb-2">
                     <h3 className="text-[14px] font-bold text-[#1a4332] tracking-tight">Alert Center</h3>
                     <span className="size-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                  </div>
                  <div className="space-y-3">
                     {alertCenter.map((alert) => (
                        <AlertItem key={alert.id} {...alert} />
                     ))}
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                  <h3 className="text-[14px] font-bold text-[#1a4332] tracking-tight">Recent Activity</h3>
                  <div className="space-y-6 relative pl-4 before:absolute before:left-[3px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                     {recentActivity.map((activity) => (
                        <div key={activity.id} className="relative">
                           <div className="absolute -left-[16.5px] top-1 size-2 rounded-full border-2 border-white ring-4 ring-gray-50 bg-brand/50" />
                           <div className="space-y-1">
                              <h4 className="text-[12px] font-bold text-gray-900 leading-tight">{activity.title}</h4>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{activity.detail}</p>
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{activity.time}</p>
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
      <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm space-y-4 transition-all hover:shadow-md cursor-default">
         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
         <div className="space-y-1">
            <h4 className="text-xl font-black text-[#1a4332] tracking-tight">{value}</h4>
            <div className="flex items-center gap-1">
               <span className={cn(
                  "text-[9px] font-bold",
                  trend.startsWith('+') ? "text-green-600" : "text-red-600"
               )}>{trend}</span>
               <span className="text-[9px] font-bold text-gray-300 uppercase">{sublabel}</span>
            </div>
         </div>
      </div>
   )
}

function ActionCard({ icon, title }: any) {
   return (
      <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-white text-left group">
         <div className="size-9 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
            {icon}
         </div>
         <span className="text-[12px] font-bold tracking-tight">{title}</span>
      </button>
   )
}

function AlertItem({ title, description, type }: any) {
   const styles = {
      error: 'bg-red-50 border-red-100 text-red-700',
      warning: 'bg-orange-50 border-orange-100 text-orange-700',
      success: 'bg-green-50 border-green-100 text-green-700'
   }
   return (
      <div className={cn("p-4 rounded-xl border flex gap-3", (styles as any)[type])}>
         <AlertTriangle className="size-4 shrink-0" />
         <div className="space-y-0.5">
            <h4 className="text-[11px] font-bold leading-none">{title}</h4>
            <p className="text-[9px] font-bold opacity-70 uppercase tracking-tight">{description}</p>
         </div>
      </div>
   )
}
