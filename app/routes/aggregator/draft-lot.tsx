import { Eye, Plus, MapPin, CheckCircle2, ClipboardCheck, PackageCheck } from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'
import { Link } from 'react-router'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { FarmMap } from '~/components/farm-map.client'

export default function AggregatorDraftLotPage() {
  const { draftLotBatches, stats } = useDraftLot()
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        items={[
          {
            label: 'Aggregator',
            href: '/aggregator',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            ),
          },
          {
            label: 'Batch QR Scan',
            href: '/aggregator/batch-qr-scan'
          },
          { label: 'Draft Lot' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Draft Lot</h1>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-brand">Batch Identifier</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-brand">Farmer Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-brand">Location</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-brand">Harvested</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-brand">Quantity</th>
                <th className="px-6 py-4 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {draftLotBatches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                    No batches in current draft.
                  </td>
                </tr>
              ) : (
                draftLotBatches.map((batch) => (
                  <tr key={batch.id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-brand tracking-tight">#{batch.batchIdentifier.slice(0, 8)}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-gray-900">{batch.farmerName}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">F - {batch.id.slice(-3)}</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-500">{batch.location}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-500">{batch.harvestedAt}</td>
                    <td className="px-6 py-5 font-bold text-gray-900">{batch.quantityKg.toFixed(2)} Kg</td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-gray-300 hover:text-brand transition-colors">
                          <Eye className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
        <Button
          onClick={() => setIsReviewModalOpen(true)}
          className="w-full sm:w-[500px] h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-normal rounded-md shadow-md transition-all active:scale-95"
          disabled={draftLotBatches.length === 0}
        >
          Create Lot
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full sm:w-[240px] h-12 border-gray-200 text-gray-600 font-normal rounded-md hover:bg-gray-50 shadow-sm transition-all active:scale-95"
        >
          <Link to="/aggregator/batch-qr-scan">
            Add More
          </Link>
        </Button>
      </div>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[540px] p-0 overflow-hidden border-none shadow-2xl rounded-md bg-white">
          <div className="p-8 space-y-8">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Review Lot Consolidation</DialogTitle>
                <DialogDescription className="text-[11px] font-medium text-gray-400 max-w-[320px] leading-relaxed">
                  Verify the batch aggregation details before generating the final Lot ID. This action is irreversible
                </DialogDescription>
              </div>
              <Badge variant="secondary" className="bg-gray-100 text-gray-500 font-bold px-3 py-1 text-[10px] uppercase rounded-md border-none">
                Pending
              </Badge>
            </div>

            <div className="space-y-6">
              {/* IDs Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-full bg-green-50 flex items-center justify-center text-[#1a4332]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Generated Lot ID</p>
                    <p className="text-base font-bold text-[#1a4332] tracking-tight">Lot-2026-0892-av</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Creation Date</p>
                    <p className="text-base font-bold text-[#1a4332] tracking-tight">oct 24, 2026 - 14:32</p>
                  </div>
                </div>
              </div>

              {/* Stats Grid - Border top and down only */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100/50">
                    <ClipboardCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Batches</p>
                    <p className="text-sm font-bold text-gray-900">{stats.scanned} Items</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100/50">
                    <PackageCheck className="size-5" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Total Weight</p>
                    <p className="text-sm font-bold text-gray-900">{stats.totalDraftWeightKg.toLocaleString()} KG</p>
                  </div>
                </div>
              </div>

              {/* Entity List - Rounded MD container */}
              <div className="rounded-md border border-gray-100 bg-gray-50/10 overflow-hidden divide-y divide-gray-50">
                {draftLotBatches.slice(0, 3).map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 bg-white/50">
                    <div className="flex items-center gap-4">
                      <div className="size-9 rounded-md bg-white border border-gray-100 flex items-center justify-center text-brand shadow-sm">
                        <ClipboardCheck className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a4332] tracking-tight">{batch.farmerName}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{batch.location} . 1 Batch</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-gray-900">{batch.quantityKg.toLocaleString()} KG</p>
                  </div>
                ))}
              </div>

              {/* Traceability Check */}
              <div className="p-4 rounded-md border border-gray-100 bg-white flex items-center gap-4 shadow-sm">
                <div className="size-8 rounded-md bg-green-50 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="size-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-[#1a4332] uppercase tracking-wider">Traceability Check Passed</p>
                  <p className="text-[9px] font-bold text-gray-400 leading-none">
                    All {stats.scanned} batches have valid QR credentials and origin certificates verified on-chain.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <Button
                  asChild
                  className="h-12 flex-1 rounded-md bg-[#1a4332] text-sm font-normal text-white hover:bg-[#122e22] shadow-md transition-all active:scale-95 border-none"
                >
                  <Link to="/aggregator/lot-consolidation">
                    Confirm & Create Lot
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="h-12 flex-1 rounded-md bg-red-600 text-sm font-normal text-white hover:bg-red-700 shadow-md transition-all active:scale-95 border-none"
                >
                  Cancel
                </Button>
              </div>

              {/* Map Image Section */}
              <div className="space-y-3 pt-4">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Consolidation Location</p>
                <div className="h-48 rounded-md overflow-hidden border border-gray-100 shadow-sm bg-gray-50 relative">
                  <FarmMap farms={[]} className="w-full h-full" />
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-lg border border-gray-100">
                      <MapPin className="size-3.5 text-red-500" />
                      <span className="text-[10px] font-bold text-gray-900 tracking-tight">Johannesburg Hub A-1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
