import { useCallback, useMemo } from 'react'
import { GoogleMap, Marker, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { cn } from '~/lib/utils'
import { DEFAULT_FARM_PLOT_CENTER, getGoogleMapsApiKey } from '~/lib/google-maps'

const loaderId = 'argolinking-google-maps'

export type GoogleMapPolygonPickerVariant = 'create-farm' | 'crop'

const variantStyles: Record<
  GoogleMapPolygonPickerVariant,
  { stroke: string; fill: string; fillOpacity: number }
> = {
  'create-farm': {
    stroke: '#4CAF50',
    fill: '#4CAF50',
    fillOpacity: 0.2,
  },
  crop: {
    stroke: '#2E5A27',
    fill: '#2E5A27',
    fillOpacity: 0.2,
  },
}

type PointTuple = [number, number]

function GoogleMapPolygonPickerLoaded({
  apiKey,
  points,
  onAddPoint,
  variant,
  minHeightPx,
  className,
  mapClassName,
  mapCenter,
}: {
  apiKey: string
  points: PointTuple[]
  onAddPoint: (lat: number, lng: number) => void
  variant: GoogleMapPolygonPickerVariant
  minHeightPx: number
  className?: string
  mapClassName?: string
  mapCenter: google.maps.LatLngLiteral
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: loaderId,
    googleMapsApiKey: apiKey,
  })

  const mapOptions = useMemo(
    () => ({
      mapTypeId: 'satellite' as const,
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
    }),
    [],
  )

  const center = mapCenter

  const polygonOpts = useMemo(() => {
    const v = variantStyles[variant]
    return {
      strokeColor: v.stroke,
      fillColor: v.fill,
      fillOpacity: v.fillOpacity,
      strokeWeight: 2,
      clickable: false,
    }
  }, [variant])

  const pathLiteral = useMemo(
    () => points.map(([lat, lng]) => ({ lat, lng })),
    [points]
  )

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onAddPoint(e.latLng.lat(), e.latLng.lng())
    },
    [onAddPoint]
  )

  const onMapLoad = useCallback((map: google.maps.Map) => {
    window.setTimeout(() => {
      const c = map.getCenter()
      if (window.google?.maps?.event) {
        window.google.maps.event.trigger(map, 'resize')
      }
      if (c) map.setCenter(c)
    }, 200)
  }, [])

  if (loadError) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-md bg-red-50 text-sm text-red-600', className)}
        style={{ minHeight: minHeightPx }}
      >
        Map failed to load. Check the API key and Google Cloud Maps JavaScript API.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-md bg-gray-100 text-sm text-gray-400', className)}
        style={{ minHeight: minHeightPx }}
      >
        Loading map…
      </div>
    )
  }

  return (
    <div
      className={cn('h-full w-full overflow-hidden rounded-md', className)}
      style={{ minHeight: minHeightPx }}
    >
      <GoogleMap
        mapContainerClassName={cn('h-full w-full', mapClassName)}
        mapContainerStyle={{ width: '100%', height: '100%', minHeight: minHeightPx }}
        center={center}
        zoom={13}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {points.map((point, idx) => (
          <Marker key={idx} position={{ lat: point[0], lng: point[1] }} />
        ))}
        {points.length >= 3 && <Polygon paths={pathLiteral} options={polygonOpts} />}
      </GoogleMap>
    </div>
  )
}

export function GoogleMapPolygonPicker({
  points,
  onAddPoint,
  variant = 'create-farm',
  minHeightPx = 320,
  className,
  mapClassName,
  mapCenter,
}: {
  points: PointTuple[]
  onAddPoint: (lat: number, lng: number) => void
  variant?: GoogleMapPolygonPickerVariant
  minHeightPx?: number
  className?: string
  mapClassName?: string
  /** When omitted, uses the app default plot center (Nigeria). */
  mapCenter?: google.maps.LatLngLiteral
}) {
  const apiKey = getGoogleMapsApiKey()
  const resolvedCenter = mapCenter ?? DEFAULT_FARM_PLOT_CENTER

  if (!apiKey) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-4 text-center text-sm text-amber-900',
          className
        )}
        style={{ minHeight: minHeightPx }}
      >
        Set <code className="rounded bg-amber-100 px-1 font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> in your
        environment to use the map.
      </div>
    )
  }

  return (
    <GoogleMapPolygonPickerLoaded
      apiKey={apiKey}
      points={points}
      onAddPoint={onAddPoint}
      variant={variant}
      minHeightPx={minHeightPx}
      className={className}
      mapClassName={mapClassName}
      mapCenter={resolvedCenter}
    />
  )
}
