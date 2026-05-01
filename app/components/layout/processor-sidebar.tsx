import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { sidebarNavigation } from '~/lib/mock-data/processor'
import { cn } from '~/lib/utils'
import { useSidebar } from './sidebar-context'
import { useAuth } from '~/context/auth-context'
import { LogoutConfirmationModal } from '~/components/logout-confirmation-modal'
import { useGetWalletBalance } from '~/lib/api/generated/wallet/wallet'
import { getTenantFromPathname, getTenantSelectValue, getUserDisplayName, getUserInitials } from '~/lib/tenant'
import { generateStellarKeypair, saveWalletLocal } from '~/lib/stellar/wallet'
import { useMutation } from '@tanstack/react-query'
import { customFetch } from '~/lib/api/custom-fetch'

interface NavGroupProps {
  label: string
  items: { label: string; icon: string; href: string }[]
  onItemClick?: () => void
}

function NavGroup({ label, items, onItemClick }: NavGroupProps) {
  return (
    <div className="mb-1">
      <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={
              item.href === '/processor' ||
              item.href === '/processor/certifications' ||
              item.href === '/processor/batches'
            }
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )
            }
          >
            <SidebarIcon name={item.icon} />
            <span className="truncate text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function SidebarIcon({ name }: { name: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    'layout-dashboard': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    'home': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    'hexagon': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    'package': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    'sprout': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M7 20h10M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" />
      </svg>
    ),
    'clipboard-list': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
        <line x1="12" y1="11" x2="12" y2="11" />
        <line x1="12" y1="16" x2="12" y2="16" />
      </svg>
    ),
    'jar': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M10 2v2.343M14 2v2.343M8 4h8a1 1 0 011 1v1H7V5a1 1 0 011-1zM5 8h14l-1 14H6L5 8z" />
      </svg>
    ),
    'upload': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    'check-circle': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    'award': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    ),
    'receipt': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
      </svg>
    ),
    'banknote': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
        <path d="M6 12h.01M18 12h.01" />
      </svg>
    ),
    'bar-chart-3': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
    'layers': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
    'plus': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    'box': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    'settings': (
      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  }

  return iconMap[name] ?? (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

export function Sidebar() {
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isWalletExpanded, setIsWalletExpanded] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const { data: walletResp, refetch: refetchWallet, isLoading: isLoadingWallet } = useGetWalletBalance()
  const { mutate: createWallet, isPending: isCreatingWallet } = useMutation({
    mutationFn: async (payload: { publicKey: string, encryptedSecretKey: string }) => {
      return customFetch('/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    },
    onSuccess: () => {
      refetchWallet()
    }
  })

  const handleCreateWallet = async () => {
    try {
      const keyPair = generateStellarKeypair()
      saveWalletLocal(keyPair)
      createWallet({
        publicKey: keyPair.publicKey,
        encryptedSecretKey: keyPair.secretKey // Ideally encrypt this in production
      })
    } catch (error) {
      console.error('Failed to create wallet locally', error)
    }
  }

  const walletData = walletResp?.data?.data as any
  const walletAddress = walletData?.id || walletData?.publicKey || walletData?.address || walletData?.accountId
  const activeRole = getTenantFromPathname(location.pathname)
  const displayName = getUserDisplayName(user)
  const initials = getUserInitials(user)

  const handleSignOut = () => {
    setShowLogoutModal(true)
  }

  const confirmSignOut = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login', { replace: true })
  }

  const handleRoleChange = (role: string) => {
    // In a real app this would update auth context, for now we just navigate to the dashboard layout
    const rolePath = role.toLowerCase()
    navigate(`/${rolePath}`)
  }

  return (
    <>
    <aside className={cn(
      "fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#e6e6e6] transition-transform duration-300 ease-in-out",
      isOpenMobile ? "translate-x-0" : "-translate-x-full",
      isCollapsedDesktop ? "lg:-translate-x-full" : "lg:translate-x-0"
    )}>
      {/* Logo */}
      <div className="flex items-center px-4 py-4">
        <img src="/logo.png" alt="Agrolinking" className="h-[28px] w-auto object-contain" />
      </div>

      {/* Role Switcher */}
      <div className="mx-4 mb-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Admin Controls
        </div>
        <div className="flex items-center gap-2 mb-1.5 ml-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">View as:</span>
        </div>
        <Select value={getTenantSelectValue(activeRole)} onValueChange={(val) => handleRoleChange(val || '')}>
          <SelectTrigger className="w-full h-10 py-2 px-3.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer">
            <SelectValue className="text-sm font-semibold text-gray-900" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Farmer" className="focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand">Farmer</SelectItem>
            <SelectItem value="Processor" className="focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand">Processor</SelectItem>
            <SelectItem value="Cooperative" className="focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand">Cooperative</SelectItem>
            <SelectItem value="Aggregator" className="focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand">Aggregator</SelectItem>
            <SelectItem value="Transporter" className="focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand">Transporter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        <NavGroup label="Platform" items={sidebarNavigation.platform} onItemClick={() => sidebarCtx?.closeMobile()} />
        <NavGroup label="Operations" items={sidebarNavigation.operations} onItemClick={() => sidebarCtx?.closeMobile()} />
        <NavGroup label="Certification" items={sidebarNavigation.certification} onItemClick={() => sidebarCtx?.closeMobile()} />
        <NavGroup label="Finance" items={sidebarNavigation.finance} onItemClick={() => sidebarCtx?.closeMobile()} />
        {sidebarNavigation.reports && sidebarNavigation.reports.length > 0 && (
          <NavGroup label="Reports" items={sidebarNavigation.reports} onItemClick={() => sidebarCtx?.closeMobile()} />
        )}

        {/* Settings Group */}
        <div className="mt-4">
          <nav className="flex flex-col gap-0.5">
            <NavLink
              to="/processor/settings"
              onClick={() => sidebarCtx?.closeMobile()}
              className={({ isActive }) => cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive ? 'bg-brand text-white' : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <SidebarIcon name="settings" />
              <span className="truncate text-xs">Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Wallet */}
      <div className="border-t border-gray-200 px-4 py-3 pb-4">
        <button
          onClick={() => setIsWalletExpanded(!isWalletExpanded)}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M22 10H2" />
            </svg>
            <div>
              <div className="text-[13px] font-bold text-gray-900">Wallet</div>
              <div className="text-[10px] text-gray-500 font-mono tracking-wide">
                {isLoadingWallet ? 'Loading...' : (walletAddress ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-4)}` : 'No Wallet Address')}
              </div>
            </div>
          </div>
          <svg
            className={cn("size-3.5 text-gray-500 transition-transform", isWalletExpanded ? "rotate-180" : "rotate-0")}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isWalletExpanded && (
          <div className="mt-3">
            <div className="mb-3 border-t border-gray-200/60" />
            <div className="space-y-2.5 px-0.5 text-[13px] font-medium">
              {isLoadingWallet ? (
                <div className="flex justify-center py-2">
                  <span className="text-xs text-gray-500">Loading assets...</span>
                </div>
              ) : walletAddress ? (
                <>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>{walletData?.currency || 'NGN'}</span>
                    <span className="font-mono text-gray-900 font-bold">{Number(walletData?.balance || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span>AGT</span>
                    <span className="font-mono text-gray-900 font-bold">0.00</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 gap-3">
                  <span className="text-xs text-gray-500 text-center">No wallet found for this account.</span>
                  <button
                    onClick={handleCreateWallet}
                    disabled={isCreatingWallet}
                    className="flex w-full items-center justify-center rounded-lg bg-brand px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-black transition-colors disabled:opacity-50 gap-2 shadow-sm"
                  >
                    {isCreatingWallet ? 'Creating...' : 'Create a Wallet'}
                  </button>
                </div>
              )}

              <div className="flex items-center gap-5 pt-3 pb-1">
                <button className="flex items-center gap-1.5 text-[13px] font-bold text-gray-900 hover:text-gray-600 transition-colors">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                <button className="flex items-center gap-1.5 text-[13px] font-bold text-gray-900 hover:text-gray-600 transition-colors">
                  <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Explorer
                </button>
                <button onClick={() => refetchWallet()} className="ml-auto flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors" title="Refresh">
                  <svg className={`size-4 ${isLoadingWallet ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-gray-900">
              {displayName}
            </div>
            <div className="truncate text-[11px] text-gray-400">{user?.email || 'Not signed in'}</div>
          </div>
          <button onClick={handleSignOut} className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600" title="Sign out">
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmSignOut}
      />
    </>
  )
}
