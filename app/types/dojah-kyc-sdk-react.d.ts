declare module 'dojah-kyc-sdk-react' {
  import type { ComponentType } from 'react'

  type DojahResponseEvent = 'loading' | 'start' | 'success' | 'error' | 'close'

  export type DojahKycSdkProps = {
    appID: string
    publicKey: string
    type: string
    config?: Record<string, unknown>
    userData?: Record<string, unknown>
    metadata?: Record<string, unknown>
    govData?: Record<string, unknown>
    referenceId?: string
    env?: string
    response: (event: DojahResponseEvent | string, data?: unknown) => void
  }

  const DojahKycSdk: ComponentType<DojahKycSdkProps>
  export default DojahKycSdk
}
