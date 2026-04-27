/** Google Maps JavaScript API key (Maps JavaScript API + any needed APIs in Cloud Console). */
export function getGoogleMapsApiKey(): string {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) ?? ''
}

export const NIGERIA_ROUGH_CENTER = { lat: 9.082, lng: 8.6753 } as const

export const DEFAULT_FARM_PLOT_CENTER = { lat: 9.06, lng: 7.49 } as const
