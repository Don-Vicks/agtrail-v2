import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  LayoutDashboard,
  Package,
  Plus,
  QrCode,
  Settings,
  Loader2
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { DateTimePicker } from '~/components/ui/date-time-picker'
import { Input } from '~/components/ui/input'
import type { AddProcessingStepRequest } from '~/lib/api/generated/models'
import { ProcessorBatchStatus } from '~/lib/api/generated/models/processorBatchStatus'
import { useGetProcessorsBatchesId, usePutProcessorsBatchesIdStatus } from '~/lib/api/generated/processors-batches/processors-batches'
import { usePostProcessorsBatchesIdProcessingSteps } from '~/lib/api/generated/processors-operations/processors-operations'
import { usePostProcessorsBatchesIdProducts } from '~/lib/api/generated/processors-products/processors-products'
import { cn } from '~/lib/utils'
import { toast } from 'sonner'

export default function BatchDetailsPage() {
  const params = useParams()
  const batchId = params.id as string

  const { data: batchData, isLoading: isBatchLoading, refetch } = useGetProcessorsBatchesId(batchId, {
    query: {
      enabled: !!batchId
    }
  })

  const { mutateAsync: addStep, isPending: isAddingStep } = usePostProcessorsBatchesIdProcessingSteps()
  const { mutateAsync: addProduct, isPending: isAddingProduct } = usePostProcessorsBatchesIdProducts()
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = usePutProcessorsBatchesIdStatus()

  // Live Data overrides
  const batch = batchData?.data?.data
  const batchCode = batch?.batchCode || batchId
  const productName = batch?.outputProductName || 'Loading...'
  const productType = batch?.outputProductType || 'Loading...'
  const status = batch?.status || 'Active'
  const batchStatus = batch?.status
  const isReadOnly =
    batchStatus === ProcessorBatchStatus.completed ||
    batchStatus === ProcessorBatchStatus.cancelled

  const [currentStep, setCurrentStep] = useState(1)

  // Local Form Buffers
  const [stepData, setStepData] = useState<any>({ stepName: '', stepOrder: 1 })
  const [fortData, setFortData] = useState<any>({ nutrients: [] })
  const [qualityData, setQualityData] = useState<any>({})
  const [packData, setPackData] = useState<any>({ productName: batch?.outputProductName || '', category: batch?.outputProductType || '' })

  // Forms Visibility State
  const [showAddStepForm, setShowAddStepForm] = useState(false)
  const [showAddFortificationForm, setShowAddFortificationForm] = useState(false)
  const [showAddQualityTestForm, setShowAddQualityTestForm] = useState(false)
  const [showAddPackagingForm, setShowAddPackagingForm] = useState(false)

  useEffect(() => {
    if (!isReadOnly) return
    setShowAddStepForm(false)
    setShowAddFortificationForm(false)
    setShowAddQualityTestForm(false)
    setShowAddPackagingForm(false)
  }, [isReadOnly])

  // Submissions
  const handleAddStep = async () => {
    if (isReadOnly) return
    if (!stepData.stepName) {
      toast.error('Step name is required')
      return
    }
    const n = (v: unknown) => {
      const x = typeof v === 'number' ? v : parseFloat(String(v))
      return Number.isFinite(x) ? x : undefined
    }
    const payload: AddProcessingStepRequest = {
      stepName: stepData.stepName,
      stepOrder: ((batch as any)?.processingSteps?.length ?? 0) + 1,
      description: stepData.description || undefined,
      startTime: stepData.startTime || undefined,
      endTime: stepData.endTime || undefined,
      personnelResponsible: stepData.personnelResponsible || undefined,
      equipmentUsed: stepData.equipmentUsed || undefined,
      temperature: n(stepData.temperature),
      humidity: n(stepData.humidity),
      pressure: n(stepData.pressure),
    }
    try {
      await addStep({
        id: batchId,
        data: payload,
      })
      toast.success('Processing step added')
      setStepData({ stepName: '', stepOrder: 1 })
      setShowAddStepForm(false)
      refetch()
    } catch (error) {
      toast.error('Failed to add processing step')
    }
  }

  const handleAddProduct = async () => {
    if (isReadOnly) return
    if (!packData.quantityProduced) {
      toast.error('Quantity is required')
      return
    }
    try {
      await addProduct({
        id: batchId,
        data: {
          ...packData,
          productName: productName,
          category: productType,
          unit: 'kg',
        }
      })
      
      // Also complete the batch
      await updateStatus({
        id: batchId,
        data: { status: 'completed' }
      })

      toast.success('Batch processing completed!')
      setShowAddPackagingForm(false)
      refetch()
    } catch (error) {
      toast.error('Failed to complete batch packaging')
    }
  }

  const steps = [
    { title: 'Materials Review', desc: 'Confirm input materials and quantities', icon: <CheckCircle2 className="size-4" /> },
    { title: 'Processing Steps', desc: 'Record processing operations and parameters', icon: <Settings className="size-4" /> },
    { title: 'Quality Control', desc: 'Perform quality tests and record results', icon: <FlaskConical className="size-4" /> },
    { title: 'Packaging & Complete', desc: 'Package products and auto-complete workflow', icon: <Package className="size-4" /> }
  ]

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb Header */}
      <PageHeader
        items={[
          { label: 'Dashboard', href: '/processor', icon: <LayoutDashboard className="size-4 text-gray-400" /> },
          { label: 'Batches', href: '/processor/batches' },
          { label: 'Batch Details' }
        ]}
      />

      {/* Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">{batchCode}</h1>
          <p className="text-sm text-gray-500 mt-1">{productName}</p>
        </div>
        <Badge variant="outline" className={cn(
          "px-4 py-1 text-xs uppercase tracking-widest font-bold",
          status?.toLowerCase() === 'completed' ? "border-green-200 text-emerald-600 bg-green-50" : "border-brand/40 text-brand bg-brand/5"
        )}>{status}</Badge>
      </div>

      {isReadOnly && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900">
          This batch is closed for editing. You can review each step below; changes and new records are disabled.
        </div>
      )}

      {/* Progress Section */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Processing Progress</h3>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
            {currentStep} of {steps.length} steps completed
          </span>
        </div>

        {/* Progress Bar Line */}
        <div className="h-2.5 w-full bg-gray-100 rounded-full mb-6 overflow-hidden flex">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-full transition-all duration-300",
                i < currentStep ? "bg-[#1d3d1e]" : "bg-transparent",
                i > 0 && "border-l border-white/20"
              )}
              style={{ width: `${100 / steps.length}%` }}
            />
          ))}
        </div>

        {/* Form Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep
            const isCompleted = index + 1 <= currentStep
            return (
              <button
                key={index}
                onClick={() => setCurrentStep(index + 1)}
                className={cn(
                  "p-4 rounded-md border text-left transition-all relative overflow-hidden active:scale-95",
                  isActive ? "border-brand bg-brand/5 shadow-md" :
                    isCompleted ? "border-brand/40 bg-brand/5 opacity-80" : "border-gray-100 bg-gray-50/50 hover:bg-gray-50 shadow-sm"
                )}
              >
                <div className="flex items-center gap-2 mb-2 z-10 relative">
                  <div className={cn(
                    "flex items-center justify-center size-6 rounded-full",
                    isActive || isCompleted ? "bg-brand text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    {step.icon}
                  </div>
                  <h4 className={cn(
                    "font-black text-[10px] uppercase tracking-widest",
                    isActive || isCompleted ? "text-brand" : "text-gray-400"
                  )}>
                    {step.title}
                  </h4>
                </div>
                <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase leading-snug">
                  {step.desc}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="mt-8">
        {/* === STEP 1: Materials Review === */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="size-5 text-brand" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 1: Materials Review</h2>
            </div>

            <div className="rounded-md border border-gray-100 bg-white p-16 shadow-md flex flex-col items-center justify-center text-center">
              <div className="size-20 rounded-full bg-brand/5 flex items-center justify-center mb-6">
                <Package className="size-10 text-brand" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Materials Confirmed</h3>
              <p className="text-xs text-gray-500 max-w-sm mb-8 font-medium leading-relaxed">
                Input materials have been reviewed and successfully associated with this batch. Traceability for all source products is active.
              </p>

              <Button onClick={() => setCurrentStep(2)} disabled={isReadOnly} className="bg-brand hover:bg-brand/90 text-white px-10 font-black uppercase tracking-widest text-[10px] h-12 rounded-md shadow-lg transition-all active:scale-95">
                Continue to Processing <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* === STEP 2: Processing Steps === */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-5 text-brand" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 2: Processing Steps</h2>
            </div>

            <div className="flex items-center gap-2 mb-6 text-gray-500">
              <Settings className="size-4" />
              <p className="text-sm">Processing Steps & Fortification<br /><span className="text-xs text-gray-400">Document processing operations and fortification details</span></p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Batch: {batchCode}</h3>
                <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest opacity-70">Target Product: {productName}</p>
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <Button
                  disabled={isReadOnly}
                  onClick={() => { setShowAddStepForm(true); setShowAddFortificationForm(false); }}
                  className="bg-brand hover:bg-brand/90 text-white h-11 px-6 text-[10px] font-black tracking-widest uppercase flex-1 sm:flex-none rounded-md shadow-md transition-all active:scale-95"
                >
                  <Plus className="size-4 mr-2" /> Add Operation
                </Button>
                <Button
                  disabled={isReadOnly}
                  onClick={() => { setShowAddFortificationForm(true); setShowAddStepForm(false); }}
                  variant="outline"
                  className="h-11 px-6 text-[10px] border-gray-200 text-gray-600 font-black tracking-widest uppercase flex-1 sm:flex-none rounded-md hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                >
                  <Plus className="size-4 mr-2" /> Add Fortification
                </Button>
              </div>
            </div>

            {/* ADD PROCESSING STEP FORM */}
            {showAddStepForm && (
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight uppercase">Add Processing Operation</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Document operational parameters for traceability</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddStepForm(false)} className="size-8 rounded-full p-0">
                    <ArrowLeft className="size-4 text-gray-400" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Step Name *</label>
                    <Input
                      value={stepData.stepName || ''}
                      onChange={e => setStepData({ ...stepData, stepName: e.target.value })}
                      placeholder="e.g. Washing, Drying, Milling"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Personnel Responsible</label>
                    <Input
                      value={stepData.personnelResponsible || ''}
                      onChange={e => setStepData({ ...stepData, personnelResponsible: e.target.value })}
                      placeholder="Operator name"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Start Time</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={stepData.startTime}
                      onChange={(iso) => setStepData({ ...stepData, startTime: iso })}
                      placeholder="Start date & time"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">End Time</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={stepData.endTime}
                      onChange={(iso) => setStepData({ ...stepData, endTime: iso })}
                      placeholder="End date & time"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Temp (°C)</label>
                      <Input
                        type="number"
                        value={
                          stepData.temperature === undefined ||
                          stepData.temperature === null ||
                          Number.isNaN(stepData.temperature)
                            ? ''
                            : stepData.temperature
                        }
                        onChange={(e) => {
                          const v = e.target.value
                          setStepData({
                            ...stepData,
                            temperature: v === '' ? undefined : parseFloat(v),
                          })
                        }}
                        placeholder="25.0"
                        className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Humidity (%)</label>
                      <Input
                        type="number"
                        value={
                          stepData.humidity === undefined ||
                          stepData.humidity === null ||
                          Number.isNaN(stepData.humidity)
                            ? ''
                            : stepData.humidity
                        }
                        onChange={(e) => {
                          const v = e.target.value
                          setStepData({
                            ...stepData,
                            humidity: v === '' ? undefined : parseFloat(v),
                          })
                        }}
                        placeholder="60.0"
                        className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Pressure (Bar)</label>
                    <Input
                      type="number"
                      value={
                        stepData.pressure === undefined ||
                        stepData.pressure === null ||
                        Number.isNaN(stepData.pressure)
                          ? ''
                          : stepData.pressure
                      }
                      onChange={(e) => {
                        const v = e.target.value
                        setStepData({
                          ...stepData,
                          pressure: v === '' ? undefined : parseFloat(v),
                        })
                      }}
                      placeholder="1.0"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Equipment Used</label>
                    <Input
                      value={stepData.equipmentUsed || ''}
                      onChange={e => setStepData({ ...stepData, equipmentUsed: e.target.value })}
                      placeholder="e.g. Industrial Dryer, Hammer Mill"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Description / Operations</label>
                    <textarea
                      value={stepData.description || ''}
                      onChange={e => setStepData({ ...stepData, description: e.target.value })}
                      rows={3}
                      placeholder="Detailed description of the processing operations..."
                      className="w-full rounded-md border border-gray-100 p-4 text-xs bg-white outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none shadow-sm transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAddStepForm(false)}
                    className="text-[10px] uppercase tracking-widest font-black h-11 px-8 text-gray-400 hover:text-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStep}
                    disabled={isAddingStep || isReadOnly}
                    className="bg-brand text-white hover:bg-brand/90 text-[10px] uppercase tracking-widest font-black h-11 px-10 rounded-md shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    {isAddingStep ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
                    Save Operation
                  </Button>
                </div>
              </div>
            )}

            {/* ADD FORTIFICATION RECORD FORM */}
            {showAddFortificationForm && (
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight uppercase">Add Fortification Record</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Document nutrient enrichment and supplier traceability</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddFortificationForm(false)} className="size-8 rounded-full p-0">
                    <ArrowLeft className="size-4 text-gray-400" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Fortificant Type *</label>
                    <Input
                      value={fortData.type || ''}
                      onChange={e => setFortData({ ...fortData, type: e.target.value })}
                      placeholder="e.g. Vitamin A, Iron"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Fortificant/Premix Name *</label>
                    <Input
                      value={fortData.name || ''}
                      onChange={e => setFortData({ ...fortData, name: e.target.value })}
                      placeholder="e.g., Vitamin A Palmitate 250"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Date & Time of Addition</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={fortData.additionTime}
                      onChange={(iso) => setFortData({ ...fortData, additionTime: iso })}
                      placeholder="Addition date & time"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Quantity Added *</label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={fortData.quantity || ''}
                        onChange={e => setFortData({ ...fortData, quantity: e.target.value })}
                        placeholder="10.5"
                        className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs flex-1"
                      />
                      <select
                        value={fortData.unit || 'mg'}
                        onChange={e => setFortData({ ...fortData, unit: e.target.value })}
                        className="h-12 px-3 rounded-md border border-gray-100 text-xs bg-white outline-none focus:border-brand w-24 shadow-sm"
                      >
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-4 pb-2 border-b border-gray-50">Supplier Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Supplier Name *</label>
                        <Input
                          value={fortData.supplierName || ''}
                          onChange={e => setFortData({ ...fortData, supplierName: e.target.value })}
                          placeholder="e.g. Global Nutrients Inc."
                          className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Supplier Batch/Lot *</label>
                        <Input
                          value={fortData.supplierBatch || ''}
                          onChange={e => setFortData({ ...fortData, supplierBatch: e.target.value })}
                          placeholder="Supplier's identifier"
                          className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                  <Button variant="ghost" onClick={() => setShowAddFortificationForm(false)} className="text-[10px] uppercase tracking-widest font-black h-11 px-8 text-gray-400 hover:text-gray-600">Cancel</Button>
                  <Button
                    onClick={handleAddStep}
                    disabled={isReadOnly}
                    className="bg-brand text-white hover:bg-brand/90 text-[10px] uppercase tracking-widest font-black h-11 px-10 rounded-md shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Plus className="size-4" />
                    Record Fortification
                  </Button>
                </div>
              </div>
            )}

            {/* Processing Steps & Fortification Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recorded Steps Log */}
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md">
                <h3 className="text-base font-black text-gray-900 tracking-tight uppercase mb-6">Processing Steps Log</h3>
                <div className="space-y-4">
                  {((batch as any)?.processingSteps || []).length === 0 ? (
                    <div className="py-12 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                      <Settings className="size-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No processing steps recorded</p>
                    </div>
                  ) : (batch as any).processingSteps.map((step: any, idx: number) => (
                    <div key={idx} className="rounded-md border border-gray-100 p-5 bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-tight">{step.stepName}</h4>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Order #{step.stepOrder}</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 font-black tracking-widest uppercase text-[9px] h-6">Active</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div>
                          <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Operator</span>
                          <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{step.personnelResponsible || 'Unassigned'}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Recorded At</span>
                          <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{new Date(step.createdAt).toLocaleTimeString()}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fortification Log */}
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md">
                <h3 className="text-base font-black text-gray-900 tracking-tight uppercase mb-6">Fortification Traceability</h3>
                <div className="space-y-4">
                  {((batch as any)?.fortifications || []).length === 0 ? (
                    <div className="py-12 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                      <FlaskConical className="size-8 text-gray-200 mx-auto mb-3" />
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No fortification records</p>
                    </div>
                  ) : (batch as any).fortifications.map((fort: any, idx: number) => (
                    <div key={idx} className="rounded-md border border-gray-100 p-5 bg-white hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-tight">{fort.name}</h4>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Supplier: {fort.supplierName}</p>
                        </div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 font-black tracking-widest uppercase text-[9px] h-6">Verified</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <div>
                          <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</span>
                          <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{fort.quantity} {fort.unit}</strong>
                        </div>
                        <div>
                          <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Batch #</span>
                          <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{fort.supplierBatch || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === STEP 3: Quality Control === */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-6 text-brand" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Step 3: Quality Control</h2>
            </div>

            <div className="flex items-center gap-3 mb-8 bg-brand/5 p-4 rounded-md border border-brand/10">
              <FlaskConical className="size-5 text-brand" />
              <p className="text-xs font-medium text-gray-600">
                Quality Testing & QA/QC Protocols. <span className="text-gray-400">Record laboratory analysis and field test results to ensure compliance and quality standards.</span>
              </p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Batch: {batchCode}</h3>
                <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest opacity-70">Quality Assurance Protocols</p>
              </div>

              <Button
                disabled={isReadOnly}
                onClick={() => setShowAddQualityTestForm(true)}
                className="bg-brand hover:bg-brand/90 text-white h-11 px-6 text-[10px] font-black tracking-widest uppercase rounded-md shadow-md transition-all active:scale-95"
              >
                <Plus className="size-4 mr-2" /> Log Quality Test
              </Button>
            </div>

            {/* ADD QUALITY TEST FORM */}
            {showAddQualityTestForm && (
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight uppercase">Log Quality Assurance Test</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Record laboratory or field test results</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddQualityTestForm(false)} className="size-8 rounded-full p-0">
                    <ArrowLeft className="size-4 text-gray-400" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Test Name *</label>
                    <Input
                      value={qualityData.name || ''}
                      onChange={e => setQualityData({ ...qualityData, name: e.target.value })}
                      placeholder="e.g. Moisture Content, Purity Test"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Test Type</label>
                    <Input
                      value={qualityData.type || ''}
                      onChange={e => setQualityData({ ...qualityData, type: e.target.value })}
                      placeholder="e.g. Laboratory Analysis"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Result Value</label>
                    <Input
                      value={qualityData.result || ''}
                      onChange={e => setQualityData({ ...qualityData, result: e.target.value })}
                      placeholder="e.g. 12.5% or Passed"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Test Date & Time</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={qualityData.date}
                      onChange={(iso) => setQualityData({ ...qualityData, date: iso })}
                      placeholder="Test date & time"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                  <Button variant="ghost" onClick={() => setShowAddQualityTestForm(false)} className="text-[10px] uppercase tracking-widest font-black h-11 px-8 text-gray-400 hover:text-gray-600">Cancel</Button>
                  <Button
                    onClick={handleAddStep}
                    disabled={isReadOnly}
                    className="bg-brand text-white hover:bg-brand/90 text-[10px] uppercase tracking-widest font-black h-11 px-10 rounded-md shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    <FlaskConical className="size-4" />
                    Save Test Result
                  </Button>
                </div>
              </div>
            )}

            {/* Quality Test Results List */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md">
              <h3 className="text-base font-black text-gray-900 tracking-tight uppercase mb-6">Quality Control Log</h3>
              <div className="space-y-4">
                {((batch as any)?.processingSteps || []).filter((s: any) => s.stepName.toLowerCase().includes('test') || s.stepName.toLowerCase().includes('quality')).length === 0 ? (
                  <div className="py-12 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                    <FlaskConical className="size-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No quality testing recorded</p>
                  </div>
                ) : (batch as any).processingSteps.filter((s: any) => s.stepName.toLowerCase().includes('test') || s.stepName.toLowerCase().includes('quality')).map((test: any, idx: number) => (
                  <div key={idx} className="rounded-md border border-gray-100 p-5 bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-tight">{test.stepName}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">{test.description || 'Quality Assurance Protocol'}</p>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 font-black tracking-widest uppercase text-[9px] h-6">Verified</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                      <div>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Result</span>
                        <strong className="text-xs font-black text-brand uppercase tracking-tight">{test.parameters?.result || 'PASSED'}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</span>
                        <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{new Date(test.startTime || test.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === STEP 4: Packaging & Complete === */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-5 text-brand" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 4: Packaging & Complete</h2>
            </div>

            <div className="flex items-center gap-2 mb-6 text-gray-500">
              <Package className="size-4" />
              <p className="text-sm">Packaging & QR Code Generation<br /><span className="text-xs text-gray-400">Package products and generate QR codes for finished goods</span></p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md flex flex-col sm:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Batch: {batchCode}</h3>
                <p className="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest opacity-70">Packaging & Distribution Ready</p>
              </div>

              <div className="flex gap-4 w-full sm:w-auto">
                <Button
                  disabled={isReadOnly}
                  onClick={() => setShowAddPackagingForm(true)}
                  className="bg-brand hover:bg-brand/90 text-white h-11 px-6 text-[10px] font-black tracking-widest uppercase flex-1 sm:flex-none rounded-md shadow-md transition-all active:scale-95"
                >
                  <Plus className="size-4 mr-2" /> Record Packaging
                </Button>
                <Button
                  disabled={isReadOnly}
                  variant="outline"
                  className="h-11 px-6 text-[10px] border-gray-200 text-gray-600 font-black tracking-widest uppercase flex-1 sm:flex-none rounded-md hover:bg-gray-50 shadow-sm transition-all active:scale-95"
                >
                  <QrCode className="size-4 mr-2" /> Generate QR
                </Button>
              </div>
            </div>

            {/* ADD PACKAGING FORM */}
            {showAddPackagingForm && (
              <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-black text-gray-900 tracking-tight uppercase">Final Packaging & Completion</h3>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Record finished goods and close processing batch</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddPackagingForm(false)} className="size-8 rounded-full p-0">
                    <ArrowLeft className="size-4 text-gray-400" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Packaging Material *</label>
                    <Input
                      value={packData.packagingMaterial || ''}
                      onChange={e => setPackData({ ...packData, packagingMaterial: e.target.value })}
                      placeholder="e.g. Food-grade polypropylene"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Packaging Type *</label>
                    <Input
                      value={packData.unit || 'Bags'}
                      onChange={e => setPackData({ ...packData, unit: e.target.value })}
                      placeholder="e.g. Bags, Boxes"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Quantity Produced *</label>
                    <Input
                      type="number"
                      value={
                        packData.quantityProduced === undefined ||
                        packData.quantityProduced === null ||
                        Number.isNaN(packData.quantityProduced)
                          ? ''
                          : packData.quantityProduced
                      }
                      onChange={(e) => {
                        const v = e.target.value
                        setPackData({
                          ...packData,
                          quantityProduced: v === '' ? undefined : parseFloat(v),
                        })
                      }}
                      placeholder="1000"
                      className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Package Size</label>
                      <Input
                        type="number"
                        value={
                          packData.packageSize === undefined ||
                          packData.packageSize === null ||
                          Number.isNaN(packData.packageSize)
                            ? ''
                            : packData.packageSize
                        }
                        onChange={(e) => {
                          const v = e.target.value
                          setPackData({
                            ...packData,
                            packageSize: v === '' ? undefined : parseFloat(v),
                          })
                        }}
                        placeholder="1.0"
                        className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Packages Count</label>
                      <Input
                        type="number"
                        value={
                          packData.packagesCount === undefined ||
                          packData.packagesCount === null ||
                          Number.isNaN(packData.packagesCount)
                            ? ''
                            : packData.packagesCount
                        }
                        onChange={(e) => {
                          const v = e.target.value
                          setPackData({
                            ...packData,
                            packagesCount: v === '' ? undefined : parseInt(v, 10),
                          })
                        }}
                        placeholder="100"
                        className="h-12 rounded-md border-gray-100 bg-white focus:border-brand shadow-sm transition-all text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Packaging Date *</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={packData.packagingDate}
                      onChange={(iso) => setPackData({ ...packData, packagingDate: iso })}
                      placeholder="Packaging date & time"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Expiry Date & Time</label>
                    <DateTimePicker
                      disabled={isReadOnly}
                      value={packData.expiryDate}
                      onChange={(iso) => setPackData({ ...packData, expiryDate: iso })}
                      placeholder="Expiry date & time"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-50">
                  <Button variant="ghost" onClick={() => setShowAddPackagingForm(false)} className="text-[10px] uppercase tracking-widest font-black h-11 px-8 text-gray-400 hover:text-gray-600">Cancel</Button>
                  <Button
                    onClick={handleAddProduct}
                    disabled={isAddingProduct || isUpdatingStatus || isReadOnly}
                    className="bg-brand text-white hover:bg-brand/90 text-[10px] uppercase tracking-widest font-black h-11 px-10 rounded-md shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  >
                    {isAddingProduct || isUpdatingStatus ? <Loader2 className="size-4 animate-spin" /> : <Package className="size-4" />}
                    Complete Batch & Package
                  </Button>
                </div>
              </div>
            )}

            {/* Packaging Records List */}
            <div className="rounded-md border border-gray-100 bg-white p-8 shadow-md">
              <h3 className="text-base font-black text-gray-900 tracking-tight uppercase mb-6">Finished Product Inventory</h3>
              <div className="space-y-4">
                {((batch as any)?.products || []).length === 0 ? (
                  <div className="py-12 text-center bg-gray-50/50 rounded-md border border-dashed border-gray-100">
                    <Package className="size-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No packaging records added</p>
                  </div>
                ) : (batch as any).products.map((prod: any, idx: number) => (
                  <div key={idx} className="rounded-md border border-gray-100 p-5 bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-tight">{prod.unit} - {prod.packagingMaterial || 'Standard Packaging'}</h4>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Product ID: {prod.id.split('-')[0]}</p>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 font-black tracking-widest uppercase text-[9px] h-6">Ready</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
                      <div>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Quantity</span>
                        <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{prod.quantityProduced} {prod.unit}</strong>
                      </div>
                      <div>
                        <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Date</span>
                        <strong className="text-xs font-black text-gray-900 uppercase tracking-tight">{new Date(prod.createdAt).toLocaleDateString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Wizard Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-gray-100 pt-8 bg-white rounded-md p-6 shadow-md">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="text-[10px] font-black uppercase tracking-widest h-12 w-32 rounded-md border-gray-200 text-gray-500 shadow-sm transition-all active:scale-95"
        >
          <ArrowLeft className="size-4 mr-2" /> Previous
        </Button>

        {status?.toLowerCase() === 'completed' && (
          <span className="text-emerald-600 font-black text-xs flex items-center gap-2 uppercase tracking-widest">
            <CheckCircle2 className="size-5" /> Batch Fully Processed ✨
          </span>
        )}

        {currentStep === steps.length ? (
          <Link to="/processor/products">
            <Button className="bg-brand hover:bg-brand/90 text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-md shadow-lg transition-all active:scale-95">
              View Final Products <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            className="bg-brand hover:bg-brand/90 text-white text-[10px] font-black uppercase tracking-widest h-12 w-32 rounded-md shadow-lg transition-all active:scale-95"
          >
            Next Step <ArrowRight className="size-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
