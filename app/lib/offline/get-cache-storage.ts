import { OFFLINE_GET_CACHE_STORAGE_KEY } from './constants'

type CachedGetEntry = {
  value: unknown
  status: number
  updatedAt: number
}

type GetCacheStore = Record<string, CachedGetEntry>

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStore(): GetCacheStore {
  if (!isBrowser()) return {}
  const raw = localStorage.getItem(OFFLINE_GET_CACHE_STORAGE_KEY)
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw) as GetCacheStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: GetCacheStore) {
  if (!isBrowser()) return
  localStorage.setItem(OFFLINE_GET_CACHE_STORAGE_KEY, JSON.stringify(store))
}

export function buildGetCacheKey(url: string, organizationId?: string | null): string {
  return `${organizationId ?? 'no-org'}::${url}`
}

export function setCachedGetResponse(
  key: string,
  value: unknown,
  status: number,
): void {
  const store = readStore()
  store[key] = {
    value,
    status,
    updatedAt: Date.now(),
  }
  writeStore(store)
}

export function getCachedGetResponse(
  key: string,
): CachedGetEntry | null {
  const store = readStore()
  return store[key] ?? null
}
