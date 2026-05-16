import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { UploadCloud, Link as LinkIcon, Eye, Filter, Activity, Cpu, CheckCircle2 } from 'lucide-react'

export default function ExporterAddDocusPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Add Documents' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1a4332] tracking-tight">Export Batch</h1>
          <p className="text-xs md:text-sm text-gray-500">Review and finalize batches for global shipment.</p>
        </div>
        <div className="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="size-full bg-gray-50 object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
        
        {/* Left Column: Staging & Ingestion */}
        <div className="space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 md:p-8 shadow-sm space-y-6">
            <h3 className="text-lg font-black text-[#1a4332] tracking-tight flex items-center gap-2">
              <UploadCloud className="size-5" />
              Staging & Ingestion
            </h3>
            
            <div className="border-2 border-dashed border-emerald-100 bg-emerald-50/30 rounded-md p-10 flex flex-col items-center justify-center text-center gap-4 transition-colors cursor-pointer hover:bg-emerald-50/50">
              <div className="size-12 rounded-md bg-white shadow-sm border border-emerald-100 flex items-center justify-center text-[#1a4332]">
                <UploadCloud className="size-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900">Drag and drop document here</p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">PDF, TIFF, XML accepted (Max 50MB)</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Type</label>
                <Select>
                  <SelectTrigger className="h-11 bg-gray-50 border-gray-100 text-sm font-bold">
                    <SelectValue placeholder="Select Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bol">Bill of Lading</SelectItem>
                    <SelectItem value="co">Certificate of Origin</SelectItem>
                    <SelectItem value="phyto">Phytosanitary Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issuing Authority</label>
                  <Input placeholder="e.g. NAQS" className="h-11 bg-gray-50 border-gray-100 text-sm font-bold placeholder:text-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Issue Date</label>
                  <Input type="date" className="h-11 bg-gray-50 border-gray-100 text-sm font-bold text-gray-500" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Note (Optional)</label>
                <Textarea placeholder="Required if superseding existing version" className="resize-none bg-gray-50 border-gray-100 text-sm font-bold placeholder:text-gray-300 min-h-[80px]" />
              </div>

              <Button className="w-full h-12 bg-[#1a4332] hover:bg-black text-white font-bold text-[11px] uppercase tracking-widest shadow-lg transition-all gap-2 rounded-md">
                <LinkIcon className="size-4" />
                Link to Manifest
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="rounded-md border border-sky-100 bg-sky-50 p-6 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-sky-600/70 uppercase tracking-widest mb-1">Validation Status</p>
                <div className="flex items-center gap-2">
                   <p className="text-3xl font-black text-sky-900 tracking-tight">100%</p>
                   <div className="size-5 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                      <CheckCircle2 className="size-3" />
                   </div>
                </div>
             </div>
             <div className="rounded-md border border-sky-100 bg-sky-50 p-6 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-sky-600/70 uppercase tracking-widest mb-1">Anchor Node</p>
                <p className="text-sm font-black text-sky-900 tracking-tight mt-1">LUTH-MAIN-7702</p>
             </div>
          </div>
        </div>

        {/* Right Column: Document Vault & Compliance Delta */}
        <div className="space-y-6">
          <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1a4332] tracking-tight">Document Vault</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest cursor-pointer hover:text-gray-900 transition-colors">
                Auto-filter by Manifest ID <Filter className="size-3.5" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-4 pl-6">Document Type</th>
                    <th className="p-4">Issuing Body</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Hash</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[11px] font-bold text-[#1a4332]">Bill of Lading</td>
                    <td className="p-4 text-[11px] font-medium text-emerald-600/80">Maersk Global</td>
                    <td className="p-4 text-[11px] font-medium text-gray-500">24/05/2024</td>
                    <td className="p-4 text-[11px] font-mono text-gray-400">0x7am...21f</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="size-3" /> Eligible
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <Eye className="size-4" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[11px] font-bold text-[#1a4332]">Cert of Origin</td>
                    <td className="p-4 text-[11px] font-medium text-emerald-600/80">Fed. Min. of Trade</td>
                    <td className="p-4 text-[11px] font-medium text-gray-500">20/05/2024</td>
                    <td className="p-4 text-[11px] font-mono text-gray-400">0x7am...21f</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest">
                         <Activity className="size-3" /> Ineligible
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <Eye className="size-4" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[11px] font-bold text-[#1a4332]">Phytosanitary Cert</td>
                    <td className="p-4 text-[11px] font-medium text-emerald-600/80">NAQS</td>
                    <td className="p-4 text-[11px] font-medium text-gray-500">25/05/2024</td>
                    <td className="p-4 text-[11px] font-mono text-gray-400">0x7am...21f</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="size-3" /> Eligible
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <Eye className="size-4" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[11px] font-bold text-[#1a4332]">Bill of Lading</td>
                    <td className="p-4 text-[11px] font-medium text-emerald-600/80">Maersk Global</td>
                    <td className="p-4 text-[11px] font-medium text-gray-500">24/05/2024</td>
                    <td className="p-4 text-[11px] font-mono text-gray-400">0x7am...21f</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="size-3" /> Eligible
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <Eye className="size-4" />
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-[11px] font-bold text-[#1a4332]">Phytosanitary Cert</td>
                    <td className="p-4 text-[11px] font-medium text-emerald-600/80">Maersk Global</td>
                    <td className="p-4 text-[11px] font-medium text-gray-500">19/05/2024</td>
                    <td className="p-4 text-[11px] font-mono text-gray-400">0x7am...21f</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-widest">
                         <Activity className="size-3" /> Ineligible
                      </div>
                    </td>
                    <td className="p-4 pr-6 text-gray-400 hover:text-gray-900 cursor-pointer">
                      <Eye className="size-4" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-sky-50/30 border-t border-gray-100 p-4 px-6 flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="size-2 rounded-full bg-emerald-500" />
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Node Sync: Healthy</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="size-2 rounded-full bg-gray-800" />
                     <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Uploader: CEO_LUTH_01</p>
                  </div>
               </div>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing 5 of 12 Records  |  Page 1 of 4</p>
            </div>
          </div>

          <div className="rounded-md bg-[#0a1f12] p-8 relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-xl">
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }} />
             <div className="absolute inset-0 bg-linear-to-r from-transparent to-emerald-500/20" />
             
             <div className="relative z-10 flex items-start justify-between">
               <h3 className="text-xl font-bold text-white tracking-tight">Compliance Delta</h3>
               <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                  <Cpu className="size-3" />
                  Live Stream
               </div>
             </div>
             
             <div className="relative z-10 flex items-end gap-12 mt-8">
                <div>
                   <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">AUDIT VELOCITY</p>
                   <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-black text-white tracking-tight">842.01</p>
                      <p className="text-xs font-bold text-emerald-400">Tx/s</p>
                   </div>
                </div>
                <div>
                   <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1">LATENCY</p>
                   <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-black text-white tracking-tight">14</p>
                      <p className="text-xs font-bold text-emerald-400">ms</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
