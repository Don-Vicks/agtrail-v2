import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    Connect: any
  }
}

export type DojahWidgetProps = {
  appID: string
  publicKey: string
  type: string
  env?: string
  config: Record<string, unknown>
  userData?: Record<string, unknown>
  metadata?: Record<string, unknown>
  response: (type: string, data?: unknown) => void
}

export function DojahWidget({
  appID,
  publicKey,
  type,
  config,
  userData,
  metadata,
  response,
}: DojahWidgetProps) {
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    
    if (typeof window !== 'undefined' && window.Connect) {
      try {
        const options = {
          app_id: appID,
          p_key: publicKey,
          type,
          config,
          user_data: userData,
          metadata,
          onSuccess: (data: any) => response('success', data),
          onError: (data: any) => response('error', data),
          onClose: () => response('close'),
        }
        
        const connect = new window.Connect(options)
        connect.setup()
        connect.open()
        
        initializedRef.current = true
      } catch (err) {
        console.error('Failed to initialize Dojah widget:', err)
        response('error', { message: 'Widget initialization failed' })
      }
    } else {
      console.error('Dojah script not found in window. Ensure it is included in root.tsx')
      response('error', { message: 'Dojah library not loaded' })
    }
  }, [appID, publicKey, type, config, userData, metadata, response])

  return null
}
