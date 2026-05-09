import { QRCodeSVG } from 'qrcode.react'
import { Copy, Download, Share2, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'

interface ShareQRModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  batchNumber?: string
}

export function ShareQRModal({ isOpen, onClose, productId, productName, batchNumber }: ShareQRModalProps) {
  // Use passport/ prefix as requested
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/passport/${productId}`
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied to clipboard!')
  }

  const handleDownloadQR = () => {
    const svg = document.getElementById('share-qr-svg')
    if (!svg) return

    // Convert SVG to Data URL for download
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Add padding for the canvas
      canvas.width = img.width + 40
      canvas.height = img.height + 40
      
      // Background
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 20, 20)
      }

      const pngFile = canvas.toDataURL('image/png')
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${batchNumber || productId}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }

    // Set src after onload is defined
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
    toast.success('QR Code download started!')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] bg-white p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
        {/* Header Section - More elegant and soft */}
        <div className="p-6 sm:p-8 text-center relative shrink-0 border-b border-gray-50">
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-50"
          >
            <X className="size-5" />
          </button>
          
          <div className="mx-auto size-14 sm:size-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
            <Share2 className="size-7 sm:size-8 text-emerald-600" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-tight">Share Traceability</DialogTitle>
            <p className="text-gray-500 text-[11px] sm:text-xs font-medium uppercase tracking-[0.15em] mt-2 px-4 line-clamp-2">
              {productName} {batchNumber ? `• ${batchNumber}` : ''}
            </p>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-1 rounded-[2.5rem] bg-gradient-to-tr from-emerald-50 to-emerald-100/50 shadow-inner">
              <div className="bg-white p-5 rounded-[2.2rem] shadow-sm border border-emerald-50">
                <QRCodeSVG 
                  id="share-qr-svg"
                  value={shareUrl} 
                  size={160}
                  level="H"
                  includeMargin={false}
                  className="sm:w-[180px] sm:h-[180px]"
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Digital Traceability Passport</p>
              <p className="text-[9px] text-gray-300 mt-1">Scan to verify origin & sustainability</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Direct Access Link</label>
              <div className="flex items-center gap-2 p-1.5 pl-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                <span className="flex-1 text-[11px] sm:text-xs font-semibold text-gray-500 truncate mr-2">{shareUrl}</span>
                <Button 
                  onClick={handleCopyLink}
                  variant="ghost"
                  className="h-9 px-4 bg-white hover:bg-white text-emerald-700 border border-gray-100 rounded-xl shadow-sm font-bold text-[10px] uppercase tracking-widest gap-2 shrink-0 hover:shadow-md transition-all"
                >
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={handleDownloadQR}
                className="h-12 bg-gray-900 hover:bg-black text-white rounded-xl shadow-lg shadow-gray-200 font-bold uppercase tracking-widest text-[10px] gap-2 w-full order-1 transition-all active:scale-95"
              >
                <Download className="size-4" />
                Download QR
              </Button>
              <Button 
                onClick={onClose}
                variant="outline"
                className="h-12 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl font-bold uppercase tracking-widest text-[10px] w-full order-2 transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
