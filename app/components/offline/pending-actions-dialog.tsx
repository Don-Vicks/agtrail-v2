import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useOffline } from '~/hooks/use-offline'

interface PendingActionsDialogProps {
  isOpen: boolean
  onClose: () => void
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleString()
}

function toFriendlyActionLabel(method: string, url: string) {
  const normalized = url.toLowerCase()

  if (method === 'POST' && normalized === '/processors/batches') {
    return 'Create processing batch'
  }

  if (method === 'POST' && /\/farms\/[^/]+\/operations$/.test(normalized)) {
    return 'Record farm operation'
  }

  if (method === 'POST' && /\/farms\/[^/]+\/crop-cycles$/.test(normalized)) {
    return 'Start crop cycle'
  }

  if (method === 'POST' && normalized === '/farms') {
    return 'Create farm'
  }

  if (method === 'POST' && normalized.includes('/certifications')) {
    return 'Submit certification'
  }

  if (method === 'POST') return 'Create record'
  if (method === 'PATCH' || method === 'PUT') return 'Update record'
  if (method === 'DELETE') return 'Delete record'
  return 'Pending action'
}

export function PendingActionsDialog({ isOpen, onClose }: PendingActionsDialogProps) {
  const {
    queueItems,
    failedCount,
    isSyncing,
    triggerSync,
    removeQueuedAction,
    clearFailedActions,
  } = useOffline()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pending Offline Actions</DialogTitle>
          <DialogDescription>
            {queueItems.length === 0
              ? 'No pending actions in queue.'
              : `${queueItems.length} action(s) pending${failedCount > 0 ? `, ${failedCount} failed` : ''}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => void triggerSync()}
            disabled={isSyncing || queueItems.length === 0}
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {isSyncing ? 'Syncing...' : 'Retry Sync'}
          </button>
          <button
            type="button"
            onClick={clearFailedActions}
            disabled={failedCount === 0}
            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 disabled:opacity-50"
          >
            Clear Failed
          </button>
        </div>

        <div className="space-y-2">
          {queueItems.length === 0 ? (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
              Queue is empty.
            </div>
          ) : (
            queueItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-md border p-3 ${
                  item.failed
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {toFriendlyActionLabel(item.method, item.url)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Queued: {formatTime(item.timestamp)} · Retries: {item.retries}
                    </p>
                    {item.lastError ? (
                      <p className="mt-1 text-xs text-red-700">Error: {item.lastError}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQueuedAction(item.id)}
                    className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
