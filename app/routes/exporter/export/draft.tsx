import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Eye,
  Plus,
  Search,
  Filter,
  X,
  ShieldCheck,
  Package,
  ArrowUpRight
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  exportBatchTable,
  draftManifestBatches
} from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterExportDraftPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center gap-2 text-[#1a4332] text-[11px] font-bold uppercase tracking-widest">
        <Plus className="size-3.5" /> Add Farmer
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Export Batch</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Review and finalize batches for global shipment.</p>
        </div>
        <div className="size-10 rounded-full border-2 border-[#1a4332] p-0.5">
          <div className="size-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="size-full object-cover" />
          </div>
        </div>
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { label: 'Commodity Type', options: ['All Commodities'] },
           { label: 'Origin Region', options: ['All Regions'] },
           { label: 'Risk Tier', options: ['All Risk'] },
           { label: 'Compliance Status', options: ['All Statuses'] },
         ].map((filter, i) => (
           <div key={i} className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filter.label}</label>
              <div className="relative">
                 <select className="w-full h-11 px-4 bg-gray-50/50 border border-gray-100 rounded-md text-[11px] font-bold text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand appearance-none">
                    {filter.options.map(opt => <option key={opt}>{opt}</option>)}
                 </select>
                 <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-3 rotate-90 text-gray-400" />
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Batch Table */}
        <div className="lg:col-span-3 space-y-6">
           <div className='bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden'>
             <div className='overflow-x-auto'>
               <table className='w-full text-left border-collapse'>
                 <thead>
                   <tr className='bg-gray-50/50 border-b border-gray-50'>
                     <th className='px-6 py-4 w-12'></th>
                     <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Batch Identifier</th>
                     <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Commodity</th>
                     <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Quantity</th>
                     <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Harvested</th>
                     <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Weight</th>
                     <th className='px-6 py-4 w-12'></th>
                   </tr>
                 </thead>
                 <tbody className='divide-y divide-gray-50'>
                   {exportBatchTable.map((b, i) => (
                     <tr key={i} className='hover:bg-gray-50/50 transition-colors'>
                       <td className='px-6 py-4'>
                         <div className={cn(
                           "size-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer",
                           b.selected ? "bg-brand border-brand" : "border-gray-300 bg-white"
                         )}>
                           {b.selected && <CheckCircle2 className="size-3 text-white" />}
                         </div>
                       </td>
                       <td className='px-6 py-4'>
                         <span className='text-[12px] font-bold text-brand uppercase tracking-tight'>{b.batchId}</span>
                       </td>
                       <td className='px-6 py-4'>
                         <span className='text-[12px] font-bold text-[#1a4332] tracking-tight'>{b.commodity}</span>
                       </td>
                       <td className='px-6 py-4 text-center'>
                         <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{b.quantity}</span>
                       </td>
                       <td className='px-6 py-4 text-center'>
                         <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{b.harvested}</span>
                       </td>
                       <td className='px-6 py-4 text-center'>
                         <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{b.weight}</span>
                       </td>
                       <td className='px-6 py-4 text-right'>
                         <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-brand">
                           <Eye className="size-4" />
                         </Button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* Sustainability Banner */}
           <div className="rounded-md overflow-hidden relative h-32 group cursor-pointer shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1595841696662-5083d6012867?w=1000&h=300&fit=crop" 
                alt="Sustainability Report" 
                className="size-full object-cover brightness-[0.4] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                 <h4 className="text-xl font-bold text-white tracking-tight">Sustainability Report 2023</h4>
                 <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
                    Download Insights <ArrowUpRight className="size-3" />
                 </p>
              </div>
           </div>
        </div>

        {/* Draft Manifest Sidebar */}
        <div className="space-y-6">
           <div className="rounded-md border border-brand/10 bg-brand/[0.02] p-8 space-y-8 relative overflow-hidden">
              {/* Dashed Border Overlay */}
              <div className="absolute inset-2 border-2 border-dashed border-brand/10 rounded pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                 <h3 className="text-sm font-black text-[#1a4332] uppercase tracking-widest">Draft Manifest</h3>
                 <span className="bg-[#1a4332] text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase">MANIFEST-882</span>
              </div>

              <div className="grid grid-cols-2 gap-4 relative z-10">
                 <div className="rounded-md bg-white border border-gray-100 p-4 space-y-1">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Total Weight</p>
                    <h4 className="text-lg font-black text-[#1a4332] tracking-tighter">850 <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MT</span></h4>
                 </div>
                 <div className="rounded-md bg-white border border-gray-100 p-4 space-y-1">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Batches</p>
                    <h4 className="text-lg font-black text-[#1a4332] tracking-tighter">12</h4>
                 </div>
              </div>

              <div className="space-y-4 relative z-10">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Additions</p>
                 <div className="space-y-2">
                    {draftManifestBatches.map((batch, i) => (
                       <div key={i} className="flex items-center justify-between p-3 rounded-md bg-white border border-gray-100">
                          <div className="flex items-center gap-3">
                             <div className="size-8 rounded bg-gray-50 flex items-center justify-center text-gray-400">
                                <Package className="size-4" />
                             </div>
                             <div className="space-y-0.5">
                                <p className="text-[10px] font-bold text-gray-900 tracking-tight">Batch #{batch.id}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{batch.type} • {batch.weight}</p>
                             </div>
                          </div>
                          <Button variant="ghost" size="icon" className="size-6 text-gray-300 hover:text-red-500">
                             <X className="size-3" />
                          </Button>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="flex gap-4 p-4 rounded-md bg-brand/5 border border-brand/10 relative z-10">
                 <ShieldCheck className="size-5 text-brand shrink-0" />
                 <p className="text-[9px] font-medium text-brand/80 leading-relaxed">
                   All batches in this draft meet EU-DR compliance standards. Finalize to generate export certificates.
                 </p>
              </div>

              <Button asChild className="w-full h-12 bg-[#1a4332] hover:bg-[#1a4332]/90 text-white font-bold uppercase tracking-widest text-[11px] gap-2 rounded-md shadow-lg relative z-10">
                 <Link to="/exporter/export/destination">
                   Finalize Manifest <ArrowRight className="size-4" />
                 </Link>
              </Button>
           </div>
        </div>
      </div>
    </div>
  )
}
