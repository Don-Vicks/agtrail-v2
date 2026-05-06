import { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import type { OperationFormFooterValues } from '~/lib/operation-form-footer'
import {
  DEFAULT_OPERATION_FOOTER,
  validateOperationFormFooter,
} from '~/lib/operation-form-footer'
import type { OperationLayoutCropCycle } from '~/lib/operation-layout-types'
import { getOperationsListPath } from '~/lib/operations-list-path'
import { useWeather } from '~/hooks/use-weather'
import { cn } from '~/lib/utils'

interface OperationFormLayoutProps {
  title: string
  cropCycle: OperationLayoutCropCycle
  breadcrumbLabel: string
  children: React.ReactNode
  onSubmit: (
    e: React.FormEvent,
    footer: OperationFormFooterValues,
  ) => void | Promise<void>
  submitLabel: string
  organicWarning?: string
  isSubmitting?: boolean
}

export function OperationFormLayout({
  title,
  cropCycle,
  breadcrumbLabel,
  children,
  onSubmit,
  submitLabel,
  organicWarning,
  isSubmitting = false,
}: OperationFormLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const areaInputRef = useRef<HTMLInputElement>(null)
  
  const {
    weather,
    isLoading: isWeatherLoading,
    error: weatherError,
    hasCoordinates,
    refreshWeather,
  } = useWeather({
    latitude: cropCycle.latitude,
    longitude: cropCycle.longitude,
    locationQuery: `${cropCycle.farmName} ${cropCycle.farmLocation}`.trim(),
  })

  const [renewableEnergy, setRenewableEnergy] = useState(
    DEFAULT_OPERATION_FOOTER.renewableEnergy,
  )
  const [mainEnergySource, setMainEnergySource] = useState(
    DEFAULT_OPERATION_FOOTER.mainEnergySource,
  )
  const [weatherConditions, setWeatherConditions] = useState(
    DEFAULT_OPERATION_FOOTER.weatherConditions,
  )
  const [areaHectares, setAreaHectares] = useState(
    DEFAULT_OPERATION_FOOTER.areaHectares,
  )
  const [costNgn, setCostNgn] = useState(DEFAULT_OPERATION_FOOTER.costNgn)
  const [additionalNotes, setAdditionalNotes] = useState(
    DEFAULT_OPERATION_FOOTER.additionalNotes,
  )

  const basePath = location.pathname.startsWith('/cooperative')
    ? '/cooperative'
    : location.pathname.startsWith('/processor')
      ? '/processor'
      : location.pathname.startsWith('/field-agent')
        ? '/field-agent'
      : '/farmer'
  const operationsListHref = getOperationsListPath(location.pathname)

  const cycleAreaNumber = (() => {
    const a = cropCycle.area
    if (a == null || a === '') return null
    const n = typeof a === 'number' ? a : parseFloat(String(a))
    return Number.isFinite(n) && n > 0 ? n : null
  })()

  const applyCycleArea = () => {
    if (cycleAreaNumber == null) {
      toast.error('This crop cycle has no planted area on file. Enter hectares manually.')
      return
    }
    setAreaHectares(String(cycleAreaNumber))
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    
    // Extract operator name from the children fields if present
    const formData = new FormData(formEl)
    const personnelId =
      (formData.get('operator-personnel-id') as string) ||
      (formData.get('operator-name') as string) ||
      undefined

    if (!formEl.checkValidity()) {
      formEl.reportValidity()
      return
    }

    const footer: OperationFormFooterValues = {
      renewableEnergy,
      mainEnergySource,
      weatherConditions,
      weatherData: {
        temperature: weather.temperature,
        rainfall: weather.rainfall,
        notes: weather.notes,
      },
      areaHectares,
      costNgn,
      currency: 'NGN',
      additionalNotes,
      personnelId,
    }

    const footerCheck = validateOperationFormFooter(footer)
    if (!footerCheck.ok) {
      toast.error(footerCheck.message)
      return
    }

    await onSubmit(e, footer)
  }

  return (
    <div className="pb-12 text-left">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: basePath,
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Record Operation', href: operationsListHref },
          { label: breadcrumbLabel },
        ]}
      />

      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate(operationsListHref)}
            className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Crop Cycles
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold uppercase text-[#2b5314] tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">Record farm operation details</p>
        </div>

        <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A]">OPERATION CONTEXT</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-md bg-[#F8FCF9] p-5">
              <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">CROP CYCLE</p>
              <div className="mb-1 flex items-center gap-2">
                <span className="text-base font-bold text-gray-900">{cropCycle.productName}</span>
                <span className="flex items-center gap-1 rounded-full border border-green-200 bg-[#Edf8f0] px-2 py-[2px] text-[10px] font-medium text-[#166534]">
                  <svg className="size-2.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C22 3 21 8 17 8ZM11.95 18C9.52 18 7.15 17 5.25 15.34C6.56 12.3 9.4 6 20 5C19.78 12.06 16.57 18 11.95 18Z" />
                  </svg>
                  Organic
                </span>
              </div>
              <p className="mb-4 text-xs font-normal text-gray-500">Variety: <span className="font-semibold text-gray-900">{cropCycle.variety || 'N/A'}</span></p>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs text-gray-500">
                <span className="font-normal">Planted:</span><span className="text-right font-semibold text-gray-900">{cropCycle.plantedDate || 'N/A'}</span>
                <span className="font-normal">Area:</span>
                <span className="text-right font-semibold text-gray-900">
                  {cropCycle.area != null && cropCycle.area !== '' ? `${cropCycle.area} hectares` : 'N/A'}
                </span>
                <span className="font-normal">Season:</span><span className="text-right font-semibold text-gray-900">{cropCycle.season ? cropCycle.season.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'}</span>
              </div>
            </div>

            <div className="rounded-md bg-[#F8F9FD] p-5">
              <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">FARM</p>
              <p className="text-base font-bold text-gray-900">{cropCycle.farmName}</p>
              <p className="mt-1 text-sm font-normal text-gray-600">{cropCycle.farmLocation || 'Bagary Coconot Area'}</p>
            </div>

            <div className="rounded-md bg-[#FDFCF6] p-5">
              <p className="mb-2 text-[10px] uppercase font-semibold tracking-wider text-gray-500">FARMER</p>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm" style={{ backgroundColor: cropCycle.farmerColor || '#264d10' }}>
                  {cropCycle.farmerInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{cropCycle.farmer}</p>
                  <p className="text-[10px] font-normal text-gray-500 truncate max-w-[12rem]" title={cropCycle.id}>
                    Cycle ID: {cropCycle.id.slice(0, 8)}…
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {organicWarning && (
            <div className="rounded-md border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3">
              <p className="text-sm font-medium text-[#166534]">{organicWarning}</p>
            </div>
          )}

          <div className="rounded-md border border-gray-100 bg-white p-5 shadow-sm">
            <div className="space-y-6 text-left">
              <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#8A8A8A]">OPERATION DETAILS</h3>
              {children}
            </div>

            <div className="mt-8 space-y-6 border-t border-gray-100 pt-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-900 text-left">Do you use renewable energy?</label>
                  <select
                    name="opRenewableEnergy"
                    value={renewableEnergy}
                    onChange={(e) => setRenewableEnergy(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white"
                  >
                    <option value="no_traditional">No - Traditional energy</option>
                    <option value="solar">Yes - Solar</option>
                    <option value="wind">Yes - Wind</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-900 text-left">What is your main energy source? <span className="text-red-500">*</span></label>
                  <select
                    name="opMainEnergy"
                    required
                    value={mainEnergySource}
                    onChange={(e) => setMainEnergySource(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white"
                  >
                    <option value="">Select energy source</option>
                    <option value="grid">Grid Electricity</option>
                    <option value="diesel">Diesel Generator</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Weather Conditions</h3>
                  <button
                    type="button" 
                    disabled={isWeatherLoading || !hasCoordinates}
                    onClick={refreshWeather}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-[#1f3c0f] transition-colors disabled:opacity-50"
                  >
                    <svg className={cn("size-3.5", isWeatherLoading && "animate-spin")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    {isWeatherLoading ? 'Fetching...' : 'Refresh'}
                  </button>
                </div>
                <div className="rounded-md border border-gray-100 bg-gray-50 p-4">
                  {weatherError && (
                    <p className="mb-2 text-xs text-red-600">{weatherError}</p>
                  )}
                  <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">Temperature</p>
                      <p className="font-semibold text-gray-900">{weather.temperature}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">Humidity</p>
                      <p className="font-semibold text-gray-900">{weather.humidity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">Wind</p>
                      <p className="font-semibold text-gray-900">{weather.wind}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-500">Source</p>
                      <p className="font-semibold text-gray-900">{weather.source}</p>
                    </div>
                  </div>
                  <select
                    name="opWeather"
                    value={weatherConditions}
                    onChange={(e) => setWeatherConditions(e.target.value)}
                    className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm text-gray-700 bg-white"
                  >
                    <option value="sunny">Sunny</option>
                    <option value="cloudy">Cloudy</option>
                    <option value="rainy">Rainy</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 text-left">Area Covered (hectares) <span className="text-red-500">*</span></label>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={applyCycleArea}
                      className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3.5 py-1.5 text-sm font-medium text-[#2563EB] hover:bg-blue-100 transition-colors"
                    >
                      {cycleAreaNumber != null
                        ? `Use crop cycle area (${cycleAreaNumber} ha)`
                        : 'Use crop cycle area'}
                    </button>
                    <button
                      type="button"
                      onClick={applyCycleArea}
                      className="rounded-full border border-[#bbf7d0] bg-white px-3.5 py-1.5 text-sm font-medium text-[#16A34A] hover:bg-green-50 transition-colors"
                    >
                      Use full farm area
                    </button>
                    <button
                      type="button"
                      onClick={() => areaInputRef.current?.focus()}
                      className="flex items-center gap-1.5 rounded-full border border-[#fbd5a1] bg-[#FFF7ED] px-3.5 py-1.5 text-sm font-medium text-[#EA580C] hover:bg-orange-100 transition-colors"
                    >
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      Draw custom area
                    </button>
                  </div>
                  <input
                    ref={areaInputRef}
                    name="opAreaHa"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    required
                    value={areaHectares}
                    onChange={(e) => setAreaHectares(e.target.value)}
                    placeholder="Enter area in hectares"
                    className="w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900 text-left">Cost (₦)</label>
                  <input
                    name="opCost"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    value={costNgn}
                    onChange={(e) => setCostNgn(e.target.value)}
                    placeholder="Enter cost (optional)"
                    className="mt-7 w-full rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-900 text-left">Additional Notes</label>
                <textarea
                  name="opExtraNotes"
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional observations..."
                  className="w-full resize-none rounded-md border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-[#2b5314] py-3 text-sm font-bold text-white hover:bg-[#1f3c0f] shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-brand/20 disabled:pointer-events-none disabled:opacity-60"
              >
                {isSubmitting ? 'Saving…' : submitLabel}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
