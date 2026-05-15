import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Globe,
  MapPin,
  Truck,
  Ship,
  FileText,
  AlertTriangle,
  ExternalLink,
  Plus,
  Package,
  Eye
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { manifestSummary } from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterManifestDestinationPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center gap-2 text-[#1a4332] text-[11px] font-bold uppercase tracking-widest">
        <Plus className="size-3.5" /> Add Farmer
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Manifest Destination</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Merge farmer batches into sealed aggregators lots with an immutable composition</p>
        </div>
        <div className="size-10 rounded-full border-2 border-[#1a4332] p-0.5">
          <div className="size-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="size-full object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Content */}
        <div className="lg:col-span-2 space-y-8">
           {/* Section 1: Shipment Destination */}
           <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 space-y-8">
              <div className="flex items-center gap-3 text-sm font-black text-[#1a4332] uppercase tracking-widest border-b border-gray-50 pb-4">
                 <Globe className="size-5 text-brand" /> Shipment Destination
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Destination Country</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="Select Country" 
                         className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                       />
                       <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 rotate-90 text-gray-300" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Port of Entry</label>
                    <input 
                      type="text" 
                      defaultValue="e.g. Port Rotterdam" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Final Delivery Address</label>
                 <textarea 
                   placeholder="Full street address, city, and postal code" 
                   className="w-full h-32 p-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand resize-none"
                 />
              </div>
           </div>

           {/* Section 2: Logistics Partners */}
           <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 space-y-8">
              <div className="flex items-center gap-3 text-sm font-black text-[#1a4332] uppercase tracking-widest border-b border-gray-50 pb-4">
                 <Ship className="size-5 text-brand" /> Logistics Partners
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Shipping Line/Vessel Name</label>
                    <input 
                      type="text" 
                      defaultValue="e.g. Maersk Hamburg" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Container ID</label>
                    <input 
                      type="text" 
                      defaultValue="e.g. MSC 123456-7" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carrier/ Freight Forwarder</label>
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Choose authorized partner" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 rotate-90 text-gray-300" />
                 </div>
              </div>
           </div>

           {/* Section 3: Export Metadata */}
           <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 space-y-8">
              <div className="flex items-center gap-3 text-sm font-black text-[#1a4332] uppercase tracking-widest border-b border-gray-50 pb-4">
                 <FileText className="size-5 text-brand" /> Export Metadata
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Incoterms</label>
                    <input 
                      type="text" 
                      defaultValue="FOB" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Port of Loading</label>
                    <input 
                      type="text" 
                      defaultValue="e.g Lagos Port" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Arrival Date</label>
                    <input 
                      type="text" 
                      defaultValue="mm/dd/yyyy" 
                      className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30 text-sm font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                 </div>
              </div>
           </div>

           <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" className="h-10 px-8 text-[11px] font-bold border-gray-200 text-gray-600 uppercase tracking-widest rounded-md">
                Discharger Changes
              </Button>
              <Button asChild className="h-10 px-8 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white uppercase tracking-widest gap-2 rounded-md shadow-sm">
                <Link to="/exporter/export/manifest">
                  Save & Continue <ArrowRight className="size-4" />
                </Link>
              </Button>
           </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
           <div className="rounded-md border border-gray-100 bg-[#1a4332] p-8 text-white shadow-xl space-y-10 relative overflow-hidden">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-60">Manifest Summary</h3>
              
              <div className="space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Package className="size-5 opacity-40" />
                       <span className="text-[11px] font-bold uppercase tracking-widest">Attached Batches</span>
                    </div>
                    <span className="text-xl font-black">{manifestSummary.attachedBatches}</span>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Truck className="size-5 opacity-40" />
                       <span className="text-[11px] font-bold uppercase tracking-widest">Total Net Weight</span>
                    </div>
                    <div className="text-right">
                       <div className="text-xl font-black">{manifestSummary.totalNetWeight}</div>
                       <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">KILOGRAMS</div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="size-5 rounded border-2 border-white/20 flex items-center justify-center text-[10px] font-black">{manifestSummary.loadPercentage}%</div>
                       <span className="text-[11px] font-bold uppercase tracking-widest">Load Percentage</span>
                    </div>
                    <span className="text-xl font-black">{manifestSummary.loadPercentage}%</span>
                 </div>
              </div>

              <Button variant="outline" className="w-full h-11 border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest text-[10px] gap-2 rounded-md">
                 <Eye className="size-4" /> View Batch Details
              </Button>
           </div>

           {/* Compliance Check Card */}
           <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">EXPORT COMPLIANCE CHECK</h3>
              <div className="space-y-6">
                 <div className="flex gap-4">
                    <CheckCircle2 className="size-5 text-green-500 shrink-0" />
                    <div className="space-y-1">
                       <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Exporter License Verified</h4>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Valid until Oct 2024</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                    <div className="space-y-1">
                       <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Phytosanitary Cert Pending</h4>
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Requires destination confirmation</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Global Export Network Ad */}
           <div className="rounded-md overflow-hidden relative h-64 group cursor-pointer shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=500&h=800&fit=crop" 
                alt="Global Export" 
                className="size-full object-cover brightness-[0.4] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                 <h4 className="text-xl font-bold text-white tracking-tight leading-tight">Global Export Network</h4>
                 <p className="text-[10px] font-medium text-white/60 mt-2 leading-relaxed">
                   Real-time tracking and logistics management across 45+ international ports.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
