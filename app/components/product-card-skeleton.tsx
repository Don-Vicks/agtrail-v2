export function ProductCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-[100px] h-[100px] rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-3 w-32 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="mt-4 h-10 bg-gray-200 rounded-lg" />
    </div>
  )
}
