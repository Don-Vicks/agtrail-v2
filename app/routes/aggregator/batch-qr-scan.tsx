import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import {
  Camera,
  CheckCircle2,
  CircleAlert,
  QrCode,
  ScanLine,
  User,
  XCircle,
  FileText,
  Monitor,
  Gamepad2,
  PackageCheck,
  ChevronRight,
  MapPin,
  Sprout,
  Archive
} from 'lucide-react'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useAggregatorIncomingBatches } from '~/lib/aggregator/use-aggregator-data'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'
import type { AggregatorBatch } from '~/lib/aggregator/types'

export default function AggregatorBatchQrScanPage() {
  const { batches, isLoading } = useAggregatorIncomingBatches()
  const { draftLotBatches, stats, addBatch } = useDraftLot()
  const [isScanModalOpen, setIsScanModalOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<AggregatorBatch | null>(null)

  const nextScannableBatch = useMemo(
    () => batches.find((batch) => !draftLotBatches.some((existing) => existing.id === batch.id)),
    [batches, draftLotBatches],
  )

  const handleSimulateScan = () => {
    if (!nextScannableBatch) return
    setSelectedBatch(nextScannableBatch)
    setIsScanModalOpen(true)
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
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
          { label: 'Batch QR Scan' }
        ]}
      />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
            Inbound consolidation - draft-2026-04-22
          </p>
          <h1 className="text-2xl font-bold text-[#2e7d32]">Batch QR Scan & Verification</h1>
          <p className="text-sm text-gray-500 max-w-2xl">
            Scan farmer batch QRs, review verification status, and consolidate them into a lot before taking custody.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Scanned" value={stats.scanned} />
        <StatCard label="Verified" value={stats.verified} />
        <StatCard label="Flagged" value={stats.flagged} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: QR Scan Station & Lot Summary */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
                  <Camera className="size-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-tight uppercase">QR Scan Station</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Aim at a batch QR or simulate scans</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest bg-[#1a4332] text-white hover:bg-[#1a4332]/90 border-none shadow-sm">
                  <Monitor className="size-3 mr-1" />
                  Camera
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2 text-[9px] font-bold uppercase tracking-widest border-gray-200 text-gray-600 hover:bg-gray-50 shadow-none"
                  onClick={handleSimulateScan}
                  disabled={!nextScannableBatch}
                >
                  <Gamepad2 className="size-3 mr-1 text-gray-400" />
                  Simulate
                </Button>
              </div>
            </div>

            <div className="aspect-[2/1] rounded-xl bg-[#1a4332] flex flex-col items-center justify-center text-white border border-[#2e7d32]/20">
              <ScanLine className="size-8 text-white/20 mb-2" />
              <p className="text-xs font-bold tracking-tight">Camera Off</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/60 mt-0.5">Use the buttons below</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white py-2 px-1 hover:bg-gray-50 hover:shadow-sm transition-all group">
                <CheckCircle2 className="size-3.5 text-[#2e7d32]" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-[#2e7d32]">Valid batch</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white py-2 px-1 hover:bg-gray-50 hover:shadow-sm transition-all group">
                <CircleAlert className="size-3.5 text-amber-500" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-amber-600">Flagged Batch</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white py-2 px-1 hover:bg-gray-50 hover:shadow-sm transition-all group">
                <XCircle className="size-3.5 text-red-500" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-red-600">Rejected QR</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-gray-900 tracking-tight uppercase">Lot Summary</h3>
              <PackageCheck className="size-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Includable</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{stats.scanned}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">batches</span>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 mb-1">Total Weight</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{Math.round(stats.totalDraftWeightKg)}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kg</span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-[9px] text-gray-400 leading-relaxed font-bold uppercase tracking-tight">
              verified batches appear here, ready to consolidation into a lot
            </p>
          </div>
        </div>

        {/* Right Column: Draft Lot List */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Draft Lot ({draftLotBatches.length})</h3>
          </div>

          {draftLotBatches.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50/20">
              <div className="size-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                <QrCode className="size-5 text-[#2e7d32]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight mb-1">no batches scanned yet</h4>
              <p className="text-[9px] text-gray-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest">
                verified batches will appear here, ready to consolidation into a lot
              </p>
              <Button asChild variant="link" className="mt-4 text-brand font-bold text-[10px] uppercase tracking-widest">
                <Link to="/aggregator/draft-lot">View Empty Draft Page</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-100 bg-gray-50/30">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-brand">Batch Identifier</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-brand">Farmer Name</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-brand">Location</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-brand">Harvested</th>
                      <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-brand">Quantity</th>
                      <th className="px-4 py-3 w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {draftLotBatches.map((batch) => (
                      <tr key={batch.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-4 font-bold text-brand tracking-tight">#{batch.batchIdentifier.slice(0, 8)}</td>
                        <td className="px-4 py-4">
                          <p className="font-bold text-gray-900">{batch.farmerName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">F - {batch.id.slice(-3)}</p>
                        </td>
                        <td className="px-4 py-4 text-[11px] font-bold text-gray-500">{batch.location}</td>
                        <td className="px-4 py-4 text-[11px] font-bold text-gray-500">{batch.harvestedAt}</td>
                        <td className="px-4 py-4 font-bold text-gray-900">{batch.quantityKg.toFixed(2)} Kg</td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="text-gray-300 hover:text-brand transition-colors">
                              <Eye className="size-4" />
                            </button>
                            <button className="text-gray-300 hover:text-brand transition-colors">
                              <Eye className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-auto pt-6 space-y-4">
                <Button asChild className="w-full h-12 bg-brand hover:bg-brand/90 text-white font-bold rounded-xl shadow-sm">
                  <Link to="/aggregator/draft-lot">
                    See Draft
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild className="h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold rounded-xl shadow-sm">
                    <Link to="/aggregator/lot-consolidation">
                      Create Lot
                    </Link>
                  </Button>
                  <Button 
                    onClick={() => setIsScanModalOpen(true)}
                    variant="outline" 
                    className="h-12 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50"
                  >
                    Add More
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isScanModalOpen} onOpenChange={setIsScanModalOpen}>
        <DialogContent className='sm:max-w-[480px] p-6 overflow-hidden border-none shadow-2xl rounded-[10px] bg-white'>
          {selectedBatch && (
            <div className="space-y-6">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight">Batch Scanned</DialogTitle>
                <div className="flex items-center gap-2">
                  <div className="flex size-5 items-center justify-center rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                    <User className="size-3" />
                  </div>
                  <p className="text-xs text-gray-500 font-medium">From <span className="font-bold text-gray-900">{selectedBatch.farmerName}</span></p>
                </div>
              </div>

              <div className="space-y-6 py-2">
                {/* Farm Location */}
                <div className="flex items-start gap-4">
                  <div className="flex size-11 items-center justify-center rounded-full bg-[#1a4332] text-white shadow-sm">
                    <MapPin className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-400">Farm Location</p>
                    <p className="text-base font-bold text-[#1a4332] tracking-tight">{selectedBatch.location}</p>
                  </div>
                </div>

                {/* Field Agent */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 items-center justify-center rounded-full bg-red-600 text-white shadow-sm">
                      <MapPin className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-gray-400">Field Agent</p>
                      <p className="text-base font-bold text-[#1a4332] tracking-tight">{selectedBatch.fieldAgentName}</p>
                    </div>
                  </div>
                  <div className="mt-2 px-3 py-1 rounded-lg border border-gray-100 bg-white shadow-sm">
                    <span className="text-[10px] font-bold text-green-700">Approved</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-50 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    icon={<Sprout className="size-5" />}
                    label='Type of Goods'
                    value={selectedBatch.goodsType}
                  />
                  <InfoItem
                    icon={<Sprout className="size-5" />}
                    label='Quantity'
                    value={`${selectedBatch.quantityKg.toFixed(0)}Kg (${(selectedBatch.quantityKg / 50).toFixed(0)} Bags)`}
                  />
                  <InfoItem
                    icon={<Sprout className="size-5" />}
                    label='Harvest Date'
                    value={selectedBatch.harvestedAt}
                  />
                  <InfoItem
                    icon={<Sprout className="size-5" />}
                    label='Est. Time'
                    value={`${selectedBatch.estimatedInspectionMins} mins`}
                  />
                </div>
              </div>

              <div className='flex gap-4 pt-4'>
                <Button
                  onClick={() => setIsScanModalOpen(false)}
                  className='h-12 flex-1 rounded-xl bg-[#dc2626] text-sm font-bold text-white hover:bg-[#b91c1c] shadow-md transition-all active:scale-95'
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (!selectedBatch) return
                    addBatch(selectedBatch)
                    setIsScanModalOpen(false)
                  }}
                  className='h-12 flex-1 rounded-xl bg-[#1a4332] text-sm font-bold text-white hover:bg-[#122e22] shadow-md transition-all active:scale-95'
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-hover:text-[#2e7d32] transition-colors">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tighter">{value}</p>
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50">
      <div className="flex size-10 items-center justify-center rounded-xl bg-[#e8f5e9] text-[#1a4332]">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className='text-[10px] font-bold text-gray-400'>{label}</p>
        <p className='text-[13px] font-bold text-[#1a4332] tracking-tight'>{value}</p>
      </div>
    </div>
  )
}

