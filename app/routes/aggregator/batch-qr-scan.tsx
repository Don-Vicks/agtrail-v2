import {
  Camera,
  CheckCircle2,
  CircleAlert,
  Eye,
  Gamepad2,
  Loader2,
  PackageCheck,
  QrCode,
  Video,
  VideoOff,
  XCircle,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { BatchQrCameraScanner } from '~/components/aggregator/batch-qr-camera-scanner'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { parseBatchScannedText } from '~/lib/aggregator/parse-batch-qr'
import { useAggregatorIncomingBatches } from '~/lib/aggregator/use-aggregator-data'
import { useDraftLot } from '~/lib/aggregator/use-draft-lot'

export default function AggregatorBatchQrScanPage() {
  const { batches } = useAggregatorIncomingBatches()
  const { draftLotBatches, stats, addBatch, isAdding } = useDraftLot()
  const [cameraOn, setCameraOn] = useState(false)
  const [manualBatchNumber, setManualBatchNumber] = useState('')

  const navigate = useNavigate()

  const nextScannableBatch = useMemo(
    () => batches.find((batch) => !draftLotBatches.some((existing) => existing.id === batch.id)),
    [batches, draftLotBatches],
  )

  const handleSimulateScan = async () => {
    if (!nextScannableBatch) return
    try {
      await addBatch(nextScannableBatch.batchIdentifier || nextScannableBatch.id)
    } catch (err) {
      // toast handled in addBatch
    }
  }

  const handleManualScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualBatchNumber.trim()) return
    const segment = parseBatchScannedText(manualBatchNumber)
    if (!segment) return

    try {
      await addBatch(segment)
      setManualBatchNumber('')
    } catch (err) {
      // toast handled in addBatch
    }
  }

  const handleQrDecoded = useCallback(
    async (text: string) => {
      const segment = parseBatchScannedText(text)
      if (!segment) {
        toast.error('Could not read a batch id from this QR code.')
        return
      }

      setCameraOn(false)
      try {
        await addBatch(segment)
      } catch (err) {
        // toast handled in addBatch
      }
    },
    [addBatch],
  )

  const handleCameraError = useCallback((message: string) => {
    toast.error(message)
    setCameraOn(false)
  }, [])

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Scanned" value={stats.scanned} />
        <StatCard label="Verified" value={stats.verified} />
        <StatCard label="Flagged" value={stats.flagged} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: QR Scan Station & Lot Summary */}
        <div className="space-y-4">
          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-gray-50 text-gray-400 border border-gray-100">
                  <Camera className="size-4 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900 tracking-tight uppercase">QR Scan Station</h3>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                    Point at a batch QR (HTTPS + camera permission required)
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`h-7 px-2 text-[9px] font-bold uppercase tracking-widest border-none shadow-sm ${cameraOn
                      ? 'border border-red-200 bg-red-50 text-red-800 hover:bg-red-100'
                      : 'bg-[#1a4332] text-white hover:bg-[#1a4332]/90'
                    }`}
                  onClick={() => setCameraOn((v) => !v)}
                >
                  {cameraOn ? (
                    <>
                      <VideoOff className="size-3 mr-1" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Video className="size-3 mr-1" />
                      Start camera
                    </>
                  )}
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

            <div className="relative aspect-video md:aspect-2/1 overflow-hidden rounded-md border border-[#2e7d32]/20 bg-[#1a4332]">
              <BatchQrCameraScanner
                active={cameraOn}
                onDecoded={handleQrDecoded}
                onScannerError={handleCameraError}
                className="min-h-[220px] md:min-h-[280px]"
              />

              {isAdding && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 animate-spin text-white" />
                    <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Adding to Draft...</p>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleManualScan} className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                placeholder="Enter batch id or batch number manually…"
                value={manualBatchNumber}
                onChange={(e) => setManualBatchNumber(e.target.value)}
                className="h-10 flex-1 rounded-md border border-gray-200 px-3 text-xs font-bold text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <Button
                type="submit"
                className="h-10 shrink-0 bg-brand px-4 font-bold text-white hover:bg-brand/90"
                disabled={!manualBatchNumber.trim() || isAdding}
              >
                {isAdding ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Add to draft
              </Button>
            </form>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={handleSimulateScan}
                disabled={!nextScannableBatch}
                className="flex items-center justify-center gap-1.5 rounded-md border border-gray-100 bg-white py-2 px-1 transition-all hover:bg-gray-50 hover:shadow-sm group disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5 text-[#2e7d32]" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-[#2e7d32]">Simulate valid</span>
              </button>
              <button
                type="button"
                className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-gray-100 bg-white py-2 px-1 opacity-50 group"
                disabled
              >
                <CircleAlert className="size-3.5 text-amber-500" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-amber-600">Flagged batch</span>
              </button>
              <button
                type="button"
                className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-md border border-gray-100 bg-white py-2 px-1 opacity-50 group"
                disabled
              >
                <XCircle className="size-3.5 text-red-500" />
                <span className="text-[8px] font-bold uppercase tracking-tight text-red-600">Rejected QR</span>
              </button>
            </div>
          </div>

          <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
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
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-gray-900 tracking-tight uppercase">Draft Lot ({draftLotBatches.length})</h3>
          </div>

          {draftLotBatches.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-md border border-dashed border-gray-200 bg-gray-50/20">
              <div className="size-10 rounded-md bg-white border border-gray-100 flex items-center justify-center mb-4 shadow-sm">
                <QrCode className="size-5 text-[#2e7d32]" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 tracking-tight mb-1">no batches scanned yet</h4>
              <p className="text-[9px] text-gray-400 font-bold max-w-xs leading-relaxed uppercase tracking-widest">
                verified batches will appear here, ready to consolidation into a lot
              </p>
              <Link to="/aggregator/draft-lot" className="mt-4 text-brand font-bold text-[10px] uppercase tracking-widest hover:underline underline-offset-4">
                View Empty Draft Page
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left text-xs min-w-[600px]">
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
                <Link to="/aggregator/draft-lot" className="flex items-center justify-center w-full h-12 bg-brand hover:bg-brand/90 text-white font-bold rounded-md shadow-sm">
                  See Draft
                </Link>
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/aggregator/lot-consolidation" className="flex items-center justify-center h-12 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold rounded-md shadow-sm px-4">
                    Create Lot
                  </Link>
                  <Button
                    onClick={handleSimulateScan}
                    disabled={!nextScannableBatch}
                    variant="outline"
                    className="h-12 border-gray-200 text-gray-600 font-bold rounded-md hover:bg-gray-50"
                  >
                    Add More
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2 group-hover:text-[#2e7d32] transition-colors">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tighter">{value}</p>
    </div>
  )
}
