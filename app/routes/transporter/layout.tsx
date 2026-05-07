import { Outlet, useLocation } from 'react-router'
import { Sidebar } from '~/components/layout/sidebar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { AuthGuard } from '~/components/auth-guard'
import { cn } from '~/lib/utils'
import { transporterSidebarNavigation } from '~/lib/mock-data/transporter'

function TransporterLayoutContent() {
  const location = useLocation()
  const isDashboard = location.pathname === '/transporter' || location.pathname === '/transporter/'
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false

  return (
    <div className="min-h-screen bg-white flex">
      <Sidebar navigation={transporterSidebarNavigation} roleLabel="Transporter" />

      {/* Mobile Backdrop */}
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
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function TransporterLayout() {
  return (
    <AuthGuard allowedRoles={['transporter']}>
      <SidebarProvider>
        <TransporterLayoutContent />
      </SidebarProvider>
    </AuthGuard>
  )
}
