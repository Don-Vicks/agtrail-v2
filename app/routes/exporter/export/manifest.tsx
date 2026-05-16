import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { CheckCircle2, ShieldCheck, FileText, CheckSquare, Square, Pencil, FileBadge, QrCode } from 'lucide-react'

export default function ExporterManifestPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Manifest' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1a4332] tracking-tight">Final Review: Manifest #exp-8842</h1>
          <p className="text-xs md:text-sm text-gray-500">Complete the following institutional audit report for shipment validation</p>
        </div>
        <Button className="h-10 px-6 text-[11px] font-bold bg-[#1a4332] hover:bg-black text-white rounded-md shadow-sm uppercase tracking-widest">
          Add Document
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Batches</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">12</p>
        </div>
        <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Net-Weight</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">850 MT</p>
        </div>
        <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Commodity</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Premium Cocoa</p>
        </div>
        <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination</p>
          <p className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">Port of Rotterdam</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1a4332] tracking-tight">Manifest Batch Details</h3>
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                All Verified
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-4 pl-6">Batch ID</th>
                    <th className="p-4">Origin</th>
                    <th className="p-4">Weight</th>
                    <th className="p-4 pr-6">Compliance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6 text-xs font-bold text-[#1a4332]">BAT-2024-001</td>
                    <td className="p-4 text-xs font-medium text-gray-600">Kumasi Highlands, GH</td>
                    <td className="p-4 text-xs font-medium text-gray-600">75 MT</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="size-4" /> Verified
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6 text-xs font-bold text-[#1a4332]">BAT-2024-002</td>
                    <td className="p-4 text-xs font-medium text-gray-600">Brong-Ahafo, GH</td>
                    <td className="p-4 text-xs font-medium text-gray-600">68 MT</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="size-4" /> Verified
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 pl-6 text-xs font-bold text-[#1a4332]">BAT-2024-003</td>
                    <td className="p-4 text-xs font-medium text-gray-600">Western Region, GH</td>
                    <td className="p-4 text-xs font-medium text-gray-600">82 MT</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <CheckCircle2 className="size-4" /> Verified
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rows 4-12 omitted for preview clarity. All status verified.</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-[#1a4332] tracking-tight flex items-center gap-2">
                <FileText className="size-5" />
                Compliance Checklist
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckSquare className="size-5 text-[#1a4332] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">All required documents attached</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Phytosanitary, Origin, and BL templates</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckSquare className="size-5 text-[#1a4332] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">Pre-shipment inspection passed</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Verified by Bureau Veritas - GH-2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Square className="size-5 text-gray-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-gray-900">EUDR deforestation check complete</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Satellite overlay verification pending final sync</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="text-lg font-black text-[#1a4332] tracking-tight">
                  Compliance Authorization
                </h3>
                <div className="h-32 border-b-2 border-dashed border-gray-200 flex items-end justify-center pb-4 text-gray-300 italic">
                  Draw signature or type to authorize...
                </div>
                <div className="space-y-1 pt-2">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AUTHORIZED OFFICER</p>
                  <p className="text-sm font-bold text-gray-900">Arthur Kwesi Mensah</p>
                  <p className="text-[10px] text-gray-500 font-medium">Lead Compliance Director - Port Agency</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button className="h-12 px-8 bg-[#1a4332] hover:bg-black text-white font-bold text-[11px] uppercase tracking-widest shadow-lg transition-all rounded-md">
              Finalize & Generate Passport
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-md border border-[#1a4332] bg-white shadow-xl overflow-hidden relative">
            <div className="bg-[#1a4332] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest leading-none">PASSPORT</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none mt-1">PREVIEW</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black tracking-tight leading-none">95%</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 mt-1">COMPLETE</p>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 flex items-center justify-center relative">
              <div className="bg-white p-6 shadow-md border border-gray-100 w-full max-w-[240px] aspect-[1/1.4] relative z-10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-black text-[#1a4332] tracking-tight leading-none">Agtrail</h4>
                      <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest mt-1">DIGITAL PRODUCT PASSPORT</p>
                    </div>
                    <QrCode className="size-8 text-gray-300" />
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest border-l-2 border-[#1a4332] pl-1.5 leading-tight">CONSIGNMENT ID</p>
                      <p className="text-xs font-bold text-gray-900 mt-0.5 border-l-2 border-transparent pl-1.5">AGTR-GH-ROT-2024-8842</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">HARVEST WINDOW</p>
                        <p className="text-[10px] font-bold text-gray-900 mt-0.5">OCT 23 - JAN 24</p>
                      </div>
                      <div>
                        <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest">GRADE</p>
                        <p className="text-[10px] font-bold text-gray-900 mt-0.5">Export Quality A1</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-[7px] font-black text-gray-400 uppercase tracking-widest mb-1.5">AUDIT PROGRESS</p>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[95%]" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-100 pt-3 mt-4">
                  <div>
                    <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">VALIDATION HASH</p>
                    <p className="text-[8px] font-medium text-gray-500">0x8842...4E3B27</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">AUTHENTICATED BY</p>
                    <p className="text-[9px] font-bold text-[#1a4332]">Blockchain Verified</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 right-12 size-32 bg-emerald-500/5 rounded-full blur-2xl z-0" />
            </div>

            <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-3">
               <Button variant="outline" className="w-full h-9 text-[10px] font-black uppercase tracking-widest border-gray-200">
                 Edit Fields
               </Button>
               <Button className="w-full h-9 bg-[#1a4332] hover:bg-black text-white text-[10px] font-black uppercase tracking-widest">
                 Full Preview
               </Button>
            </div>
          </div>

          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MANIFEST JOURNEY</h3>
            <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-0.5 before:bg-gray-100 pl-8">
              <div className="relative pb-6">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm z-10">
                   <CheckCircle2 className="size-3 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Batches Aggregated</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Mar 12, 2024 - 09:45 AM</p>
              </div>
              <div className="relative pb-6">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-emerald-500 border-[3px] border-white flex items-center justify-center shadow-sm z-10">
                   <CheckCircle2 className="size-3 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Compliance Verification</h4>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Mar 14, 2024 - 02:15 PM</p>
              </div>
              <div className="relative pb-6">
                <div className="absolute -left-[28px] top-1 size-4 rounded-full border-[3px] border-emerald-500 bg-white z-10" />
                <h4 className="text-xs font-bold text-emerald-600">Final Manifest Approval</h4>
                <p className="text-[10px] font-bold text-emerald-500/70 mt-0.5 uppercase tracking-widest">Awaiting Signature</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[28px] top-1 size-4 rounded-full border-[3px] border-gray-200 bg-white z-10" />
                <h4 className="text-xs font-bold text-gray-400">Passport Generation</h4>
                <p className="text-[10px] font-bold text-gray-300 mt-0.5">Scheduled upon approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
