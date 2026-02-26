import { currentUser } from '~/lib/mock-data/farmer'

export function Topbar() {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Greeting */}
      <h1 className="text-base font-medium text-gray-800">
        {getGreeting()}, <span className="font-semibold">{currentUser.name}</span>
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5">
          <button className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Corp
          </button>
          <button className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Beekeeping
          </button>
          <button className="rounded-md bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand transition-colors">
            Farm
          </button>
        </div>

        {/* Add Farm Button */}
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Farm
        </button>
      </div>
    </header>
  )
}
