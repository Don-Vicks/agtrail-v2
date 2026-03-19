import { lazy, Suspense, useEffect, useState } from 'react'

const FarmMapClient = lazy(() => import('./farm-map.client').then((module) => ({ default: module.FarmMap })))

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

export function FarmMap(props: FarmMapProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const Fallback = (
    <div 
      className={`rounded-md border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 ${props.className || ''}`} 
      style={{ height: '300px', width: '100%' }}
    >
      <div className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-brand" />
      <span className="text-gray-400 text-sm">Loading map...</span>
    </div>
  )

  if (!isMounted) {
    return Fallback
  }

  return (
    <Suspense fallback={Fallback}>
      <FarmMapClient {...props} />
    </Suspense>
  )
}
