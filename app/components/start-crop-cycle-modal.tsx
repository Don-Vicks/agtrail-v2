import { useState } from 'react'
import { cn } from '~/lib/utils'

interface StartCropCycleModalProps {
  isOpen: boolean
  onClose: () => void
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Start New Crop Cycle</h2>
            <p className="mt-0.5 text-sm text-gray-500">Create a new crop cycle for {farmName}</p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Farm Info */}
        <div className="mx-6 mb-4 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400">Farm</p>
            <p className="text-sm font-semibold text-gray-900">{farmName}</p>
            <p className="text-xs text-gray-500">{farmLocation}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: farmerColor }}>
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
              <input type="text" placeholder="e.g., Maize, Rice, Tomatoes" value={formData.productName}
                onChange={(e) => handleFieldChange('productName', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Crop Category <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={formData.cropCategory} onChange={(e) => handleFieldChange('cropCategory', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                  <option value="">Select category</option>
                  <option value="Cereals">Cereals</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Tubers">Tubers</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Variety (Optional)</label>
              <input type="text" placeholder="e.g., Yellow Maize, Basmati Rice" value={formData.variety}
                onChange={(e) => handleFieldChange('variety', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Description (Optional)</label>
              <textarea placeholder="Additional notes about this crop cycle" value={formData.description}
                onChange={(e) => handleFieldChange('description', e.target.value)} rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
            </div>
            {/* Organic toggle */}
            <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
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
              <div className="relative">
                <input type="date" value={formData.plantingDate} onChange={(e) => handleFieldChange('plantingDate', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Expected Harvest Date (Optional)</label>
              <div className="relative">
                <input type="date" value={formData.expectedHarvest} onChange={(e) => handleFieldChange('expectedHarvest', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <p className="mt-1 text-xs text-gray-400">Estimated date when the crop will be ready for harvest</p>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Growing Season (Optional)</label>
              <div className="relative">
                <select value={formData.growingSeason} onChange={(e) => handleFieldChange('growingSeason', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                  <option value="">Select season</option>
                  <option value="dry_2025">Dry 2025</option>
                  <option value="wet_2025">Wet 2025</option>
                  <option value="dry_2026">Dry 2026</option>
                  <option value="wet_2026">Wet 2026</option>
                </select>
                <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <p className="mt-1 text-xs text-gray-400">The growing season for this crop cycle</p>
            </div>
          </div>
        )}

        {/* ─── Step 3: Area & Location ──────────────────── */}
        {step === 3 && (
          <div className="space-y-4 px-6">
            {/* Info banner */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
              <p className="text-xs text-blue-800">
                <svg className="mr-1 inline-block size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                Area pre-filled from farm size. You can adjust if planting a smaller area.
              </p>
            </div>

            {/* Draw on Map */}
            <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              Draw Area on Map
            </button>
            <p className="text-center text-xs text-gray-400">or enter manually</p>

            {/* Hectares + Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Hectares Planted <span className="text-red-500">*</span></label>
                <input type="text" value={formData.hectaresPlanted} onChange={(e) => handleFieldChange('hectaresPlanted', e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Unit</label>
                <div className="relative">
                  <select value={formData.unit} onChange={(e) => handleFieldChange('unit', e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20">
                    <option value="Hectares">Hectares</option>
                    <option value="Acres">Acres</option>
                    <option value="Square Meters">Square Meters</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Field Identifiers */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Field Identifiers (Optional)</label>
              <input type="text" placeholder="e.g., Plot A, Block 3, North Field" value={formData.fieldIdentifiers}
                onChange={(e) => handleFieldChange('fieldIdentifiers', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20" />
              <p className="mt-1 text-xs text-gray-400">Separate multiple identifiers with commas</p>
            </div>

            {/* Summary */}
            <div className="rounded-xl border border-gray-200 p-4">
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
          <button onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
            Back
          </button>
          <button onClick={() => (step < 3 ? setStep(step + 1) : handleClose())}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-colors">
            {step < 3 ? 'Next' : 'Create Crop Cycle'}
            {step < 3 && <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>}
          </button>
        </div>
      </div>
    </div>
  )
}
