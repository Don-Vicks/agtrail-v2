import { useContext } from 'react'
import { OfflineContext } from '~/context/offline-context'

export function useOffline() {
  const value = useContext(OfflineContext)
  if (!value) {
    throw new Error('useOffline must be used within OfflineProvider')
  }
  return value
}
