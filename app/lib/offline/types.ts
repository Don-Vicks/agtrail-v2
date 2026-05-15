export type OfflineQueueAction = {
  id: string
  url: string
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers: Record<string, string>
  body?: string
  timestamp: number
  retries: number
  organizationId: string | null
  idempotencyKey: string
  lastError?: string
  failed?: boolean
  label?: string
}

export type OfflineSyncSummary = {
  syncedCount: number
  failedCount: number
  remainingCount: number
  blockedByAuth: boolean
}
