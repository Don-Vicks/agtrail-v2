import { NavLink, useLocation } from 'react-router'
import { cn } from '~/lib/utils'
import { IconMap } from './sidebar-icons'

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

export function NavGroupComponent({
  title,
  items,
  isCollapsed,
  onItemClick,
}: {
  title: string
  items: NavItem[]
  isCollapsed: boolean
  onItemClick?: () => void
}) {
  const location = useLocation()
  
  return (
    <div className='mb-1'>
      {!isCollapsed && (
        <div className='px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
          {title}
        </div>
      )}
      <nav className='flex flex-col gap-0.5'>
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            end={item.href.split('/').length <= 2} // Dashboard ends, others don't
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              )
            }
          >
            {IconMap[item.icon] || <div className="size-4 rounded-full border border-current opacity-20" />}
            {!isCollapsed && (
              <span className='truncate text-xs'>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
