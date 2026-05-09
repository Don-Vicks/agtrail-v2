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
      <DialogContent className="sm:max-w-md w-[95vw] bg-white p-0 overflow-hidden border-none shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
        {/* Header Section - Sticky at top if needed */}
        <div className="bg-[#1d3d1e] p-6 sm:p-8 text-center text-white relative shrink-0">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors p-2"
          >
            <X className="size-5" />
          </button>
          
          <div className="mx-auto size-16 sm:size-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
            <Share2 className="size-8 sm:size-10 text-white" />
          </div>

          <DialogHeader className="text-white">
            <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">Share Traceability</DialogTitle>
            <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-2 px-4 line-clamp-2">
              {productName} {batchNumber ? `• ${batchNumber}` : ''}
            </p>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <QRCodeSVG 
                id="share-qr-svg"
                value={shareUrl} 
                size={160}
                level="H"
                includeMargin={false}
                className="sm:w-[180px] sm:h-[180px]"
              />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Digital Passport Link</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Direct Link</label>
              <div className="flex items-center gap-2 p-1 pl-4 rounded-xl border border-gray-100 bg-gray-50/50">
                <span className="flex-1 text-[11px] sm:text-xs font-bold text-gray-500 truncate mr-2">{shareUrl}</span>
                <Button 
                  onClick={handleCopyLink}
                  variant="ghost"
                  className="h-10 px-4 bg-white hover:bg-white text-[#1d3d1e] border border-gray-100 rounded-lg shadow-sm font-black text-[10px] uppercase tracking-widest gap-2 shrink-0"
                >
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button 
                onClick={handleDownloadQR}
                className="h-12 bg-[#1d3d1e] hover:bg-black text-white rounded-xl shadow-lg shadow-brand/10 font-black uppercase tracking-widest text-[10px] gap-2 w-full order-1 transition-all active:scale-95"
              >
                <Download className="size-4" />
                Download QR
              </Button>
              <Button 
                onClick={onClose}
                variant="outline"
                className="h-12 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl font-black uppercase tracking-widest text-[10px] w-full order-2 transition-all"
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
