/** Google Maps JavaScript API key (Maps JavaScript API + any needed APIs in Cloud Console). */
export function getGoogleMapsApiKey(): string {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? ''
}

export const NIGERIA_ROUGH_CENTER = { lat: 9.082, lng: 8.6753 } as const

export const DEFAULT_MAP_ID = 'argolinking_map_id'
