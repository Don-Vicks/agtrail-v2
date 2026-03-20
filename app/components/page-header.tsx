import { Breadcrumb, type BreadcrumbItem } from '~/components/breadcrumb'

interface PageHeaderProps {
  items: BreadcrumbItem[]
}

/**
 * PageHeader provides a full-width, sticky breadcrumb header that matches the Topbar layout.
 * It uses negative margins to bleed out to the edges of the main content area.
 */
export function PageHeader({ items }: PageHeaderProps) {
  return (
    <div className="-mx-4 mb-6 -mt-4 md:-mx-6 md:-mt-6 lg:-mx-8 lg:-mt-8">
      <Breadcrumb items={items} />
    </div>
  )
}
