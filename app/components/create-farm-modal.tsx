import { useCallback, useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { usePostFarms } from '~/lib/api/generated/farms/farms'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
    useMap: typeof import('react-leaflet')['useMap']
  } | null>(null)

  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)

  // Load leaflet + react-leaflet dynamically on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    let mounted = true

    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      if (!mounted) return

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
        useMap: RL.useMap,
      })
      setLeafletLoaded(true)
    }).catch(err => {
      console.error('Leaflet load error:', err)
      setLoadError(true)
    })

    return () => { mounted = false }
  }, [])

  if (loadError) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md bg-red-50 text-sm text-red-500">
        Fatal: Map library failed to load.
      </div>
    )
  }

  if (!leafletLoaded || !mapComponents) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400">
        Loading map…
      </div>
    )
  }

  const { MapContainer, TileLayer, Marker, Polygon, useMapEvents, useMap } = mapComponents

  function MapResizeTrigger() {
    const map = useMap()
    useEffect(() => {
      // Small timeout to ensure the DOM has settled (modal transitions)
      const timer = setTimeout(() => {
        map.invalidateSize()
      }, 100)
      return () => clearTimeout(timer)
    }, [map])
    return null
  }

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
      className="h-full w-full rounded-md z-0 min-h-[400px]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapResizeTrigger />
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
                'mt-1.5 text-xs font-medium whitespace-nowrap',
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

  const queryClient = useQueryClient()
  const { mutate: createFarm, isPending } = usePostFarms({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/farms`] })
        toast.success('Farm created successfully')
        handleClose()
      },
      onError: (err: any) => {
        console.error('Failed to create farm:', err)
        toast.error(err.response?.data?.message || 'Failed to create farm')
      }
    }
  })

  const submitFarm = () => {
    let boundaries = null
    let gpsCoordinates = null
    if (boundaryPoints.length >= 3) {
      // GeoJSON expects [lng, lat]
      const closedPoints = [...boundaryPoints]
      const first = closedPoints[0]
      const last = closedPoints[closedPoints.length - 1]
      // Ensure the polygon refers back to the first point
      if (first[0] !== last[0] || first[1] !== last[1]) {
        closedPoints.push(first)
      }
      boundaries = {
        type: 'Polygon',
        coordinates: [closedPoints.map(p => [p[1], p[0]])]
      }
      // Set gpsCoordinates to the first point
      gpsCoordinates = {
        type: 'Point',
        coordinates: [first[1], first[0]]
      }
    }

    createFarm({
      data: {
        name: formData.farmName,
        state: formData.state || undefined,
        lga: formData.lga || undefined,
        region: formData.farmRegion || undefined,
        address: formData.address || undefined,
        boundaries,
        gpsCoordinates,
      }
    })
  }

  if (!isOpen) return null

  const areaSqMeters = calculatePolygonArea(boundaryPoints)
  const areaHectares = areaSqMeters / 10000

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden outline-none duration-200 sm:max-w-xl"
        showCloseButton={false}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between p-6 pb-4">
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold text-brand">
                Create New Farm - Step {step} of 3
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {step === 1 && 'Enter the basic details of your farm'}
                {step === 2 && 'Map your farm boundaries using GPS coordinates'}
                {step === 3 && 'Review your farm information before submitting'}
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          {/* Step Indicator */}
          <StepIndicator currentStep={step} />

          {/* ─── Step 1: Farm Details ─────────────────────── */}
          {step === 1 && (
            <div className="space-y-4 px-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">
                  Farm Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g., Sunshine Farm"
                  value={formData.farmName}
                  onChange={(e) => handleFieldChange('farmName', e.target.value)}
                  className="py-5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">State</label>
                  <Select value={formData.state} onValueChange={(val) => handleFieldChange('state', val || '')}>
                    <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                      <SelectValue placeholder="Select a State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abia">Abia</SelectItem>
                      <SelectItem value="Lagos">Lagos</SelectItem>
                      <SelectItem value="Katsina">Katsina</SelectItem>
                      <SelectItem value="Oyo">Oyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-900">LGA</label>
                  <Select value={formData.lga} onValueChange={(val) => handleFieldChange('lga', val || '')} disabled={!formData.state}>
                    <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                      <SelectValue placeholder="Select a state first" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.state && <SelectItem value="Arochukwu">Arochukwu</SelectItem>}
                      {formData.state && <SelectItem value="Ikeja">Ikeja</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Farm Region</label>
                <Input
                  placeholder="e.g., Ekirin"
                  value={formData.farmRegion}
                  onChange={(e) => handleFieldChange('farmRegion', e.target.value)}
                  className="py-5"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-900">Address</label>
                <Textarea
                  placeholder="Enter the full address of the farm"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {/* ─── Step 2: Map Boundaries ──────────────────── */}
          {step === 2 && (
            <div className="space-y-4 px-6 relative w-full h-full flex flex-col">
              {/* Instructions */}
              <div className="rounded-md bg-[#f0f6ff] p-3">
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
                <div className="rounded-md border border-gray-200 bg-[#f0f6ff] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1e3b8a]">Points</span>
                    <svg className="size-4 text-[#1e3b8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-[#1e3b8a]">{boundaryPoints.length}</p>
                  <p className="text-xs text-gray-500">Add points to map</p>
                </div>
                <div className="rounded-md border border-gray-200 bg-[#e4fded] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1b8341]">Hectares</span>
                    <svg className="size-4 text-[#1b8341]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-[#1b8341]">{areaHectares.toFixed(2)}</p>
                  <p className="text-xs text-gray-400">Estimated area</p>
                </div>
                <div className="rounded-md border border-gray-200 bg-brand-surface/30 p-3">
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
              <div className="overflow-hidden rounded-md border border-gray-200 w-full flex-grow min-h-[400px]">
                <MapBoundaryPicker points={boundaryPoints} onAddPoint={handleAddPoint} />
              </div>

              {/* Point controls */}
              {boundaryPoints.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRemoveLastPoint}
                    className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Undo Last Point
                  </button>
                  <button
                    onClick={handleClearPoints}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
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

              <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-md border border-gray-100 bg-gray-50/50 p-5">
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
              <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span>{' '}
                  Please review all information carefully before creating the farm. You can go back to edit any details.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-6">
            <Button
              variant="outline"
              onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Button>

            <Button
              onClick={() => {
                if (step < 3) setStep(step + 1)
                else submitFarm()
              }}
              disabled={(step === 2 && boundaryPoints.length < 3) || isPending}
              className="flex items-center gap-1.5 bg-brand text-white hover:bg-brand-dark px-5"
            >
              {isPending ? 'Creating...' : step < 3 ? 'Next' : 'Create Farm'}
              {step < 3 && !isPending && (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
