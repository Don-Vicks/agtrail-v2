import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { QrCode, Download, Share2, LayoutGrid, Leaf, Globe, Fingerprint, CheckCircle2 } from 'lucide-react'

export default function ExporterPassportPage() {
  return (
    <div className="space-y-8 pb-20">
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Passport' },
        ]}
      />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#1a4332] tracking-tight">Passport #exp-8842</h1>
          <p className="text-xs md:text-sm text-gray-500">Global Standard Immutable Trade Record</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" className="size-full bg-gray-50 object-cover" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Main QR Card */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-8 md:p-12 space-y-10 flex flex-col">
            <div className="flex justify-center">
               <div className="size-48 md:size-64">
                  {/* Simulating QR code with an image */}
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=exp-8842&color=1a4332" alt="QR Code" className="size-full" />
               </div>
            </div>
            <div className="space-y-4 max-w-2xl w-full">
               <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Premium Arabica Coffee Beans</h2>
               <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  Batch originating from the Sidamo region, Ethiopia. Verified through blockchain-backed traceability for fair trade compliance and organic certification standards.
               </p>
               <div className="flex flex-wrap items-center gap-3 pt-4">
                  <Button className="bg-[#1a4332] hover:bg-black text-white h-11 px-6 text-[11px] font-bold uppercase tracking-widest gap-2 rounded-md">
                     <LayoutGrid className="size-4" /> QR Code
                  </Button>
                  <Button className="bg-[#1a4332] hover:bg-black text-white h-11 px-6 text-[11px] font-bold uppercase tracking-widest gap-2 rounded-md">
                     <Download className="size-4" /> Download
                  </Button>
                  <Button className="bg-[#1a4332] hover:bg-black text-white h-11 px-6 text-[11px] font-bold uppercase tracking-widest gap-2 rounded-md">
                     <Share2 className="size-4" /> Share
                  </Button>
               </div>
            </div>
          </div>

          {/* Quality Control Results */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xs font-black text-[#1a4332] uppercase tracking-widest">Quality Control (QC) Results</h3>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-widest">
                <CheckCircle2 className="size-4" /> Overall Pass
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="p-4 pl-6 w-1/3">Parameter</th>
                    <th className="p-4">Specification</th>
                    <th className="p-4">Measured</th>
                    <th className="p-4 pr-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-gray-900">Moisture Content</td>
                    <td className="p-4 text-xs font-medium text-gray-500">10.5% - 12.0%</td>
                    <td className="p-4 text-xs font-medium text-gray-900">11.2%</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <div className="size-1.5 rounded-full bg-emerald-500" /> Pass
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-gray-900">Defect Count (Primary)</td>
                    <td className="p-4 text-xs font-medium text-gray-500">&lt; 5 per 300g</td>
                    <td className="p-4 text-xs font-medium text-gray-900">2 per 300g</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <div className="size-1.5 rounded-full bg-emerald-500" /> Pass
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-gray-900">Cup Score (Q-Grade)</td>
                    <td className="p-4 text-xs font-medium text-gray-500">&gt; 80.0</td>
                    <td className="p-4 text-xs font-medium text-gray-900">84.5</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <div className="size-1.5 rounded-full bg-emerald-500" /> Pass
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 text-xs font-bold text-gray-900">Foreign Matter</td>
                    <td className="p-4 text-xs font-medium text-gray-500">0.0%</td>
                    <td className="p-4 text-xs font-medium text-gray-900">0.0%</td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <div className="size-1.5 rounded-full bg-emerald-500" /> Pass
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Compliance Scorecard */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Compliance Scorecard</h3>
            
            <div className="space-y-4">
               <div className="rounded-md border border-gray-100 p-4 flex items-center justify-between group hover:border-emerald-100 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#1a4332] shrink-0">
                        <Leaf className="size-5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900">Rainforest Alliance</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: CERT-882-99</p>
                     </div>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-500" />
               </div>

               <div className="rounded-md border border-gray-100 p-4 flex items-center justify-between group hover:border-emerald-100 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#1a4332] shrink-0">
                        <Globe className="size-5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900">EUDR Compliant</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Deforestation-Free Proof</p>
                     </div>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-500" />
               </div>

               <div className="rounded-md border border-gray-100 p-4 flex items-center justify-between group hover:border-emerald-100 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className="size-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 shrink-0 border border-gray-200">
                        <Fingerprint className="size-5" />
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-xs font-bold text-gray-900">Digital Signature</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest max-w-[140px] truncate">Validated by Ethiopian Coffee Authority</p>
                     </div>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-500" />
               </div>
            </div>

            <div className="pt-2 border-t border-gray-50">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-gray-500">Global Audit Confidence</span>
                  <span className="text-xs font-black text-gray-900">98/100</span>
               </div>
               <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1a4332] w-[98%]" />
               </div>
            </div>
          </div>

          {/* Audit Timeline */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-6 space-y-6">
            <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Audit Timeline</h3>
            <div className="space-y-0 relative before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-gray-100 pl-8 pt-2">
              <div className="relative pb-8">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-[#1a4332] flex items-center justify-center shadow-sm z-10 border-4 border-white">
                   <CheckCircle2 className="size-3.5 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Shipment Exported</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Oct 24, 2024 · Djibouti Port</p>
              </div>
              <div className="relative pb-8">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-[#1a4332] flex items-center justify-center shadow-sm z-10 border-4 border-white">
                   <CheckCircle2 className="size-3.5 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Customs Clearance Issued</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Oct 22, 2024 · Addis Ababa</p>
              </div>
              <div className="relative pb-8">
                <div className="absolute -left-[32px] top-1 size-6 rounded-full bg-[#1a4332] flex items-center justify-center shadow-sm z-10 border-4 border-white">
                   <CheckCircle2 className="size-3.5 text-white" />
                </div>
                <h4 className="text-xs font-bold text-gray-900">QC Verification Passed</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Oct 20, 2024 · Regional Lab</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[30px] top-1.5 size-5 rounded-full border-[3px] border-[#1a4332] bg-white z-10" />
                <h4 className="text-xs font-bold text-gray-900">Origin Batch Certified</h4>
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Oct 18, 2024 · Jimma Hub</p>
              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}
