import {
   Eye,
   FileIcon,
   FileText,
   Fingerprint,
   Info,
   PlusCircle,
   Save,
   Send,
   UploadCloud
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

export default function RegulatorInspectionReportPage() {
   const [purpose, setPurpose] = useState('Routine Audit')

   return (
      <div className='space-y-6 pb-12'>
         <div className="flex items-center justify-between">
            <h1 className="text-[14px] font-bold text-[#1a4332]">Good afternoon, Olamide</h1>
         </div>

         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Create New Inspection Report</h2>
               <p className="text-[12px] text-gray-500 font-medium tracking-tight">Field intelligence documentation for regulatory ledger entry.</p>
            </div>
            <div className="flex items-center gap-2">
               <Button variant="outline" className="h-9 px-4 text-[11px] font-bold border-gray-200 text-gray-600 gap-1.5 rounded-md">
                  <Save className="size-3.5" /> Save Draft
               </Button>
               <Button className="h-9 px-4 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-1.5 rounded-md">
                  <Send className="size-3.5" /> Submit Report
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
               {/* Inspection Overview */}
               <section className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[#1a4332]">
                     <Info className="size-5" />
                     <h3 className="text-lg font-bold tracking-tight">Inspection Overview</h3>
                  </div>

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">BATCH ID / TRACEABILITY CODE</p>
                        <div className="flex items-center gap-3 p-4 rounded-md border border-gray-100 bg-gray-50/50">
                           <div className="size-8 rounded-md bg-brand/10 flex items-center justify-center">
                              <Fingerprint className="size-5 text-brand" />
                           </div>
                           <span className="text-sm font-bold text-gray-900 tracking-tight">TRC-992-XBK-2024</span>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400">© Linked to Ethereum Mainnet Ledger ID: 0x4f...8a2</p>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inspection Date</label>
                           <input type="text" value="11/24/2023" className="w-full h-12 px-4 rounded-md border border-gray-100 bg-white text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand" readOnly />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inspector Name</label>
                           <input type="text" value="11/24/2023" className="w-full h-12 px-4 rounded-md border border-gray-100 bg-white text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand" readOnly />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Purpose of Inspection */}
               <section className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[#1a4332]">
                     <FileText className="size-5" />
                     <h3 className="text-lg font-bold tracking-tight">Purpose of Inspection</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                     {['Routine Audit', 'Violation Follow-up', 'Certification', 'Random Check'].map((item) => (
                        <button
                           key={item}
                           onClick={() => setPurpose(item)}
                           className={cn(
                              "p-4 rounded-md border text-left transition-all space-y-2",
                              purpose === item ? "border-[#1a4332] bg-gray-50/50" : "border-gray-100 bg-white hover:bg-gray-50"
                           )}
                        >
                           <div className="flex items-center justify-between">
                              <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{item}</h4>
                              <div className={cn(
                                 "size-4 rounded-full border-2 flex items-center justify-center",
                                 purpose === item ? "border-[#1a4332] bg-[#1a4332]" : "border-gray-200"
                              )}>
                                 {purpose === item && <div className="size-1.5 rounded-full bg-white" />}
                              </div>
                           </div>
                           <p className="text-[9px] font-medium text-gray-500 leading-normal">
                              {item === 'Routine Audit' && 'Standard annual regulatory compliance review.'}
                              {item === 'Violation Follow-up' && 'Verification of previously cited issues.'}
                              {item === 'Certification' && 'New standard or export certification check.'}
                              {item === 'Random Check' && 'Unannounced site visit for quality assurance.'}
                           </p>
                        </button>
                     ))}
                  </div>
               </section>

               {/* Physical Observations */}
               <section className="rounded-md border border-gray-100 bg-white p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[#1a4332]">
                        <Eye className="size-5" />
                        <h3 className="text-lg font-bold tracking-tight">Physical Observations</h3>
                     </div>
                     <span className="text-[10px] font-bold text-gray-400 uppercase">4 Checklist Items Found</span>
                  </div>

                  <table className="w-full text-left">
                     <thead>
                        <tr className="border-b border-gray-50 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                           <th className="px-4 py-3">Inspection Item</th>
                           <th className="px-4 py-3 text-center">Status</th>
                           <th className="px-4 py-3">Findings / Notes</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {[
                           { item: 'Boundary Check', status: 'Pass' },
                           { item: 'Chemical Storage', status: 'Fail', notes: 'Ventilation issue in Zone' },
                           { item: 'Crop Health', status: 'Pass' },
                           { item: 'Labor Standards', status: 'Pass' }
                        ].map((row, i) => (
                           <tr key={i} className="text-sm">
                              <td className="px-4 py-6 font-bold text-gray-700">{row.item}</td>
                              <td className="px-4 py-6">
                                 <div className="flex items-center justify-center gap-1.5 p-1 rounded-md bg-gray-100 border border-gray-200">
                                    {['Pass', 'Fail', 'Minor'].map((s) => (
                                       <button
                                          key={s}
                                          className={cn(
                                             "px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all",
                                             row.status === s ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600"
                                          )}
                                       >
                                          {s}
                                       </button>
                                    ))}
                                 </div>
                              </td>
                              <td className="px-4 py-6">
                                 <input
                                    type="text"
                                    defaultValue={row.notes || ''}
                                    placeholder="Add details..."
                                    className="w-full bg-transparent text-[11px] font-medium text-gray-500 italic focus:outline-none"
                                 />
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </section>
            </div>

            {/* Sidebar Sections */}
            <div className="space-y-6">
               <section className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[#1a4332]">
                     <UploadCloud className="size-5" />
                     <h3 className="text-lg font-bold tracking-tight">Evidence Upload</h3>
                  </div>

                  <div className="border-2 border-dashed border-gray-100 rounded-md p-8 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-4 group hover:bg-gray-50 transition-colors cursor-pointer">
                     <div className="size-12 rounded-md bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-brand transition-colors">
                        <UploadCloud className="size-6" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-900">Drag and drop site evidence</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase leading-relaxed">Supports PDF, JPG, PNG up to 20MB</p>
                     </div>
                  </div>

                  <div className="space-y-3">
                     {[
                        { name: 'Farm_Boundary_East.jpg', size: '1.2 MB', time: '5m ago', img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop' },
                        { name: 'Storage_Facility_01.jpg', size: '2.4 MB', time: '2m ago', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&h=300&fit=crop' }
                     ].map((file, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-md border border-gray-100 bg-white group">
                           <img src={file.img} alt={file.name} className="size-10 rounded-md object-cover" />
                           <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold text-gray-900 truncate">{file.name}</p>
                              <p className="text-[9px] font-bold text-gray-400 uppercase">{file.size} • Uploaded {file.time}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </section>

               <section className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[#1a4332]">
                     <FileIcon className="size-5" />
                     <h3 className="text-lg font-bold tracking-tight">Inspector's Summary</h3>
                  </div>
                  <textarea
                     placeholder="Provide a detailed summary and specific regulatory recommendations..."
                     className="w-full h-40 p-4 rounded-md border border-gray-100 bg-gray-50/20 text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand"
                  />
               </section>

               <section className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 text-[#1a4332]">
                     <PlusCircle className="size-5" />
                     <h3 className="text-lg font-bold tracking-tight">Digital Signature</h3>
                  </div>

                  <div className="h-40 w-full rounded-md border border-dashed border-gray-100 bg-gray-50/50 flex flex-col items-center justify-center text-center gap-3 relative overflow-hidden">
                     <div className="space-y-1 z-10">
                        <p className="text-sm font-bold text-gray-400">Signature will be applied upon submission</p>
                        <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">TX-ID: AG-234-9842-8821-X</p>
                     </div>
                     <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                        <Fingerprint className="size-32" />
                     </div>
                  </div>

                  <div className="flex gap-3">
                     <div className="pt-0.5">
                        <div className="size-4 rounded border border-gray-300 flex items-center justify-center cursor-pointer hover:border-brand">
                           <div className="size-2 bg-brand rounded-sm opacity-0 hover:opacity-100" />
                        </div>
                     </div>
                     <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">
                        I certify that this report is true and accurate.
                     </p>
                  </div>
                  <div className="pt-2 border-t border-gray-50">
                     <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Timestamp: 2023-11-24 14:32:01 UTC</p>
                  </div>
               </section>
            </div>
         </div>
      </div>
   )
}
