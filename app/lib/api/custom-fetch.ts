import { getClientOrganizationId } from '~/lib/organization-context'
import { buildGetCacheKey, getCachedGetResponse, setCachedGetResponse } from '~/lib/offline/get-cache-storage'
import { enqueueOfflineAction } from '~/lib/offline/queue-storage'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function normalizePathAgainstBase(baseUrl: string, pathOrUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '')
  const cleanPath = pathOrUrl.trim().replace(/^\/+/, '')
  // Prevent `/api` duplication when base already includes it and payload/path also starts with it.
  if (/\/api$/i.test(cleanBase) && /^api\//i.test(cleanPath)) {
    return cleanPath.replace(/^api\/+/i, '')
  }
  return cleanPath
}

function persistOrganizationIdFromResponse(payload: unknown): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('agrolinking_organization_id')) return

  const source =
    (payload as { data?: unknown })?.data ??
    payload

  const probeArray = Array.isArray(source) ? source : []
  const probeObject = !Array.isArray(source) && typeof source === 'object' && source
    ? (source as Record<string, unknown>)
    : null

  const fromArray =
    probeArray.find(
      (row) =>
        row &&
        typeof row === 'object' &&
        typeof (row as Record<string, unknown>).organizationId === 'string',
    ) as Record<string, unknown> | undefined

  const orgId =
    (probeObject?.organizationId as string | undefined) ||
    (fromArray?.organizationId as string | undefined)

  if (orgId) {
    localStorage.setItem('agrolinking_organization_id', orgId)
  }
}

/**
 * Upload endpoints often return a relative path (e.g. `upload/file/...`).
 * Some certification APIs expect a fully qualified URL — join with `VITE_API_BASE_URL`.
 */
export function resolveDocumentUrlForApi(
  pathOrUrl: string | undefined | null,
): string | undefined {
  if (pathOrUrl == null || pathOrUrl === '') return undefined
  const s = pathOrUrl.trim()
  if (/^https?:\/\//i.test(s)) return s
  const cleanBase = API_BASE_URL.replace(/\/+$/, '')
  const cleanPath = normalizePathAgainstBase(cleanBase, s)
  return `${cleanBase}/${cleanPath}`
}

function headersToRecord(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {}
  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries())
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }
  return { ...headers }
}

function isMutationMethod(method: string) {
  return ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
}

function isOfflineQueueablePath(path: string) {
  const lowered = path.toLowerCase()
  if (lowered.includes('/auth/login') || lowered.includes('/auth/refresh')) return false
  if (lowered.includes('/upload') || lowered.includes('/certifications/upload')) return false
  return true
}

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  // Gracefully handle slashes between the base URL and the path
  const cleanBase = API_BASE_URL.replace(/\/+$/, '')
  const cleanPath = normalizePathAgainstBase(cleanBase, url)
  const fullUrl = `${cleanBase}/${cleanPath}`

  const token = typeof window !== 'undefined' ? localStorage.getItem('agrolinking_token') : null
  const organizationId = getClientOrganizationId()
  const method = String(options?.method ?? 'GET').toUpperCase()

  const body = options?.body
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData
  const mergedHeaders = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {}),
    ...headersToRecord(options?.headers),
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (method === 'GET') {
      const cacheKey = buildGetCacheKey(cleanPath, organizationId)
      const cached = getCachedGetResponse(cacheKey)
      if (cached) {
        return {
          data: cached.value,
          status: cached.status,
          offlineCached: true,
          cachedAt: cached.updatedAt,
        } as unknown as T
      }

      const err = new Error('Offline and no cached response available')
      ;(err as any).code = 'OFFLINE_READ_UNAVAILABLE'
      throw err
    }

    if (isMutationMethod(method) && isOfflineQueueablePath(cleanPath) && !isFormData) {
      const idempotencyKey =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      enqueueOfflineAction({
        url: cleanPath,
        method: method as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        headers: mergedHeaders,
        body:
          typeof body === 'string'
            ? body
            : body != null
              ? JSON.stringify(body)
              : undefined,
        organizationId: organizationId ?? null,
        idempotencyKey,
      })

      return {
        data: {
          success: true,
          offlineQueued: true,
          message: 'Saved offline. Sync will resume when online.',
        },
        status: 202,
      } as unknown as T
    }
  }

  let response: Response
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers: mergedHeaders,
    })
  } catch (error) {
    // Network blip while browser still reports online.
    if (isMutationMethod(method) && isOfflineQueueablePath(cleanPath) && !isFormData) {
      const idempotencyKey =
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`

      enqueueOfflineAction({
        url: cleanPath,
        method: method as 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        headers: mergedHeaders,
        body:
          typeof body === 'string'
            ? body
            : body != null
              ? JSON.stringify(body)
              : undefined,
        organizationId: organizationId ?? null,
        idempotencyKey,
      })

      return {
        data: {
          success: true,
          offlineQueued: true,
          message: 'Connection unstable. Request queued for retry.',
        },
        status: 202,
      } as unknown as T
    }
    throw error
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
    // Attach response context so that our onError handlers can extract it like axios
    ;(err as any).response = { data: errorData, status: response.status }
    throw err
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    const text = await response.text()
    if (!text) return { data: {} as any, status: response.status } as unknown as T
    const parsed = JSON.parse(text)
    persistOrganizationIdFromResponse(parsed)
    if (method === 'GET') {
      setCachedGetResponse(
        buildGetCacheKey(cleanPath, organizationId),
        parsed,
        response.status,
      )
    }
    return {
      data: parsed,
      status: response.status,
    } as unknown as T
  }

  // Handle binary data (images, PDFs, etc.)
  const blob = await response.blob()
  return {
    data: blob,
    status: response.status,
  } as unknown as T
}

export default customFetch
