import { CheckCircle2, ShieldCheck, User, PenTool, Sprout, Factory, Truck, MapPin } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

export default function DeliveryCustodyPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          { label: 'Product', href: '#' },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="space-y-1 text-left">
            <h1 className="text-2xl font-semibold text-brand tracking-tight">Delivery & Proof of Custody</h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">Status: Final Destination Reached</p>
         </div>
         <div className="text-right">
            <p className="text-[11px] text-gray-900 font-medium tracking-tight">2023-11-24 14:32:01 UTC</p>
            <p className="text-[9px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">Time stamp</p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Left Column: Summary & Blockchain */}
         <div className="flex-1 space-y-8">
            <div className="rounded-md border border-gray-100 bg-white p-10 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-10 -mr-10 size-48 bg-gray-50/50 rounded-full"></div>
               <div className="flex items-center gap-3 mb-10">
                  <div className="size-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Delivery Summary</h2>
               </div>

               <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-1.5">
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Batch ID</p>
                     <p className="text-2xl font-semibold text-brand tracking-tight">#AG-9928-TX</p>
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Quantity</p>
                     <p className="text-2xl font-semibold text-gray-900 tracking-tight">42.5 <span className="text-sm font-medium text-gray-400">Metric Tons</span></p>
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Quality Grade</p>
                     <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-emerald-500"></div>
                        <p className="text-xl font-semibold text-emerald-900 tracking-tight">Premium A+</p>
                     </div>
                  </div>
                  <div className="space-y-1.5">
                     <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Moisture Level</p>
                     <p className="text-2xl font-semibold text-gray-900 tracking-tight">11.2%</p>
                  </div>
               </div>

               <div className="mt-12 pt-10 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-md border border-gray-100 flex items-center justify-center text-emerald-900 bg-white">
                        <ShieldCheck className="size-5" />
                     </div>
                     <div>
                        <p className="text-xs font-semibold text-gray-900 tracking-tight">Origin Verification</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">Authenticated by Agtrail Node #04</p>
                     </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-medium text-gray-400 border-gray-100 uppercase tracking-widest px-4 py-1.5 rounded-md">Validated</Badge>
               </div>
            </div>

            {/* Blockchain Hashing */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
               <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-brand animate-pulse"></div>
                  <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">Blockchain Hashing Live</h3>
               </div>
               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Prev_Hash:</p>
                        <p className="text-[11px] font-mono font-medium text-gray-500">0x4f2d...e92a</p>
                     </div>
                     <div className="space-y-1.5 text-right">
                        <div className="flex items-center justify-end gap-2 mb-1.5">
                           <span className="text-[10px] font-medium text-brand uppercase tracking-widest">Curr_Tx :</span>
                           <div className="h-2 w-48 bg-gray-50 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-900 w-[64%]"></div>
                           </div>
                           <span className="text-[10px] font-medium text-gray-300">64%</span>
                        </div>
                        <p className="text-[10px] font-mono font-medium text-gray-300 truncate">sha256:d54f762f92f25492d2f2d54f762f92f25492d2f2...</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Right Column: Identity & Signature */}
         <div className="w-[480px] space-y-8">
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
               <h3 className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">Receiver Identity</h3>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="size-12 rounded-full bg-emerald-900 flex items-center justify-center text-white">
                        <User className="size-6" />
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Operations Lead, Silo-North</p>
                     </div>
                  </div>
                  <Badge className="bg-emerald-900 text-white font-bold text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-md border-none">KYC VERIFIED</Badge>
               </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-8 text-left relative">
               <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-widest">Receiver Signature</h3>
                  <button className="text-[11px] font-semibold text-emerald-600 uppercase tracking-widest hover:underline">Clear</button>
               </div>

               <div className="h-64 rounded-md border-2 border-dashed border-gray-100 bg-gray-50/30 flex items-center justify-center relative group">
                  <div className="absolute inset-8 rounded-md bg-[#6b8e8a] flex items-center justify-center shadow-2xl">
                     <span className="text-white text-7xl font-signature opacity-40 rotate-[-12deg] tracking-widest">Jatal</span>
                  </div>
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded border border-gray-100">
                     <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">E-Sign ID: AXQ-01</span>
                  </div>
                  <div className="absolute bottom-4 right-4 size-10 rounded-full bg-white shadow-xl flex items-center justify-center text-gray-400 group-hover:text-emerald-900 transition-colors">
                     <PenTool className="size-5" />
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[11px] font-medium text-emerald-900/60 leading-relaxed italic">
                    I hereby confirm receipt of the mentioned batch in its stated condition. This action will generate an immutable record on the AgriLogix ledger.
                  </p>
                  <Button className="w-full h-14 bg-brand-dark hover:bg-black text-white font-bold text-[15px] uppercase tracking-widest rounded-md shadow-2xl active:scale-95 transition-all">
                     Finalize & Anchor
                  </Button>
               </div>
            </div>
         </div>
      </div>

      {/* Supply Chain Journey */}
      <div className="rounded-md border border-gray-100 bg-white p-12 shadow-sm">
         <div className="flex items-center justify-between relative">
            <div className="absolute top-[28px] left-0 right-0 h-0.5 bg-gray-100"></div>
            
            <JourneyStep 
              icon={<Sprout className="size-5" />} 
              label="Harvest" 
              id="TX_H1290" 
              status="completed" 
            />
            <JourneyStep 
              icon={<Factory className="size-5" />} 
              label="Processing" 
              id="TX_P4492" 
              status="completed" 
            />
            <JourneyStep 
              icon={<Truck className="size-5" />} 
              label="Transit" 
              id="TX_T9983" 
              status="completed" 
            />
            <JourneyStep 
              icon={<MapPin className="size-5" />} 
              label="Final Custody" 
              id="Awaiting Anchor..." 
              status="active" 
            />
         </div>
      </div>
    </div>
  )
}

function JourneyStep({ icon, label, id, status }: { icon: React.ReactNode, label: string, id: string, status: 'completed' | 'active' }) {
  return (
    <div className="flex flex-col items-center gap-6 relative z-10 w-48">
       <div className={cn(
         "size-14 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-500",
         status === 'completed' ? "bg-gray-50 text-gray-400" : "bg-emerald-900 text-white scale-110 ring-4 ring-emerald-900/10"
       )}>
          {icon}
       </div>
       <div className="text-center space-y-1">
          <p className={cn("text-[11px] font-black uppercase tracking-widest", status === 'active' ? "text-emerald-900" : "text-gray-400")}>{label}</p>
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{id}</p>
       </div>
    </div>
  )
}
