import { useEffect, useRef } from 'react'
import DojahKycSdk from 'dojah-kyc-sdk-react'

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
  env,
  config,
  userData,
  metadata,
  response,
}: DojahWidgetProps) {
  const mountedRef = useRef(false)
  const responseRef = useRef(response)
  responseRef.current = response

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const safeResponse = (event: string, data?: unknown) => {
    if (!mountedRef.current) return
    responseRef.current(event, data)
  }

  return (
    <DojahKycSdk
      appID={appID}
      publicKey={publicKey}
      type={type}
      env={env}
      config={config}
      userData={userData}
      metadata={metadata}
      response={safeResponse}
    />
  )
}
