import { getClientOrganizationId } from '~/lib/organization-context'
import {
  OFFLINE_SYNC_MAX_RETRIES,
  OFFLINE_SYNC_RETRY_BASE_MS,
} from './constants'
import {
  getOfflineQueue,
  removeOfflineAction,
  updateOfflineAction,
} from './queue-storage'
import type { OfflineQueueAction, OfflineSyncSummary } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
let syncInProgress = false

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine
}

function normalizePathAgainstBase(baseUrl: string, pathOrUrl: string): string {
  const cleanBase = baseUrl.replace(/\/+$/, '')
  const cleanPath = pathOrUrl.trim().replace(/^\/+/, '')
  if (/\/api$/i.test(cleanBase) && /^api\//i.test(cleanPath)) {
    return cleanPath.replace(/^api\/+/i, '')
  }
  return cleanPath
}

function buildRequestUrl(path: string): string {
  const cleanBase = API_BASE_URL.replace(/\/+$/, '')
  const cleanPath = normalizePathAgainstBase(cleanBase, path)
  return `${cleanBase}/${cleanPath}`
}

function buildReplayHeaders(action: OfflineQueueAction): Record<string, string> {
  const headers: Record<string, string> = { ...action.headers }
  delete headers.Authorization
  delete headers.authorization
  delete headers['X-Organization-Id']
  delete headers['x-organization-id']

  const token = typeof window !== 'undefined' ? localStorage.getItem('agrolinking_token') : null
  const organizationId = getClientOrganizationId() ?? action.organizationId
  return {
    ...headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(organizationId ? { 'X-Organization-Id': organizationId } : {}),
    'X-Offline-Replay': '1',
    'X-Idempotency-Key': action.idempotencyKey,
  }
}

async function replayAction(action: OfflineQueueAction): Promise<{ ok: boolean; blockedByAuth?: boolean; error?: string }> {
  try {
    const response = await fetch(buildRequestUrl(action.url), {
      method: action.method,
      headers: buildReplayHeaders(action),
      ...(action.body ? { body: action.body } : {}),
    })

    if (response.ok) return { ok: true }

    if (response.status === 401 || response.status === 403) {
      return { ok: false, blockedByAuth: true, error: `Auth blocked (${response.status})` }
    }

    const body = await response.text().catch(() => '')
    return { ok: false, error: `HTTP ${response.status}${body ? `: ${body.slice(0, 160)}` : ''}` }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Replay failed',
    }
  }
}

export async function syncOfflineQueue(): Promise<OfflineSyncSummary> {
  if (syncInProgress) {
    return {
      syncedCount: 0,
      failedCount: 0,
      remainingCount: getOfflineQueue().length,
      blockedByAuth: false,
    }
  }

  syncInProgress = true
  let syncedCount = 0
  let failedCount = 0
  let blockedByAuth = false

  try {
    if (!isOnline()) {
      return {
        syncedCount: 0,
        failedCount: 0,
        remainingCount: getOfflineQueue().length,
        blockedByAuth: false,
      }
    }

    let queue = getOfflineQueue()
    for (const action of queue) {
      if (!isOnline()) break
      if (action.failed) continue

      const replay = await replayAction(action)
      if (replay.ok) {
        removeOfflineAction(action.id)
        syncedCount += 1
        continue
      }

      if (replay.blockedByAuth) {
        updateOfflineAction(action.id, { lastError: replay.error ?? 'Auth blocked' })
        blockedByAuth = true
        break
      }

      const nextRetries = action.retries + 1
      const hasExceededRetry = nextRetries >= OFFLINE_SYNC_MAX_RETRIES
      updateOfflineAction(action.id, {
        retries: nextRetries,
        failed: hasExceededRetry,
        lastError: replay.error ?? 'Replay failed',
      })
      failedCount += 1

      if (!hasExceededRetry) {
        const backoff = OFFLINE_SYNC_RETRY_BASE_MS * Math.max(1, nextRetries)
        await wait(backoff)
        break
      }

      // Stop to preserve mutation order and let user inspect failures.
      break
    }

    queue = getOfflineQueue()
    return {
      syncedCount,
      failedCount,
      remainingCount: queue.length,
      blockedByAuth,
    }
  } finally {
    syncInProgress = false
  }
}

export function isOfflineSyncInProgress() {
  return syncInProgress
}
