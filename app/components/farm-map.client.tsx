import { useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { GoogleMap, InfoWindow, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { getGoogleMapsApiKey, NIGERIA_ROUGH_CENTER, DEFAULT_MAP_ID } from '~/lib/google-maps'
import { MapPin, Maximize2 } from 'lucide-react'

const loaderId = 'argolinking-google-maps'
const libraries: ("marker" | "drawing" | "geometry" | "localContext" | "places" | "visualization")[] = ['marker']

interface FarmLocation {
  id: string
  name: string
  location: string
  region: string
  hectares: number
  lat: number
  lng: number
  boundary?: { lat: number; lng: number }[]
}

interface FarmMapProps {
  farms: FarmLocation[]
  className?: string
}

type FarmId = string

const polygonOptions = {
  fillColor: '#2e7d32',
  fillOpacity: 0.15,
  strokeColor: '#2e7d32',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}

function AdvancedMarker({ map, position, onClick, title }: { 
  map?: google.maps.Map | null, 
  position: google.maps.LatLngLiteral, 
  onClick?: () => void,
  title?: string
}) {
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  useEffect(() => {
    if (!map || !google.maps.marker?.AdvancedMarkerElement) return;

    if (!markerRef.current) {
      // Create a custom pin element
      const pinElement = new google.maps.marker.PinElement({
        background: '#2e7d32',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        scale: 1.2,
      });

      markerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        title,
        content: pinElement.element,
      });

      if (onClick) {
        markerRef.current.addListener('click', onClick);
      }
    } else {
      markerRef.current.position = position;
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.map = null;
        markerRef.current = null;
      }
    };
  }, [map, position, title, onClick]);

  return null;
}

function FarmMapLoaded({ farms, className, apiKey }: FarmMapProps & { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: loaderId,
    googleMapsApiKey: apiKey,
    libraries,
  })
  const [openInfoId, setOpenInfoId] = useState<FarmId | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const totalHectares = useMemo(() => farms.reduce((acc, f) => acc + f.hectares, 0), [farms])

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
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: true,
      mapId: DEFAULT_MAP_ID,
      styles: [
        {
          featureType: 'all',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#ffffff' }]
        }
      ]
    }),
    []
  )

  const onMapLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance)
    window.setTimeout(() => {
      if (window.google?.maps?.event) {
        window.google.maps.event.trigger(mapInstance, 'resize')
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
    <div className={`overflow-hidden rounded-md border border-gray-200 relative ${className}`}>
      {/* Boundary Stats Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-md p-2 shadow-sm min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="size-1.5 rounded-full bg-[#2e7d32]" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Total Area</span>
          </div>
          <p className="text-sm font-black text-[#1a4332]">{totalHectares.toFixed(2)} Ha</p>
        </div>
        <div className="bg-white/95 backdrop-blur-sm border border-gray-100 rounded-md p-2 shadow-sm min-w-[120px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="size-1.5 rounded-full bg-blue-500" />
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Plots</span>
          </div>
          <p className="text-sm font-black text-gray-900">{farms.length} Farm Plots</p>
        </div>
      </div>

      {/* Map Action Overlay */}
      <div className="absolute top-3 right-3 z-10">
        <button className="bg-white/90 hover:bg-white p-2 rounded-md shadow-sm border border-gray-100 transition-colors">
          <Maximize2 className="size-3.5 text-gray-600" />
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '300px' }}
        center={center}
        zoom={farms.length <= 1 ? 14 : 11}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {farms.map((farm) => (
          <div key={farm.id}>
            {farm.boundary && (
              <Polygon
                paths={farm.boundary}
                options={polygonOptions}
              />
            )}
            <AdvancedMarker
              map={map}
              position={{ lat: farm.lat, lng: farm.lng }}
              onClick={() => setOpenInfoId(farm.id)}
              title={farm.name}
            />
            {openInfoId === farm.id && (
              <InfoWindow 
                position={{ lat: farm.lat, lng: farm.lng }}
                onCloseClick={() => setOpenInfoId(null)}
              >
                <div className="p-1 min-w-0 max-w-[220px]">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="size-3 text-[#2e7d32]" />
                    <h3 className="text-sm font-extrabold text-[#1a4332]">{farm.name}</h3>
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">{farm.location}</p>
                  <div className="bg-gray-50 p-2 rounded border border-gray-100">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400 font-bold uppercase">Size</span>
                      <span className="font-extrabold text-[#2e7d32]">{farm.hectares} Ha</span>
                    </div>
                  </div>
                </div>
              </InfoWindow>
            )}
          </div>
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
