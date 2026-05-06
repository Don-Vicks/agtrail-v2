import { createContext, useContext, useState, type ReactNode } from 'react'
import type { BreadcrumbItem } from '~/components/breadcrumb'

interface HeaderContextType {
  items: BreadcrumbItem[]
  action: ReactNode | null
  setHeader: (items: BreadcrumbItem[], action?: ReactNode) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  const [action, setAction] = useState<ReactNode | null>(null)

  const setHeader = (newItems: BreadcrumbItem[], newAction: ReactNode = null) => {
    setItems(newItems)
    setAction(newAction)
  }

  return (
    <HeaderContext.Provider value={{ items, action, setHeader }}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader(items?: BreadcrumbItem[], action?: ReactNode) {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }

  // Effect-like behavior but simpler for immediate setting if called in render
  // Actually, a useEffect is safer to avoid render phase updates
  return context
}
