import { getClientOrganizationId } from '~/lib/organization-context'
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

  const body = options?.body
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      // Multipart uploads must not send application/json; let the browser set the boundary.
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(organizationId ? { 'X-Organization-Id': organizationId } : {}),
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
  if (!text) return { data: {}, status: response.status } as unknown as T
  const parsed = JSON.parse(text)
  persistOrganizationIdFromResponse(parsed)
  return {
    data: parsed,
    status: response.status,
  } as unknown as T
}

export default customFetch
