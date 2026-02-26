import { useNavigate } from 'react-router'
import type { CropCycle } from '~/lib/mock-data/farmer'
import { operationTypes } from '~/lib/mock-data/farmer'

interface SelectOperationModalProps {
  isOpen: boolean
  onClose: () => void
  cropCycle: CropCycle | null
}

export function SelectOperationModal({ isOpen, onClose, cropCycle }: SelectOperationModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !cropCycle) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Select Operation Type</h2>
            <p className="mt-0.5 text-sm text-gray-500">Choose the type of farm operation you want to record</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Crop Cycle Info */}
        <div className="mx-6 mb-5 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Crop Cycle</p>
              <p className="text-sm font-semibold text-gray-900">
                {cropCycle.productName}
                {cropCycle.variety && <span className="ml-1 font-normal text-gray-500">({cropCycle.variety})</span>}
              </p>
              <p className="text-xs text-gray-500">Planted: {cropCycle.plantedDate || 'Not set'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Farm</p>
              <p className="text-sm font-medium text-gray-900">{cropCycle.farmName}</p>
              <p className="text-xs text-gray-500">{cropCycle.farmLocation}</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 border-t border-gray-200 pt-3">
            <div
              className="flex size-7 items-center justify-center rounded-full text-[9px] font-bold text-white"
              style={{ backgroundColor: cropCycle.farmerColor }}
            >
              {cropCycle.farmerInitials}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Farmer</p>
              <p className="text-sm font-medium text-gray-900">{cropCycle.farmer}</p>
            </div>
          </div>
        </div>

        {/* Operation Types Grid */}
        <div className="grid grid-cols-2 gap-3 px-6">
          {operationTypes.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                onClose()
                navigate(`/farmer/operations/new/${cropCycle.id}/${op.id}`)
              }}
              className="group flex items-start gap-3 rounded-xl border border-gray-200 p-4 text-left transition-all hover:border-brand-light hover:shadow-sm"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ backgroundColor: op.color }}
              >
                {op.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 group-hover:text-brand">{op.name}</p>
                <p className="text-xs text-gray-500">{op.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 pt-5">
          <button onClick={onClose} className="rounded-lg border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
