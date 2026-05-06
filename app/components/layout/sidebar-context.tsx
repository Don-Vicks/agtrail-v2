import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface SidebarContextType {
  isOpenMobile: boolean
  toggleMobile: () => void
  closeMobile: () => void
  isCollapsedDesktop: boolean
  toggleDesktop: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpenMobile, setIsOpenMobile] = useState(false)
  const [isCollapsedDesktop, setIsCollapsedDesktop] = useState(false)

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpenMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpenMobile])

  const toggleMobile = () => setIsOpenMobile((prev) => !prev)
  const closeMobile = () => setIsOpenMobile(false)
  const toggleDesktop = () => setIsCollapsedDesktop((prev) => !prev)

  return (
    <SidebarContext.Provider
      value={{
        isOpenMobile,
        toggleMobile,
        closeMobile,
        isCollapsedDesktop,
        toggleDesktop,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  return context
}
