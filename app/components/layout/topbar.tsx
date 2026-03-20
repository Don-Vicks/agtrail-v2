import { Link } from 'react-router'
import { currentUser } from '~/lib/mock-data/farmer'
import { useSidebar } from './sidebar-context'

export function Topbar() {
  const sidebarCtx = useSidebar()
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between gap-4 border-y border-gray-200 bg-white px-4 md:px-6">
      {/* Left Side: Hamburger & Greeting */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={() => sidebarCtx?.toggleMobile()}
          className="lg:hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="hidden min-w-0 truncate text-base font-medium text-gray-800 sm:block">
          {getGreeting()}, <span className="font-semibold">{currentUser.name}</span>
        </h1>
        <h1 className="min-w-0 truncate text-base font-medium text-gray-800 sm:hidden">
          Hi, <span className="font-semibold">{currentUser.name.split(' ')[0]}</span>
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex shrink-0 items-center gap-2 md:gap-3">
        {/* Tabs */}
        {/* <div className="hidden md:flex items-center gap-1 rounded-md border border-gray-200 p-0.5">
          <button className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Corp
          </button>
          <button className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors">
            Beekeeping
          </button>
          <button className="rounded-md bg-brand-surface px-3 py-1.5 text-xs font-medium text-brand transition-colors">
            Farm
          </button>
        </div> */}

        {/* Log Operation Button */}
        <Link to="/farmer/operations/new" className="flex items-center gap-1.5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark transition-colors">
          <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Log Operation
        </Link>
      </div>
    </header>
  )
}
