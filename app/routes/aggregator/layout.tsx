import { Outlet, useLocation } from 'react-router'
import { AuthGuard } from '~/components/auth-guard'
import { Sidebar } from '~/components/layout/sidebar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { cn } from '~/lib/utils'
import { aggregatorSidebarNavigation } from '~/lib/mock-data/aggregator'
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
      <Sidebar navigation={aggregatorSidebarNavigation} roleLabel="Aggregator" />

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
    <AuthGuard allowedRoles={['aggregator']}>
      <SidebarProvider>
        <AggregatorLayoutContent />
      </SidebarProvider>
    </AuthGuard>
  )
}
