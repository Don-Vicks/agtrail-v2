import { Link } from 'react-router'
import type { Farm } from '~/lib/api/generated/models'

// Accept both the API Farm type and any additional mock-data shape
type FarmLike = Farm | (Record<string, any> & { id: string; name: string })

interface FarmCardProps {
  farm: FarmLike
  action?: 'view' | 'start-cycle'
  onAction?: (farmId: string) => void
  basePath?: string
  ownerName?: string
}

export function FarmCard({ farm, action = 'view', onAction, basePath = '/farmer/farms', ownerName }: FarmCardProps) {
  // Normalise fields — supports both API Farm and legacy mock shapes
  const location = (farm as any).state || (farm as any).lga || (farm as any).region || (farm as any).location || (farm as any).address || 'No location'
  const hectares = (farm as any).sizeHectares ?? (farm as any).hectares ?? (farm as any).totalArea ?? 0

  const ownerSource = ownerName ?? (farm as any).contactEmail ?? (farm as any).owner ?? 'Unknown'
  const ownerLabel = typeof ownerSource === 'string' ? ownerSource : String(ownerSource)
  const ownerInitialsSource = (farm as any).ownerInitials
  const ownerInitials = (typeof ownerInitialsSource === 'string' && ownerInitialsSource.trim() ? ownerInitialsSource : ownerLabel)
    .split(/[@.\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s: string) => s[0]?.toUpperCase())
    .join('')

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-md bg-brand-dark text-white">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="rounded-full border border-brand-accent/30 px-2.5 py-0.5 text-xs font-medium text-brand-accent">
          {hectares} Hectares
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{farm.name}</h3>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white bg-brand">
            {ownerInitials || '?'}
          </div>
          <span className="text-xs text-gray-500 truncate">{ownerLabel}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span className="truncate">{location}</span>
          <span className="text-brand">→</span>
        </div>
      </div>

      {/* Action Button */}
      {action === 'view' ? (
        <Link
          to={`${basePath}/${farm.id}`}
          className="mt-auto flex items-center justify-center rounded-md border border-brand px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Farm
        </Link>
      ) : (
        <button
          onClick={() => onAction?.(farm.id)}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors"
        >
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Start Crop Cycle
        </button>
      )}
    </div>
  )
}
