import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { DatePicker } from '~/components/ui/date-picker'
import { cn } from '~/lib/utils'
import { usePostFarmsIdCropCycles } from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface StartCropCycleModalProps {
  isOpen: boolean
  onClose: () => void
  farmId?: string
  farmName: string
  farmLocation: string
  farmerName: string
  farmerInitials: string
  farmerColor: string
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Crop Details' },
    { number: 2, label: 'Planting Schedule' },
    { number: 3, label: 'Area & Location' },
  ]

  return (
    <div className="flex items-center justify-center gap-0 pb-6">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex size-9 items-center justify-center rounded-full text-sm font-bold transition-colors',
                currentStep > s.number
                  ? 'bg-brand text-white'
                  : currentStep === s.number
                    ? 'bg-brand text-white'
                    : 'border-2 border-gray-200 text-gray-400'
              )}
            >
              {currentStep > s.number ? (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                s.number
              )}
            </div>
            <span className={cn('mt-1.5 text-xs font-medium', currentStep >= s.number ? 'text-gray-900' : 'text-gray-400')}>
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn('mx-3 mt-[-18px] h-0.5 w-16', currentStep > s.number ? 'bg-brand' : 'bg-gray-200')} />
          )}
        </div>
      ))}
    </div>
  )
}

export function StartCropCycleModal({
  isOpen,
  onClose,
  farmId,
  farmName,
  farmLocation,
  farmerName,
  farmerInitials,
  farmerColor,
}: StartCropCycleModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    productName: '',
    cropCategory: '',
    variety: '',
    description: '',
    isOrganic: false,
    plantingDate: '',
    expectedHarvest: '',
    growingSeason: '',
    hectaresPlanted: '',
    unit: 'Hectares',
    fieldIdentifiers: '',
  })

  const handleFieldChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      productName: '', cropCategory: '', variety: '', description: '', isOrganic: false,
      plantingDate: '', expectedHarvest: '', growingSeason: '',
      hectaresPlanted: '', unit: 'Hectares', fieldIdentifiers: '',
    })
    onClose()
  }

  const queryClient = useQueryClient()
  const { mutate: createCropCycle, isPending } = usePostFarmsIdCropCycles({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/farms/${farmId}`] })
        toast.success('Crop cycle started successfully')
        handleClose()
      },
      onError: (err: any) => {
        console.error('Failed to create crop cycle', err)
        toast.error(err.response?.data?.message || 'Failed to create crop cycle')
      }
    }
  })

  const handleSubmit = () => {
    if (!farmId) {
      toast.error('Farm ID is missing, cannot create crop cycle.')
      return
    }
    createCropCycle({
      id: farmId,
      data: {
        cropName: formData.productName,
        variety: formData.variety || undefined,
        season: formData.growingSeason || undefined,
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvestDate: formData.expectedHarvest ? new Date(formData.expectedHarvest).toISOString() : undefined,
        areaPlantedHectares: formData.hectaresPlanted ? parseFloat(formData.hectaresPlanted) : undefined,
      }
    })
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden outline-none duration-200 sm:max-w-xl"
        showCloseButton={false}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between p-6 pb-3">
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold text-brand">Start New Crop Cycle</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">Create a new crop cycle for {farmName}</DialogDescription>
            </div>
            <button onClick={handleClose} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </DialogHeader>

          {/* Farm Info */}
          <div className="mx-6 mb-4 flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Farm</p>
              <p className="text-sm font-semibold text-gray-900">{farmName}</p>
              <p className="text-xs text-gray-500">{farmLocation}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-full text-[9px] font-bold text-white bg-brand" >
                {farmerInitials}
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Farmer</p>
                <p className="text-sm font-medium text-gray-900">{farmerName}</p>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="px-6">
            <StepIndicator currentStep={step} />
          </div>

          {/* ─── Step 1: Crop Details ─────────────────────── */}
          {step === 1 && (
            <div className="space-y-4 px-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Product Name <span className="text-red-500">*</span></label>
                <Input placeholder="e.g., Maize, Rice, Tomatoes" value={formData.productName}
                  onChange={(e) => handleFieldChange('productName', e.target.value)}
                  className="py-5" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Crop Category <span className="text-red-500">*</span></label>
                <Select value={formData.cropCategory} onValueChange={(val) => handleFieldChange('cropCategory', val || '')}>
                  <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cereals">Cereals</SelectItem>
                    <SelectItem value="Legumes">Legumes</SelectItem>
                    <SelectItem value="Vegetables">Vegetables</SelectItem>
                    <SelectItem value="Fruits">Fruits</SelectItem>
                    <SelectItem value="Tubers">Tubers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Variety (Optional)</label>
                <Input placeholder="e.g., Yellow Maize, Basmati Rice" value={formData.variety}
                  onChange={(e) => handleFieldChange('variety', e.target.value)}
                  className="py-5" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Description (Optional)</label>
                <Textarea placeholder="Additional notes about this crop cycle" value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)} rows={3}
                  className="resize-none" />
              </div>
              {/* Organic toggle */}
              <div className="flex items-center justify-between rounded-md border border-brand-lighter bg-brand-surface px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-brand-surface">
                    <svg className="size-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Organic Farming</p>
                    <p className="text-xs text-gray-500">This crop will be grown using organic practices</p>
                  </div>
                </div>
                <button
                  onClick={() => handleFieldChange('isOrganic', !formData.isOrganic)}
                  className={cn('relative h-6 w-11 rounded-full transition-colors', formData.isOrganic ? 'bg-brand' : 'bg-gray-300')}
                >
                  <span className={cn('absolute top-0.5 block size-5 rounded-full bg-white shadow transition-transform', formData.isOrganic ? 'translate-x-5.5' : 'translate-x-0.5')} />
                </button>
              </div>
            </div>
          )}

          {/* ─── Step 2: Planting Schedule ────────────────── */}
          {step === 2 && (
            <div className="space-y-4 px-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Planting Date <span className="text-red-500">*</span></label>
                <DatePicker 
                  value={formData.plantingDate} 
                  onChange={(val) => handleFieldChange('plantingDate', val)}
                  placeholder="Select planting date"
                  className="py-5 h-auto text-gray-500 font-normal"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Expected Harvest Date (Optional)</label>
                <DatePicker 
                  value={formData.expectedHarvest} 
                  onChange={(val) => handleFieldChange('expectedHarvest', val)}
                  placeholder="Select expected harvest date"
                  className="py-5 h-auto text-gray-500 font-normal"
                />
                <p className="mt-1 text-xs text-gray-400">Estimated date when the crop will be ready for harvest</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Growing Season (Optional)</label>
                <Select value={formData.growingSeason} onValueChange={(val) => handleFieldChange('growingSeason', val || '')}>
                  <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry_2025">Dry 2025</SelectItem>
                    <SelectItem value="wet_2025">Wet 2025</SelectItem>
                    <SelectItem value="dry_2026">Dry 2026</SelectItem>
                    <SelectItem value="wet_2026">Wet 2026</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-xs text-gray-400">The growing season for this crop cycle</p>
              </div>
            </div>
          )}

          {/* ─── Step 3: Area & Location ──────────────────── */}
          {step === 3 && (
            <div className="space-y-4 px-6">
              {/* Info banner */}
              <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2.5">
                <p className="text-xs text-blue-800">
                  <svg className="mr-1 inline-block size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                  Area pre-filled from farm size. You can adjust if planting a smaller area.
                </p>
              </div>

              {/* Draw on Map */}
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 py-6 text-gray-700">
                <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Draw Area on Map
              </Button>
              <p className="text-center text-xs text-gray-400">or enter manually</p>

              {/* Hectares + Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">Hectares Planted <span className="text-red-500">*</span></label>
                  <Input type="text" value={formData.hectaresPlanted} onChange={(e) => handleFieldChange('hectaresPlanted', e.target.value)}
                    className="py-5" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">Unit</label>
                  <Select value={formData.unit} onValueChange={(val) => handleFieldChange('unit', val || '')}>
                    <SelectTrigger className="w-full py-5 text-gray-900 font-normal">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hectares">Hectares</SelectItem>
                      <SelectItem value="Acres">Acres</SelectItem>
                      <SelectItem value="Square Meters">Square Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Field Identifiers */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Field Identifiers (Optional)</label>
                <Input placeholder="e.g., Plot A, Block 3, North Field" value={formData.fieldIdentifiers}
                  onChange={(e) => handleFieldChange('fieldIdentifiers', e.target.value)}
                  className="py-5" />
                <p className="mt-1 text-xs text-gray-400">Separate multiple identifiers with commas</p>
              </div>

              {/* Summary */}
              <div className="rounded-md border border-gray-200 p-4">
                <h4 className="mb-3 text-sm font-semibold text-gray-900">Summary</h4>
                <div className="space-y-2 text-sm">
                  {[
                    ['Product:', formData.productName || '—'],
                    ['Category:', formData.cropCategory || '—'],
                    ['Variety:', formData.variety || '—'],
                    ['Planting Date:', formData.plantingDate ? new Date(formData.plantingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'],
                    ['Expected Harvest:', formData.expectedHarvest ? new Date(formData.expectedHarvest).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'],
                    ['Season:', formData.growingSeason ? formData.growingSeason.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—'],
                    ['Area Planted:', formData.hectaresPlanted ? `${formData.hectaresPlanted} ${formData.unit.toLowerCase()}` : '—'],
                    ['Farming Method:', formData.isOrganic ? 'Organic' : 'Conventional'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-6">
            <Button variant="ghost" onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
              Back
            </Button>
            <Button 
              onClick={() => {
                if (step < 3) setStep(step + 1)
                else handleSubmit()
              }}
              disabled={isPending}
              className="flex items-center gap-1.5 bg-brand text-white hover:bg-brand-dark px-5"
            >
              {isPending ? 'Creating...' : step < 3 ? 'Next' : 'Create Crop Cycle'}
              {step < 3 && !isPending && <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
