import { Loader2 } from 'lucide-react'
import { EmptyState } from '~/components/empty-state'

export function OperationFormLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-gray-600">
      <Loader2 className="size-10 animate-spin text-brand" aria-hidden />
      <p className="text-sm">Loading crop cycle…</p>
    </div>
  )
}

export function OperationFormError({ message }: { message: string }) {
  return (
    <div className="py-12">
      <EmptyState
        className="rounded-md border border-dashed border-red-200 bg-red-50/50 py-14"
        title="Could not load crop cycle"
        description={message}
      />
    </div>
  )
}
