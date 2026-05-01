import { useState, useEffect } from 'react'

export interface WeatherData {
  temperature: string
  humidity: string
  wind: string
  rainfall: string
  notes: string
  source: string
}

type UseWeatherArgs = {
  latitude?: number | null
  longitude?: number | null
  locationQuery?: string
}

const EMPTY_WEATHER: WeatherData = {
  temperature: '--',
  humidity: '--',
  wind: '--',
  rainfall: '--',
  notes: 'No weather data available',
  source: 'Unavailable',
}

function toTemperature(value?: number) {
  return typeof value === 'number' ? `${Math.round(value)}°C` : '--'
}

function toHumidity(value?: number) {
  return typeof value === 'number' ? `${Math.round(value)}%` : '--'
}

function toWind(value?: number) {
  return typeof value === 'number' ? `${Math.round(value)} km/h` : '--'
}

function toRainfall(value?: number) {
  return typeof value === 'number' ? `${value.toFixed(1)} mm` : '--'
}

function weatherCodeToNotes(code?: number) {
  if (typeof code !== 'number') return 'Unknown conditions'
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 48) return 'Foggy'
  if (code <= 67) return 'Rainy'
  if (code <= 77) return 'Snowy'
  if (code <= 82) return 'Rain showers'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown conditions'
}

async function resolveCoordinatesFromLocation(locationQuery?: string) {
  const query = locationQuery?.trim()
  if (!query) return null
  const endpoint =
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}` +
    '&count=1&language=en&format=json'
  const response = await fetch(endpoint)
  if (!response.ok) return null
  const data = (await response.json()) as {
    results?: Array<{ latitude?: number; longitude?: number }>
  }
  const first = data.results?.[0]
  if (!first) return null
  if (!Number.isFinite(first.latitude) || !Number.isFinite(first.longitude)) return null
  return { latitude: Number(first.latitude), longitude: Number(first.longitude) }
}

export function useWeather({ latitude, longitude, locationQuery }: UseWeatherArgs = {}) {
  const [weather, setWeather] = useState<WeatherData>(EMPTY_WEATHER)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude)

  const refreshWeather = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const resolvedCoordinates = hasCoordinates
        ? { latitude: latitude as number, longitude: longitude as number }
        : await resolveCoordinatesFromLocation(locationQuery)
      if (!resolvedCoordinates) {
        setWeather({
          ...EMPTY_WEATHER,
          notes: 'Missing farm coordinates',
        })
        setError('Farm coordinates are not available, and location lookup failed.')
        return
      }
      const endpoint =
        `https://api.open-meteo.com/v1/forecast?latitude=${resolvedCoordinates.latitude}&longitude=${resolvedCoordinates.longitude}` +
        '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code' +
        '&daily=precipitation_sum&timezone=auto'
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`)
      }
      const data = (await response.json()) as {
        current?: {
          temperature_2m?: number
          relative_humidity_2m?: number
          wind_speed_10m?: number
          weather_code?: number
        }
        daily?: {
          precipitation_sum?: number[]
        }
      }
      setWeather({
        temperature: toTemperature(data.current?.temperature_2m),
        humidity: toHumidity(data.current?.relative_humidity_2m),
        wind: toWind(data.current?.wind_speed_10m),
        rainfall: toRainfall(data.daily?.precipitation_sum?.[0]),
        notes: weatherCodeToNotes(data.current?.weather_code),
        source: hasCoordinates ? 'Open-Meteo (farm GPS)' : 'Open-Meteo (farm location)',
      })
    } catch (err) {
      setWeather(EMPTY_WEATHER)
      setError(err instanceof Error ? err.message : 'Failed to fetch weather.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshWeather()
  }, [latitude, longitude, locationQuery])

  return {
    weather,
    isLoading,
    error,
    hasCoordinates,
    refreshWeather,
  }
}
