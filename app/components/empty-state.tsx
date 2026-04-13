import type { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500", className)}>
      {icon && (
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-50 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant="outline"
          onClick={action.onClick}
          className="mt-6 border-brand text-brand hover:bg-brand hover:text-white transition-all font-bold"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
