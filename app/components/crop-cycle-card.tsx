import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { CropCycle } from '~/lib/api/generated/models'
import { cropCycleStatusLabel, cropCycleStatusPillClass } from '~/lib/record-operation-dashboard'

interface CropCycleCardProps {
  cycle: CropCycle
  farmName: string
  farmLocation?: string
  farmerName?: string
  farmerInitials?: string
  farmerColor?: string
  daysToHarvest?: number | null
  onViewActivities?: () => void
  onRecordOperation?: () => void
  viewActivitiesLink?: string
  recordOperationLink?: string
}

export function CropCycleCard({
  cycle,
  farmName,
  farmLocation,
  farmerName,
  farmerInitials,
  farmerColor = '#2E5A27',
  daysToHarvest: daysToHarvestProp,
  onViewActivities,
  onRecordOperation,
  viewActivitiesLink,
  recordOperationLink,
}: CropCycleCardProps) {
  // Use prop if provided, otherwise calculate
  const daysToHarvest = daysToHarvestProp !== undefined ? daysToHarvestProp : (
    cycle.expectedHarvestDate
      ? Math.max(0, Math.ceil((new Date(cycle.expectedHarvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : null
  )

  const plantedDate = cycle.plantingDate ? new Date(cycle.plantingDate).toLocaleDateString() : null
  const area = (cycle as any).area || (cycle.areaPlanted ? `${cycle.areaPlanted} ${cycle.areaUnit || 'ha'}` : null)
  const productName = cycle.productName || (cycle as any).cropName

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 flex flex-col hover:shadow-md transition-shadow">
      <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cropCycleStatusPillClass(cycle.status)}`}>
          {cropCycleStatusLabel(cycle.status)}
        </span>
        {daysToHarvest !== null && (
          <span className="text-xs text-gray-500 font-medium">{daysToHarvest} days to harvest</span>
        )}
      </div>

      <h4 className="text-base font-semibold text-gray-900">
        {productName}
        {cycle.variety ? <span className="ml-1 text-sm font-normal text-gray-500">({cycle.variety})</span> : null}
      </h4>
      <p className="text-sm text-gray-600 mt-1">{farmName}</p>
      <p className="text-xs text-gray-400 mt-0.5">{farmLocation}</p>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white shadow-inner" style={{ backgroundColor: farmerColor }}>
          {farmerInitials || (farmerName ? farmerName.substring(0, 2).toUpperCase() : 'CF')}
        </div>
        <span className="text-xs text-gray-500">{farmerName}</span>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-500">
        {plantedDate && <p>Planted: <span className="text-gray-900 font-medium float-right">{plantedDate}</span></p>}
        {area && <p>Area: <span className="text-gray-900 font-medium float-right">{area}</span></p>}
      </div>

      <div className="mt-auto pt-4 space-y-2">
        {viewActivitiesLink ? (
          <Link to={viewActivitiesLink} className="block w-full">
            <Button
              variant="outline"
              className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm h-auto"
            >
              <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              View Activities
            </Button>
          </Link>
        ) : (
          <button
            type="button"
            onClick={onViewActivities}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="size-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
            View Activities
          </button>
        )}

        {recordOperationLink ? (
          <Link to={recordOperationLink} className="block w-full">
            <Button
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#255220] py-2.5 text-xs font-bold text-white hover:bg-[#1a3a16] transition-colors shadow-sm h-auto"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              </svg>
              Record Operation
            </Button>
          </Link>
        ) : onRecordOperation ? (
          <button
            type="button"
            onClick={onRecordOperation}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#255220] py-2.5 text-xs font-bold text-white hover:bg-[#1a3a16] transition-colors shadow-sm"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            </svg>
            Record Operation
          </button>
        ) : (
          <Link to={`/farmer/record-operation?cycleId=${cycle.id}`} className="block w-full">
            <Button
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-[#255220] py-2.5 text-xs font-bold text-white hover:bg-[#1a3a16] transition-colors shadow-sm h-auto"
            >
              <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="8" y="2" width="8" height="4" rx="1" /><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
              </svg>
              Record Operation
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
