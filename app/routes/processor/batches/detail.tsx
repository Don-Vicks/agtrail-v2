import { useState } from 'react'
import { useParams, Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { EmptyState } from '~/components/empty-state'
import { useGetProcessorsBatchesId } from '~/lib/api/generated/processors-batches/processors-batches'
import { 
  CheckCircle2, 
  Settings, 
  FlaskConical, 
  Package, 
  LayoutDashboard, 
  Plus, 
  ArrowRight,
  ArrowLeft,
  Clock,
  Thermometer,
  Droplets,
  Activity,
  QrCode,
  UploadCloud
} from 'lucide-react'
import { cn } from '~/lib/utils'

export default function BatchDetailsPage() {
  const params = useParams()
  const batchId = params.id as string

  const { data: batchData, isLoading } = useGetProcessorsBatchesId(batchId, {
    query: {
      enabled: !!batchId
    }
  })

  // Live Data overrides
  const batch = batchData?.data?.data
  const batchCode = batch?.batchCode || batchId
  const productName = batch?.outputProductName || 'Loading...'
  const productType = batch?.outputProductType || 'Loading...'
  const status = batch?.status || 'Active'
  
  const [currentStep, setCurrentStep] = useState(2)

  // Simulation state arrays for dynamic local rendering until GET hooks explicitly exist for these endpoints
  const [processingStepsList] = useState<any[]>([])
  const [fortificationList] = useState<any[]>([])
  const [qualityTestList] = useState<any[]>([])
  const [packagingList] = useState<any[]>([])

  // Forms Visibility State
  const [showAddStepForm, setShowAddStepForm] = useState(false)
  const [showAddFortificationForm, setShowAddFortificationForm] = useState(false)
  const [showAddQualityTestForm, setShowAddQualityTestForm] = useState(false)
  const [showAddPackagingForm, setShowAddPackagingForm] = useState(false)

  const steps = [
    { title: 'Materials Review', desc: 'Confirm input materials and quantities', icon: <CheckCircle2 className="size-4" /> },
    { title: 'Processing Steps', desc: 'Record processing operations and parameters', icon: <Settings className="size-4" /> },
    { title: 'Quality Control', desc: 'Perform quality tests and record results', icon: <FlaskConical className="size-4" /> },
    { title: 'Packaging & Complete', desc: 'Package products and auto-complete workflow', icon: <Package className="size-4" /> }
  ]

  return (
    <div className="space-y-6 pb-24 px-1 max-w-5xl mx-auto align-top">
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
          <p className="text-sm text-gray-500 mt-1">{productName} {productType && `(${productType})`}</p>
        </div>
        <Badge variant="outline" className={cn(
          "px-4 py-1 text-xs uppercase tracking-widest font-bold",
          status?.toLowerCase() === 'completed' ? "border-green-200 text-emerald-600 bg-green-50" : "border-brand/40 text-brand bg-brand/5"
        )}>{status}</Badge>
      </div>

      {/* Progress Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
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
                  "p-3 rounded-lg border text-left transition-all relative overflow-hidden",
                  isActive ? "border-brand bg-brand/5 shadow-sm" : 
                  isCompleted ? "border-brand/40 bg-brand/5 opacity-80" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5 z-10 relative">
                  <div className={cn(
                    "flex items-center justify-center size-5 rounded-full",
                    isActive || isCompleted ? "text-brand" : "text-gray-400"
                  )}>
                    {step.icon}
                  </div>
                  <h4 className={cn(
                    "font-bold text-xs uppercase tracking-wider",
                    isActive || isCompleted ? "text-brand" : "text-gray-500"
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
            
            <div className="rounded-xl border border-gray-200 bg-white p-16 shadow-sm flex flex-col items-center justify-center text-center">
              <Package className="size-12 text-brand mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Materials Confirmed</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">Input materials have been reviewed and confirmed for this batch.</p>
              
              <Button onClick={() => setCurrentStep(2)} className="bg-[#1d3d1e] hover:bg-black text-white px-6 font-bold uppercase tracking-widest text-xs h-11">
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
              <p className="text-sm">Processing Steps & Fortification<br/><span className="text-xs text-gray-400">Document processing operations and fortification details</span></p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Batch: {batchCode}</h3>
                <p className="text-xs text-gray-500 mt-1">Product: {productName} {productType && `(${productType})`}</p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  onClick={() => { setShowAddStepForm(true); setShowAddFortificationForm(false); }}
                  className="bg-[#1d3d1e] hover:bg-black text-white h-9 px-4 text-xs font-bold tracking-wider uppercase flex-1 sm:flex-none"
                >
                  <Plus className="size-3.5 mr-1.5" /> Add Step
                </Button>
                <Button 
                  onClick={() => { setShowAddFortificationForm(true); setShowAddStepForm(false); }}
                  variant="outline" 
                  className="h-9 px-4 text-xs font-bold tracking-wider uppercase flex-1 sm:flex-none"
                >
                  <Plus className="size-3.5 mr-1.5" /> Add Fortification
                </Button>
              </div>
            </div>

            {/* ADD PROCESSING STEP FORM */}
            {showAddStepForm && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900Tracking-tight mb-1">Add Processing Step</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Document each step of your processing operation with contextual details</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Step Name *</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand">
                      <option>Select processing step</option>
                      <option>Washing</option>
                      <option>Drying</option>
                      <option>Milling</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Personnel Responsible</label>
                    <Input placeholder="Operator name" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Start Time</label>
                    <Input type="datetime-local" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">End Time</label>
                    <Input type="datetime-local" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Temperature (°C)</label>
                    <Input type="number" placeholder="25.0" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Humidity (%)</label>
                    <Input type="number" placeholder="60.0" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Equipment Used</label>
                    <Input placeholder="Search or add equipment..." className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Description</label>
                    <textarea rows={3} placeholder="Detailed description of the processing step..." className="w-full rounded-lg border border-gray-200 p-3 text-sm bg-gray-50/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Notes</label>
                    <textarea rows={3} placeholder="Additional notes or observations..." className="w-full rounded-lg border border-gray-200 p-3 text-sm bg-gray-50/50 outline-none focus:border-brand focus:ring-1 focus:ring-brand resize-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setShowAddStepForm(false)} className="text-xs uppercase tracking-wider font-bold h-9">Cancel</Button>
                  <Button onClick={() => setShowAddStepForm(false)} className="bg-[#8b9e8b] text-white hover:bg-brand text-xs uppercase tracking-wider font-bold h-9 px-6 transition-colors">Add Processing Step</Button>
                </div>
              </div>
            )}

            {/* ADD FORTIFICATION RECORD FORM */}
            {showAddFortificationForm && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Add Fortification Record</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Document fortification/biofortification details with full supplier traceability</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Fortificant Type *</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand">
                      <option>Select fortificant type</option>
                      <option>Vitamin</option>
                      <option>Mineral</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Fortificant/Premix Name *</label>
                    <Input placeholder="e.g., Vitamin A Palmitate 250" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Process Stage *</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand">
                      <option>Select process stage</option>
                      <option>mixing process</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Date & Time of Addition</label>
                    <Input type="datetime-local" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Quantity of Premix Added *</label>
                    <div className="flex gap-2">
                      <Input type="number" placeholder="10.5" className="h-10 bg-gray-50/50 flex-1" />
                      <select className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand w-24">
                        <option>mg</option>
                        <option>g</option>
                        <option>kg</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Concentration</label>
                    <Input type="number" placeholder="15.0" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Fortificant Expiry Date</label>
                    <Input type="date" className="h-10 bg-gray-50/50" />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-3 block">Nutrients Added</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {['Vitamin A', 'Iron', 'Folic Acid', 'Zinc', 'Vitamin B12', 'Calcium', 'Vitamin D', 'Iodine'].map(n => (
                      <label key={n} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-brand focus:ring-brand size-4" />
                        <span className="text-sm font-medium text-gray-700">{n}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">Supplier Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Supplier Name *</label>
                    <Input placeholder="e.g. Global Nutrients Inc." className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Supplier Batch Number</label>
                    <Input placeholder="Supplier batch number" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Supplier Lot Number *</label>
                    <Input placeholder="Supplier's lot number (for traceability)" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Certificate Number</label>
                    <Input placeholder="Certificate or CoA number" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Certificate of Analysis</label>
                    <div className="w-full flex items-center gap-4 bg-gray-50/50 border border-gray-200 rounded-lg h-11 px-3">
                      <Button variant="outline" className="h-7 text-xs">Choose file</Button>
                      <span className="text-xs text-gray-500">No file chosen</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">Upload Certificate of Analysis (CoA) for the premix / proof of fortificant quality.</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setShowAddFortificationForm(false)} className="text-xs uppercase tracking-wider font-bold h-9">Cancel</Button>
                  <Button onClick={() => setShowAddFortificationForm(false)} className="bg-[#8b9e8b] text-white hover:bg-brand text-xs uppercase tracking-wider font-bold h-9 px-6 transition-colors">Add Fortification Record</Button>
                </div>
              </div>
            )}

            {/* Recorded Steps Log */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Processing Steps</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Recorded processing operations for this batch</p>
              
              <div className="space-y-4 mb-8">
                {processingStepsList.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No processing steps recorded yet</p>
                  </div>
                ) : processingStepsList.map((step, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 p-5 bg-gray-50/30">
                    <p className="text-xs text-gray-600">Recorded Processing Step</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fortification Log */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 tracking-tight mb-1">Fortification Records</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">Fortification/biofortification details for this batch</p>
              
              <div className="space-y-4">
                {fortificationList.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No fortification records added yet</p>
                  </div>
                ) : fortificationList.map((fort, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 p-5 bg-gray-50/30">
                    <p className="text-xs text-gray-600">Recorded Fortification Step</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === STEP 3: Quality Control === */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="size-5 text-brand" />
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Step 3: Quality Control</h2>
            </div>
            
            <div className="flex items-center gap-2 mb-6 text-gray-500">
              <FlaskConical className="size-4" />
              <p className="text-sm">Quality Testing & QA/QC<br/><span className="text-xs text-gray-400">Record quality tests and lab reports for your batches</span></p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Batch: {batchCode}</h3>
                <p className="text-xs text-gray-500 mt-1">Product: {productName} {productType && `(${productType})`}</p>
              </div>
              
              <Button 
                onClick={() => setShowAddQualityTestForm(true)}
                className="bg-[#1d3d1e] hover:bg-black text-white h-9 px-4 text-xs font-bold tracking-wider uppercase"
              >
                <Plus className="size-3.5 mr-1.5" /> Add Quality Test
              </Button>
            </div>

            {/* ADD QUALITY TEST FORM */}
            {showAddQualityTestForm && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-4">Add Quality Test</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Test Name</label>
                    <Input placeholder="e.g. Moisture Content" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Test Type</label>
                    <Input placeholder="e.g. Nutritional" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Result</label>
                    <Input placeholder="e.g. 12.5 ppm" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Date</label>
                    <Input type="date" className="h-10 bg-gray-50/50" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setShowAddQualityTestForm(false)} className="text-xs uppercase tracking-wider font-bold h-9">Cancel</Button>
                  <Button onClick={() => setShowAddQualityTestForm(false)} className="bg-[#8b9e8b] text-white hover:bg-brand text-xs uppercase tracking-wider font-bold h-9 px-6 transition-colors">Add Test Record</Button>
                </div>
              </div>
            )}

            {/* Quality Test Results List */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 tracking-tight mb-6">Quality Test Results</h3>
              <div className="space-y-4">
                {qualityTestList.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No quality testing completed yet</p>
                  </div>
                ) : qualityTestList.map((test, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 p-5 bg-gray-50/30">
                    <p className="text-xs text-gray-600">Recorded Test Result</p>
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
              <p className="text-sm">Packaging & QR Code Generation<br/><span className="text-xs text-gray-400">Package products and generate QR codes for finished goods</span></p>
            </div>

            {/* Sub-Header Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Batch: {batchCode}</h3>
                <p className="text-xs text-gray-500 mt-1">Product: {productName} {productType && `(${productType})`}</p>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  onClick={() => setShowAddPackagingForm(true)}
                  className="bg-[#1d3d1e] hover:bg-black text-white h-9 px-4 text-xs font-bold tracking-wider uppercase flex-1 sm:flex-none"
                >
                  <Plus className="size-3.5 mr-1.5" /> Add Packaging
                </Button>
                <Button 
                  variant="outline" 
                  className="h-9 px-4 text-xs font-bold tracking-wider uppercase flex-1 sm:flex-none"
                >
                  <QrCode className="size-3.5 mr-1.5" /> Generate QR
                </Button>
              </div>
            </div>

            {/* ADD PACKAGING FORM */}
            {showAddPackagingForm && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-base font-bold text-gray-900 tracking-tight mb-6">Add Packaging Record</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Packaging Material *</label>
                    <Input placeholder="e.g. Food-grade polypropylene" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Packaging Type *</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand">
                      <option>Select packaging type</option>
                      <option>Bag</option>
                      <option>Sack</option>
                      <option>Box</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Environmental Rating</label>
                    <select className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-gray-50/50 outline-none focus:border-brand">
                      <option>A - Excellent</option>
                      <option>B - Good</option>
                      <option>C - Fair</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Package Size</label>
                    <Input type="number" placeholder="1.0" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Packages Count</label>
                    <Input type="number" placeholder="100" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Packaging Date *</label>
                    <Input type="date" className="h-10 bg-gray-50/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500">Expiry Date</label>
                    <Input type="date" className="h-10 bg-gray-50/50" />
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block">Product Image (Optional)</label>
                  <p className="text-[10px] text-gray-400 font-medium mb-3">Upload an image of the final packaged product. This image will be used for the product listing and passport.</p>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-gray-500 block">Product Image</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-3">
                      <UploadCloud className="size-5" />
                    </div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Click to select or drag and drop</p>
                    <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-4">PNG, JPG or WEBP (Max 5MB)</p>
                    <Button variant="outline" className="h-8 text-xs px-4">Choose File</Button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button variant="ghost" onClick={() => setShowAddPackagingForm(false)} className="text-xs uppercase tracking-wider font-bold h-9">Cancel</Button>
                  <Button onClick={() => setShowAddPackagingForm(false)} className="bg-[#1d3d1e] text-white hover:bg-black text-xs uppercase tracking-wider font-bold h-9 px-6 transition-colors">Add Packaging Record</Button>
                </div>
              </div>
            )}

            {/* Packaging Records List */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 tracking-tight mb-6">Packaging Records</h3>
              <div className="space-y-4">
                {packagingList.length === 0 ? (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No packaging records added yet</p>
                  </div>
                ) : packagingList.map((record, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 p-5 bg-gray-50/30">
                    <p className="text-xs text-gray-600">Recorded Packaging</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Wizard Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50 flex items-center justify-between sm:pl-64">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="text-xs font-bold uppercase tracking-wider h-10 w-28"
        >
          <ArrowLeft className="size-3.5 mr-2" /> Previous
        </Button>
        
        {currentStep >= 3 && (
            <span className="text-brand font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="size-4" /> Processing Complete! ✨
            </span>
        )}

        {currentStep === steps.length ? (
          <Link to="/processor/products">
            <Button className="bg-[#1d3d1e] hover:bg-black text-white text-xs font-bold uppercase tracking-wider h-10 px-6">
              View Products <ArrowRight className="size-3.5 ml-2" />
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
            className="bg-[#1d3d1e] hover:bg-black text-white text-xs font-bold uppercase tracking-wider h-10 w-28"
          >
            Next <ArrowRight className="size-3.5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  )
}
