import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  availableFarmers,
  consolidationStats
} from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterLotDraftPage() {
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">INBOUND CONSOLIDATION - DRAFT-2026-04-22</p>
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Consolidate the harvest</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Merge farmer batches into sealed aggregators lots with an immutable composition</p>
        </div>
        <Button variant="outline" className="h-9 px-4 text-[11px] font-bold border-gray-200 text-[#1a4332] gap-2 rounded-md">
          <Plus className="size-3.5" /> New Consolidation
        </Button>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        {consolidationStats.map((stat, i) => (
          <div key={i} className='rounded-md border border-gray-100 bg-white p-6 shadow-sm'>
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2'>{stat.label}</p>
            <h4 className='text-2xl font-bold text-gray-900 tracking-tight'>{stat.value}</h4>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className='bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-gray-50'>
          <h3 className='text-sm font-bold text-[#1a4332] uppercase tracking-widest'>Available Farmer</h3>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-50'>
                <th className='px-6 py-4 w-12'></th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Batch Identifier</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Farmer</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Quantity</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Harvested</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Weight</th>
                <th className='px-6 py-4 w-12'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {availableFarmers.map((f) => (
                <tr key={f.id} className='hover:bg-gray-50/50 transition-colors'>
                  <td className='px-6 py-4'>
                    <div className={cn(
                      "size-4 rounded-sm border flex items-center justify-center transition-colors cursor-pointer",
                      f.selected ? "bg-brand border-brand" : "border-gray-300 bg-white"
                    )}>
                      {f.selected && <CheckCircle2 className="size-3 text-white" />}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-[12px] font-bold text-brand uppercase tracking-tight'>{f.batchId}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='space-y-0.5'>
                      <p className='text-[12px] font-bold text-[#1a4332] tracking-tight'>{f.farmer}</p>
                      <p className='text-[10px] font-bold text-gray-400 uppercase tracking-tight'>{f.farmerId}</p>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{f.quantity}</span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{f.harvested}</span>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{f.weight}</span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <Button variant="ghost" size="icon" className="size-8 text-gray-400 hover:text-brand hover:bg-brand/10">
                      <Eye className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='p-6 flex items-center justify-end gap-3 bg-gray-50/30'>
          <Button variant="outline" className="h-9 px-6 text-[11px] font-bold border-gray-200 text-gray-600 uppercase tracking-widest rounded-md">
            Cancel
          </Button>
          <Link 
            to="/exporter/tress"
            className={cn(
              "inline-flex items-center justify-center h-9 px-6 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white uppercase tracking-widest gap-2 rounded-md shadow-sm transition-colors"
            )}
          >
            Continue to Next Step <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
