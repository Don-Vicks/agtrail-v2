import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CropCycle } from '~/lib/mock-data/farmer'

interface ViewActivitiesModalProps {
  isOpen: boolean
  onClose: () => void
  cropCycle: CropCycle | null
}

// Mock Activity Data (will be replaced by API calls later)
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

const mockActivities: Activity[] = [
  {
    id: 'act-1',
    title: 'Land_preparation',
    date: '2/13/2026',
    description: 'Got Tractors from Hello Tractor',
    operator: 'Fashola',
    area: '25 ha',
    weather: 'sunny',
    cost: '$99999.92',
    iconType: 'land-prep',
  },
  {
    id: 'act-2',
    title: 'Planting',
    date: '2/13/2026',
    description: 'xfagffikmdfinkcrr',
    operator: 'Fashola',
    area: '24.94 ha',
    weather: 'sunny',
    cost: '$49999.95',
    iconType: 'planting',
  },
  {
    id: 'act-3',
    title: 'Fertilizing',
    date: '2/13/2026',
    description: 'hgdfhgkjed',
    operator: 'Fashola',
    area: '25 ha',
    weather: 'sunny',
    cost: '$2999999.95',
    iconType: 'fertilizer',
  },
  {
    id: 'act-4',
    title: 'Harvesting',
    date: '2/13/2026',
    description: 'dgvkjlwejdygjhe',
    operator: 'Fashola',
    area: '50.87 ha',
    weather: 'sunny',
    cost: '$149999.97',
    iconType: 'harvesting',
  },
]

const activityIconMap: Record<Activity['iconType'], string> = {
  'land-prep': '📋',
  planting: '🌱',
  fertilizer: '📋',
  harvesting: '🌾',
}

export function ViewActivitiesModal({ isOpen, onClose, cropCycle }: ViewActivitiesModalProps) {
  const [mounted, setMounted] = useState(false)

  // Wait until mounted to avoid hydration errors with portals
  useEffect(() => {
    setMounted(true)
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  if (!mounted || !isOpen || !cropCycle) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header Section */}
        <div className="flex items-start bg-white z-10 p-6 flex-shrink-0 relative">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-brand-dark mb-4">Crop Cycle Activities</h2>
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 text-sm">
                {cropCycle.productName} <span className="text-gray-500 font-normal">({cropCycle.variety})</span>
              </p>
              <p className="text-gray-600 text-sm">{cropCycle.farmName}</p>
              <p className="text-gray-400 text-xs mt-1">
                Planted: {cropCycle.plantedDate || 'Not specified'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full p-1.5 transition-colors"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timeline Scrollable Section */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 mt-2 relative">
          <div className="space-y-6 relative">

            {/* Vertical Connecting Line */}
            <div className="absolute left-[17px] top-4 bottom-8 w-px bg-gray-200" />

            {mockActivities.map((activity) => (
              <div key={activity.id} className="flex gap-4 group">

                {/* Timeline Node Icon */}
                <div className="relative z-10 flex size-9 items-center justify-center shrink-0 rounded-full bg-brand text-white shadow-sm ring-4 ring-white">
                  <span className="text-sm">{activityIconMap[activity.iconType]}</span>
                </div>

                {/* Activity Card */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">

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
                    <div className="grid grid-cols-1 gap-1.5 text-xs text-gray-600">
                      {activity.operator && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-light">👤</span>
                          <span className="text-gray-400 shrink-0">Operator:</span>
                          <span className="truncate">{activity.operator}</span>
                        </div>
                      )}

                      {activity.area && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-light">📏</span>
                          <span className="text-gray-400 shrink-0">Area:</span>
                          <span className="truncate">{activity.area}</span>
                        </div>
                      )}

                      {activity.weather && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-brand-light">🌤️</span>
                          <span className="text-gray-400 shrink-0">Weather:</span>
                          <span className="truncate">{activity.weather}</span>
                        </div>
                      )}

                      {activity.cost && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-yellow-600">💰</span>
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

      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
