import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { AuthResponseDataUser } from '~/lib/api/generated/models/authResponseDataUser'

interface AuthContextType {
  user: AuthResponseDataUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthResponseDataUser, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResponseDataUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token and user on mount
    const storedToken = localStorage.getItem('agrolinking_token')
    const storedUser = localStorage.getItem('agrolinking_user')

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse stored user data', e)
        localStorage.removeItem('agrolinking_token')
        localStorage.removeItem('agrolinking_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (newUser: AuthResponseDataUser, token: string) => {
    localStorage.setItem('agrolinking_token', token)
    localStorage.setItem('agrolinking_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('agrolinking_token')
    localStorage.removeItem('agrolinking_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
