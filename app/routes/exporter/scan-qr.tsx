import {
   AlertTriangle,
   Camera,
   CheckCircle2,
   ChevronLeft,
   FileText,
   History,
   Info,
   Scan,
   XCircle
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'

export default function ExporterScanQR() {
   return (
      <div className="space-y-6 pb-12">
         <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <ChevronLeft className="size-3" /> Add Farmer
         </div>

         <div className="space-y-1 mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">INBOUND CONSOLIDATION - DRAFT-2026-04-22</p>
            <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Batch QR Scan & Verification</h1>
            <p className="text-sm text-gray-500 font-medium">Scan farmer batch QRs, review verification status, and consolidate them into a lot before taking custody.</p>
         </div>

         {/* Verification KPI Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ScanKPI label="Scanned" value="0" />
            <ScanKPI label="Verified" value="0" />
            <ScanKPI label="Flagged" value="0" />
            <ScanKPI label="Rejected" value="0" />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Left Side: Scanner UI */}
            <div className="space-y-6">
               <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center">
                           <Camera className="size-5 text-gray-400" />
                        </div>
                        <div>
                           <h3 className="text-[14px] font-bold text-gray-900 tracking-tight">QR Scan Station</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aim at a batch QR or simulate scans for demo</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-9 px-3 bg-gray-50 text-gray-600 font-bold text-[10px] uppercase tracking-widest gap-2">
                           <Camera className="size-3.5" /> Camera
                        </Button>
                        <Button variant="outline" className="h-9 px-3 bg-white text-brand border-brand/20 font-bold text-[10px] uppercase tracking-widest gap-2">
                           <History className="size-3.5" /> Simulate
                        </Button>
                     </div>
                  </div>

                  <div className="relative aspect-video rounded-md bg-[#1a4332] flex flex-col items-center justify-center text-white/50 space-y-4 shadow-inner">
                     <Scan className="size-12 opacity-20" />
                     <div className="text-center">
                        <p className="text-[14px] font-bold text-white tracking-tight leading-none">Camera Off</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Use the buttons below</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                     <Button variant="outline" className="h-10 px-4 border-gray-100 text-green-600 font-bold text-[10px] uppercase tracking-widest gap-2">
                        <CheckCircle2 className="size-4" /> Valid batch
                     </Button>
                     <Button variant="outline" className="h-10 px-4 border-gray-100 text-amber-600 font-bold text-[10px] uppercase tracking-widest gap-2">
                        <AlertTriangle className="size-4" /> Flagged Batch
                     </Button>
                     <Button variant="outline" className="h-10 px-4 border-gray-100 text-red-600 font-bold text-[10px] uppercase tracking-widest gap-2">
                        <XCircle className="size-4" /> Rejected QR
                     </Button>
                  </div>
               </div>

               {/* Lot Summary */}
               <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[14px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <FileText className="size-4 text-brand" /> Lot Summary
                     </h3>
                     <button className="text-gray-400 hover:text-gray-600">
                        <Info className="size-4" />
                     </button>
                  </div>

                  <div className="grid grid-cols-2 gap-8 border-b border-gray-50 pb-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Includable</p>
                        <p className="text-2xl font-black text-[#1a4332] tracking-tight">0 <span className="text-[12px] font-bold text-gray-300 ml-1">batches</span></p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Weight</p>
                        <p className="text-2xl font-black text-[#1a4332] tracking-tight">0 <span className="text-[12px] font-bold text-gray-300 ml-1">Kg</span></p>
                     </div>
                  </div>

                  <p className="text-xs text-gray-500 font-medium italic leading-relaxed">
                     Use the scan station on the left to add batches. Verified batches will appear here, ready to consolidation into a lot
                  </p>
               </div>
            </div>

            {/* Right Side: Scanned Batches List */}
            <div className="space-y-4 flex flex-col h-full">
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Scanned Batches <span className="text-gray-400 ml-1">(0)</span></h3>

               <div className="flex-1 rounded-md border border-dashed border-gray-200 bg-white/50 flex flex-col items-center justify-center p-12 text-center space-y-4">
                  <div className="size-16 rounded-md bg-gray-50 flex items-center justify-center mb-2">
                     <Scan className="size-8 text-gray-300" />
                  </div>
                  <div className="space-y-1">
                     <h4 className="text-[14px] font-bold text-gray-400 tracking-tight leading-none uppercase">no batches scanned yet</h4>
                     <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest max-w-[300px]">
                        use the scan station on the left to add batches. verified batches will appear here, ready to consolidation into a lot
                     </p>
                  </div>
               </div>

               <div className="flex justify-end pt-4">
                  <Link to="/exporter/lot-draft">
                     <Button className="h-11 px-8 bg-[#1a4332] hover:bg-black text-white font-bold text-[12px] uppercase tracking-widest gap-2 shadow-lg shadow-brand/10 transition-all">
                        <History className="size-4" /> See Draft
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   )
}

function ScanKPI({ label, value }: any) {
   return (
      <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-1">
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
         <h4 className="text-3xl font-black text-[#1a4332] tracking-tight">{value}</h4>
      </div>
   )
}
