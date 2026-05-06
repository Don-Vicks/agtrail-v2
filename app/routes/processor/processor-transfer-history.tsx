import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Eye, CheckCircle2, Clock, MapPin } from 'lucide-react'
import { cn } from '~/lib/utils'

export default function ProcessorTransferHistory() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Processor', href: '/processor' },
          { label: 'Transfer' },
          { label: 'Transfer History' },
        ]}
      />
      
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d3d1e] uppercase tracking-tight">Transfer History</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Audit trail of all processed batches transferred to distributors or exporters.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg border border-gray-100 bg-white px-4 py-2 shadow-sm text-center min-w-[120px]">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Batches</p>
              <p className="text-lg font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Batch ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Receiver</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <HistoryRow 
                  date="Nov 02, 2024"
                  id="#PROC-8812"
                  product="Premium Rice Flour"
                  receiver="National Distribution Co"
                  qty="500 Sacks"
                  status="completed"
                />
                <HistoryRow 
                  date="Oct 28, 2024"
                  id="#PROC-8810"
                  product="Fortified Maize Flour"
                  receiver="World Food Program"
                  qty="1,200 Sacks"
                  status="completed"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryRow({ date, id, product, receiver, qty, status }: { 
  date: string, 
  id: string, 
  product: string, 
  receiver: string,
  qty: string,
  status: 'completed' | 'in_transit' | 'pending' 
}) {
  const statusConfig = {
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700',
      icon: CheckCircle2
    },
    in_transit: {
      label: 'In Transit',
      className: 'bg-blue-100 text-blue-700',
      icon: Clock
    },
    pending: {
      label: 'Pending',
      className: 'bg-amber-100 text-amber-700',
      icon: Clock
    }
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4 font-medium text-gray-900">{date}</td>
      <td className="px-6 py-4">
        <span className="font-mono text-xs text-brand font-bold bg-brand/5 px-2 py-0.5 rounded">
          {id}
        </span>
      </td>
      <td className="px-6 py-4 font-bold text-gray-900">{product}</td>
      <td className="px-6 py-4 text-gray-500 font-medium">{receiver}</td>
      <td className="px-6 py-4 font-bold text-gray-900">{qty}</td>
      <td className="px-6 py-4">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
          config.className
        )}>
          <Icon className="size-3" />
          {config.label}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-gray-300 hover:text-brand transition-colors p-1">
          <Eye className="size-4" />
        </button>
      </td>
    </tr>
  )
}
