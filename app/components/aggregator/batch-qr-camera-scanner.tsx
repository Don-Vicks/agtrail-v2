import { BrowserQRCodeReader, type IScannerControls } from '@zxing/browser'
import { Loader2, ScanLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '~/lib/utils'

type BatchQrCameraScannerProps = {
  active: boolean
  onDecoded: (text: string) => void
  onScannerError?: (message: string) => void
  className?: string
}

/**
 * Live QR scan from the device camera using @zxing/browser.
 * Stops the stream when `active` becomes false or after a successful decode (parent should set active false).
 */
export function BatchQrCameraScanner({
  active,
  onDecoded,
  onScannerError,
  className,
}: BatchQrCameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const controlsRef = useRef<IScannerControls | null>(null)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!active) {
      controlsRef.current?.stop()
      controlsRef.current = null
      setStarting(false)
      return
    }

    const video = videoRef.current
    if (!video) return

    let cancelled = false
    const reader = new BrowserQRCodeReader()

    setStarting(true)

    reader
      .decodeFromConstraints(
        {
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        },
        video,
        (result, _err, controls) => {
          if (cancelled || !result) return
          const text = result.getText()?.trim()
          if (!text) return
          controls.stop()
          controlsRef.current = null
          onDecoded(text)
        },
      )
      .then((controls) => {
        if (cancelled) {
          controls.stop()
          return
        }
        controlsRef.current = controls
        setStarting(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setStarting(false)
        const msg =
          e instanceof Error
            ? e.message
            : typeof e === 'string'
              ? e
              : 'Could not access the camera. Check permissions and HTTPS.'
        onScannerError?.(msg)
      })

    return () => {
      cancelled = true
      controlsRef.current?.stop()
      controlsRef.current = null
      setStarting(false)
    }
  }, [active, onDecoded, onScannerError])

  return (
    <div className={cn('relative isolate h-full min-h-[200px] w-full overflow-hidden rounded-md bg-black', className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
      />

      {/* Viewfinder */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
        <div className="relative aspect-square w-[min(72%,260px)] rounded-lg border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
          <div className="absolute -left-0.5 -top-0.5 size-5 border-l-2 border-t-2 border-brand" />
          <div className="absolute -right-0.5 -top-0.5 size-5 border-r-2 border-t-2 border-brand" />
          <div className="absolute -bottom-0.5 -left-0.5 size-5 border-b-2 border-l-2 border-brand" />
          <div className="absolute -bottom-0.5 -right-0.5 size-5 border-b-2 border-r-2 border-brand" />
        </div>
      </div>

      {starting ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#1a4332]/85 text-white">
          <Loader2 className="size-8 animate-spin text-white/90" />
          <p className="text-[10px] font-bold uppercase tracking-widest">Starting camera…</p>
        </div>
      ) : null}

      {!active ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#1a4332] text-white">
          <ScanLine className="size-8 text-white/25" />
          <p className="text-xs font-bold tracking-tight">Camera off</p>
          <p className="text-[9px] font-bold uppercase tracking-widest text-white/55">Tap “Start camera” to scan</p>
        </div>
      ) : null}
    </div>
  )
}
