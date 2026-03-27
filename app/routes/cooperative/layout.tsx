import { Outlet, useLocation } from 'react-router'
import { CooperativeSidebar } from '~/components/layout/cooperative-sidebar'
import { Topbar } from '~/components/layout/topbar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { AuthGuard } from '~/components/auth-guard'
import { cn } from '~/lib/utils'
import type { Route } from './+types/layout'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Agrolinking Cooperative Platform' }
  ]
}

function CooperativeLayoutContent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/cooperative' || location.pathname === '/cooperative/'
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CooperativeSidebar />

      {isOpenMobile && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => sidebarCtx?.closeMobile()}
        />
      )}

      <div className={cn(
        "flex-1 min-w-0 w-full transition-all duration-300 ease-in-out",
        "ml-0",
        isCollapsedDesktop ? "lg:ml-0" : "lg:ml-64"
      )}>
        {isDashboard && <Topbar />}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function CooperativeLayout() {
  return (
    <AuthGuard>
      <SidebarProvider>
        <CooperativeLayoutContent />
      </SidebarProvider>
    </AuthGuard>
  )
}
