import {
   ArrowLeft,
   CheckCircle2,
   Clock,
   Download,
   Filter,
   MapPin,
   MessageSquare,
   Package,
   Phone,
   Truck
} from 'lucide-react'
import { Link, useParams } from 'react-router'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import { mockFarms, shipmentDetails } from '~/lib/mock-data/transporter'
import { cn } from '~/lib/utils'

export default function ShipmentHistoryDetailPage() {
   const { id } = useParams()

   return (
      <div className="space-y-6 pb-12">
         <div className="flex items-center justify-between">
            <h1 className="text-[14px] font-bold text-[#1a4332]">Product</h1>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <Link to="/transporter/history" className="size-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="size-4" />
               </Link>
               <div className="space-y-1">
                  <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Shipment History</h2>
                  <p className="text-[12px] text-gray-500 font-medium tracking-tight">Verified ledger of all global dispatches, Immutable lineage tracking and compliance audit trail for institutional reporting.</p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" className="h-9 px-4 text-[11px] font-bold border-gray-200 text-gray-600 gap-2 rounded-md">
                  <Filter className="size-4" /> Filter View
               </Button>
               <Button className="h-9 px-4 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-2 rounded-md">
                  <Download className="size-4" /> Export Report
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Farmer Details */}
            <DetailSection icon={<MapPin className="size-4" />} title="Farmer Details">
               <div className="p-4 rounded-md border border-gray-50 bg-white/50 space-y-6">
                  <div className="flex items-center gap-4">
                     <img src={shipmentDetails.farmer.avatar} alt="Avatar" className="size-14 rounded-full object-cover border-2 border-white shadow-sm" />
                     <div className="space-y-1">
                        <h4 className="text-lg font-bold text-[#1a4332]">{shipmentDetails.farmer.name}</h4>
                        <p className="text-[12px] font-bold text-gray-400">{shipmentDetails.farmer.rating} Rating</p>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     <Button variant="outline" className="h-10 text-[12px] font-bold text-emerald-600 border-emerald-100 hover:bg-emerald-50 gap-2 rounded-md">
                        <Phone className="size-4" /> Call
                     </Button>
                     <Button variant="outline" className="h-10 text-[12px] font-bold text-emerald-600 border-emerald-100 hover:bg-emerald-50 gap-2 rounded-md">
                        <MessageSquare className="size-4" /> Message
                     </Button>
                  </div>
               </div>
            </DetailSection>

            {/* Pickup Locations Info */}
            <DetailSection icon={<MapPin className="size-4" />} title="Pickup Locations">
               <div className="flex items-center gap-4 p-4">
                  <div className="flex-1 space-y-2">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Product</p>
                     <p className="text-[14px] font-bold text-[#1a4332]">{shipmentDetails.pickup.product}</p>
                  </div>
                  <div className="flex-1 space-y-2">
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</p>
                     <p className="text-[14px] font-bold text-[#1a4332]">{shipmentDetails.pickup.quantity}</p>
                  </div>
                  <div className="absolute top-4 right-4">
                     <Badge variant="success" label="GPRS Active" />
                  </div>
               </div>
               <div className="p-4 pt-0 space-y-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Packing</p>
                  <p className="text-[14px] font-bold text-[#1a4332]">{shipmentDetails.pickup.packing}</p>
               </div>
            </DetailSection>

            {/* Maps */}
            <DetailSection icon={<MapPin className="size-4" />} title="Pickup Locations">
               <div className="absolute top-4 right-4 z-10">
                  <Badge variant="success" label="GPRS Active" />
               </div>
               <div className="rounded-md overflow-hidden h-[300px]">
                  <FarmMap farms={mockFarms.slice(0, 1).map(f => ({
                     ...f,
                     id: f.id.toString(),
                  }))} className="h-full border-none" />
               </div>
            </DetailSection>

            <DetailSection icon={<MapPin className="size-4" />} title="Destination">
               <div className="absolute top-4 right-4 z-10">
                  <Badge variant="success" label="GPRS Active" />
               </div>
               <div className="rounded-md overflow-hidden h-[300px]">
                  <FarmMap farms={mockFarms.slice(1, 2).map(f => ({
                     ...f,
                     id: f.id.toString(),
                  }))} className="h-full border-none" />
               </div>
            </DetailSection>
         </div>

         {/* Stats Row */}
         <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-center gap-24">
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Clock className="size-5" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Time</p>
                  <p className="text-lg font-bold text-[#1a4332]">{shipmentDetails.stats.estTime}</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Truck className="size-5" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Distance</p>
                  <p className="text-lg font-bold text-[#1a4332]">{shipmentDetails.stats.distance}</p>
               </div>
            </div>
         </div>

         {/* Destination Timeline */}
         <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-[#1a4332]">
               <MapPin className="size-5" />
               <h3 className="text-lg font-bold tracking-tight">Destination</h3>
            </div>

            <div className="space-y-0 relative pl-8 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
               {shipmentDetails.timeline.map((step, i) => (
                  <div key={i} className="relative pb-8 last:pb-0 flex items-start gap-4 group cursor-pointer">
                     <div className={cn(
                        "size-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 shrink-0",
                        step.status === 'current' ? "bg-brand text-white shadow-lg ring-4 ring-brand/10" :
                           step.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-300 border border-gray-100"
                     )}>
                        {step.label === 'In Transit' && <Truck className="size-4" />}
                        {step.label === 'Arrived' && <CheckCircle2 className="size-4" />}
                        {step.label === 'Picked up' && <Package className="size-4" />}
                        {step.label === 'Delivered' && <Package className="size-4" />}
                     </div>
                     <div className="space-y-0.5 pt-1.5">
                        <p className={cn(
                           "text-[12px] font-bold transition-colors",
                           step.status === 'current' ? "text-brand" : "text-gray-400 group-hover:text-gray-600"
                        )}>{step.label}</p>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                           {step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'In Progress' : 'Pending'}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

function DetailSection({ icon, title, children }: any) {
   return (
      <section className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col relative">
         <div className="p-6 pb-4 flex items-center gap-3 text-[#1a4332]">
            {icon}
            <h3 className="text-sm font-bold tracking-tight uppercase tracking-widest">{title}</h3>
         </div>
         <div className="flex-1">
            {children}
         </div>
      </section>
   )
}

function Badge({ variant, label }: { variant: 'success' | 'warning' | 'info', label: string }) {
   const styles = {
      success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      warning: 'bg-orange-50 text-orange-600 border-orange-100',
      info: 'bg-blue-50 text-blue-600 border-blue-100'
   }
   return (
      <span className={cn("px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest", styles[variant])}>
         {label}
      </span>
   )
}
