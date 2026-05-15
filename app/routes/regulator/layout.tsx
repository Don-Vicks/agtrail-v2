import { Outlet, useLocation } from 'react-router'
import { Sidebar } from '~/components/layout/sidebar'
import { SidebarProvider, useSidebar } from '~/components/layout/sidebar-context'
import { AuthGuard } from '~/components/auth-guard'
import { cn } from '~/lib/utils'
import { sidebarNavigation } from '~/lib/mock-data/regulator'

function RegulatorLayoutContent() {
  const location = useLocation()
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar navigation={sidebarNavigation} roleLabel="Regulator" />

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
        <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function RegulatorLayout() {
  return (
    <AuthGuard allowedRoles={['regulator', 'admin']}>
      <SidebarProvider>
        <RegulatorLayoutContent />
      </SidebarProvider>
    </AuthGuard>
  )
}
