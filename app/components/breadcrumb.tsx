import { Link } from 'react-router'
import { cn } from '~/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, index) => (
        <span key={item.label} className="flex items-center gap-1.5">
          {index > 0 && (
            <svg className="size-3 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.href ? (
            <Link
              to={item.href}
              className="group flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              {item.icon && <span className="flex items-center text-gray-400 group-hover:text-brand transition-colors">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className={cn('flex items-center gap-1.5', index === items.length - 1 && 'font-medium text-gray-900')}>
              {item.icon && <span className="flex items-center text-gray-400">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
