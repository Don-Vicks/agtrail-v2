import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import type { CropCycle } from '~/lib/api/generated/models'

interface CropCycleCardProps {
  cycle: CropCycle
  farmName: string
  farmLocation?: string
}

export function CropCycleCard({ cycle, farmName, farmLocation }: CropCycleCardProps) {
  const statusLabel = cycle.status || 'planned'
  const isCompleted = statusLabel === 'harvested' || statusLabel === 'failed' || statusLabel === 'abandoned'

  // Calculate days to harvest
  const daysToHarvest = cycle.expectedHarvestDate
    ? Math.max(0, Math.ceil((new Date(cycle.expectedHarvestDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : undefined

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-3">
      {/* Top row: status + days to harvest */}
      <div className="flex items-center justify-between">
        <span className={`inline-block rounded px-2.5 py-[3px] text-[11px] font-bold tracking-wide ${
          isCompleted ? 'bg-gray-200 text-gray-700' : 'bg-[#2E5A27] text-white'
        }`}>
          {statusLabel}
        </span>
        {daysToHarvest !== undefined && !isCompleted && (
          <span className="text-xs text-gray-500 font-medium">{daysToHarvest} days to harvest</span>
        )}
      </div>

      {/* Crop name + variety */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 leading-tight">
          {cycle.cropName}
          {cycle.variety && <span className="text-sm font-normal text-gray-500 ml-1">({cycle.variety})</span>}
        </h3>
        <p className="text-[13px] text-gray-700 font-medium mt-0.5">{farmName}</p>
        {farmLocation && <p className="text-[12px] text-gray-400">{farmLocation}</p>}
      </div>

      {/* Planted + Area */}
      <div className="flex items-center justify-between text-[12px] text-gray-500">
        <span>
          Planted: <span className="font-semibold text-gray-700">
            {cycle.plantingDate ? new Date(cycle.plantingDate).toLocaleDateString() : '—'}
          </span>
        </span>
        <span>
          Area: <span className="font-semibold text-gray-700">
            {cycle.areaPlantedHectares ? `${cycle.areaPlantedHectares} ha` : '—'}
          </span>
        </span>
      </div>

      {/* Season */}
      {cycle.season && (
        <div className="text-[12px] text-gray-400">Season: {cycle.season}</div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-1">
        <Link to={`/farmer/crop-cycle/${cycle.id}`} className="block">
          <Button
            variant="outline"
            className="w-full h-9 text-xs font-medium text-gray-700 border-gray-200 bg-white hover:bg-gray-50 rounded-lg gap-1.5"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View Activities
          </Button>
        </Link>
        <Link to={`/farmer/record-operation?cycleId=${cycle.id}`} className="block">
          <Button className="w-full h-9 text-xs font-semibold bg-[#2E5A27] hover:bg-[#1e3d1a] text-white border-none rounded-lg shadow-none">
            Record Operation
          </Button>
        </Link>
      </div>
    </div>
  )
}
