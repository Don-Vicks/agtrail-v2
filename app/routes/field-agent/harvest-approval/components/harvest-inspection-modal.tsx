import { X, MapPin, Upload, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { cn } from '~/lib/utils'
import type { HarvestItem } from './harvest-card'

interface HarvestInspectionModalProps {
  item: HarvestItem | null
  isOpen: boolean
  onClose: () => void
}

export function HarvestInspectionModal({ item, isOpen, onClose }: HarvestInspectionModalProps) {
  if (!item) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[580px] p-0 overflow-hidden border-none shadow-2xl rounded-lg bg-white">
        <div className="max-h-[90vh] overflow-y-auto relative">
          {/* Note: Standard DialogContent usually includes a close button. 
              We removed the manual X icon to avoid duplication. */}
          
          <div className="p-6 space-y-6">
            {/* Context Bar */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-md p-4 flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-md bg-white flex items-center justify-center text-[#2e7d32] font-bold text-lg border border-gray-100 shadow-sm">
                {item.product.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-left">
                  <h2 className="text-base font-bold text-gray-900 tracking-tight uppercase truncate">{item.product}</h2>
                  <span className="px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-white">
                    {item.batchId.replace('BATCH-', '')}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#1a4332] text-white text-[9px] font-bold">{item.weight}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 text-[9px] font-semibold uppercase tracking-wider mt-1 text-left">
                  <span className="flex items-center gap-1 truncate"><MapPin className="size-2.5" />{item.location}</span>
                  <span className="flex items-center gap-1 shrink-0">田 {item.hectares}</span>
                </div>
              </div>
              <div className="text-right border-l border-gray-200/60 pl-4 hidden xs:block">
                 <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest mb-1">Holder</p>
                 <div className="flex items-center gap-1.5 justify-end">
                   <span className="text-[9px] font-bold text-gray-500 truncate max-w-[80px]">{item.owner.split('@')[0]}</span>
                   <div className="size-6 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">AD</div>
                 </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6 text-left">
              <FormGroup label="Quality *" placeholder="Select a state" isSelect />
              <FormGroup label="Quantity *" placeholder="e.g., Sunshine Farm" />
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">Remarks *</label>
                <textarea 
                  placeholder="e.g., Sunshine Farm"
                  className="w-full h-32 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all resize-none shadow-sm"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">UPLOAD DOCUMENT<span className="text-red-500 ml-1">*</span></p>
                <div className="border-2 border-dashed border-gray-100 rounded-md p-12 flex flex-col items-center justify-center bg-gray-50/20 group hover:border-[#2e7d32]/20 transition-all cursor-pointer shadow-sm">
                  <div className="size-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2e7d32] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload or drag and drop</p>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">MAX FILE SIZE: 10MB (PDF, JPG, PNG)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
              <button 
                onClick={onClose}
                className="px-6 h-11 rounded-md border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                &lsaquo; Back
              </button>
              <Button 
                onClick={onClose}
                className="px-8 h-11 bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FormGroup({ label, placeholder, isSelect }: { label: string; placeholder: string; isSelect?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-gray-900 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input 
          readOnly={isSelect}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all shadow-sm",
            isSelect && "cursor-pointer bg-white"
          )}
        />
        {isSelect && (
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
        )}
      </div>
    </div>
  )
}
