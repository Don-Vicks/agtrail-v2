import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  getOfflineQueue,
  getOfflineQueueCount,
  removeOfflineAction,
  setOfflineQueue,
  subscribeOfflineQueue,
} from '~/lib/offline/queue-storage'
import { syncOfflineQueue } from '~/lib/offline/sync-engine'
import type { OfflineQueueAction } from '~/lib/offline/types'

type OfflineContextValue = {
  hasHydrated: boolean
  isOnline: boolean
  isSyncing: boolean
  queueCount: number
  failedCount: number
  queueItems: OfflineQueueAction[]
  lastSyncAt: number | null
  syncError: string | null
  triggerSync: () => Promise<void>
  removeQueuedAction: (id: string) => void
  clearFailedActions: () => void
}

export const OfflineContext = createContext<OfflineContextValue | null>(null)

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isOnline, setIsOnline] = useState(
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  const [isSyncing, setIsSyncing] = useState(false)
  const [queueCount, setQueueCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [queueItems, setQueueItems] = useState<OfflineQueueAction[]>([])
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)

  const triggerSync = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return
    setIsSyncing(true)
    setSyncError(null)

    try {
      const result = await syncOfflineQueue()
      setQueueCount(result.remainingCount)
      const queue = getOfflineQueue()
      setQueueItems(queue)
      setFailedCount(queue.filter((item) => item.failed).length)
      if (result.blockedByAuth) {
        setSyncError('Sync paused: please sign in again.')
        toast.warning('Sync paused. Sign in again to continue offline replay.')
      } else if (result.syncedCount > 0) {
        setLastSyncAt(Date.now())
        toast.success(
          result.remainingCount > 0
            ? `Synced ${result.syncedCount} action(s). ${result.remainingCount} still pending.`
            : `Synced ${result.syncedCount} queued action(s).`,
        )
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Offline sync failed'
      setSyncError(message)
      toast.error(message)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    setHasHydrated(true)
    setIsOnline(navigator.onLine)

    const updateOnlineStatus = () => {
      const next = navigator.onLine
      setIsOnline(next)

      if (next) {
        toast.success('Back online. Syncing pending actions...')
        void triggerSync()
      } else {
        toast.warning('You are offline. Changes will be queued locally.')
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
    setQueueCount(getOfflineQueueCount())
    const initial = getOfflineQueue()
    setQueueItems(initial)
    setFailedCount(initial.filter((item) => item.failed).length)

    const unsubscribeQueue = subscribeOfflineQueue((queue) => {
      setQueueCount(queue.length)
      setQueueItems(queue)
      setFailedCount(queue.filter((item) => item.failed).length)
    })

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      unsubscribeQueue()
    }
  }, [triggerSync])

  useEffect(() => {
    if (!isOnline || queueCount === 0) return
    const interval = window.setInterval(() => {
      void triggerSync()
    }, 30000)
    return () => window.clearInterval(interval)
  }, [isOnline, queueCount, triggerSync])

  const removeQueuedAction = useCallback((id: string) => {
    removeOfflineAction(id)
    const queue = getOfflineQueue()
    setQueueItems(queue)
    setQueueCount(queue.length)
    setFailedCount(queue.filter((item) => item.failed).length)
  }, [])

  const clearFailedActions = useCallback(() => {
    const queue = getOfflineQueue()
    const next = queue.filter((item) => !item.failed)
    setOfflineQueue(next)
    setQueueItems(next)
    setQueueCount(next.length)
    setFailedCount(next.filter((item) => item.failed).length)
    toast.success('Cleared failed offline actions')
  }, [])

  const value = useMemo<OfflineContextValue>(
    () => ({
      hasHydrated,
      isOnline,
      isSyncing,
      queueCount,
      failedCount,
      queueItems,
      lastSyncAt,
      syncError,
      triggerSync,
      removeQueuedAction,
      clearFailedActions,
    }),
    [
      hasHydrated,
      isOnline,
      isSyncing,
      queueCount,
      failedCount,
      queueItems,
      lastSyncAt,
      syncError,
      triggerSync,
      removeQueuedAction,
      clearFailedActions,
    ],
  )

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  )
}
