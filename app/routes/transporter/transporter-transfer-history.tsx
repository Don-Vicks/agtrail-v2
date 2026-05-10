import { CheckCircle2, Clock, Eye } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { cn } from '~/lib/utils'

export default function TransporterTransferHistory() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Transporter', href: '/transporter' },
          { label: 'Transfer' },
          { label: 'Transfer History' },
        ]}
      />

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1d3d1e] uppercase tracking-tight">Transfer History</h1>
            <p className="text-sm text-gray-500 font-medium mt-1">Review all your completed and active shipments across the network.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-md border border-gray-100 bg-white px-4 py-2 shadow-sm">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Trips</p>
              <p className="text-lg font-bold text-gray-900">1,284</p>
            </div>
            <div className="rounded-md border border-gray-100 bg-white px-4 py-2 shadow-sm">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Completed</p>
              <p className="text-lg font-bold text-green-600">1,240</p>
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
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Origin Node</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Destination</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <HistoryRow
                  date="Oct 26, 2024"
                  id="#BATCH-99887"
                  origin="Baba Beji Farms"
                  dest="Lagos Consolidation Center"
                  status="delivered"
                />
                <HistoryRow
                  date="Oct 24, 2024"
                  id="#BATCH-99885"
                  origin="Olamide Farms"
                  dest="Kano Processing Plant"
                  status="in_transit"
                />
                <HistoryRow
                  date="Oct 22, 2024"
                  id="#BATCH-99882"
                  origin="IITA Hub"
                  dest="Ibadan Warehouse"
                  status="delivered"
                />
                <HistoryRow
                  date="Oct 20, 2024"
                  id="#BATCH-99880"
                  origin="Lagos Port"
                  dest="Export Terminal A"
                  status="delivered"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function HistoryRow({ date, id, origin, dest, status }: {
  date: string,
  id: string,
  origin: string,
  dest: string,
  status: 'delivered' | 'in_transit' | 'pending'
}) {
  const statusConfig = {
    delivered: {
      label: 'Delivered',
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
      <td className="px-6 py-4 text-gray-500 font-medium">{origin}</td>
      <td className="px-6 py-4 text-gray-500 font-medium">{dest}</td>
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
