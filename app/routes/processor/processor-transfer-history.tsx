import { useState } from 'react'
import { PageHeader } from '~/components/page-header'
import { PickupHandoffQRModal } from '~/components/transfer/pickup-handoff-qr-modal'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { useGetTransfers } from '~/lib/api/generated/transfers/transfers'
import { cn } from '~/lib/utils'
import type { ProductTransfer, TransferStatus } from '~/types/transfer'

const statusStyles: Record<TransferStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
  accepted: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  ready_for_pickup: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100',
  picked_up: 'bg-purple-100 text-purple-700 hover:bg-purple-100',
  in_transit: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  delivered: 'bg-green-100 text-green-700 hover:bg-green-100',
  acknowledged: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
  cancelled: 'bg-red-100 text-red-700 hover:bg-red-100',
  rejected: 'bg-red-100 text-red-700 hover:bg-red-100',
  available: 'bg-gray-100 text-gray-700 hover:bg-gray-100',
}

export default function ProcessorTransferHistory() {
  const { data: transfersData, isLoading } = useGetTransfers()
  const [selectedTransfer, setSelectedTransfer] = useState<ProductTransfer | null>(null)
  const [isQRModalOpen, setIsQRModalOpen] = useState(false)

  const rawTransfers = transfersData?.data?.data || []

  const transfers: ProductTransfer[] = rawTransfers.map((t) => ({
    id: t.id,
    batchId: t.transferCode || 'N/A',
    productName: t.productName || 'Unknown Product',
    farmerName: t.fromUserName || 'You',
    farmName: 'Your Facility',
    location: t.deliveryLocation || 'N/A',
    quantity: Number(t.quantityTransferred),
    unit: t.unit || 'KG',
    status: (t.status as TransferStatus) || 'pending',
    date: t.initiatedDate || t.createdAt,
  }))

  const handleOpenQR = (transfer: ProductTransfer) => {
    setSelectedTransfer(transfer)
    setIsQRModalOpen(true)
  }

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
            <div className="rounded-md border border-gray-100 bg-white px-4 py-2 shadow-sm text-center min-w-[120px]">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Batches</p>
              <p className="text-lg font-bold text-gray-900">{transfers.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Batch ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Destination</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Quantity</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Loading transfers...</td>
                  </tr>
                ) : transfers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No transfers found.</td>
                  </tr>
                ) : (
                  transfers.map((transfer) => (
                    <tr key={transfer.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(transfer.date as string).toLocaleDateString('en-NG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs text-brand font-bold bg-brand/5 px-2 py-0.5 rounded">
                          {transfer.batchId}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{transfer.productName}</td>
                      <td className="px-6 py-4 text-gray-500 font-medium">{transfer.location}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {transfer.quantity} {transfer.unit}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn('border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', statusStyles[transfer.status])}>
                          {transfer.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {transfer.status === 'accepted' && (
                          <Button
                            onClick={() => handleOpenQR(transfer)}
                            className="h-8 px-4 bg-[#1d3d1e] hover:bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-md"
                          >
                            Ready for Pickup
                          </Button>
                        )}
                        {transfer.status === 'ready_for_pickup' && (
                          <Button
                            onClick={() => handleOpenQR(transfer)}
                            variant="outline"
                            className="h-8 px-4 border-gray-200 text-[#1d3d1e] font-bold text-[10px] uppercase tracking-widest rounded-md"
                          >
                            View QR
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PickupHandoffQRModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        transfer={selectedTransfer}
      />
    </div>
  )
}
