import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Map as MapIcon,
  Plus,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { Link } from 'react-router'
import { FarmMap } from '~/components/farm-map.client'
import { Button } from '~/components/ui/button'
import {
  lotReviewStats,
  mockFarms
} from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterConsolidationPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center gap-2 text-[#1a4332] text-[11px] font-bold uppercase tracking-widest">
        <div className="size-4 rounded-sm border border-[#1a4332] flex items-center justify-center">
          <Plus className="size-3" />
        </div>
        Add Farmer
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Finalize Lot Review</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Merge farmer batches into sealed aggregators lots with an immutable composition</p>
        </div>
        <div className="size-10 rounded-full border-2 border-[#1a4332] p-0.5">
          <div className="size-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="size-full object-cover" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {lotReviewStats.map((stat, i) => (
          <div key={i} className='rounded-md border border-gray-100 bg-white p-6 shadow-sm'>
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2'>{stat.label}</p>
            <div className="flex items-end gap-3">
               <h4 className='text-2xl font-bold text-gray-900 tracking-tight leading-none'>{stat.value}</h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight pb-0.5">{stat.sublabel}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composition Tree Visualizer */}
        <div className="lg:col-span-2 rounded-md border border-gray-100 bg-white p-8 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-12">
             <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Composition Tree</h3>
             <Button variant="outline" className="h-7 text-[9px] font-bold border-gray-100 text-gray-400 uppercase tracking-widest px-3 rounded-md">
               Hierarchy View
             </Button>
          </div>

          <div className="relative flex flex-col items-center gap-16">
             {/* Root Node */}
             <div className="w-48 rounded-md bg-[#1a4332] p-4 text-center shadow-lg relative">
                <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest mb-1">LOT ROOT</p>
                <h4 className="text-[12px] font-bold text-white uppercase tracking-widest">LOT-2023-001</h4>
                
                {/* Lines to Sectors */}
                <div className="absolute left-1/2 -bottom-16 w-[1.5px] h-16 bg-gray-100 -translate-x-1/2" />
                <div className="absolute left-[-20%] right-[-20%] bottom-[-16px] h-[1.5px] bg-gray-100" />
             </div>

             <div className="flex gap-8">
                {/* Sector A */}
                <div className="flex flex-col items-center gap-4">
                   <div className="absolute -top-16 left-1/4 w-[1.5px] h-16 bg-gray-100" />
                   <div className="w-48 rounded-md border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center gap-2">
                      <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-brand">
                        <MapIcon className="size-4" />
                      </div>
                      <div className="text-center">
                        <h5 className="text-[11px] font-bold text-gray-900 leading-tight">Sector A</h5>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">5 Batches</p>
                      </div>
                   </div>
                </div>

                {/* Sector B */}
                <div className="flex flex-col items-center gap-4">
                   <div className="absolute -top-16 right-1/4 w-[1.5px] h-16 bg-gray-100" />
                   <div className="w-48 rounded-md border border-gray-100 bg-white p-6 shadow-sm flex flex-col items-center gap-2">
                      <div className="size-8 rounded-full bg-gray-50 flex items-center justify-center text-brand">
                        <MapIcon className="size-4" />
                      </div>
                      <div className="text-center">
                        <h5 className="text-[11px] font-bold text-gray-900 leading-tight">Sector B</h5>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">4 Batches</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex gap-4 w-full">
                <div className="flex-1 rounded-md border border-gray-100 bg-gray-50/50 p-6 flex items-center gap-4">
                   <div className="size-10 rounded-md bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1a4332]">
                      <Zap className="size-5" />
                   </div>
                   <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-gray-900 leading-tight">Sub-Lot Traceability</h5>
                      <p className="text-[9px] font-medium text-gray-500 leading-tight">All nodes linked to source farm IDs</p>
                   </div>
                </div>
                <div className="flex-1 rounded-md border border-gray-100 bg-gray-50/50 p-6 flex items-center gap-4">
                   <div className="size-10 rounded-md bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#1a4332]">
                      <History className="size-5" />
                   </div>
                   <div className="space-y-1">
                      <h5 className="text-[11px] font-bold text-gray-900 leading-tight">Audit Readiness</h5>
                      <p className="text-[9px] font-medium text-gray-500 leading-tight">Compliance checks passed for all branches</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Geographic Origin Map */}
        <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6 flex flex-col">
          <h3 className="text-sm font-bold text-[#1a4332] uppercase tracking-widest">Geographic Origin</h3>
          <div className="rounded-md overflow-hidden flex-1 min-h-[300px]">
             <FarmMap farms={mockFarms.map((f: any) => ({ ...f, id: f.id.toString() }))} className="h-full border-none" />
          </div>
          <div className="space-y-3 pt-4">
             <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-gray-400">Primary Region</span>
                <span className="text-[#1a4332]">North Valley Flats</span>
             </div>
             <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-gray-400">Total Area</span>
                <span className="text-[#1a4332]">428.5 Hectares</span>
             </div>
          </div>
        </div>
      </div>

      {/* Warning Box */}
      <div className="rounded-md border border-red-100 bg-red-50 p-8 flex gap-6">
        <div className="size-10 rounded-md bg-white shadow-sm flex items-center justify-center text-red-600 shrink-0">
           <AlertTriangle className="size-5" />
        </div>
        <div className="space-y-2">
           <h4 className="text-sm font-bold text-red-900 leading-tight">Critical Action: Data Lock Notice</h4>
           <p className="text-[11px] font-medium text-red-700 leading-relaxed max-w-2xl">
             Finalizing will permanently lock all data and logs for this lot. This action cannot be undone. Ensure all weights, farmer attributions, and batch links are accurate before proceeding.
           </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline" className="h-10 px-8 text-[11px] font-bold border-gray-200 text-gray-600 uppercase tracking-widest rounded-md">
          Save as Draft
        </Button>
        <Button className="h-10 px-8 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white uppercase tracking-widest gap-3 rounded-md shadow-sm">
          Finalize & Create Lot <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
