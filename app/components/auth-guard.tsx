import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '~/context/auth-context'
import { AgrolinkingLogo } from './agrolinking-logo'

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: location }, replace: true })
      } else if (allowedRoles && user?.systemRole && !allowedRoles.includes(user.systemRole.toLowerCase())) {
        // Redirect if the user doesn't have the required role for this section
        navigate('/unauthorized', { replace: true })
      }
    }
  }, [isAuthenticated, isLoading, navigate, location, allowedRoles, user])

  if (isLoading || !isAuthenticated || (allowedRoles && user?.systemRole && !allowedRoles.includes(user.systemRole.toLowerCase()))) {
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
