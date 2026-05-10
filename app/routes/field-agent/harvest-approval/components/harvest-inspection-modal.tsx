import { MapPin, ChevronDown, Upload, FileCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent } from '~/components/ui/dialog'
import { CreateHarvestApprovalRequestAction } from '~/lib/api/generated/models/createHarvestApprovalRequestAction'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import type { HarvestItem } from './harvest-card'

const FLAG_REASONS = [
  { value: 'quantity_mismatch', label: 'Quantity mismatch' },
  { value: 'quality_dispute', label: 'Quality dispute' },
  { value: 'documentation_missing', label: 'Documentation missing' },
]

interface HarvestInspectionModalProps {
  item: HarvestItem | null
  isOpen: boolean
  onClose: () => void
  onSubmitDecision: (input: {
    action: typeof CreateHarvestApprovalRequestAction.approved | typeof CreateHarvestApprovalRequestAction.flagged
    notes?: string
    flagReason?: string
  }) => Promise<void>
  isSubmitting: boolean
}

export function HarvestInspectionModal({
  item,
  isOpen,
  onClose,
  onSubmitDecision,
  isSubmitting,
}: HarvestInspectionModalProps) {
  const [notes, setNotes] = useState('')
  const [flagReason, setFlagReason] = useState(FLAG_REASONS[0]?.value ?? 'quantity_mismatch')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutateAsync: uploadFile, isPending: isUploading } = usePostUpload()

  useEffect(() => {
    if (!item) return
    setNotes('')
    setFlagReason(FLAG_REASONS[0]?.value ?? 'quantity_mismatch')
    setEvidenceFile(null)
  }, [item?.id])

  if (!item) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 10MB.')
        return
      }
      setEvidenceFile(file)
    }
  }

  const doSubmit = async (action: typeof CreateHarvestApprovalRequestAction.approved | typeof CreateHarvestApprovalRequestAction.flagged) => {
    if (!evidenceFile) {
      toast.error('Please upload an evidence document before submitting.')
      return
    }

    try {
      // Upload file first
      const uploadRes = await uploadFile({ data: { files: [evidenceFile] } })
      const uploadedUrl = resolveDocumentUrlForApi((uploadRes.data as any)?.urls?.[0])

      if (!uploadedUrl) {
        toast.error('Document upload failed. Please try again.')
        return
      }

      await onSubmitDecision({
        action,
        notes: notes.trim() || undefined,
        flagReason: action === CreateHarvestApprovalRequestAction.flagged ? flagReason : undefined,
      })
      setNotes('')
      setEvidenceFile(null)
      onClose()
    } catch {
      /* error surfaced by parent (e.g. toast) */
    }
  }

  const handleApprove = () => void doSubmit(CreateHarvestApprovalRequestAction.approved)
  const handleFlag = () => void doSubmit(CreateHarvestApprovalRequestAction.flagged)

  const busy = isSubmitting || isUploading

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-lg bg-white'>
        <div className='max-h-[90vh] overflow-y-auto relative'>
          <div className='p-5 space-y-5'>
            {/* Context Bar */}
            <div className='bg-gray-50/50 border border-gray-100 rounded-md p-3 flex items-center gap-3'>
              <div className='size-10 shrink-0 rounded-md bg-white flex items-center justify-center text-[#2e7d32] font-bold text-base border border-gray-100 shadow-sm'>
                {item.product.slice(0, 2).toUpperCase()}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 flex-wrap text-left'>
                  <h2 className='text-sm font-bold text-gray-900 tracking-tight uppercase truncate'>{item.product}</h2>
                  <span className='px-1.5 py-0.5 rounded border border-gray-200 text-[9px] font-bold text-gray-400 uppercase tracking-tighter bg-white'>
                    {item.batchId.replace(/^BATCH-/i, '')}
                  </span>
                  <span className='px-2 py-0.5 rounded bg-[#1a4332] text-white text-[9px] font-bold'>{item.weight}</span>
                </div>
                <div className='flex items-center gap-3 text-gray-400 text-[9px] font-semibold uppercase tracking-wider mt-0.5 text-left'>
                  <span className='flex items-center gap-1 truncate'>
                    <MapPin className='size-2.5' />
                    {item.location}
                  </span>
                  <span className='flex items-center gap-1 shrink-0'>田 {item.hectares}</span>
                </div>
              </div>
              <div className="text-right border-l border-gray-200/60 pl-3 hidden xs:block">
                 <p className="text-[9px] font-semibold text-gray-300 uppercase tracking-widest mb-1">Holder</p>
                 <div className="flex items-center gap-1.5 justify-end">
                   <span className="text-[9px] font-bold text-gray-500 truncate max-w-[70px]">{item.owner.split('@')[0]}</span>
                   <div className="size-5 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold">AD</div>
                 </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className='space-y-5 text-left'>
              <div className='space-y-1.5'>
                <label className='text-[10px] font-semibold text-gray-900 uppercase tracking-widest' htmlFor='flag-reason'>
                  Decision / Flag Reason *
                </label>
                <div className='relative'>
                  <select
                    id='flag-reason'
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    className='w-full h-10 appearance-none rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-900 bg-white focus:border-[#2e7d32] outline-none transition-all shadow-sm'
                  >
                    {FLAG_REASONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-[10px] font-semibold text-gray-900 uppercase tracking-widest'>
                  Reported Quantity
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={item.weight}
                    disabled
                    className='w-full h-10 rounded-md border border-gray-200 px-3 text-sm font-medium text-gray-500 bg-gray-50/50 outline-none shadow-sm cursor-not-allowed'
                  />
                </div>
              </div>

              <div className='space-y-1.5'>
                <label className='text-[10px] font-semibold text-gray-900 uppercase tracking-widest' htmlFor='harvest-notes'>
                  Remarks *
                </label>
                <textarea
                  id='harvest-notes'
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder='e.g., Moisture content appears higher than standard...'
                  className='w-full h-24 rounded-md border border-gray-200 p-3 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all resize-none shadow-sm'
                />
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">UPLOAD DOCUMENT<span className="text-red-500 ml-1">*</span></p>
                <label
                  className="block border-2 border-dashed border-gray-100 rounded-md p-8 flex flex-col items-center justify-center bg-gray-50/20 group hover:border-[#2e7d32]/20 transition-all cursor-pointer shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {evidenceFile ? (
                    <>
                      <div className="size-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3">
                        <FileCheck className="size-4" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5 truncate max-w-full">{evidenceFile.name}</p>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">
                        {(evidenceFile.size / 1024).toFixed(0)} KB — CLICK TO CHANGE
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="size-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2e7d32] mb-3 shadow-sm group-hover:scale-110 transition-transform">
                        <Upload className="size-4" />
                      </div>
                      <p className="text-sm font-semibold text-gray-900 mb-0.5">Click to upload or drag and drop</p>
                      <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">MAX FILE SIZE: 10MB (PDF, JPG, PNG)</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 justify-between items-center pt-4 border-t border-gray-50'>
              <button 
                type="button"
                onClick={onClose}
                disabled={busy}
                className="px-5 h-10 w-full sm:w-auto rounded-md border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                &lsaquo; Back
              </button>
              <div className='flex flex-col sm:flex-row gap-2 w-full sm:w-auto'>
                <Button
                  type='button'
                  variant='destructive'
                  disabled={busy || !item.canInspect}
                  className='h-10 px-5 text-sm font-semibold rounded-md shadow-sm'
                  onClick={handleFlag}
                >
                  {isUploading ? 'Uploading…' : 'Flag Harvest'}
                </Button>
                <Button
                  type='button'
                  disabled={busy || !item.canInspect}
                  className='h-10 px-6 text-sm bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-lg transition-all active:scale-95'
                  onClick={handleApprove}
                >
                  {isUploading ? 'Uploading…' : 'Approve Harvest'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
