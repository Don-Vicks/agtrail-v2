import { PageHeader } from '~/components/page-header'
import {
  ArrowRight,
  ChevronRight,
  Database,
  History,
  Plus,
  Search,
  Filter,
  Eye,
  ClipboardList,
  ChevronLeft
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { storageHistory } from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterStoragePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className='space-y-6 pb-12'>
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'Storage' },
        ]}
      />

      <div className="flex items-center gap-2 text-[#1a4332] text-[11px] font-bold uppercase tracking-widest">
        <ClipboardList className="size-3.5" /> Product
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Storage History</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Manage and track all your products throughout their journey</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search Farm..." 
            className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-100 bg-white text-sm font-medium text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
          />
        </div>
        <Button variant="outline" className="h-10 px-4 text-[11px] font-bold border-gray-100 bg-white text-gray-600 gap-2 rounded-md shadow-sm">
          <Search className="size-3.5" /> Search
        </Button>
        <Button variant="outline" className="h-10 px-4 text-[11px] font-bold border-gray-100 bg-white text-gray-600 gap-2 rounded-md shadow-sm">
          <ClipboardList className="size-3.5" /> Sort by Farmer <ChevronRight className="size-3 rotate-90" />
        </Button>
        <Button variant="outline" className="h-10 px-4 text-[11px] font-bold border-gray-100 bg-white text-gray-600 gap-2 rounded-md shadow-sm">
          <ClipboardList className="size-3.5" /> Sort by Lot ID <ChevronRight className="size-3 rotate-90" />
        </Button>
        <Button variant="outline" className="h-10 px-4 text-[11px] font-bold border-gray-100 bg-white text-gray-600 gap-2 rounded-md shadow-sm">
          <ClipboardList className="size-3.5" /> Sort by Product <ChevronRight className="size-3 rotate-90" />
        </Button>
      </div>

      {/* Grid of Storage Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
        {storageHistory.map((item, i) => (
          <div key={i} className='rounded-md border border-gray-100 bg-white p-6 shadow-sm space-y-6'>
            <div className="flex items-start justify-between">
               <div className="flex gap-4">
                  <div className="size-16 rounded-md border border-gray-100 bg-gray-50 p-1 flex items-center justify-center">
                    <img src={item.qr} alt="QR" className="size-full object-contain" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight">{item.product} <span className="text-gray-400 font-medium text-sm">({item.warehouse})</span></h4>
                    <p className="text-[12px] font-bold text-[#1a4332] flex items-center gap-1">
                      {item.farm} <ArrowRight className="size-3 rotate-[-45deg]" />
                    </p>
                    <div className="flex items-center gap-4 text-[11px] font-medium text-gray-500 pt-1">
                      <span>{item.location}</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
               </div>
               <div className="bg-brand/5 px-2 py-1 rounded text-[9px] font-bold text-brand tracking-widest uppercase">
                  {item.id}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <Button variant="outline" className="w-full h-10 text-[11px] font-bold text-[#1a4332] border-gray-100 gap-2 rounded-md hover:bg-gray-50">
                <Eye className="size-3.5" /> View Operations
              </Button>
              <Button className="w-full h-10 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white gap-2 rounded-md shadow-sm">
                <ClipboardList className="size-3.5" /> Record New Operation
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between pt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
         <div>0 of 100 row(s) selected.</div>
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               Rows per page
               <select className="bg-white border border-gray-100 rounded px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-brand">
                 <option>10</option>
                 <option>20</option>
                 <option>50</option>
               </select>
            </div>
            <div>Page 1 of 4</div>
            <div className="flex items-center gap-1">
               <Button variant="outline" size="icon" className="size-7 border-gray-100 text-gray-400 rounded">
                 <ChevronLeft className="size-3" />
               </Button>
               <Button variant="outline" size="icon" className="size-7 border-gray-100 text-gray-400 rounded">
                 <ChevronLeft className="size-3 rotate-180" />
               </Button>
            </div>
         </div>
      </div>

      {/* Modal is still here if needed for logging conditions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="w-full max-w-lg bg-white rounded-md shadow-2xl overflow-hidden">
              <div className="p-8 space-y-8">
                 <h3 className="text-xl font-bold text-[#1a4332]">Log storage conditions</h3>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-400 uppercase">Storage Location</label>
                       <input type="text" className="w-full h-12 px-4 rounded-md border border-gray-100 bg-gray-50/30" />
                    </div>
                    <div className="flex gap-4">
                       <Button onClick={() => setIsModalOpen(false)} className="flex-1 h-12 bg-red-600 text-white">Cancel</Button>
                       <Button onClick={() => setIsModalOpen(false)} className="flex-1 h-12 bg-[#1a4332] text-white">Save Entry</Button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
