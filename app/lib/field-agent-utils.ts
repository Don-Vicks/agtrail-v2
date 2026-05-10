import type { FarmProduct } from '~/lib/api/generated/models/farmProduct'

const LAST_CHECKIN_KEY = 'field-agent:last-check-in'

export type FieldAgentLastCheckIn = {
  checkInId: string
  farmId: string
  storedAt: string
}

export function saveFieldAgentLastCheckIn(entry: Omit<FieldAgentLastCheckIn, 'storedAt'>): void {
  try {
    sessionStorage.setItem(
      LAST_CHECKIN_KEY,
      JSON.stringify({ ...entry, storedAt: new Date().toISOString() }),
    )
  } catch {
    // quota / private mode
  }
}

export function readFieldAgentLastCheckIn(): FieldAgentLastCheckIn | null {
  try {
    const raw = sessionStorage.getItem(LAST_CHECKIN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FieldAgentLastCheckIn>
    if (typeof parsed.checkInId === 'string' && typeof parsed.farmId === 'string') {
      return {
        checkInId: parsed.checkInId,
        farmId: parsed.farmId,
        storedAt: typeof parsed.storedAt === 'string' ? parsed.storedAt : '',
      }
    }
    return null
  } catch {
    return null
  }
}

/** Normalize list payloads from `{ data: T[] }`, nested `data.data`, or bare arrays. */
export function extractDataArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[]
  if (payload && typeof payload === 'object') {
    const o = payload as Record<string, unknown>
    if (Array.isArray(o.data)) return o.data as T[]
    const inner = o.data
    if (inner && typeof inner === 'object' && Array.isArray((inner as Record<string, unknown>).data)) {
      return (inner as { data: T[] }).data
    }
  }
  return []
}

export function extractFarmProductsFromFieldAgentEnvelope(responseBody: unknown): FarmProduct[] {
  return extractDataArray<FarmProduct>(responseBody)
}
