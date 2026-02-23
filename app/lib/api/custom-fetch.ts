const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export const customFetch = async <T>({
  url,
  method,
  params,
  data,
  headers,
  signal,
}: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  params?: Record<string, string>
  data?: unknown
  headers?: HeadersInit
  signal?: AbortSignal
}): Promise<T> => {
  const search = params ? `?${new URLSearchParams(params)}` : ''

  const response = await fetch(`${BASE_URL}${url}${search}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(data ? { body: JSON.stringify(data) } : {}),
    signal,
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export default customFetch
