import { Archive, Search, ChevronDown, Download, FileText, Eye } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'

export default function ShipmentHistoryPage() {
  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        items={[
          { label: 'Transporter', href: '/transporter' },
          { label: 'Shipment History', href: '#' },
        ]}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-brand tracking-tight">Shipment History</h1>
          <p className="text-xs text-gray-400 font-medium max-w-sm">Historical logistics data and archived proof of custody records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 border-gray-100 text-gray-600 font-semibold px-4 rounded-md hover:bg-gray-50 shadow-sm text-[11px] uppercase tracking-widest">
            <Download className="size-3.5 mr-2" /> Export CSV
          </Button>
          <Button className="h-9 bg-brand hover:bg-brand/90 text-white font-semibold px-4 rounded-md shadow-md transition-all active:scale-95 text-[11px] uppercase tracking-widest">
            <FileText className="size-3.5 mr-2" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shipment, batch, or destination..."
            className="h-10 w-full rounded-md border border-gray-100 bg-white pl-9 pr-4 text-[12px] outline-none focus:border-brand shadow-sm transition-all"
          />
        </div>
        <div className="relative w-full sm:w-[180px]">
          <select className="h-10 w-full appearance-none rounded-md border border-gray-100 bg-white px-4 pr-10 text-[11px] font-semibold text-gray-500 outline-none focus:border-brand shadow-sm transition-all hover:bg-gray-50">
            <option>All Locations</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden'>
        <div className="p-6 border-b border-gray-50">
           <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Archived Shipments</h3>
        </div>
        <table className='w-full text-left text-sm'>
          <thead>
            <tr className='bg-gray-50/30 border-b border-gray-100'>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Shipment ID</th>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Origin</th>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Destination</th>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Date Delivered</th>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px]'>Status</th>
              <th className='px-6 py-4 font-semibold text-gray-400 uppercase tracking-widest text-[10px] text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-50'>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className='hover:bg-gray-50/30 transition-colors group'>
                <td className='px-6 py-5 font-bold text-brand text-[13px]'>#SHP-8829-{i}</td>
                <td className='px-6 py-5 text-gray-600 font-bold text-[13px]'>Akure, Nigeria</td>
                <td className='px-6 py-5 text-gray-600 font-bold text-[13px]'>Lagos Terminal</td>
                <td className='px-6 py-5 text-gray-400 font-semibold text-[12px]'>Oct 2{i}, 2023</td>
                <td className='px-6 py-5'>
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-semibold text-[9px] uppercase tracking-widest rounded-md px-3 py-1">Delivered</Badge>
                </td>
                <td className='px-6 py-5 text-right'>
                   <button className='text-gray-300 hover:text-brand transition-colors'>
                      <Eye className='size-4' />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
