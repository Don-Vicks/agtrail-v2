import { Breadcrumb, type BreadcrumbItem } from '~/components/breadcrumb'

interface PageHeaderProps {
  items: BreadcrumbItem[]
  action?: React.ReactNode
}

export function PageHeader({ items, action }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-20 w-auto -mt-4 -mx-4 mb-6 md:-mt-6 md:-mx-6 lg:-mt-8 lg:-mx-8 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 lg:px-8 shadow-sm">
      <Breadcrumb items={items} />
      {action && <div>{action}</div>}
    </div>
  )
}
