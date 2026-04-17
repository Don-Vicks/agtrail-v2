import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

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

export function FarmMap({ farms, className = '' }: FarmMapProps) {
  // Calculate center point from all farm locations
  const centerLat = farms.reduce((sum, farm) => sum + farm.lat, 0) / farms.length
  const centerLng = farms.reduce((sum, farm) => sum + farm.lng, 0) / farms.length

  return (
    <div className={`rounded-md border border-gray-200 overflow-hidden ${className}`}>
      <MapContainer
        center={[centerLat || 9.0820, centerLng || 8.6753]} // Default to Nigeria center
        zoom={6}
        style={{ height: '300px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='Tiles &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        {farms.map((farm) => (
          <Marker
            key={farm.id}
            position={[farm.lat, farm.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{farm.name}</h3>
                <p className="text-xs text-gray-600">{farm.location}</p>
                <p className="text-xs text-gray-600">{farm.region}</p>
                <p className="text-xs font-medium text-green-600">{farm.hectares} ha</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}