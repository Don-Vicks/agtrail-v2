import { useEffect, useRef } from 'react'

const DEFAULT_WIDGET_URI = 'https://widget.dojah.io/widget.js'

type ConnectInstance = {
  setup: () => void
  open: () => void
}

declare global {
  interface Window {
    Connect?: new (options: Record<string, unknown>) => ConnectInstance
    dojah?: { uri?: string }
  }
}

export type DojahWidgetProps = {
  appID: string
  publicKey: string
  type: string
  config: Record<string, unknown>
  userData?: Record<string, unknown>
  metadata?: Record<string, unknown>
  response: (type: string, data?: unknown) => void
}

/**
 * Drop-in replacement for `react-dojah` with safe teardown.
 * Upstream `react-dojah` calls `document.head.removeChild(script)` on unmount even when
 * the widget already removed the script via `script.remove()`, which throws NotFoundError.
 */
export function DojahWidget({
  appID,
  publicKey,
  type,
  config,
  userData,
  metadata,
  response,
}: DojahWidgetProps) {
  const cancelledRef = useRef(false)
  const scriptRef = useRef<HTMLScriptElement | null>(null)
  const responseRef = useRef(response)
  responseRef.current = response

  const configRef = useRef(config)
  const userDataRef = useRef(userData)
  const metadataRef = useRef(metadata)
  configRef.current = config
  userDataRef.current = userData
  metadataRef.current = metadata

  const emit = (event: string, data?: unknown) => {
    responseRef.current(event, data)
  }

  useEffect(() => {
    cancelledRef.current = false

    const removeScriptSafe = () => {
      const script = scriptRef.current
      if (!script) return
      script.removeEventListener('load', onScriptLoad)
      script.removeEventListener('error', onScriptError)
      try {
        script.remove()
      } catch {
        // Node may already be detached (widget callbacks call remove() too).
      }
      scriptRef.current = null
    }

    const openWidget = () => {
      if (cancelledRef.current) return
      if (typeof window.Connect !== 'function') {
        emit('error', new Error('Dojah Connect failed to load'))
        return
      }

      const options: Record<string, unknown> = {
        app_id: appID,
        p_key: publicKey,
        type,
        config: configRef.current,
        metadata: metadataRef.current,
        user_data: userDataRef.current,
        _getLocation: () =>
          new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (location) => {
                resolve({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  accuracy: location.coords.accuracy,
                })
              },
              () => resolve(null),
            )
          }),
        onSuccess: (data: unknown) => {
          emit('success', data)
          removeScriptSafe()
        },
        onError: (err: unknown) => {
          emit('error', err)
          removeScriptSafe()
        },
        onClose: (err: unknown) => {
          emit('close', err)
          removeScriptSafe()
        },
      }

      const connect = new window.Connect!(options)
      connect.setup()
      connect.open()
    }

    const onScriptLoad = () => {
      if (cancelledRef.current) {
        removeScriptSafe()
        return
      }
      emit('start')
      openWidget()
    }

    const onScriptError = () => {
      emit('error', new Error('Failed to load Dojah widget script'))
      removeScriptSafe()
    }

    const uri = window.dojah?.uri || DEFAULT_WIDGET_URI
    emit('loading')

    const script = document.createElement('script')
    script.async = true
    script.src = uri
    script.addEventListener('load', onScriptLoad)
    script.addEventListener('error', onScriptError)
    document.head.appendChild(script)
    scriptRef.current = script

    return () => {
      cancelledRef.current = true
      removeScriptSafe()
    }
  }, [appID, publicKey, type])

  return null
}
