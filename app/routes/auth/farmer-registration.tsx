import { useCallback, useMemo, useRef, useState } from 'react'

import { StepIndicator, SubStepIndicator } from '~/components/step-indicator'
import { COUNTRIES, DEFAULT_COUNTRY_CODE } from '~/lib/data/countries'
import { NIGERIA_STATES } from '~/lib/data/nigeria-states'
import type { Route } from './+types/farmer-registration'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Farmer Registration | Agtrail' },
    { name: 'description', content: 'Complete your farmer profile on Agtrail' },
  ]
}

/* ─── Icons ─── */

function LeafCheckIcon({ className = 'size-10' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-full bg-brand text-white ${className}`}>
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" fill="currentColor" stroke="none" />
        <path d="M7 13l3 3 7-7" stroke="white" />
      </svg>
    </div>
  )
}

function LocationIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ShieldIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

/* ─── Main steps config ─── */

const MAIN_STEPS = [
  { label: 'Location', icon: <LocationIcon /> },
  { label: 'Verification', icon: <ShieldIcon /> },
]

const VERIFICATION_SUB_STEPS = [
  { label: 'Country' },
  { label: 'ID' },
  { label: 'Selfie' },
  { label: 'Verify' },
]

/* ─── Shared input styles ─── */

const inputClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand'
const selectClass =
  'h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand appearance-none cursor-pointer'
const labelClass = 'block text-sm font-semibold text-gray-900'

/* ─── Page component ─── */

export default function FarmerRegistrationPage() {
  // Main step: 0 = Location, 1 = Verification
  const [mainStep, setMainStep] = useState(0)
  // Verification sub-step: 0 = Country, 1 = ID, 2 = Selfie, 3 = Verify
  const [verificationStep, setVerificationStep] = useState(0)

  // Location form state
  const [country, setCountry] = useState(DEFAULT_COUNTRY_CODE)
  const [phone, setPhone] = useState('')
  const [state, setState] = useState('')
  const [lga, setLga] = useState('')
  const [address, setAddress] = useState('')

  // Verification form state
  const [verificationCountry, setVerificationCountry] = useState(DEFAULT_COUNTRY_CODE)
  const [nin, setNin] = useState('')

  // Webcam ref for selfie
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [selfieCapture, setSelfieCapture] = useState<string | null>(null)

  // Derive LGAs from selected state
  const availableLgas = useMemo(() => {
    if (country !== 'NG' || !state) return []
    const found = NIGERIA_STATES.find((s) => s.name === state)
    return found?.lgas ?? []
  }, [country, state])

  // Whether to show Nigeria-specific fields (State / LGA)
  const isNigeria = country === 'NG'

  const handleContinueToVerification = useCallback(() => {
    setMainStep(1)
    setVerificationStep(0)
  }, [])

  const handleBackToLocation = useCallback(() => {
    setMainStep(0)
  }, [])

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setCameraActive(true)
      }
    } catch {
      // Camera not available
    }
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)
    setSelfieCapture(canvas.toDataURL('image/jpeg'))

    // Stop camera
    const stream = videoRef.current.srcObject as MediaStream | null
    stream?.getTracks().forEach((t) => t.stop())
    setCameraActive(false)
    setVerificationStep(3)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg">
        {/* ─── Header ─── */}
        <div className="flex flex-col items-center">
          <LeafCheckIcon className="size-12" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Farmer Registration</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete your profile to start using AgTrail
          </p>
        </div>

        {/* ─── Main step indicator ─── */}
        <StepIndicator steps={MAIN_STEPS} currentStep={mainStep} className="mt-6" />

        {/* ─── Step Content ─── */}
        <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          {mainStep === 0 && (
            <LocationStep
              country={country}
              setCountry={(c) => { setCountry(c); setState(''); setLga('') }}
              phone={phone}
              setPhone={setPhone}
              state={state}
              setState={(s) => { setState(s); setLga('') }}
              lga={lga}
              setLga={setLga}
              address={address}
              setAddress={setAddress}
              isNigeria={isNigeria}
              availableLgas={availableLgas}
              onContinue={handleContinueToVerification}
            />
          )}

          {mainStep === 1 && (
            <VerificationStep
              subStep={verificationStep}
              setSubStep={setVerificationStep}
              country={verificationCountry}
              setCountry={setVerificationCountry}
              nin={nin}
              setNin={setNin}
              videoRef={videoRef}
              cameraActive={cameraActive}
              selfieCapture={selfieCapture}
              startCamera={startCamera}
              capturePhoto={capturePhoto}
              onBackToProfile={handleBackToLocation}
            />
          )}
        </div>

        {/* ─── Terms footer ─── */}
        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to AgTrail&apos;s{' '}
          <a href="#" className="underline">Terms of Service</a> and{' '}
          <a href="#" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Step 1 — Location
   ═══════════════════════════════════════════ */

interface LocationStepProps {
  country: string
  setCountry: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  state: string
  setState: (v: string) => void
  lga: string
  setLga: (v: string) => void
  address: string
  setAddress: (v: string) => void
  isNigeria: boolean
  availableLgas: string[]
  onContinue: () => void
}

function LocationStep({
  country, setCountry,
  phone, setPhone,
  state, setState,
  lga, setLga,
  address, setAddress,
  isNigeria,
  availableLgas,
  onContinue,
}: LocationStepProps) {
  return (
    <div className="space-y-5">
      {/* Country */}
      <div className="space-y-1.5">
        <label htmlFor="reg-country" className={labelClass}>
          Country <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="reg-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={selectClass}
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <ChevronDown />
        </div>
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label htmlFor="reg-phone" className={labelClass}>
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          id="reg-phone"
          type="tel"
          placeholder="+234 800 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* State (Nigeria-specific) */}
      {isNigeria && (
        <div className="space-y-1.5">
          <label htmlFor="reg-state" className={labelClass}>
            State <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              id="reg-state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={selectClass}
            >
              <option value="">Select State</option>
              {NIGERIA_STATES.map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      )}

      {/* LGA (depends on state) */}
      {isNigeria && (
        <div className="space-y-1.5">
          <label htmlFor="reg-lga" className={labelClass}>
            Local Government Area
          </label>
          <div className="relative">
            <select
              id="reg-lga"
              value={lga}
              onChange={(e) => setLga(e.target.value)}
              disabled={!state}
              className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">{state ? 'Select LGA' : 'Select a state first'}</option>
              {availableLgas.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      )}

      {/* Address */}
      <div className="space-y-1.5">
        <label htmlFor="reg-address" className={labelClass}>
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reg-address"
          rows={3}
          placeholder="Enter your full address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          className="h-11 flex-1 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light"
        >
          Continue to Verification
          <ArrowRightIcon />
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Step 2 — Verification
   ═══════════════════════════════════════════ */

interface VerificationStepProps {
  subStep: number
  setSubStep: (v: number) => void
  country: string
  setCountry: (v: string) => void
  nin: string
  setNin: (v: string) => void
  videoRef: React.RefObject<HTMLVideoElement | null>
  cameraActive: boolean
  selfieCapture: string | null
  startCamera: () => void
  capturePhoto: () => void
  onBackToProfile: () => void
}

function VerificationStep({
  subStep, setSubStep,
  country, setCountry,
  nin, setNin,
  videoRef,
  cameraActive,
  selfieCapture,
  startCamera,
  capturePhoto,
  onBackToProfile,
}: VerificationStepProps) {
  return (
    <div className="space-y-6">
      {/* Verification sub-step indicator */}
      <SubStepIndicator steps={VERIFICATION_SUB_STEPS} currentStep={subStep} />

      {/* Sub-step content */}
      {subStep === 0 && (
        <VerifyCountrySubStep
          country={country}
          setCountry={setCountry}
          onContinue={() => setSubStep(1)}
          onBackToProfile={onBackToProfile}
        />
      )}

      {subStep === 1 && (
        <VerifyIdSubStep
          nin={nin}
          setNin={setNin}
          onContinue={() => { setSubStep(2); }}
          onChangeCountry={() => setSubStep(0)}
          onBackToProfile={onBackToProfile}
        />
      )}

      {subStep === 2 && (
        <VerifySelfieSubStep
          videoRef={videoRef}
          cameraActive={cameraActive}
          startCamera={startCamera}
          capturePhoto={capturePhoto}
          onBackToProfile={onBackToProfile}
        />
      )}

      {subStep === 3 && (
        <VerifyCompleteSubStep
          selfieCapture={selfieCapture}
          onBackToProfile={onBackToProfile}
        />
      )}
    </div>
  )
}

/* ─── Sub-step 1: Country ─── */

function VerifyCountrySubStep({
  country, setCountry, onContinue, onBackToProfile,
}: {
  country: string
  setCountry: (v: string) => void
  onContinue: () => void
  onBackToProfile: () => void
}) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex size-12 items-center justify-center rounded-full border-2 border-brand text-brand">
        <ShieldIcon className="size-6" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">Identity Verification</h2>
        <p className="mt-1 text-sm text-gray-500">Select your country to get started</p>
      </div>

      <div className="w-full space-y-1.5">
        <label htmlFor="verify-country" className={labelClass}>
          Country <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="verify-country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={selectClass}
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <ChevronDown />
        </div>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={!country}
        className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
      >
        Continue
      </button>

      <button
        type="button"
        className="h-11 w-full rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Skip for now
      </button>

      <button type="button" onClick={onBackToProfile} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon /> Back to edit profile
      </button>
    </div>
  )
}

/* ─── Sub-step 2: ID (NIN) ─── */

function VerifyIdSubStep({
  nin, setNin, onContinue, onChangeCountry, onBackToProfile,
}: {
  nin: string
  setNin: (v: string) => void
  onContinue: () => void
  onChangeCountry: () => void
  onBackToProfile: () => void
}) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex size-12 items-center justify-center rounded-full border-2 border-brand text-brand">
        <ShieldIcon className="size-6" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">Identity Verification</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your National Identity Number (NIN)</p>
      </div>

      <div className="w-full space-y-1.5">
        <label htmlFor="verify-nin" className={labelClass}>
          National Identity Number (NIN) <span className="text-red-500">*</span>
        </label>
        <input
          id="verify-nin"
          type="text"
          inputMode="numeric"
          maxLength={11}
          placeholder="12345678901"
          value={nin}
          onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
          className={`${inputClass} text-center tracking-widest`}
        />
        <p className="text-xs text-gray-400">
          Your NIN is 11 digits found on your National ID card or NIN slip
        </p>
      </div>

      <button
        type="button"
        onClick={onContinue}
        disabled={nin.length !== 11}
        className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
      >
        Continue to Selfie
      </button>

      <button type="button" onClick={onChangeCountry} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        ← Change country
      </button>

      <button
        type="button"
        className="h-11 w-full rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Skip for now
      </button>

      <button type="button" onClick={onBackToProfile} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon /> Back to edit profile
      </button>
    </div>
  )
}

/* ─── Sub-step 3: Selfie ─── */

function VerifySelfieSubStep({
  videoRef, cameraActive, startCamera, capturePhoto, onBackToProfile,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  cameraActive: boolean
  startCamera: () => void
  capturePhoto: () => void
  onBackToProfile: () => void
}) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">Take a Selfie</h2>
        <p className="mt-1 text-sm text-gray-500">Position your face in the frame and capture</p>
      </div>

      {/* Camera viewfinder */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {/* Oval guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-48 rounded-full border-2 border-white/50" />
        </div>

        {!cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <button
              type="button"
              onClick={startCamera}
              className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium text-white hover:bg-white/30"
            >
              <CameraIcon /> Enable Camera
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={capturePhoto}
        disabled={!cameraActive}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light disabled:opacity-50"
      >
        <CameraIcon /> Capture Photo
      </button>

      <button type="button" onClick={onBackToProfile} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon /> Back to edit profile
      </button>
    </div>
  )
}

/* ─── Sub-step 4: Verify complete ─── */

function VerifyCompleteSubStep({
  selfieCapture, onBackToProfile,
}: {
  selfieCapture: string | null
  onBackToProfile: () => void
}) {
  return (
    <div className="flex flex-col items-center space-y-5">
      <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-brand">
        <svg className="size-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900">Verification Submitted</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your identity verification is being processed. We&apos;ll notify you once it&apos;s complete.
        </p>
      </div>

      {selfieCapture && (
        <img
          src={selfieCapture}
          alt="Captured selfie"
          className="size-24 rounded-full border-2 border-brand object-cover"
        />
      )}

      <button
        type="button"
        className="h-11 w-full rounded-lg bg-brand text-sm font-semibold text-white transition-colors hover:bg-brand-light"
      >
        Go to Dashboard
      </button>

      <button type="button" onClick={onBackToProfile} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeftIcon /> Back to edit profile
      </button>
    </div>
  )
}

/* ─── Shared chevron icon for selects ─── */

function ChevronDown() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <svg className="size-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  )
}
