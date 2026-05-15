import { useQueryClient } from '@tanstack/react-query'
import { getStateByCode } from 'ng-geo-data'
import { useCallback, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { toast } from 'sonner'
import { GoogleMapPolygonPicker } from '~/components/google-map-polygon-picker.client'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import { usePostFarms } from '~/lib/api/generated/farms/farms'
import { useGetUsersProfile } from '~/lib/api/generated/users/users'
import { getKycStatusFromUsersProfileBody, isVerifiedKycStatus } from '~/lib/kyc'
import { sortedLgasForStateCode, sortedNigeriaStates } from '~/lib/nigeria-geo-options'
import { cn } from '~/lib/utils'

// ─── Area calculation utility ──────────────────────────────────────
function calculatePolygonArea(points: [number, number][]): number {
  if (points.length < 3) return 0

  // Shoelace formula on lat/lng (approximate, converts to meters)
  const toRadians = (deg: number) => (deg * Math.PI) / 180
  const R = 6371000 // Earth radius in meters

  let area = 0
  const n = points.length

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n
    const lat1 = toRadians(points[i][0])
    const lat2 = toRadians(points[j][0])
    const dLng = toRadians(points[j][1] - points[i][1])
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2))
  }

  area = Math.abs((area * R * R) / 2)
  return area
}

