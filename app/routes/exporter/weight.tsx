import {
   ChevronLeft,
   Info,
   Scale
} from 'lucide-react'
import { Button } from '~/components/ui/button'

export default function ExporterWeight() {
   return (
      <div className="space-y-6 pb-12">
         <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            <ChevronLeft className="size-3" /> Add Farmer
         </div>

         <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight">Confirm Transfer Weight</h1>
            <p className="text-sm text-gray-500 font-medium">Verify the delivered Batch against the sender declaration before accepting it into your inventory</p>
         </div>

         <div className="max-w-5xl mx-auto rounded-3xl border border-gray-100 bg-white p-10 shadow-sm space-y-10">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
               <div className="size-10 rounded-xl bg-brand/5 flex items-center justify-center">
                  <Scale className="size-5 text-brand" />
               </div>
               <h2 className="text-xl font-black text-[#1a4332] tracking-tight">Weight Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
               <div className="space-y-3">
                  <label className="text-[11px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                     Received Weight (Kg)
                  </label>
                  <div className="relative">
                     <input
                        type="text"
                        placeholder="00.000"
                        className="w-full h-14 rounded-xl border border-gray-100 bg-gray-50/30 px-6 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-gray-200"
                     />
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400 uppercase">Kg</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 px-1">
                     <Info className="size-3" /> Calibration certificate must be valid.
                  </p>
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-bold text-[#1a4332] uppercase tracking-widest flex items-center gap-2">
                     Total Quantity (Unit)
                  </label>
                  <div className="relative">
                     <input
                        type="text"
                        placeholder="Enter quantity"
                        className="w-full h-14 rounded-xl border border-gray-100 bg-white px-6 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-gray-200 shadow-sm"
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                     Report Weight
                  </label>
                  <div className="relative">
                     <input
                        type="text"
                        value="1,680"
                        readOnly
                        className="w-full h-14 rounded-xl border border-gray-100 bg-gray-100/50 px-6 font-bold text-lg text-gray-500 cursor-not-allowed"
                     />
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[11px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                     Measured Weight
                  </label>
                  <div className="relative">
                     <input
                        type="text"
                        value="1,675"
                        readOnly
                        className="w-full h-14 rounded-xl border border-gray-100 bg-gray-100/50 px-6 font-bold text-lg text-gray-500 cursor-not-allowed"
                     />
                     <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-400 uppercase">Kg</span>
                  </div>
               </div>

               <div className="md:col-span-2 space-y-3 pt-4">
                  <label className="text-[11px] font-bold text-brand uppercase tracking-widest flex items-center gap-2">
                     Discrepancy Note
                  </label>
                  <textarea
                     placeholder="WBR-####-####"
                     className="w-full h-32 rounded-md border border-gray-100 bg-white p-6 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-gray-200 shadow-sm resize-none"
                  />
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
               <Button variant="outline" className="flex-1 h-14 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 font-bold text-[13px] uppercase tracking-widest shadow-sm">
                  Flag Discrepancy
               </Button>
               <Button className="flex-1 h-14 bg-[#1a4332] hover:bg-black text-white font-bold text-[13px] uppercase tracking-widest shadow-xl shadow-brand/10">
                  Save
               </Button>
            </div>
         </div>
      </div>
   )
}
