import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { LogoutConfirmationModal } from '~/components/logout-confirmation-modal'
import { useAuth } from '~/context/auth-context'
import { getUserDisplayName, getUserInitials } from '~/lib/tenant'

interface SidebarUserFooterProps {
  isCollapsed: boolean
}

export function SidebarUserFooter({ isCollapsed }: SidebarUserFooterProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

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
      <div className='border-t border-gray-200 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-white'>
            {initials}
          </div>
          {!isCollapsed && (
            <div className='min-w-0 flex-1'>
              <p className='truncate text-[13px] font-bold text-gray-900'>
                {displayName}
              </p>
              <p className='truncate text-[10px] text-gray-500'>
                {user?.email || 'Not signed in'}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleSignOut}
              className='shrink-0 text-gray-400 hover:text-gray-600'
            >
              <LogOut className='size-4' />
            </button>
          )}
        </div>
      </div>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmSignOut}
      />
    </>
  )
}
