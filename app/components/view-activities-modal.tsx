import {
  CircleDollarSign,
  FlaskConical,
  Loader2,
  Ruler,
  Sprout,
  Sun,
  Tractor,
  User,
  Wheat
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useGetFarmsCropCyclesIdOperations as useGetCropCylesOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import type { CropCycle } from '~/lib/api/generated/models'

interface ViewActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  cropCycle: (CropCycle & Record<string, any>) | null
}

interface Activity {
  id: string
  title: string
  date: string
  description?: string
  operator?: string
  area?: string
  weather?: string
  cost?: string
  iconType: 'land-prep' | 'planting' | 'fertilizer' | 'harvesting'
}

const activityIconMap: Record<Activity['iconType'], React.ElementType> = {
  'land-prep': Tractor,
  planting: Sprout,
  fertilizer: FlaskConical,
  harvesting: Wheat,
}

export function ViewActivitiesModal({ isOpen, onClose, cropCycle }: ViewActivitiesModalProps) {
  const cropCycleId = cropCycle?.id ?? ''
  const {
    data: operationsResponse,
    isLoading,
    isError,
  } = useGetCropCylesOperations(cropCycleId, {
    query: { enabled: isOpen && !!cropCycleId },
  })

  const operations = Array.isArray(operationsResponse?.data?.data)
    ? operationsResponse.data.data
    : []

  const formatOperationType = (value: string) =>
    value
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const getIconType = (operationType: string): Activity['iconType'] => {
    if (operationType.includes('plant')) return 'planting'
    if (operationType.includes('fertilizer')) return 'fertilizer'
    if (operationType.includes('harvest')) return 'harvesting'
    return 'land-prep'
  }

  const mappedActivities: Activity[] = operations.map((op: any) => ({
    id: op.id,
    title: formatOperationType(op.operationType || 'other'),
    date: op.operationDate
      ? new Date(op.operationDate).toLocaleDateString()
      : 'N/A',
    description: op.description || op.notes || undefined,
    operator: op.performedBy || undefined,
    area:
      op.inputQuantity && op.inputUnit
        ? `${op.inputQuantity} ${op.inputUnit}`
        : undefined,
    weather: op.weatherConditions || undefined,
    cost:
      typeof op.costIncurred === 'number'
        ? `₦${op.costIncurred.toLocaleString()}`
        : undefined,
    iconType: getIconType(op.operationType || ''),
  }))

  if (!isOpen || !cropCycle) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        showCloseButton={false}
        className="fixed top-0 right-0 bottom-0 left-auto m-0 h-full w-full max-w-md translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-l bg-white p-0 shadow-2xl duration-300 outline-none flex data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md"
      >
        {/* Header Section */}
        <DialogHeader className="flex flex-row items-start bg-white z-10 p-6 shrink-0 relative border-b border-gray-100 space-y-0 text-left">
          <div className="flex-1 space-y-4">
            <DialogTitle className="text-lg font-bold text-brand-dark">Crop Cycle Activities</DialogTitle>
            <DialogDescription className="space-y-1">
              <p className="font-semibold text-gray-900 text-sm">
                {cropCycle.cropName || (cropCycle as { productName?: string }).productName || 'Crop'}
                {cropCycle.variety ? (
                  <span className="text-gray-500 font-normal"> ({cropCycle.variety})</span>
                ) : null}
              </p>
              <p className="text-gray-600 text-sm">{cropCycle.farmName}</p>
              <p className="text-gray-400 text-xs mt-1">
                Planted: {cropCycle.plantedDate || 'Not specified'}
              </p>
            </DialogDescription>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full p-1.5 transition-colors"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>

        {/* Timeline Scrollable Section */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 mt-2 relative">
          <div className="space-y-6 relative">

            {/* Vertical Connecting Line */}
            <div className="absolute left-[17px] top-4 bottom-8 w-px bg-gray-200" />

            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Loading activities...</span>
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-md border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                Failed to load activity log. Please try again.
              </div>
            )}

            {!isLoading && !isError && mappedActivities.length === 0 && (
              <div className="rounded-md border border-gray-100 bg-gray-50 p-6 text-center">
                <p className="text-sm font-medium text-gray-600">No activities recorded yet.</p>
                <p className="mt-1 text-xs text-gray-400">Record an operation to see it here.</p>
              </div>
            )}

            {!isLoading && !isError && mappedActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">

                {/* Timeline Node Icon */}
                <div className="relative z-10 flex size-9 items-center justify-center shrink-0 rounded-full bg-brand text-white shadow-sm ring-4 ring-white">
                  {(() => {
                    const IconComponent = activityIconMap[activity.iconType]
                    return IconComponent ? <IconComponent size={16} strokeWidth={2.5} /> : null
                  })()}
                </div>

                {/* Activity Card */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">

                    {/* Card Header: Title & Date */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{activity.title}</h4>
                      <span className="text-gray-500 text-xs shrink-0">{activity.date}</span>
                    </div>

                    {/* Optional Description */}
                    {activity.description && (
                      <p className="text-gray-700 text-sm mb-3">
                        {activity.description}
                      </p>
                    )}

                    {/* Metadata Grid (Operator, Area, Weather, Cost) */}
                    <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-600 mt-2">
                      {activity.operator && (
                        <div className="flex items-center gap-1.5">
                          <User size={14} className="text-brand-light" />
                          <span className="text-gray-400 shrink-0">Operator:</span>
                          <span className="truncate">{activity.operator}</span>
                        </div>
                      )}

                      {activity.area && (
                        <div className="flex items-center gap-1.5">
                          <Ruler size={14} className="text-brand-light" />
                          <span className="text-gray-400 shrink-0">Area:</span>
                          <span className="truncate">{activity.area}</span>
                        </div>
                      )}

                      {activity.weather && (
                        <div className="flex items-center gap-1.5">
                          <Sun size={14} className="text-brand-light" />
                          <span className="text-gray-400 shrink-0">Weather:</span>
                          <span className="truncate">{activity.weather}</span>
                        </div>
                      )}

                      {activity.cost && (
                        <div className="flex items-center gap-1.5">
                          <CircleDollarSign size={14} className="text-yellow-600" />
                          <span className="text-gray-400 shrink-0">Cost:</span>
                          <span className="truncate font-medium">{activity.cost}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
