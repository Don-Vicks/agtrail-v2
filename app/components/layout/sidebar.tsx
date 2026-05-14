import { useMutation } from '@tanstack/react-query'
import { Copy, ExternalLink, LogOut } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { LogoutConfirmationModal } from '~/components/logout-confirmation-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useAuth } from '~/context/auth-context'
import { customFetch } from '~/lib/api/custom-fetch'
import { useGetWalletBalance } from '~/lib/api/generated/wallet/wallet'
import { getAccountExplorerUrl, truncateAddress } from '~/lib/block-explorer'
import { generateStellarKeypair, saveWalletLocal } from '~/lib/stellar/wallet'
import {
  getTenantFromPathname,
  getTenantSelectValue,
  getUserDisplayName,
  getUserInitials,
} from '~/lib/tenant'
import { cn } from '~/lib/utils'
import { useSidebar } from './sidebar-context'

interface NavItem {
  id: string
  label: string
  href: string
  icon: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

interface SidebarProps {
  navigation: NavGroup[]
  roleLabel: string
}

const IconMap: Record<string, React.ReactNode> = {
  'layout-dashboard': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <rect x='3' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='3' width='7' height='7' rx='1' />
      <rect x='3' y='14' width='7' height='7' rx='1' />
      <rect x='14' y='14' width='7' height='7' rx='1' />
    </svg>
  ),
  'home': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' />
      <polyline points='9 22 9 12 15 12 15 22' />
    </svg>
  ),
  'package': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' />
      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
      <line x1='12' y1='22.08' x2='12' y2='12' />
    </svg>
  ),
  'users': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
      <circle cx='9' cy='7' r='4' />
      <path d='M23 21v-2a4 4 0 00-3-3.87' />
      <path d='M16 3.13a4 4 0 010 7.75' />
    </svg>
  ),
  'sprout': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M7 20h10M10 20c5.5-2.5.8-6.4 3-10' />
      <path d='M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z' />
      <path d='M14.1 6a7 7 0 00-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z' />
    </svg>
  ),
  'file-text': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z' />
      <polyline points='14 2 14 8 20 8' />
      <line x1='16' y1='13' x2='8' y2='13' />
      <line x1='16' y1='17' x2='8' y2='17' />
      <polyline points='10 9 9 9 8 9' />
    </svg>
  ),
  'clipboard-list': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <rect x='8' y='2' width='8' height='4' rx='1' ry='1' />
      <path d='M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2' />
    </svg>
  ),
  'award': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <circle cx='12' cy='8' r='7' />
      <polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88' />
    </svg>
  ),
  'file-badge': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M12 22h6a2 2 0 002-2V7l-5-5H6a2 2 0 00-2 2v3' />
      <path d='M14 2v4a2 2 0 002 2h4' />
      <circle cx='5' cy='14' r='3' />
      <path d='M7 16l-3 4-1-1' />
      <path d='M7 20l-1-1' />
      <path d='M3 16l3 4' />
    </svg>
  ),
  'eye': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  ),
  'receipt': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z' />
    </svg>
  ),
  'banknote': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <rect x='2' y='6' width='20' height='12' rx='2' />
      <circle cx='12' cy='12' r='2' />
      <path d='M6 12h.01M18 12h.01' />
    </svg>
  ),
  'bar-chart-3': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M18 20V10M12 20V4M6 20v-6' />
    </svg>
  ),
  'shield-check': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path strokeLinecap='round' strokeLinejoin='round' d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' />
    </svg>
  ),
  'send': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <line x1='22' y1='2' x2='11' y2='13' />
      <polygon points='22 2 15 22 11 13 2 9 22 2' />
    </svg>
  ),
  'truck': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <rect x='1' y='3' width='15' height='13' />
      <polygon points='16 8 20 8 23 11 23 16 16 16 16 8' />
      <circle cx='5.5' cy='18.5' r='2.5' />
      <circle cx='18.5' cy='18.5' r='2.5' />
    </svg>
  ),
  'archive': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polyline points='21 8 21 21 3 21 3 8' />
      <rect x='1' y='3' width='22' height='5' />
      <line x1='10' y1='12' x2='14' y2='12' />
    </svg>
  ),
  'settings': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z' />
    </svg>
  ),
  'scan': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2' />
      <rect x='7' y='9' width='10' height='6' rx='1' />
    </svg>
  ),
  'map': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polygon points='1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6' />
      <line x1='8' y1='2' x2='8' y2='18' />
      <line x1='16' y1='6' x2='16' y2='22' />
    </svg>
  ),
  'check-circle': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M22 11.08V12a10 10 0 11-5.93-9.14' />
      <polyline points='22 4 12 14.01 9 11.01' />
    </svg>
  ),
  'layers': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polygon points='12 2 2 7 12 12 22 7 12 2' />
      <polyline points='2 12 12 17 22 12' />
      <polyline points='2 17 12 22 22 17' />
    </svg>
  ),
  'plus': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <line x1='12' y1='5' x2='12' y2='19' />
      <line x1='5' y1='12' x2='19' y2='12' />
    </svg>
  ),
  'box': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z' />
      <polyline points='3.27 6.96 12 12.01 20.73 6.96' />
      <line x1='12' y1='22.08' x2='12' y2='12' />
    </svg>
  ),
  'jar': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M10 2v2.343M14 2v2.343M8 4h8a1 1 0 011 1v1H7V5a1 1 0 011-1zM5 8h14l-1 14H6L5 8z' />
    </svg>
  ),
  'map-pin': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z' />
      <circle cx='12' cy='10' r='3' />
    </svg>
  ),
  'activity': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polyline points='22 12 18 12 15 21 9 3 6 12 2 12' />
    </svg>
  ),
  'maximize': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3' />
    </svg>
  ),
  'link': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71' />
      <path d='M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71' />
    </svg>
  ),
}

