import { useState } from 'react'
import { Breadcrumb, type BreadcrumbItem } from '~/components/breadcrumb'
import { useSidebar } from '~/components/layout/sidebar-context'
import { useOffline } from '~/hooks/use-offline'
import { PendingActionsDialog } from '~/components/offline/pending-actions-dialog'
import { cn } from '~/lib/utils'

interface PageHeaderProps {
  items: BreadcrumbItem[]
  action?: React.ReactNode
}

export function PageHeader({ items, action }: PageHeaderProps) {
  const sidebarCtx = useSidebar()
  const { hasHydrated, isOnline, isSyncing, queueCount, failedCount, lastSyncAt } = useOffline()
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false)

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
      <div className="sticky top-0 z-20 w-auto -mt-4 -mx-4 mb-6 md:-mt-6 md:-mx-6 lg:-mt-8 lg:-mx-8 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 lg:px-8 shadow-sm">
        <div className="flex items-center gap-1">
          {/* Mobile Toggle */}
          <button
            onClick={() => sidebarCtx?.toggleMobile()}
            className="lg:hidden rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Toggle */}
          <button
            onClick={() => sidebarCtx?.toggleDesktop()}
            className="hidden lg:flex rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 items-center justify-center mr-1"
            aria-label="Toggle Sidebar"
          >
            <svg
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          <Breadcrumb items={items.map((item, index) => index === 0 ? { ...item, icon: undefined } : item)} />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsPendingDialogOpen(true)}
            className={`hidden sm:block rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
            title={lastSyncTitle}
          >
            {statusLabel}
          </button>
          {action && <div>{action}</div>}
        </div>
      </div>

      <PendingActionsDialog
        isOpen={isPendingDialogOpen}
        onClose={() => setIsPendingDialogOpen(false)}
      />
    </>
  )
}
