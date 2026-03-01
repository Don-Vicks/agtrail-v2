interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange?: (page: number) => void
  onItemsPerPageChange?: (count: number) => void
  itemLabel?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemLabel = 'item(s)',
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-sm text-gray-500">
      <span>
        Showing {startItem}-{endItem} of {totalItems} {itemLabel}
      </span>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Page info */}
        <span>
          Page {currentPage} of {totalPages}
        </span>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="First page"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
          <button
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next page"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Last page"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
