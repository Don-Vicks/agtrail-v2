import { useCallback, useState } from 'react'
import { cn } from '~/lib/utils'

/**
 * Leaflet map component — loaded lazily on the client only (no SSR).
 * We use a dynamic wrapper to avoid importing Leaflet on the server.
 */
function MapBoundaryPicker({
  points,
  onAddPoint,
}: {
  points: [number, number][]
  onAddPoint: (lat: number, lng: number) => void
}) {
  // Lazy-load react-leaflet to avoid SSR issues
  const [mapComponents, setMapComponents] = useState<{
    MapContainer: typeof import('react-leaflet')['MapContainer']
    TileLayer: typeof import('react-leaflet')['TileLayer']
    Marker: typeof import('react-leaflet')['Marker']
    Polygon: typeof import('react-leaflet')['Polygon']
    useMapEvents: typeof import('react-leaflet')['useMapEvents']
  } | null>(null)

  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load leaflet + react-leaflet dynamically on mount
  useState(() => {
    if (typeof window === 'undefined') return

    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      // Inject leaflet CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
        document.head.appendChild(link)
      }

      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Polygon: RL.Polygon,
        useMapEvents: RL.useMapEvents,
      })
      setLeafletLoaded(true)
    })
  })

  if (!leafletLoaded || !mapComponents) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
        Loading map…
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Polygon, useMapEvents } = mapComponents

  function ClickHandler() {
    useMapEvents({
      click(e) {
        onAddPoint(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }

  return (
    <MapContainer
      center={[9.06, 7.49] as [number, number]}
      zoom={13}
      className="h-72 w-full rounded-lg z-0"
      style={{ height: '288px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler />
      {points.map((point, idx) => (
        <Marker key={idx} position={point} />
      ))}
      {points.length >= 3 && (
        <Polygon
          positions={points}
          pathOptions={{ color: '#4CAF50', fillColor: '#4CAF50', fillOpacity: 0.2 }}
        />
      )}
    </MapContainer>
  )
}

// ─── Area calculation utility ──────────────────────────────────────
function calculatePolygonArea(points: [number, number][]): number {
  if (points.length < 3) return 0

  // Shoelace formula on lat/lng (approximate, converts to meters)
  const toRadians = (deg: number) => (deg * Math.PI) / 180
  const R = 6371000 // Earth radius in meters

  let area = 0
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const lat1 = toRadians(points[i][0])
    const lat2 = toRadians(points[j][0])
    const dLng = toRadians(points[j][1] - points[i][1])
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2))
  }

  area = Math.abs((area * R * R) / 2)
  return area
}

// ─── Step Indicator ────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Farm Details' },
    { number: 2, label: 'Map Boundaries' },
    { number: 3, label: 'Review & Confirm' },
  ]

  return (
    <div className="flex items-center justify-center gap-0 px-6 pb-6">
      {steps.map((s, index) => (
        <div key={s.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors',
                currentStep > s.number
                  ? 'bg-brand text-white'
                  : currentStep === s.number
                    ? 'bg-brand text-white'
                    : 'border-2 border-gray-200 text-gray-400'
              )}
            >
              {currentStep > s.number ? (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                s.number
              )}
            </div>
            <span
              className={cn(
                'mt-1.5 text-xs font-medium',
                currentStep >= s.number ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-3 mt-[-18px] h-0.5 w-20',
                currentStep > s.number ? 'bg-brand' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────
interface CreateFarmModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateFarmModal({ isOpen, onClose }: CreateFarmModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    farmName: '',
    state: '',
    lga: '',
    farmRegion: '',
    address: '',
  })
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([])

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddPoint = useCallback((lat: number, lng: number) => {
    setBoundaryPoints((prev) => [...prev, [lat, lng]])
  }, [])

  const handleRemoveLastPoint = () => {
    setBoundaryPoints((prev) => prev.slice(0, -1))
  }

  const handleClearPoints = () => {
    setBoundaryPoints([])
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ farmName: '', state: '', lga: '', farmRegion: '', address: '' })
    setBoundaryPoints([])
    onClose()
  }

  if (!isOpen) return null

  const areaSqMeters = calculatePolygonArea(boundaryPoints)
  const areaHectares = areaSqMeters / 10000

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto',
          step === 2 ? 'max-w-2xl' : 'max-w-lg'
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Create New Farm - Step {step} of 3
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {step === 1 && 'Enter the basic details of your farm'}
              {step === 2 && 'Map your farm boundaries using GPS coordinates'}
              {step === 3 && 'Review your farm information before submitting'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={step} />

        {/* ─── Step 1: Farm Details ─────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 px-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">
                Farm Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Sunshine Farm"
                value={formData.farmName}
                onChange={(e) => handleFieldChange('farmName', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">State</label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="">Select a State</option>
                    <option value="Abia">Abia</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Katsina">Katsina</option>
                    <option value="Oyo">Oyo</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">LGA</label>
                <div className="relative">
                  <select
                    value={formData.lga}
                    onChange={(e) => handleFieldChange('lga', e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-500 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    disabled={!formData.state}
                  >
                    <option value="">Select a state first</option>
                    {formData.state && <option value="Arochukwu">Arochukwu</option>}
                    {formData.state && <option value="Ikeja">Ikeja</option>}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Farm Region</label>
              <input
                type="text"
                placeholder="e.g., Ekirin"
                value={formData.farmRegion}
                onChange={(e) => handleFieldChange('farmRegion', e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-900">Address</label>
              <textarea
                placeholder="Enter the full address of the farm"
                value={formData.address}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          </div>
        )}

        {/* ─── Step 2: Map Boundaries ──────────────────── */}
        {step === 2 && (
          <div className="space-y-4 px-6">
            {/* Instructions */}
            <div className="rounded-lg border border-orange-200 bg-brand-accent-surface p-3">
              <p className="text-sm">
                <span className="font-semibold text-gray-900">Instructions:</span>{' '}
                <span className="text-gray-600">
                  Click on the map to add boundary points. Add at least 3 points to define your farm boundaries.
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-gray-700">
                Points Added: {boundaryPoints.length}
              </p>
            </div>

            {/* Boundary Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">Points</span>
                  <svg className="size-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900">{boundaryPoints.length}</p>
                <p className="text-xs text-gray-400">Add points to map</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">Hectares</span>
                  <svg className="size-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900">{areaHectares.toFixed(2)}</p>
                <p className="text-xs text-gray-400">Estimated area</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-brand-surface/30 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand">Sq. Meters</span>
                  <svg className="size-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                </div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(areaSqMeters)}</p>
                <p className="text-xs text-gray-400">Total area</p>
              </div>
            </div>

            {/* Map */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <MapBoundaryPicker points={boundaryPoints} onAddPoint={handleAddPoint} />
            </div>

            {/* Point controls */}
            {boundaryPoints.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveLastPoint}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Undo Last Point
                </button>
                <button
                  onClick={handleClearPoints}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Clear All Points
                </button>
                <span className="ml-auto text-xs text-gray-400">
                  {boundaryPoints.length < 3
                    ? `Need ${3 - boundaryPoints.length} more point${3 - boundaryPoints.length > 1 ? 's' : ''}`
                    : '✓ Boundary defined'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Review & Confirm ───────────────── */}
        {step === 3 && (
          <div className="space-y-4 px-6">
            <h3 className="text-base font-semibold text-gray-900">Review Farm Information</h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-xl border border-gray-100 bg-gray-50/50 p-5">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Farm Name</p>
                <p className="text-sm font-semibold text-gray-900">{formData.farmName || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">State</p>
                <p className="text-sm font-semibold text-gray-900">{formData.state || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">LGA</p>
                <p className="text-sm font-semibold text-gray-900">{formData.lga || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Farm Region</p>
                <p className="text-sm font-semibold text-gray-900">{formData.farmRegion || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Boundary Points</p>
                <p className="text-sm font-semibold text-gray-900">{boundaryPoints.length} points</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Calculated Area</p>
                <p className="text-sm font-semibold text-brand-light">{areaHectares.toFixed(2)} hectares</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Area (Square Meters)</p>
                <p className="text-sm font-semibold text-gray-900">{Math.round(areaSqMeters)} m²</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Address</p>
                <p className="text-sm font-semibold text-gray-900">{formData.address || '—'}</p>
              </div>
            </div>

            {/* Note */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Note:</span>{' '}
                Please review all information carefully before creating the farm. You can go back to edit any details.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between p-6 pt-6">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
            className={cn(
              'flex items-center gap-1.5 text-sm font-medium transition-colors',
              step === 3
                ? 'rounded-lg border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-50'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <button
            onClick={() => (step < 3 ? setStep(step + 1) : handleClose())}
            disabled={step === 2 && boundaryPoints.length < 3}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors',
              step === 2 && boundaryPoints.length < 3
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-brand text-white hover:bg-brand-dark'
            )}
          >
            {step < 3 ? 'Next' : 'Create Farm'}
            {step < 3 && (
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
