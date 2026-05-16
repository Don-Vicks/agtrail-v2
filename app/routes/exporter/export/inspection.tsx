import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { CheckCircle2, ShieldCheck, FileText, UploadCloud, FileIcon, Trash2, SwitchCamera, PlayCircle, Bold, Italic, List, Link as LinkIcon, AlertCircle, Eye } from 'lucide-react'

export default function ExporterInspectionPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Inspection' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1a4332] tracking-tight">Log Pre-Shipment Inspection</h1>
          <p className="text-xs md:text-sm text-gray-500">Complete the following institutional audit report for shipment validation</p>
        </div>
        <div className="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="size-full bg-gray-50 object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#1a4332] tracking-tight flex items-center gap-2">
              <FileText className="size-5" />
              Inspection Details
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inspection Date</label>
                 <Input type="date" className="h-11 bg-white border-gray-200 text-sm font-bold text-gray-500" />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inspector ID / Name</label>
                 <Input placeholder="e.g. AGT-992-KIP" className="h-11 bg-white border-gray-200 text-sm font-bold placeholder:text-gray-300" />
               </div>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inspection Body</label>
               <Select>
                 <SelectTrigger className="h-11 bg-white border-gray-200 text-sm font-bold text-gray-500">
                   <SelectValue placeholder="Select institution..." />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="bureau">Bureau Veritas</SelectItem>
                   <SelectItem value="sgs">SGS</SelectItem>
                   <SelectItem value="naqs">NAQS</SelectItem>
                 </SelectContent>
               </Select>
            </div>

            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Findings & Observations</label>
               <div className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 border-b border-gray-200 p-2 flex items-center gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900"><Bold className="size-4" /></Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900"><Italic className="size-4" /></Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900"><List className="size-4" /></Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900"><LinkIcon className="size-4" /></Button>
                  </div>
                  <Textarea placeholder="Enter detailed audit notes, commodity state, and packaging integrity..." className="border-0 focus-visible:ring-0 rounded-none bg-white text-sm font-medium placeholder:text-gray-300 min-h-[160px] resize-none" />
               </div>
            </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#1a4332] tracking-tight flex items-center gap-2">
              <SwitchCamera className="size-5" />
              Compliance Lifecycle
            </h3>
            
            <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-gray-100 pl-8">
              <div className="relative pb-8">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-[#1a4332] flex items-center justify-center shadow-sm z-10 border-4 border-white">
                   <CheckCircle2 className="size-3.5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Draft Generated</h4>
                <p className="text-[11px] font-bold text-gray-400 mt-1">Oct 24, 2023 - 09:12 AM by Export Coordinator</p>
              </div>
              <div className="relative pb-8">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-[#1a4332] flex items-center justify-center shadow-sm z-10 border-4 border-white">
                   <CheckCircle2 className="size-3.5 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Documents Uploaded</h4>
                <p className="text-[11px] font-bold text-gray-400 mt-1">Oct 24, 2023 - 10:45 AM (Phyto-Cert V3)</p>
              </div>
              <div className="relative pb-8">
                <div className="absolute -left-[28px] top-1.5 size-4 rounded-full border-4 border-white ring-2 ring-emerald-500 bg-white z-10" />
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-tight">PSI Data Logging</h4>
                <p className="text-[11px] font-medium text-emerald-500 italic mt-1">Current task in progress...</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[28px] top-1.5 size-4 rounded-full border-[3px] border-gray-200 bg-white z-10" />
                <h4 className="text-sm font-bold text-gray-300 uppercase tracking-tight">Final Clearance</h4>
                <p className="text-[11px] font-bold text-gray-300 mt-1">Pending PSI result</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
             <ShieldCheck className="size-4 text-emerald-500" />
             Immutable Audit Log Active
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="space-y-1.5">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">OVERALL RESULT</p>
             <div className="rounded-md border border-gray-100 bg-white shadow-sm p-4 space-y-4">
                <div className="flex items-center justify-between border border-gray-100 rounded-md p-4">
                   <div className="flex items-center gap-3">
                      <FileText className="size-5 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900">Audit Status</span>
                   </div>
                   <div className="w-12 h-6 bg-red-600 rounded-full relative shadow-inner cursor-pointer">
                      <div className="absolute left-1 top-1 size-4 bg-white rounded-full shadow-sm" />
                   </div>
                </div>
                <div className="flex items-center gap-2 bg-red-50 text-red-700 p-3 rounded-md border border-red-100 text-[11px] font-medium">
                   <AlertCircle className="size-4 shrink-0" />
                   Default state is set to FAIL until validated.
                </div>
             </div>
          </div>

          <div className="space-y-1.5">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">OFFICIAL PDF REPORT</p>
             <div className="rounded-md border border-gray-100 bg-white shadow-sm p-6 space-y-6">
                <div className="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-md p-8 flex flex-col items-center justify-center text-center gap-3 transition-colors cursor-pointer hover:bg-gray-50">
                  <UploadCloud className="size-6 text-gray-400" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-900">Click to upload or drag</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Institutional PDF (Max 25MB)</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border border-gray-100 p-3 rounded-md group hover:border-red-100 transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="size-8 bg-red-50 text-red-500 rounded-md flex items-center justify-center border border-red-100">
                         <FileIcon className="size-4" />
                      </div>
                      <div className="space-y-0.5">
                         <p className="text-xs font-bold text-gray-900 leading-none">psi_report_44.pdf</p>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">1.2 MB · Oct 24, 2023</p>
                      </div>
                   </div>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="size-4" />
                   </Button>
                </div>
             </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
             <div className="relative h-40 bg-gray-900 overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&auto=format&fit=crop&q=60" 
                  alt="Inspection" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <PlayCircle className="size-12 text-white/80" />
                </div>
                <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2 text-white">
                   <Eye className="size-4" />
                   <span className="text-xs font-bold tracking-wide">Live Inspection Visuals</span>
                </div>
             </div>
             <div className="p-4 bg-white border-t border-gray-50">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lot Consistency</span>
                   <span className="text-[11px] font-black text-emerald-600">98.4%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#1a4332] w-[98.4%]" />
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  )
}
