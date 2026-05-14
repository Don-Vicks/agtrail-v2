import { Copy, ScanLine, Truck, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import type { ProductTransfer } from '~/types/transfer'

interface PickupHandoffQRModalProps {
  isOpen: boolean
  onClose: () => void
  transfer: ProductTransfer | null
}

/**
 * Deep link for transporter pickup verification. Scanner / in-app camera can open this URL.
 */
export function buildPickupHandoffUrl(origin: string, transfer: ProductTransfer): string {
  const u = new URL('/transporter/pickup', origin)
  u.searchParams.set('transferId', transfer.id)
  u.searchParams.set('batchId', transfer.batchId)
  return u.toString()
}

export function PickupHandoffQRModal({ isOpen, onClose, transfer }: PickupHandoffQRModalProps) {
  const [handoffUrl, setHandoffUrl] = useState('')
  const [urlError, setUrlError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !transfer) {
      setHandoffUrl('')
      setUrlError(null)
      return
    }
    if (typeof window === 'undefined') {
      return
    }
    try {
      setHandoffUrl(buildPickupHandoffUrl(window.location.origin, transfer))
      setUrlError(null)
    } catch {
      setUrlError('Could not build pickup link.')
      setHandoffUrl('')
    }
  }, [isOpen, transfer])

  const handleCopyLink = () => {
    if (!handoffUrl) {
      toast.error('Pickup link is not ready yet.')
      return
    }
    void navigator.clipboard.writeText(handoffUrl).then(
      () => toast.success('Pickup link copied.'),
      () => toast.error('Could not copy link.'),
    )
  }

  const urlReady = Boolean(handoffUrl)
  const showLoading = isOpen && transfer !== null && !urlReady && !urlError

  return (
    <Dialog open={Boolean(isOpen && transfer)} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md w-[95vw] bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
        <div className="bg-[#1d3d1e] p-6 sm:p-8 text-center text-white relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors p-2"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <div className="mx-auto size-16 sm:size-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
            <Truck className="size-8 sm:size-10 text-white" />
          </div>

          <DialogHeader className="text-white">
            <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
              Pickup handoff
            </DialogTitle>
            <DialogDescription className="sr-only">
              Scan the QR code so the transporter can confirm pickup in the app.
            </DialogDescription>
            {transfer ? (
              <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 px-4 line-clamp-2">
                {transfer.productName} • {transfer.batchId}
              </p>
            ) : null}
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <p className="text-center text-sm text-gray-600 font-medium leading-relaxed">
            Have the driver scan this code with their device to open pickup verification and confirm handoff.
          </p>

          <div className="flex flex-col items-center justify-center space-y-4">
            {urlError ? (
              <p className="text-sm text-red-600 font-medium text-center" role="alert">
                {urlError}
              </p>
            ) : showLoading ? (
              <div
                className="flex size-[min(280px,72vw)] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50"
                aria-busy="true"
                aria-label="Loading QR code"
              >
                <div className="size-10 rounded-full border-2 border-brand border-t-transparent animate-spin" />
              </div>
            ) : (
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
                <QRCodeSVG
                  id="pickup-handoff-qr-svg"
                  value={handoffUrl}
                  size={264}
                  level="H"
                  includeMargin={false}
                />
              </div>
            )}
            {!urlError && urlReady ? (
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <ScanLine className="size-3.5" />
                Pickup verification link
              </p>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pickup link</label>
              <div className="flex items-center gap-2 p-1 pl-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <span className="flex-1 text-[11px] sm:text-xs font-bold text-gray-500 truncate mr-2">
                  {handoffUrl || (showLoading ? 'Preparing link…' : '—')}
                </span>
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  disabled={!urlReady}
                  variant="ghost"
                  className="h-10 px-4 bg-white hover:bg-white text-[#1d3d1e] border border-gray-100 rounded-md shadow-sm font-black text-[10px] uppercase tracking-widest gap-2 shrink-0 disabled:opacity-50"
                >
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </Button>
              </div>
            </div>

            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="h-12 w-full border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
