import { Outlet, useLocation } from 'react-router'
import { AuthGuard } from '~/components/auth-guard'
import { AggregatorSidebar } from '~/components/layout/aggregator-sidebar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { Topbar } from '~/components/layout/topbar'
import { cn } from '~/lib/utils'
import type { Route } from './+types/layout'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Agrolinking Aggregator Platform' }]
}

function AggregatorLayoutContent() {
  const location = useLocation()
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const isDashboard = location.pathname === '/aggregator' || location.pathname === '/aggregator/'

  return (
    <div className='min-h-screen bg-gray-50 flex'>
      <AggregatorSidebar />

      {isOpenMobile && (
        <div
          className='fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden'
          onClick={() => sidebarCtx?.closeMobile()}
        />
      )}

      <div
        className={cn(
          'flex-1 min-w-0 w-full transition-all duration-300 ease-in-out',
          'ml-0',
          isCollapsedDesktop ? 'lg:ml-0' : 'lg:ml-64',
        )}
      >
        <main className='p-4 md:p-6 lg:p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function AggregatorLayout() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AggregatorLayoutContent />
      </SidebarProvider>
    </AuthGuard>
  )
}
