import { useCallback, useMemo, useState } from 'react'
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api'
import { getGoogleMapsApiKey, NIGERIA_ROUGH_CENTER } from '~/lib/google-maps'

const loaderId = 'argolinking-google-maps'

interface FarmLocation {
  id: string
  name: string
  location: string
  region: string
  hectares: number
  lat: number
  lng: number
}

interface FarmMapProps {
  farms: FarmLocation[]
  className?: string
}

type FarmId = string

function FarmMapLoaded({ farms, className, apiKey }: FarmMapProps & { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: loaderId,
    googleMapsApiKey: apiKey,
  })
  const [openInfoId, setOpenInfoId] = useState<FarmId | null>(null)

  const center = useMemo(() => {
    if (farms.length === 0) return NIGERIA_ROUGH_CENTER
    const sum = farms.reduce(
      (acc, f) => ({ lat: acc.lat + f.lat, lng: acc.lng + f.lng }),
      { lat: 0, lng: 0 }
    )
    return { lat: sum.lat / farms.length, lng: sum.lng / farms.length }
  }, [farms])

  const mapOptions = useMemo(
    () => ({
      mapTypeId: 'satellite' as const,
      streetViewControl: false,
      mapTypeControl: true,
      fullscreenControl: true,
    }),
    []
  )

  const onMapLoad = useCallback((map: google.maps.Map) => {
    window.setTimeout(() => {
      if (window.google?.maps?.event) {
        window.google.maps.event.trigger(map, 'resize')
      }
    }, 200)
  }, [])

  if (loadError) {
    return (
      <div
        className={`flex h-[300px] items-center justify-center rounded-md border border-gray-200 bg-red-50 text-sm text-red-600 ${className}`}
      >
        Map failed to load. Check VITE_GOOGLE_MAPS_API_KEY and the Maps JavaScript API.
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div
        className={`flex h-[300px] items-center justify-center rounded-md border border-gray-200 bg-gray-100 text-sm text-gray-500 ${className}`}
      >
        Loading map…
      </div>
    )
  }

  return (
    <div className={`overflow-hidden rounded-md border border-gray-200 ${className}`}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px' }}
        center={center}
        zoom={farms.length <= 1 ? 10 : 6}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {farms.map((farm) => (
          <Marker
            key={farm.id}
            position={{ lat: farm.lat, lng: farm.lng }}
            onClick={() => setOpenInfoId(farm.id)}
          >
            {openInfoId === farm.id && (
              <InfoWindow onCloseClick={() => setOpenInfoId(null)}>
                <div className="p-1 min-w-0 max-w-[220px]">
                  <h3 className="text-sm font-semibold">{farm.name}</h3>
                  <p className="text-xs text-gray-600">{farm.location}</p>
                  <p className="text-xs text-gray-600">{farm.region}</p>
                  <p className="text-xs font-medium text-green-600">{farm.hectares} ha</p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  )
}

export function FarmMap({ farms, className = '' }: FarmMapProps) {
  const apiKey = getGoogleMapsApiKey()
  if (!apiKey) {
    return (
      <div
        className={`flex h-[300px] items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-4 text-center text-sm text-amber-900 ${className}`}
      >
        Set <code className="mx-0.5 rounded bg-amber-100 px-1 font-mono text-xs">VITE_GOOGLE_MAPS_API_KEY</code> in
        your environment to show the map.
      </div>
    )
  }
  return <FarmMapLoaded farms={farms} className={className} apiKey={apiKey} />
}
