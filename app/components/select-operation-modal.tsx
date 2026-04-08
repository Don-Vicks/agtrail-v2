import {
  BugOff,
  Droplets,
  Factory,
  Filter,
  FlaskConical,
  Leaf,
  Package,
  Scissors,
  Sprout,
  Sun,
  Tractor,
  Warehouse,
  Wheat,
} from 'lucide-react'
import { useNavigate } from 'react-router'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import type { OperationType } from '~/lib/mock-data/farmer'
import type { CropCycle } from '~/lib/api/generated/models'
import { operationTypes } from '~/lib/mock-data/farmer'

const iconMap: Record<string, React.ElementType> = {
  tractor: Tractor,
  sprout: Sprout,
  'flask-conical': FlaskConical,
  droplets: Droplets,
  leaf: Leaf,
  'bug-off': BugOff,
  scissors: Scissors,
  wheat: Wheat,
  filter: Filter,
  sun: Sun,
  factory: Factory,
  package: Package,
  warehouse: Warehouse,
}

interface SelectOperationModalProps {
  isOpen: boolean
  onClose: () => void
  cropCycle: (CropCycle & Record<string, any>) | null
  basePath?: string
}

export function SelectOperationModal({ isOpen, onClose, cropCycle, basePath = '/farmer/operations/new' }: SelectOperationModalProps) {
  const navigate = useNavigate()

  if (!isOpen || !cropCycle) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden outline-none duration-200 sm:max-w-xl"
        showCloseButton={false}
      >
        <div className="max-h-[90vh] overflow-y-auto w-full">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between p-6 pb-3">
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold text-brand">Select Operation Type</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">Choose the type of farm operation you want to record</DialogDescription>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          {/* Crop Cycle Info */}
          <div className="mx-6 mb-5 rounded-md border border-gray-100 bg-gray-50 p-4">
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

          {/* Operation Tabs */}
          <div className="px-6 pb-6">
            <Tabs defaultValue="pre-harvest" className="w-full">
              <TabsList className="mb-4 grid w-full grid-cols-2">
                <TabsTrigger value="pre-harvest">Pre-Harvest</TabsTrigger>
                <TabsTrigger value="post-harvest">Post-Harvest</TabsTrigger>
              </TabsList>

              {/* Pre-Harvest Tab */}
              <TabsContent value="pre-harvest" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {operationTypes.filter((op) => op.category === 'pre-harvest').map((op) => (
                    <OperationCard key={op.id} op={op} />
                  ))}
                </div>
              </TabsContent>

              {/* Post-Harvest Tab */}
              <TabsContent value="post-harvest" className="mt-0">
                <div className="grid grid-cols-2 gap-3">
                  {operationTypes.filter((op) => op.category === 'post-harvest').map((op) => (
                    <OperationCard key={op.id} op={op} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  function OperationCard({ op }: { op: OperationType }) {
    return (
      <button
        onClick={() => {
          onClose()
          navigate(`${basePath}/${cropCycle!.id}/${op.id}`)
        }}
        className="group flex items-start gap-3 rounded-md border border-gray-200 p-4 text-left transition-all hover:border-brand-light hover:shadow-sm"
      >
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-md"
          style={{ backgroundColor: op.color, color: '#333' }}
        >
          {(() => {
            const IconComponent = iconMap[op.icon]
            return IconComponent ? <IconComponent size={18} strokeWidth={2} /> : null
          })()}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 group-hover:text-brand">{op.name}</p>
          <p className="text-xs text-gray-500">{op.description}</p>
        </div>
      </button>
    )
  }
}
