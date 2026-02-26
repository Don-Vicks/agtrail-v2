import { Link } from 'react-router'
import type { Farm } from '~/lib/mock-data/farmer'

interface FarmCardProps {
  farm: Farm
}

export function FarmCard({ farm }: FarmCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl bg-brand-dark text-white">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span className="rounded-full border border-brand-accent/30 bg-brand-accent-surface px-2.5 py-0.5 text-xs font-medium text-brand-accent">
          {farm.hectares} Hectares
        </span>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-base font-semibold text-gray-900 mb-1">{farm.name}</h3>
        <div className="flex items-center gap-1.5 mb-1">
          <div
            className="flex size-5 items-center justify-center rounded-full text-[8px] font-bold text-white"
            style={{ backgroundColor: farm.ownerColor }}
          >
            {farm.ownerInitials}
          </div>
          <span className="text-xs text-gray-500">{farm.owner}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span className="truncate">{farm.location || 'No location'}</span>
          <span>→</span>
        </div>
      </div>

      {/* View Farm Button */}
      <Link
        to={`/farmer/farms/${farm.id}`}
        className="mt-auto flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        View Farm
      </Link>
    </div>
  )
}