// ─── Step Indicator ────────────────────────────────────────────────
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { number: 1, label: 'Farm Details' },
    { number: 2, label: 'Map Boundaries' },
    { number: 3, label: 'Farm Ownership' },
    { number: 4, label: 'Deforestation Risk' },
    { number: 5, label: 'Review & Confirm' },
  ]

  return (
    <div className="flex items-start px-4 pb-6">
      {steps.map((s, index) => (
        <div key={s.number} className={cn('flex items-start', index < steps.length - 1 && 'flex-1')}>
          <div className="flex min-w-[76px] flex-col items-center">
            <div
              className={cn(
                'flex size-10 items-center justify-center rounded-full text-sm font-bold transition-colors',
                currentStep > s.number
                  ? 'bg-brand text-white'
                  : currentStep === s.number
                    ? 'bg-brand text-white'
                    : 'border-2 border-gray-200 text-gray-400'
              )}
            >
              {currentStep > s.number ? (
                <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                s.number
              )}
            </div>
            <span
              className={cn(
                'mt-1.5 max-w-[74px] text-center text-[10px] leading-3 font-medium',
                currentStep >= s.number ? 'text-gray-900' : 'text-gray-400'
              )}
            >
              {s.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-1.5 mt-5 h-0.5 flex-1',
                currentStep > s.number ? 'bg-brand' : 'bg-gray-200'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────
interface CreateFarmModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateFarmModal({ isOpen, onClose }: CreateFarmModalProps) {
  const location = useLocation()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    farmName: '',
    /** Nigerian state code from `ng-geo-data` (e.g. LA, FC) */
    stateCode: '',
    lga: '',
    farmRegion: '',
    address: '',
  })
  const [boundaryPoints, setBoundaryPoints] = useState<[number, number][]>([])
  const [ownershipData, setOwnershipData] = useState({
    ownerFullName: '',
    nationalId: '',
    phoneNumber: '',
    gender: '',
    documentType: '',
    documentNumber: '',
    dateIssued: '',
    issuingAuthority: '',
    leaseActive: '',
    isFarmerOwner: '',
    documentFileName: '',
  })
  const [deforestationRiskAcknowledged, setDeforestationRiskAcknowledged] = useState(false)
  const { data: profileResponse, isLoading: isProfileLoading } = useGetUsersProfile()
  const kycStatus = getKycStatusFromUsersProfileBody(profileResponse?.data)
  const isKycVerified = isVerifiedKycStatus(kycStatus)
  const kycSettingsPath = location.pathname.startsWith('/cooperative')
    ? '/cooperative/settings?tab=kyc'
    : location.pathname.startsWith('/processor')
      ? '/processor/settings?tab=kyc'
      : '/farmer/settings?tab=kyc'

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOwnershipFieldChange = (field: string, value: string) => {
    setOwnershipData((prev) => ({ ...prev, [field]: value }))
  }

  const statesSorted = useMemo(() => sortedNigeriaStates(), [])

  const lgasForState = useMemo(
    () => sortedLgasForStateCode(formData.stateCode),
    [formData.stateCode],
  )

  const validateCurrentStep = (): boolean => {
    if (step === 1) {
      if (!formData.farmName.trim()) {
        toast.error('Farm name is required.')
        return false
      }
      if (!formData.stateCode.trim()) {
        toast.error('State is required.')
        return false
      }
      if (!formData.lga.trim()) {
        toast.error('LGA is required.')
        return false
      }
      if (!formData.address.trim()) {
        toast.error('Address is required.')
        return false
      }
    }

    if (step === 2 && boundaryPoints.length < 3) {
      toast.error('Please add at least 3 boundary points on the map.')
      return false
    }

    if (step === 3) {
      const requiredFields: Array<keyof typeof ownershipData> = [
        'ownerFullName',
        'nationalId',
        'phoneNumber',
        'gender',
        'documentType',
        'documentNumber',
        'dateIssued',
        'issuingAuthority',
        'leaseActive',
        'isFarmerOwner',
      ]
      const missing = requiredFields.find((key) => !ownershipData[key]?.trim())
      if (missing) {
        toast.error('Please complete all required ownership fields.')
        return false
      }
    }

    if (step === 4 && !deforestationRiskAcknowledged) {
      toast.error('Please acknowledge the deforestation risk decision before continuing.')
      return false
    }

    return true
  }

  const handleAddPoint = useCallback((lat: number, lng: number) => {
    setBoundaryPoints((prev) => [...prev, [lat, lng]])
  }, [])

  const handleRemoveLastPoint = () => {
    setBoundaryPoints((prev) => prev.slice(0, -1))
  }

  const handleClearPoints = () => {
    setBoundaryPoints([])
  }

  const handleClose = () => {
    setStep(1)
    setFormData({ farmName: '', stateCode: '', lga: '', farmRegion: '', address: '' })
    setBoundaryPoints([])
    setOwnershipData({
      ownerFullName: '',
      nationalId: '',
      phoneNumber: '',
      gender: '',
      documentType: '',
      documentNumber: '',
      dateIssued: '',
      issuingAuthority: '',
      leaseActive: '',
      isFarmerOwner: '',
      documentFileName: '',
    })
    setDeforestationRiskAcknowledged(false)
    onClose()
  }

  const queryClient = useQueryClient()
  const { mutate: createFarm, isPending } = usePostFarms({
    request: {
      headers: { 'X-Offline-Label': 'Create farm' }
    },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [`/farms`] })
        toast.success('Farm created successfully')
        handleClose()
      },
      onError: (err: any) => {
        console.error('Failed to create farm:', err)
        toast.error(err.response?.data?.message || 'Failed to create farm')
      }
    }
  })

  const submitFarm = () => {
    if (!isKycVerified) {
      toast.error('KYC must be verified before creating farm plots.')
      return
    }

    if (!deforestationRiskAcknowledged) {
      toast.error('Please acknowledge the deforestation risk decision before creating this farm.')
      return
    }

    const stateName = getStateByCode(formData.stateCode)?.name
    if (
      !formData.farmName.trim() ||
      !formData.stateCode.trim() ||
      !stateName ||
      !formData.lga.trim() ||
      !formData.address.trim()
    ) {
      toast.error('Farm name, state, LGA, and address are required.')
      return
    }

    let boundaries = null
    let gpsCoordinates = null
    if (boundaryPoints.length >= 3) {
      // GeoJSON expects [lng, lat]
      const closedPoints = [...boundaryPoints]
      const first = closedPoints[0]
      const last = closedPoints[closedPoints.length - 1]
      // Ensure the polygon refers back to the first point
      if (first[0] !== last[0] || first[1] !== last[1]) {
        closedPoints.push(first)
      }
      boundaries = {
        type: 'Polygon',
        coordinates: [closedPoints.map(p => [p[1], p[0]])]
      }
      // Set gpsCoordinates to the first point
      gpsCoordinates = {
        type: 'Point',
        coordinates: [first[1], first[0]]
      }
    }

    createFarm({
      data: {
        name: formData.farmName,
        state: stateName || undefined,
        lga: formData.lga || undefined,
        region: formData.farmRegion || undefined,
        address: formData.address || undefined,
        boundaries,
        gpsCoordinates,
      }
    })
  }

  if (!isOpen) return null

  const areaSqMeters = calculatePolygonArea(boundaryPoints)
  const areaHectares = areaSqMeters / 10000

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose() }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden outline-none duration-200 sm:max-w-160"
        showCloseButton={false}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <DialogHeader className="flex flex-row items-start justify-between p-6 pb-4">
            <div className="text-left space-y-1">
              <DialogTitle className="text-xl font-bold text-brand">
                Create New Farm - Step {step} of 5
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500">
                {step === 1 && 'Enter the basic details of your farm'}
                {step === 2 && 'Map your farm boundaries using GPS coordinates'}
                {step === 3 && 'Provide farm ownership and tenure documentation'}
                {step === 4 && 'Review deforestation risk checks for this farm'}
                {step === 5 && 'Review your farm information before submitting'}
              </DialogDescription>
            </div>
            <button
              onClick={handleClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </DialogHeader>

          {!isProfileLoading && !isKycVerified ? (
            <div className="px-6 pb-6">
              <div className="rounded-md border border-amber-200 bg-amber-50/60 p-5">
                <p className="text-sm font-semibold text-amber-900">KYC verification required</p>
                <p className="mt-1 text-xs text-amber-800">
                  You cannot create farm plots until your KYC status is verified.
                </p>
                <div className="mt-4">
                  <Link
                    to={kycSettingsPath}
                    className="inline-flex items-center rounded-md border border-brand bg-white px-4 py-2 text-sm font-medium text-brand hover:bg-brand-surface transition-colors"
                  >
                    Complete KYC
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Step Indicator */}
              <StepIndicator currentStep={step} />

              {/* ─── Step 1: Farm Details ─────────────────────── */}
              {step === 1 && (
                <div className="space-y-4 px-6">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-900">
                      Farm Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Sunshine Farm"
                      value={formData.farmName}
                      onChange={(e) => handleFieldChange('farmName', e.target.value)}
                      className="py-5"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        State <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.stateCode || undefined}
                        onValueChange={(val) => {
                          setFormData((prev) => ({
                            ...prev,
                            stateCode: val || '',
                            lga: '',
                          }))
                        }}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {statesSorted.map((s) => (
                            <SelectItem key={s.code} value={s.code}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        LGA <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={formData.lga || undefined}
                        onValueChange={(val) => handleFieldChange('lga', val || '')}
                        disabled={!formData.stateCode}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue
                            placeholder={
                              formData.stateCode ? 'Select an LGA' : 'Select a state first'
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {lgasForState.map((lga) => (
                            <SelectItem key={`${lga.state}-${lga.name}`} value={lga.name}>
                              {lga.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-900">Farm Region</label>
                    <Input
                      placeholder="e.g., Ekirin"
                      value={formData.farmRegion}
                      onChange={(e) => handleFieldChange('farmRegion', e.target.value)}
                      className="py-5"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-900">Address</label>
                    <Textarea
                      placeholder="Enter the full address of the farm"
                      value={formData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ─── Step 2: Map Boundaries ──────────────────── */}
              {step === 2 && (
                <div className="space-y-4 px-6 relative w-full h-full flex grow flex-col">
                  {/* Instructions */}
                  <div className="rounded-md bg-[#f0f6ff] p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-gray-900">Instructions:</span>{' '}
                      <span className="text-gray-600">
                        Click on the map to add boundary points. Add at least 3 points to define your farm boundaries.
                      </span>
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-700">
                      Points Added: {boundaryPoints.length}
                    </p>
                  </div>

                  {/* Boundary Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-md border border-gray-200 bg-[#f0f6ff] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#1e3b8a]">Points</span>
                        <svg className="size-4 text-[#1e3b8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-[#1e3b8a]">{boundaryPoints.length}</p>
                      <p className="text-xs text-gray-500">Add points to map</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-[#e4fded] p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#1b8341]">Hectares</span>
                        <svg className="size-4 text-[#1b8341]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-[#1b8341]">{areaHectares.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">Estimated area</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-brand-surface/30 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-brand">Sq. Meters</span>
                        <svg className="size-4 text-brand-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{Math.round(areaSqMeters)}</p>
                      <p className="text-xs text-gray-400">Total area</p>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="overflow-hidden rounded-md border border-gray-200 w-full grow min-h-[400px]">
                    <GoogleMapPolygonPicker
                      points={boundaryPoints}
                      onAddPoint={handleAddPoint}
                      minHeightPx={400}
                    />
                  </div>

                  {/* Point controls */}
                  {boundaryPoints.length > 0 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleRemoveLastPoint}
                        className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                      >
                        Undo Last Point
                      </button>
                      <button
                        onClick={handleClearPoints}
                        className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Clear All Points
                      </button>
                      <span className="ml-auto text-xs text-gray-400">
                        {boundaryPoints.length < 3
                          ? `Need ${3 - boundaryPoints.length} more point${3 - boundaryPoints.length > 1 ? 's' : ''}`
                          : '✓ Boundary defined'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ─── Step 3: Farm Ownership ───────────────── */}
              {step === 3 && (
                <div className="space-y-4 px-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Full legal name of the farm owner <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Sunshine Farm"
                        value={ownershipData.ownerFullName}
                        onChange={(e) => handleOwnershipFieldChange('ownerFullName', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        National ID <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., A1234567890"
                        value={ownershipData.nationalId}
                        onChange={(e) => handleOwnershipFieldChange('nationalId', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="+234 800 000 0000"
                        value={ownershipData.phoneNumber}
                        onChange={(e) => handleOwnershipFieldChange('phoneNumber', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ownershipData.gender || undefined}
                        onValueChange={(val) => handleOwnershipFieldChange('gender', val || '')}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Type of document held <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ownershipData.documentType || undefined}
                        onValueChange={(val) => handleOwnershipFieldChange('documentType', val || '')}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="certificate-of-occupancy">Certificate of Occupancy</SelectItem>
                          <SelectItem value="lease-agreement">Lease Agreement</SelectItem>
                          <SelectItem value="deed-of-assignment">Deed of Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Document number/reference <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Enter reference number"
                        value={ownershipData.documentNumber}
                        onChange={(e) => handleOwnershipFieldChange('documentNumber', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Date issued <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={ownershipData.dateIssued}
                        onChange={(e) => handleOwnershipFieldChange('dateIssued', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Issuing authority <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Land Registry"
                        value={ownershipData.issuingAuthority}
                        onChange={(e) => handleOwnershipFieldChange('issuingAuthority', e.target.value)}
                        className="py-5"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Is the ownership/lease still active? <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ownershipData.leaseActive || undefined}
                        onValueChange={(val) => handleOwnershipFieldChange('leaseActive', val || '')}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-900">
                        Is the farmer the owner? <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={ownershipData.isFarmerOwner || undefined}
                        onValueChange={(val) => handleOwnershipFieldChange('isFarmerOwner', val || '')}
                      >
                        <SelectTrigger className="w-full py-5 text-gray-500 font-normal">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Upload Document <span className="text-red-500">*</span>
                    </p>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 px-4 py-10 text-center hover:bg-gray-50">
                      <svg className="mb-3 size-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path d="M12 16V4m0 0l-4 4m4-4l4 4" />
                        <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                      </svg>
                      <p className="text-base font-medium text-gray-700">
                        {ownershipData.documentFileName || 'Click to upload or drag and drop'}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                        Max file size 10MB (PDF, JPG, PNG)
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) =>
                          handleOwnershipFieldChange('documentFileName', e.target.files?.[0]?.name || '')
                        }
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ─── Step 4: Deforestation Risk ───────────────── */}
              {step === 4 && (
                <div className="space-y-4 px-6">
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <div className="relative min-h-[360px]">
                      <GoogleMapPolygonPicker
                        points={boundaryPoints}
                        onAddPoint={() => undefined}
                        minHeightPx={360}
                      />
                      <button
                        type="button"
                        className="absolute left-3 top-3 rounded-md border border-blue-100 bg-white px-3 py-1.5 text-sm font-medium text-blue-600 shadow-sm"
                      >
                        View larger map
                      </button>
                      <div className="absolute right-3 top-3 w-[280px] rounded-md border border-gray-200 bg-white/95 p-2.5 shadow-sm">
                        <Badge className="mb-2 bg-green-100 text-[10px] font-bold uppercase text-green-700">
                          Eligible
                        </Badge>
                        <ul className="space-y-2">
                          <li className="text-xs font-medium text-gray-700">Geolocation validation</li>
                          <li className="text-xs font-medium text-gray-700">2020 forest baseline check</li>
                          <li className="text-xs font-medium text-gray-700">Canopy loss detection - 31%</li>
                          <li className="text-xs font-medium text-gray-700">Protected area cross-ref</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-dashed border-gray-200 bg-white px-4 py-4 text-center">
                    <h3 className="text-xl font-bold text-gray-900">Decision Narrative</h3>
                    <p className="mt-2 text-base font-medium italic leading-relaxed text-gray-700">
                      "Geolocation verified and the farm is eligible. No forest conversion detected
                      since 2018. Full land tenure documents verified."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
                      <p className="text-xs font-medium text-gray-600">Alert Detected</p>
                      <p className="mt-1 text-xl font-bold text-[#d26e1f]">0</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
                      <p className="text-xs font-medium text-gray-600">Intensity</p>
                      <p className="mt-1 text-xl font-bold text-[#d26e1f]">0.00</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
                      <p className="text-xs font-medium text-gray-600">Confidence</p>
                      <p className="mt-1 text-xl font-bold text-[#d26e1f]">none</p>
                    </div>
                    <div className="rounded-md border border-gray-200 bg-white p-3 text-center">
                      <p className="text-xs font-medium text-gray-600">Canopy loss</p>
                      <p className="mt-1 text-xl font-bold text-[#d26e1f]">0</p>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50/70 p-4 text-left">
                    <input
                      type="checkbox"
                      checked={deforestationRiskAcknowledged}
                      onChange={(e) => setDeforestationRiskAcknowledged(e.target.checked)}
                      className="mt-0.5 size-4 rounded border-amber-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm leading-5 text-amber-900">
                      I acknowledge the deforestation risk decision and confirm this farm plot is eligible for
                      registration based on the displayed checks.
                    </span>
                  </label>
                </div>
              )}

              {/* ─── Step 5: Review & Confirm ───────────────── */}
              {step === 5 && (
                <div className="space-y-4 px-6">
                  <h3 className="text-base font-semibold text-gray-900">Review Farm Information</h3>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 rounded-md border border-gray-100 bg-gray-50/50 p-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Farm Name</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.farmName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Owner Name</p>
                      <p className="text-sm font-semibold text-gray-900">{ownershipData.ownerFullName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">State</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getStateByCode(formData.stateCode)?.name || '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">LGA</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.lga || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Farm Region</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.farmRegion || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Boundary Points</p>
                      <p className="text-sm font-semibold text-gray-900">{boundaryPoints.length} points</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Calculated Area</p>
                      <p className="text-sm font-semibold text-brand-light">{areaHectares.toFixed(2)} hectares</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Address</p>
                      <p className="text-sm font-semibold text-gray-900">{formData.address || '—'}</p>
                    </div>
                  </div>

                  <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Note:</span>{' '}
                      Please review all information carefully before creating the farm. You can go back to edit any details.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between p-6 pt-6">
            <Button
              variant="outline"
              onClick={() => (step > 1 ? setStep(step - 1) : handleClose())}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Button>

            <Button
              onClick={() => {
                if (!isKycVerified) {
                  toast.error('KYC must be verified before creating farm plots.')
                  return
                }
                if (step < 5) {
                  if (!validateCurrentStep()) return
                  setStep(step + 1)
                  return
                }

                if (!validateCurrentStep()) return
                submitFarm()
              }}
              disabled={
                !isKycVerified ||
                isProfileLoading ||
                (step === 2 && boundaryPoints.length < 3) ||
                isPending
              }
              className="flex items-center gap-1.5 bg-brand text-white hover:bg-brand-dark px-5"
            >
              {isPending ? 'Creating...' : step < 5 ? 'Next' : 'Create Farm'}
              {step < 5 && !isPending && (
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
