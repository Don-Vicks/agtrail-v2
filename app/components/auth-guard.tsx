import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '~/context/auth-context'
import { AgrolinkingLogo } from './agrolinking-logo'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const [showLoadingUI, setShowLoadingUI] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoadingUI(true), 200)
      return () => clearTimeout(timer)
    } else {
      setShowLoadingUI(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      // Only navigate if we're not already on the login page
      if (location.pathname !== '/login') {
        navigate('/login', { state: { from: location }, replace: true })
      }
    } else if (allowedRoles && user?.systemRole) {
      const userRole = user.systemRole.toLowerCase()
      const isAuthorized = allowedRoles.includes(userRole) || userRole === 'admin'
      
      if (!isAuthorized && location.pathname !== '/unauthorized') {
        // Redirect if the user doesn't have the required role for this section
        navigate('/unauthorized', { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, allowedRoles?.join(','), user?.systemRole])

  const userRole = user?.systemRole?.toLowerCase()
  const isUnauthorized = allowedRoles && userRole && !allowedRoles.includes(userRole) && userRole !== 'admin'

  if (isLoading || !isAuthenticated || isUnauthorized) {
    // Avoid flickering: don't show the loading UI for the first 200ms
    if (!showLoadingUI && (isLoading || !isAuthenticated)) {
      return null
    }

    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='animate-pulse flex flex-col items-center gap-4'>
          <AgrolinkingLogo />
          <p className='text-sm text-gray-500 font-medium tracking-wide'>
            {isLoading ? 'Authenticating...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
