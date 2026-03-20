import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { currentUser, sidebarNavigation } from '~/lib/mock-data/cooperative'
import { cn } from '~/lib/utils'
import { LogOut } from 'lucide-react'
import { useSidebar } from './sidebar-context'

const IconMap: Record<string, React.ReactNode> = {
  'layout-dashboard': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>,
  'map-pin': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  'map': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>,
  'hexagon': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>,
  'package': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>,
  'users': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
  'refresh-cw': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></svg>,
  'file-text': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>,
  'archive': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
  'award': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg>,
  'file-badge': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 22h6a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v3" /><path d="M14 2v4a2 2 0 002 2h4" /><circle cx="5" cy="14" r="3" /><path d="M7 16l-3 4-1-1" /><path d="M7 20l-1-1" /><path d="M3 16l3 4" /></svg>,
  'check-circle': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  'eye': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
  'dollar-sign': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
  'credit-card': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
  'settings': <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
}

function NavGroup({ title, items, isCollapsed }: { title: string; items: any[]; isCollapsed: boolean }) {
  return (
    <div className="mb-1">
      {!isCollapsed && (
        <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          {title}
        </div>
      )}
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            end={item.href === '/cooperative' || item.href === '/cooperative/certifications'}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            {IconMap[item.icon]}
            {!isCollapsed && <span className="truncate text-xs">{item.label}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function CooperativeSidebar() {
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const closeMobile = sidebarCtx?.closeMobile
  const navigate = useNavigate()

  return (
    <>
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => closeMobile?.()}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#e6e6e6] transition-transform duration-300 ease-in-out",
        isOpenMobile ? "translate-x-0" : "-translate-x-full",
        isCollapsedDesktop ? "lg:-translate-x-full" : "lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center px-4 py-4">
          <img src="/logo.png" alt="Agrolinking" className="h-[28px] w-auto object-contain" />
        </div>

        {/* Role Switcher */}
        <div className="mx-4 mb-3">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Admin Controls
          </div>
          <div className="flex items-center gap-2 mb-1.5 ml-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">View as:</span>
          </div>
          <Select defaultValue="Cooperative" onValueChange={(val) => {
            if (val === 'Farmer') navigate('/farmer')
            if (val === 'Processor') navigate('/processor')
            if (val === 'Cooperative') navigate('/cooperative')
          }}>
            <SelectTrigger className="w-full h-10 py-2 px-3.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer">
              <SelectValue className="text-sm font-semibold text-gray-900" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Farmer" className="focus:bg-brand/10 focus:text-brand">Farmer</SelectItem>
              <SelectItem value="Processor" className="focus:bg-brand/10 focus:text-brand">Processor</SelectItem>
              <SelectItem value="Cooperative" className="focus:bg-brand/10 focus:text-brand">Cooperative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto pb-4 pt-2">
          {sidebarNavigation.map((group) => (
            <NavGroup
              key={group.title}
              title={group.title}
              items={group.items}
              isCollapsed={isCollapsedDesktop}
            />
          ))}

          {/* Settings Group */}
          <div className="mt-4">
            <nav className="flex flex-col gap-0.5">
              <NavLink
                to="/cooperative/settings"
                className={({ isActive }) => cn(
                  'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  isActive ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                {IconMap['settings']}
                {!isCollapsedDesktop && <span className="truncate text-xs">Settings</span>}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
              {currentUser.initials}
            </div>
            {!isCollapsedDesktop && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-bold text-gray-900">{currentUser.name}</p>
                <p className="truncate text-[10px] text-gray-500">{currentUser.email}</p>
              </div>
            )}
            {!isCollapsedDesktop && (
              <button className="shrink-0 text-gray-400 hover:text-gray-600">
                <LogOut className="size-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
