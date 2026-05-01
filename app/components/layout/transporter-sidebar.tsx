import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { transporterSidebarNavigation } from '~/lib/mock-data/transporter'
import { cn } from '~/lib/utils'
import { LogOut, Search, HelpCircle } from 'lucide-react'
import { useSidebar } from './sidebar-context'
import { useAuth } from '~/context/auth-context'
import { LogoutConfirmationModal } from '~/components/logout-confirmation-modal'
import { useGetWalletBalance } from '~/lib/api/generated/wallet/wallet'
import { generateStellarKeypair, saveWalletLocal } from '~/lib/stellar/wallet'
import { useMutation } from '@tanstack/react-query'
import { customFetch } from '~/lib/api/custom-fetch'
import {
  getUserDisplayName,
  getUserInitials,
} from '~/lib/tenant'

const IconMap: Record<string, React.ReactNode> = {
  'layout-dashboard': (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <rect x='3' y='3' width='7' height='7' rx='1' />
      <rect x='14' y='3' width='7' height='7' rx='1' />
      <rect x='3' y='14' width='7' height='7' rx='1' />
      <rect x='14' y='14' width='7' height='7' rx='1' />
    </svg>
  ),
  scan: (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <path d='M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2' />
      <rect x='7' y='9' width='10' height='6' rx='1' />
    </svg>
  ),
  map: (
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
  archive: (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <polyline points='21 8 21 21 3 21 3 8' />
      <rect x='1' y='3' width='22' height='5' />
      <line x1='10' y1='12' x2='14' y2='12' />
    </svg>
  ),
  settings: (
    <svg className='size-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
      <circle cx='12' cy='12' r='3' />
      <path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' />
    </svg>
  ),
}

function NavGroup({
  title,
  items,
  isCollapsed,
}: {
  title: string
  items: Array<{ id: string; label: string; href: string; icon: string }>
  isCollapsed: boolean
}) {
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
            end={item.href === '/transporter'}
            className={({ isActive }) =>
              cn(
                'mx-2 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-brand text-white'
                  : 'text-gray-700 hover:bg-gray-100',
              )
            }
          >
            {IconMap[item.icon]}
            {!isCollapsed && (
              <span className='truncate text-xs font-semibold'>{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function TransporterSidebar() {
  const sidebarCtx = useSidebar()
  const isCollapsedDesktop = sidebarCtx?.isCollapsedDesktop ?? false
  const isOpenMobile = sidebarCtx?.isOpenMobile ?? false
  const closeMobile = sidebarCtx?.closeMobile
  const navigate = useNavigate()
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

  return (
    <>
      {isOpenMobile && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => closeMobile?.()}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-[#f9f9f9] transition-transform duration-300 ease-in-out',
          isOpenMobile ? 'translate-x-0' : '-translate-x-full',
          isCollapsedDesktop ? 'lg:-translate-x-full' : 'lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className='flex items-center px-4 py-6'>
          <div className='flex items-center gap-2'>
            <div className='size-8 rounded-full bg-brand flex items-center justify-center text-white'>
              <svg className='size-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' />
              </svg>
            </div>
            <span className='text-lg font-bold text-gray-900 tracking-tight'>Agtrail</span>
          </div>
        </div>

        {/* Role Switcher */}
        <div className='mx-4 mb-3'>
          <div className='text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1'>
            Platform
          </div>
          <Select
            defaultValue='Transporter'
            onValueChange={(val) => {
              if (val === 'Farmer') navigate('/farmer')
              if (val === 'Processor') navigate('/processor')
              if (val === 'Cooperative') navigate('/cooperative')
              if (val === 'Aggregator') navigate('/aggregator')
              if (val === 'Transporter') navigate('/transporter')
            }}
          >
            <SelectTrigger className='w-full h-11 py-2 px-3.5 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all cursor-pointer'>
              <SelectValue className='text-sm font-semibold text-gray-900' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='Farmer' className='focus:bg-brand/10 focus:text-brand'>Farmer</SelectItem>
              <SelectItem value='Processor' className='focus:bg-brand/10 focus:text-brand'>Processor</SelectItem>
              <SelectItem value='Cooperative' className='focus:bg-brand/10 focus:text-brand'>Cooperative</SelectItem>
              <SelectItem value='Aggregator' className='focus:bg-brand/10 focus:text-brand'>Aggregator</SelectItem>
              <SelectItem value='Transporter' className='focus:bg-brand/10 focus:text-brand'>Transporter</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Navigation */}
        <div className='flex-1 overflow-y-auto pb-4 pt-2'>
          {transporterSidebarNavigation.map((group) => (
            <NavGroup
              key={group.title}
              title={group.title}
              items={group.items}
              isCollapsed={isCollapsedDesktop}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className='px-4 py-4 space-y-1 border-t border-gray-100'>
          <button className='flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors'>
            {IconMap.settings}
            <span>Settings</span>
          </button>
          <button className='flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors'>
            <HelpCircle className='size-4' />
            <span>Get Help</span>
          </button>
          <button className='flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-100 transition-colors'>
            <Search className='size-4' />
            <span>Search</span>
          </button>
        </div>

        {/* User Profile Footer */}
        <div className='border-t border-gray-200 p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100'>
              <img
                src='https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde'
                alt='User'
                className='size-8 rounded'
              />
            </div>
            {!isCollapsedDesktop && (
              <div className='min-w-0 flex-1'>
                <p className='truncate text-[13px] font-bold text-gray-900'>
                  {displayName}
                </p>
                <p className='truncate text-[10px] text-gray-500'>
                  {user?.email || 'tunde@agtrail.com'}
                </p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className='shrink-0 text-gray-400 hover:text-gray-600'
            >
              <LogOut className='size-4' />
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
