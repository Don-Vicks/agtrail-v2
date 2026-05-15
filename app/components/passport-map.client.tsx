import { GoogleMap, InfoWindow, Polygon, useJsApiLoader } from '@react-google-maps/api'
import { MapPin } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_MAP_ID, getGoogleMapsApiKey, NIGERIA_ROUGH_CENTER } from '~/lib/google-maps'

const loaderId = 'argolinking-google-maps'
const libraries: any[] = ['marker']

interface PassportMapProps {
  gpsCoordinates?: any
  boundaries?: any
  farmName?: string
  farmLocation?: string
  className?: string
}

const polygonOptions = {
  fillColor: '#10b981',
  fillOpacity: 0.15,
  strokeColor: '#10b981',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  clickable: false,
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
      const pinElement = new google.maps.marker.PinElement({
        background: '#10b981',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        scale: 1.1,
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

function PassportMapLoaded({ gpsCoordinates, boundaries, farmName, farmLocation, className, apiKey }: PassportMapProps & { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: loaderId,
    googleMapsApiKey: apiKey,
    libraries,
  })
  const [showInfo, setShowInfo] = useState(true)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const center = useMemo(() => {
    if (!gpsCoordinates) return NIGERIA_ROUGH_CENTER
    if (gpsCoordinates.type === 'Point' && Array.isArray(gpsCoordinates.coordinates)) {
      return { lat: gpsCoordinates.coordinates[1], lng: gpsCoordinates.coordinates[0] }
    }
    if (typeof gpsCoordinates === 'string') {
      const [lat, lng] = gpsCoordinates.split(',').map(v => parseFloat(v.trim()))
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
    }
    return NIGERIA_ROUGH_CENTER
  }, [gpsCoordinates])

  const polygonPaths = useMemo(() => {
    if (!boundaries || boundaries.type !== 'Polygon' || !Array.isArray(boundaries.coordinates)) return null
    return boundaries.coordinates[0].map((coord: any) => ({
      lat: coord[1],
      lng: coord[0]
    }))
  }, [boundaries])

  const mapOptions = useMemo(
    () => ({
      mapTypeId: 'satellite' as const,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      zoomControl: false,
      mapId: DEFAULT_MAP_ID,
      styles: [
        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#ffffff' }] }
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

  if (loadError) return <div className={`flex h-full items-center justify-center bg-red-900/10 text-xs text-red-400 ${className}`}>Map error</div>
  if (!isLoaded) return <div className={`flex h-full items-center justify-center bg-[#0e1f14] text-xs text-white/20 ${className}`}>Loading...</div>

  return (
    <div className={`w-full h-full relative ${className}`}>

      {/* Top Left Overlay Card */}
      <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
        <div className="bg-[#050f08]/80 backdrop-blur-md border border-white/10 rounded-md p-3 shadow-xl max-w-[160px]">
          <div className="flex items-center gap-2 mb-2">
            <div className="size-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_#10b981]" />
            <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Verified Origin</span>
          </div>
          <h4 className="text-[11px] font-black text-white uppercase truncate">{farmName ?? 'Primary Site'}</h4>
          <p className="text-[9px] text-white/40 mt-0.5">{farmLocation}</p>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={19}
        onLoad={onMapLoad}
        options={mapOptions}
      >
        {polygonPaths && <Polygon paths={polygonPaths} options={polygonOptions} />}

        <AdvancedMarker
          map={map}
          position={center}
          onClick={() => setShowInfo(true)}
          title={farmName}
        />

        {showInfo && (
          <InfoWindow position={center} onCloseClick={() => setShowInfo(false)}>
            <div className="p-2 min-w-[140px] text-black">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="size-3 text-[#10b981]" />
                <h3 className="text-[10px] font-black uppercase">{farmName}</h3>
              </div>
              <p className="text-[8px] text-gray-500 font-bold mb-1 uppercase">{farmLocation}</p>
              <div className="bg-[#10b981]/5 p-1.5 rounded border border-[#10b981]/10">
                <div className="flex justify-between text-[8px]">
                  <span className="text-gray-400">SOURCE:</span>
                  <span className="font-bold text-[#10b981]">BLOCKCHAIN</span>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-md" />
    </div>
  )
}

export function PassportMap(props: PassportMapProps) {
  const apiKey = getGoogleMapsApiKey()
  if (!apiKey) return <div className={`flex h-full items-center justify-center bg-[#0e1f14] px-6 text-center text-[10px] text-white/40 ${props.className}`}>API key required</div>
  return <PassportMapLoaded {...props} apiKey={apiKey} />
}

