import { getClientOrganizationId } from '~/lib/organization-context'
import { buildGetCacheKey, getCachedGetResponse, setCachedGetResponse } from '~/lib/offline/get-cache-storage'
import { enqueueOfflineAction } from '~/lib/offline/queue-storage'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

/** Verbose API logging: on in dev, or set `VITE_DEBUG_API=true` in `.env` for staging/production. */
const DEBUG_API =
  Boolean(import.meta.env.DEV) ||
  import.meta.env.VITE_DEBUG_API === 'true' ||
  import.meta.env.VITE_DEBUG_API === '1'

const MAX_JSON_LOG_CHARS = 80_000

function redactHeadersForLog(headers: Record<string, string>): Record<string, string> {
  const out = { ...headers }
  const auth = out.Authorization
  if (auth && typeof auth === 'string') {
    if (auth.startsWith('Bearer ')) {
      const token = auth.slice(7).trim()
      out.Authorization =
        token.length <= 8 ? 'Bearer ***' : `Bearer ***${token.slice(-6)}`
    } else {
      out.Authorization = '***'
    }
  }
  return out
}

function summarizeRequestBody(body: BodyInit | null | undefined, isFormData: boolean): unknown {
  if (body == null || body === undefined) return undefined
  if (isFormData && body instanceof FormData) {
    const entries: Record<string, string> = {}
    for (const [k, v] of body.entries()) {
      entries[k] = v instanceof File ? `File(${v.name}, ${v.size} bytes)` : String(v)
    }
    return entries
  }
  if (typeof body === 'string') {
    const s = body.trim()
    if (!s) return undefined
    try {
      return JSON.parse(s) as unknown
    } catch {
      return s.length > 4000 ? `${s.slice(0, 4000)}… (${s.length} chars)` : s
    }
  }
  return '[non-string body]'
}

function stringifyForLog(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function logApiRequest(params: {
  fullUrl: string
  cleanPath: string
  method: string
  headers: Record<string, string>
  bodySummary: unknown
}) {
  if (!DEBUG_API) return
  const { fullUrl, cleanPath, method, headers, bodySummary } = params
  console.groupCollapsed(`[API] → ${method} ${cleanPath}`)
  console.log('url', fullUrl)
  console.log('headers', redactHeadersForLog(headers))
  if (bodySummary !== undefined) console.log('body', bodySummary)
  console.groupEnd()
}

function logApiResponseOk(params: {
  cleanPath: string
  method: string
  status: number
  ms: number
  parsed: unknown
}) {
  if (!DEBUG_API) return
  const { cleanPath, method, status, ms, parsed } = params
  let text = stringifyForLog(parsed)
  if (text.length > MAX_JSON_LOG_CHARS) {
    text = `${text.slice(0, MAX_JSON_LOG_CHARS)}\n… [truncated, total ${text.length} chars]`
  }
  console.groupCollapsed(`[API] ← ${status} ${method} ${cleanPath} (${ms}ms)`)
  console.log('parsed (object)', parsed)
  console.log('parsed (JSON)\n', text)
  console.groupEnd()
}

function logApiBlobResponse(params: {
  cleanPath: string
  method: string
  status: number
  ms: number
  blob: Blob
}) {
  if (!DEBUG_API) return
  const { cleanPath, method, status, ms, blob } = params
  console.groupCollapsed(`[API] ← ${status} ${method} ${cleanPath} (${ms}ms) [binary]`)
  console.log('type', blob.type, 'size', blob.size)
  console.groupEnd()
}

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

/**
 * Farmer report routes resolve the subject from the JWT (authenticated farmer).
 * Sending X-Organization-Id from a prior cooperative session can break some backends
 * (wrong tenant / mixed context) and surface as HTTP 500.
 */
function shouldAttachOrganizationIdHeader(path: string): boolean {
  const normalized = path.replace(/^\/+/, '').toLowerCase()
  if (normalized.startsWith('reports/farmer/')) return false
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
    ...(organizationId && shouldAttachOrganizationIdHeader(cleanPath)
      ? { 'X-Organization-Id': organizationId }
      : {}),
    ...headersToRecord(options?.headers),
  }

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    if (method === 'GET') {
      const cacheKey = buildGetCacheKey(cleanPath, organizationId)
      const cached = getCachedGetResponse(cacheKey)
      if (cached) {
        if (DEBUG_API) {
          console.groupCollapsed(`[API] ← (offline cache) GET ${cleanPath}`)
          console.log('parsed', cached.value)
          console.groupEnd()
        }
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

      if (DEBUG_API) {
        console.groupCollapsed(`[API] ← (offline queued) ${method} ${cleanPath}`)
        console.log('note', 'Saved offline. Sync will resume when online.')
        console.groupEnd()
      }

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

  const t0 = DEBUG_API ? Date.now() : 0
  logApiRequest({
    fullUrl,
    cleanPath,
    method,
    headers: mergedHeaders,
    bodySummary: summarizeRequestBody(body, isFormData),
  })

  let response: Response
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers: mergedHeaders,
    })
  } catch (error) {
    if (DEBUG_API) {
      console.error(`[API] ✗ ${method} ${cleanPath} — Network error`, error)
    }
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

      if (DEBUG_API) {
        console.groupCollapsed(`[API] ← (offline queued) ${method} ${cleanPath}`)
        console.log('note', 'Connection unstable. Request queued for retry.')
        console.groupEnd()
      }

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
    if (DEBUG_API) {
      const ms = Date.now() - t0
      console.groupCollapsed(`[API] ✗ ${response.status} ${method} ${cleanPath} (${ms}ms)`)
      console.log('url', fullUrl)
      console.log('error body', errorData)
      console.groupEnd()
    }
    const err = new Error(`HTTP ${response.status}: ${response.statusText}`)
    // Attach response context so that our onError handlers can extract it like axios
    ;(err as any).response = { data: errorData, status: response.status }
    throw err
  }

  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    const text = await response.text()
    const ms = DEBUG_API ? Date.now() - t0 : 0
    if (!text) {
      if (DEBUG_API) {
        console.groupCollapsed(`[API] ← ${response.status} ${method} ${cleanPath} (${ms}ms) [empty body]`)
        console.log('parsed', {})
        console.groupEnd()
      }
      return { data: {} as any, status: response.status } as unknown as T
    }
    const parsed = JSON.parse(text)
    persistOrganizationIdFromResponse(parsed)
    if (method === 'GET') {
      setCachedGetResponse(
        buildGetCacheKey(cleanPath, organizationId),
        parsed,
        response.status,
      )
    }
    logApiResponseOk({
      cleanPath,
      method,
      status: response.status,
      ms,
      parsed,
    })
    return {
      data: parsed,
      status: response.status,
    } as unknown as T
  }

  // Handle binary data (images, PDFs, etc.)
  const blob = await response.blob()
  const msBlob = DEBUG_API ? Date.now() - t0 : 0
  logApiBlobResponse({
    cleanPath,
    method,
    status: response.status,
    ms: msBlob,
    blob,
  })
  return {
    data: blob,
    status: response.status,
  } as unknown as T
}

export default customFetch