function NavGroupComponent({
  title,
  items,
  isCollapsed,
  onItemClick,
}: {
  title: string
  items: NavItem[]
  isCollapsed: boolean
  onItemClick?: () => void
}) {
  const location = useLocation()
  
  return (
    <div className='mb-1'>
      {!isCollapsed && (
        <div className='px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
          {title}
        </div>
      )}
      <nav className='flex flex-col gap-0.5'>
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            end={item.href.split('/').length <= 2} // Dashboard ends, others don't
            onClick={onItemClick}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              )
            }
          >
            {IconMap[item.icon] || <div className="size-4 rounded-full border border-current opacity-20" />}
            {!isCollapsed && (
              <span className='truncate text-xs'>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Sidebar({ navigation, roleLabel }: SidebarProps) {
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const closeMobile = sidebarCtx?.closeMobile
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [isWalletExpanded, setIsWalletExpanded] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Fetch Wallet Data
  const {
    data: walletResp,
    refetch: refetchWallet,
    isLoading: isLoadingWallet,
  } = useGetWalletBalance()
  const { mutate: createWallet, isPending: isCreatingWallet } = useMutation({
    mutationFn: async (payload: {
      publicKey: string
      encryptedSecretKey: string
    }) => {
      return customFetch('/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    },
    onSuccess: () => {
      refetchWallet()
    },
  })

  const handleCreateWallet = async () => {
    try {
      const keyPair = generateStellarKeypair()
      saveWalletLocal(keyPair)
      createWallet({
        publicKey: keyPair.publicKey,
        encryptedSecretKey: keyPair.secretKey,
      })
    } catch (error) {
      console.error('Failed to create wallet locally', error)
    }
  }

  const walletData = walletResp?.data?.data as any
  const walletAddress =
    walletData?.id ||
    walletData?.publicKey ||
    walletData?.address ||
    walletData?.accountId

  const accountExplorerUrl =
    typeof walletAddress === 'string' ? getAccountExplorerUrl(walletAddress) : null

  const copyWalletAddress = async () => {
    if (!walletAddress || typeof walletAddress !== 'string') return
    try {
      await navigator.clipboard.writeText(walletAddress)
      toast.success('Wallet address copied')
    } catch {
      toast.error('Could not copy address')
    }
  }

  const displayName = getUserDisplayName(user)
  const initials = getUserInitials(user)
  const activeRole = getTenantFromPathname(location.pathname)

  const handleSignOut = () => {
    setShowLogoutModal(true)
  }

  const confirmSignOut = () => {
    setShowLogoutModal(false)
    logout()
    navigate('/login', { replace: true })
  }

  const handleRoleChange = (role: string) => {
    const rolePath = role.toLowerCase().replace(/\s+/g, '-')
    navigate(`/${rolePath}`)
    toast.success(`Switched to ${role} Dashboard`)
  }

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#e6e6e6] transition-transform duration-300 ease-in-out',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full',
          isCollapsedDesktop ? 'lg:-translate-x-full' : 'lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className='flex items-center px-4 py-4'>
          <img
            src='/logo.png'
            alt='Agrolinking'
            className='h-[28px] w-auto object-contain'
          />
        </div>

        {/* Role Switcher */}
        <div className='mx-4 mb-3'>
          <div className='text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1'>
            {roleLabel} Controls
          </div>
          <div className='flex items-center gap-2 mb-1.5 ml-1.5'>
            <span className='text-xs font-semibold uppercase tracking-wider text-gray-500'>
              View as:
            </span>
          </div>
          <Select
            value={getTenantSelectValue(activeRole)}
            onValueChange={(val: string | null) => handleRoleChange(val || '')}
          >
            <SelectTrigger className='w-full h-10 py-2 px-3.5 rounded-md border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer'>
              <SelectValue className='text-sm font-semibold text-gray-900' />
            </SelectTrigger>
            <SelectContent>
              {['Farmer', 'Processor', 'Cooperative', 'Aggregator', 'Transporter', 'Field Agent', 'Admin'].map((r) => (
                <SelectItem
                  key={r}
                  value={r}
                  className='focus:bg-brand/10 focus:text-brand focus-visible:bg-brand/10 focus-visible:text-brand'
                >
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className='flex-1 overflow-y-auto pb-4 pt-2'>
          {navigation.map((group: NavGroup) => (
            <NavGroupComponent
              key={group.title}
              title={group.title}
              items={group.items}
              isCollapsed={isCollapsedDesktop}
              onItemClick={() => closeMobile?.()}
            />
          ))}
        </div>

        {/* Settings Group — hidden for field agents */}
        {activeRole !== 'field-agent' && (
        <div className='mt-2 mb-2'>
          <nav className='flex flex-col gap-0.5'>
            <NavLink
              to={`/${activeRole}/settings`}
              onClick={() => closeMobile?.()}
              className={({ isActive }) =>
                cn(
                  'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                  isActive
                    ? 'bg-brand text-white'
                    : 'text-gray-700 hover:bg-gray-100',
                )
              }
            >
              {IconMap['settings']}
              {!isCollapsedDesktop && (
                <span className='truncate text-xs'>Settings</span>
              )}
            </NavLink>
          </nav>
        </div>
        )}

        {/* Wallet */}
        <div className='border-t border-gray-200 px-4 py-3 pb-4'>
          <div className='flex w-full items-center gap-1.5'>
            <button
              type='button'
              onClick={() => setIsWalletExpanded(!isWalletExpanded)}
              className='flex min-w-0 flex-1 items-center justify-between gap-2 text-left'
            >
              <div className='flex min-w-0 items-center gap-2'>
                <svg
                  className='size-4 shrink-0 text-gray-500'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <rect x='2' y='4' width='20' height='16' rx='2' />
                  <path d='M22 10H2' />
                </svg>
                <div className='min-w-0'>
                  <div className='text-[13px] font-bold text-gray-900'>
                    Wallet
                  </div>
                  <div className='truncate text-[10px] text-gray-500 font-mono tracking-wide'>
                    {isLoadingWallet
                      ? 'Loading...'
                      : walletAddress
                        ? truncateAddress(walletAddress, 10, 4)
                        : 'No Wallet Address'}
                  </div>
                </div>
              </div>
              <svg
                className={cn(
                  'size-3.5 shrink-0 text-gray-500 transition-transform',
                  isWalletExpanded ? 'rotate-180' : 'rotate-0',
                )}
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </button>
            {!isLoadingWallet && walletAddress ? (
              <button
                type='button'
                onClick={copyWalletAddress}
                className='shrink-0 rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-200/80 hover:text-gray-800'
                title='Copy address'
              >
                <Copy className='size-3.5' />
              </button>
            ) : null}
          </div>

          {isWalletExpanded && (
            <div className='mt-3'>
              <div className='mb-3 border-t border-gray-200/60' />
              <div className='space-y-2.5 px-0.5 text-[13px] font-medium'>
                {isLoadingWallet ? (
                  <div className='flex justify-center py-2'>
                    <span className='text-xs text-gray-500'>
                      Loading assets...
                    </span>
                  </div>
                ) : walletAddress ? (
                  <>
                    <div className='flex justify-between items-center text-gray-600'>
                      <span>{walletData?.currency || 'NGN'}</span>
                      <span className='font-mono text-gray-900 font-bold'>
                        {Number(walletData?.balance || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className='flex justify-between items-center text-gray-600'>
                      <span>AGT</span>
                      <span className='font-mono text-gray-900 font-bold'>
                        0.00
                      </span>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col items-center justify-center py-4 gap-3'>
                    <span className='text-xs text-gray-500 text-center'>
                      No wallet found for this account.
                    </span>
                    <button
                      onClick={handleCreateWallet}
                      disabled={isCreatingWallet}
                      className='flex w-full items-center justify-center rounded-md bg-brand px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-black transition-colors disabled:opacity-50 gap-2 shadow-sm'
                    >
                      {isCreatingWallet ? 'Creating...' : 'Create a Wallet'}
                    </button>
                  </div>
                )}

                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-3 pb-1'>
                  <button
                    type='button'
                    onClick={copyWalletAddress}
                    disabled={!walletAddress}
                    className='flex items-center gap-1.5 text-[13px] font-bold text-gray-900 transition-colors hover:text-gray-600 disabled:pointer-events-none disabled:opacity-40'
                  >
                    <Copy className='size-4' />
                    Copy
                  </button>
                  {accountExplorerUrl ? (
                    <a
                      href={accountExplorerUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1.5 text-[13px] font-bold text-gray-900 transition-colors hover:text-gray-600'
                    >
                      <ExternalLink className='size-4' />
                      View on explorer
                    </a>
                  ) : null}
                  <button
                    onClick={() => refetchWallet()}
                    className='ml-auto flex items-center justify-center text-gray-900 hover:text-gray-600 transition-colors'
                    title='Refresh'
                  >
                    <svg
                      className={`size-4 ${isLoadingWallet ? 'animate-spin' : ''}`}
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                      strokeWidth={2}
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Info Footer */}
        <div className='border-t border-gray-200 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'>
              {initials}
            </div>
            {!isCollapsedDesktop && (
              <div className='min-w-0 flex-1'>
                <p className='truncate text-[13px] font-bold text-gray-900'>
                  {displayName}
                </p>
                <p className='truncate text-[10px] text-gray-500'>
                  {user?.email || 'Not signed in'}
                </p>
              </div>
            )}
            {!isCollapsedDesktop && (
              <button
                onClick={handleSignOut}
                className='shrink-0 text-gray-400 hover:text-gray-600'
              >
                <LogOut className='size-4' />
              </button>
            )}
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
