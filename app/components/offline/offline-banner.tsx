import { useState } from 'react'
import { useOffline } from '~/hooks/use-offline'
import { PendingActionsDialog } from './pending-actions-dialog'

export function OfflineBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {
    hasHydrated,
    isOnline,
    isSyncing,
    queueCount,
    failedCount,
    syncError,
    triggerSync,
  } = useOffline()

  const shouldShow =
    hasHydrated &&
    !dismissed &&
    (!isOnline || isSyncing || failedCount > 0 || (!!syncError && queueCount > 0))

  if (!shouldShow) return null

  const tone = !isOnline
    ? 'border-red-200 bg-red-50 text-red-800'
    : failedCount > 0 || syncError
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-blue-200 bg-blue-50 text-blue-900'

  const message = !isOnline
    ? `Offline mode active${queueCount > 0 ? ` · ${queueCount} queued` : ''}`
    : isSyncing
      ? `Syncing queued actions${queueCount > 0 ? ` · ${queueCount} remaining` : ''}`
      : failedCount > 0
        ? `${failedCount} action(s) failed to sync`
        : syncError || 'Sync attention required'

  return (
    <>
      <div className={`sticky top-0 z-40 border-b px-3 py-2 text-xs sm:text-sm ${tone}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2">
          <span className="font-medium">{message}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="rounded border border-current/30 px-2 py-1 text-xs font-semibold"
            >
              View Pending
            </button>
            <button
              type="button"
              onClick={() => void triggerSync()}
              disabled={!isOnline || isSyncing || queueCount === 0}
              className="rounded border border-current/30 px-2 py-1 text-xs font-semibold disabled:opacity-50"
            >
              Retry Sync
            </button>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="rounded border border-current/30 px-2 py-1 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      <PendingActionsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  )
}
