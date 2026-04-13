import { Breadcrumb, type BreadcrumbItem } from '~/components/breadcrumb'

interface PageHeaderProps {
  items: BreadcrumbItem[]
}

/**
 * PageHeader provides a full-width, sticky breadcrumb header that matches the Topbar layout.
 * It uses a full-width wrapper that accounts for the desktop sidebar width.
 */
export function PageHeader({ items }: PageHeaderProps) {
  return (
    <div className="relative w-auto -mt-4 -mx-4 mb-6 md:-mt-6 md:-mx-6 lg:-mt-8 lg:-mx-8">
      <Breadcrumb items={items} />
    </div>
  )
}
