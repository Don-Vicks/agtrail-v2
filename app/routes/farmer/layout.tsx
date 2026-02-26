import { Outlet, useLocation } from 'react-router'
import { Sidebar } from '~/components/layout/sidebar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { Topbar } from '~/components/layout/topbar'
import { cn } from '~/lib/utils'

function FarmerLayoutContent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/farmer' || location.pathname === '/farmer/'
  const sidebarCtx = useSidebar()
  const isCollapsed = sidebarCtx?.isCollapsed ?? false

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className={cn("transition-all duration-300 ease-in-out", isCollapsed ? 'ml-0' : 'ml-64')}>
        {isDashboard && <Topbar />}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function FarmerLayout() {
  return (
    <SidebarProvider>
      <FarmerLayoutContent />
    </SidebarProvider>
  )
}
