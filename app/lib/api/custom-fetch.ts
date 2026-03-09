const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  // Gracefully handle slashes between the base URL and the path
  const cleanBase = BASE_URL.replace(/\/+$/, '')
  const cleanPath = url.replace(/^\/+/, '')
  const fullUrl = `${cleanBase}/${cleanPath}`

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
    // Attach response context so that our onError handlers can extract it like axios
    ;(err as any).response = { data: errorData, status: response.status }
    throw err
  }

  const text = await response.text()
  if (!text) return {} as T
  return JSON.parse(text) as T
}

export default customFetch
