import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAuth } from '~/context/auth-context'

import { AgrolinkingLogo } from './agrolinking-logo'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: location }, replace: true })
    }
  }, [isAuthenticated, isLoading, navigate, location])

  if (isLoading || !isAuthenticated) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <div className='animate-pulse flex flex-col items-center gap-4'>
          <AgrolinkingLogo />
          <p className='text-sm text-gray-500 font-medium tracking-wide'>
            Authenticating...
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
