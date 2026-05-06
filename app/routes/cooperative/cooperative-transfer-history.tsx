import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'

export default function CooperativeTransferHistory() {
  return (
    <div className="space-y-6">
      <PageHeader
        items={[
          { label: 'Cooperative', href: '/cooperative' },
          { label: 'Transfer' },
          { label: 'Transfer History' },
        ]}
      />
      
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1d3d1e] uppercase tracking-tight">Transfer History</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Review all past product transfers from the cooperative.</p>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Batch ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Transporter</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">Oct 25, 2024</td>
                  <td className="px-6 py-4 font-mono text-xs text-brand font-bold">#BATCH-54321</td>
                  <td className="px-6 py-4 font-bold text-gray-900">Cashew</td>
                  <td className="px-6 py-4 text-gray-500 font-medium">O and Co Transport</td>
                  <td className="px-6 py-4 font-bold text-gray-900">2,000 KG</td>
                  <td className="px-6 py-4">
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">In Transit</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
