import { Link, useLocation } from 'react-router'
import { useState } from 'react'
import { useAuth } from '~/context/auth-context'
import { PendingActionsDialog } from '~/components/offline/pending-actions-dialog'
import { useOffline } from '~/hooks/use-offline'
import { getTenantFromPathname, getTenantOperationAction, getUserDisplayName } from '~/lib/tenant'
import { useSidebar } from './sidebar-context'

export function Topbar() {
  const sidebarCtx = useSidebar()
  const location = useLocation()
  const { user } = useAuth()
  const { hasHydrated, isOnline, isSyncing, queueCount, failedCount, lastSyncAt } = useOffline()
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false)

  const role = getTenantFromPathname(location.pathname)
  const primaryAction = getTenantOperationAction(role)
  const displayName = getUserDisplayName(user)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statusLabel = !hasHydrated
    ? '...'
    : !isOnline
    ? `Offline${queueCount > 0 ? ` (${queueCount})` : ''}`
    : isSyncing
      ? 'Syncing...'
      : failedCount > 0
        ? `Failed (${failedCount})`
        : queueCount > 0
          ? `Queued (${queueCount})`
          : 'Online'

  const statusClass = !hasHydrated
    ? 'border-gray-200 bg-gray-50 text-gray-500'
    : isOnline
    ? isSyncing
      ? 'border-blue-200 bg-blue-50 text-blue-700'
      : failedCount > 0
        ? 'border-red-200 bg-red-50 text-red-700'
        : queueCount > 0
          ? 'border-amber-200 bg-amber-50 text-amber-700'
          : 'border-green-200 bg-green-50 text-green-700'
    : 'border-red-200 bg-red-50 text-red-700'

  const lastSyncTitle = !hasHydrated
    ? 'Checking network status...'
    : lastSyncAt
    ? `Last synced ${new Date(lastSyncAt).toLocaleString()}`
    : 'No successful sync yet'

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 md:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => sidebarCtx?.toggleMobile()}
            className="lg:hidden rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="hidden min-w-0 truncate text-base font-medium text-gray-800 sm:block">
            {getGreeting()}, <span className="font-semibold">{displayName}</span>
          </h1>
          <h1 className="min-w-0 truncate text-base font-medium text-gray-800 sm:hidden">
            Hi, <span className="font-semibold">{displayName.split(' ')[0]}</span>
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={() => setIsPendingDialogOpen(true)}
            className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${statusClass}`}
            title={lastSyncTitle}
          >
            {statusLabel}
          </button>
          <Link to={primaryAction.href} className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {primaryAction.label}
          </Link>
        </div>
      </header>

      <PendingActionsDialog
        isOpen={isPendingDialogOpen}
        onClose={() => setIsPendingDialogOpen(false)}
      />
    </>
  )
}
