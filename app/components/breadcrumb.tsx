import { Link } from 'react-router'
import { useSidebar } from '~/components/layout/sidebar-context'
import { cn } from '~/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const sidebarCtx = useSidebar()

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && (
            <svg className="size-3 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}

          {(item.icon || (index === 0 && (item.label === 'Dashboard' || item.label === 'Transporter' || item.label === 'Aggregator' || item.label === 'Processor' || item.label === 'Farmer' || item.label === 'Cooperative'))) && (
            <div className="flex items-center text-gray-400">
              {item.icon || (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              )}
            </div>
          )}

          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-brand transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(index === items.length - 1 && 'font-medium text-gray-900')}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
