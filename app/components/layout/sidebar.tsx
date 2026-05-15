import { NavLink, useLocation } from 'react-router'
import { getTenantFromPathname } from '~/lib/tenant'
import { cn } from '~/lib/utils'
import { IconMap } from './sidebar/sidebar-icons'
import { SidebarRoleSwitcher } from './sidebar/sidebar-role-switcher'
import { NavGroupComponent } from './sidebar/sidebar-nav'
import { SidebarWallet } from './sidebar/sidebar-wallet'
import { SidebarUserFooter } from './sidebar/sidebar-user-footer'
import { useSidebar } from './sidebar-context'

interface NavItem {
  id: string
  label: string
  href: string
  icon: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  navigation: NavGroup[]
  roleLabel: string
}

export function Sidebar({ navigation, roleLabel }: SidebarProps) {
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const closeMobile = sidebarCtx?.closeMobile
  const location = useLocation()

  const activeRole = getTenantFromPathname(location.pathname)

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#e6e6e6] transition-transform duration-300 ease-in-out',
        isOpenMobile ? 'translate-x-0' : '-translate-x-full',
        isCollapsedDesktop ? 'lg:-translate-x-full' : 'lg:translate-x-0',
      )}
    >
      {/* Logo */}
      <div className='flex items-center px-4 py-4'>
        <img
          src='/logo.png'
          alt='Agrolinking'
          className='h-[28px] w-auto object-contain'
        />
      </div>

      {/* Role Switcher */}
      <SidebarRoleSwitcher roleLabel={roleLabel} activeRole={activeRole} />

      {/* Navigation */}
      <div className='flex-1 overflow-y-auto pb-4 pt-2'>
        {navigation.map((group: NavGroup) => (
          <NavGroupComponent
            key={group.title}
            title={group.title}
            items={group.items}
            isCollapsed={isCollapsedDesktop}
            onItemClick={() => closeMobile?.()}
          />
        ))}
      </div>

      {/* Settings Group — hidden for field agents */}
      {activeRole !== 'field-agent' && (
        <div className='mt-2 mb-2'>
          <nav className='flex flex-col gap-0.5'>
            <NavLink
              to={`/${activeRole}/settings`}
              onClick={() => closeMobile?.()}
              className={({ isActive }) =>
                cn(
                  'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                )
              }
            >
              {IconMap['settings']}
              {!isCollapsedDesktop && (
                <span className='truncate text-xs'>Settings</span>
              )}
            </NavLink>
          </nav>
        </div>
      )}

      {/* Wallet */}
      <SidebarWallet />

      {/* User Info Footer */}
      <SidebarUserFooter isCollapsed={isCollapsedDesktop} />
    </aside>
  )
}
