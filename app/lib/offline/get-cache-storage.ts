import { OFFLINE_GET_CACHE_STORAGE_KEY } from './constants'

type CachedGetEntry = {
  value: unknown
  status: number
  updatedAt: number
}

type GetCacheStore = Record<string, CachedGetEntry>

// In-memory cache to avoid constant localStorage parsing
let memoryStore: GetCacheStore | null = null

function isBrowser() {
  return typeof window !== 'undefined'
}

function readStore(): GetCacheStore {
  if (!isBrowser()) return {}
  
  // Use memory store if already loaded
  if (memoryStore) return memoryStore

  const raw = localStorage.getItem(OFFLINE_GET_CACHE_STORAGE_KEY)
  if (!raw) {
    memoryStore = {}
    return memoryStore
  }
  
  try {
    const parsed = JSON.parse(raw) as GetCacheStore
    memoryStore = parsed && typeof parsed === 'object' ? parsed : {}
    return memoryStore
  } catch {
    memoryStore = {}
    return memoryStore
  }
}

function writeStore(store: GetCacheStore) {
  if (!isBrowser()) return
  memoryStore = store
  // Use a slight delay or throttle if this becomes too frequent, 
  // but for now, updating memory store immediately is the key.
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
