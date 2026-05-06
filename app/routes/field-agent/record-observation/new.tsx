import { useSearchParams, useNavigate, useParams } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { ChevronRight, Upload, AlertCircle, CheckCircle2, History, MapPin, ClipboardList, Zap } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useState } from 'react'

export default function RecordObservationForm() {
  const [searchParams] = useSearchParams()
  const params = useParams()
  const navigate = useNavigate()
  
  const cycleId = params.id || 'CYCLE-8829'
  const operationType = params.operation || 'Land Preparation'
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      navigate('/field-agent/record-observation')
    }, 1500)
  }

  return (
    <div className="space-y-6 pb-20 text-left">
      <PageHeader
        items={[
          { label: 'Farmer', href: '#' },
          { label: 'Mr. Tunde Fashola', href: '#' },
          { label: 'Farms', href: '#' },
          { label: 'Debs Debs Farm', href: '#' },
          { label: 'Log Operation' }
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#1a4332] tracking-tight uppercase">RECORD FARM OBSERVATION</h1>
        <p className="text-sm text-gray-500 font-medium">Here's a list of your tasks for this month!</p>
      </div>

      {/* Summary Header Bar */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm flex flex-col md:flex-row">
        <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Selected Farm</p>
          <h3 className="text-lg font-bold text-[#1a4332] tracking-tight mb-1">Debs Debs Farm</h3>
          <p className="text-sm text-gray-500 font-medium">Kute, Iwo Road, Ibadan 8996.30 hectares</p>
        </div>
        <div className="p-8 flex-1 bg-gray-50/30 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Selected Product</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Maize</h3>
          <p className="text-sm text-gray-500 font-medium">Variety A</p>
        </div>
        <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Last Operation</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Nil</h3>
          <p className="text-sm text-gray-500 font-medium">08/08/2024</p>
        </div>
        <div className="p-8 flex-1">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Next Operation</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Land Preparation</h3>
          <p className="text-sm text-gray-500 font-medium">08/08/2024</p>
        </div>
      </div>

      {/* Form Area */}
      <div className="space-y-10 pt-6">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#1a4332] tracking-tight">Farm Operations</h2>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            All operations are automatically timestamped and include environmental conditions, safety measures, and compliance information.
          </p>
        </div>

        {/* Operation Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormGroup label="Primary Tillage Method" placeholder="Select Tillage Method" isSelect />
          <FormGroup label="Preparation Techniques" placeholder="Select Preparation Techniques" isSelect />
          <FormGroup label="Pre-Plant Inputs applied" placeholder="Select Pre-plant Inputs" isSelect />
          <FormGroup label="Quantity" placeholder="Enter Quantity" />
          <FormGroup label="Rate" placeholder="Select rate" isSelect />
          <FormGroup label="Conservation Practices" placeholder="Select Clearing Method" isSelect />
          <FormGroup label="Clearing Method" placeholder="Select Clearing Method" isSelect />
        </div>

        {/* Description Field */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#1a4332] tracking-tight">Description (Optional)</label>
          <textarea 
            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laboreLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut laboreLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
            className="w-full h-32 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none resize-none transition-all"
          />
        </div>

        {/* Energy Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormGroup label="Do you use renewable energy?" placeholder="No - Traditional energy" isSelect />
          <FormGroup label="What is your main energy source?" placeholder="Select energy source" isSelect />
        </div>

        {/* Log Observation Field */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#1a4332] tracking-tight">Log Observation</label>
          <textarea 
            placeholder="Enter description"
            className="w-full h-24 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none resize-none transition-all shadow-sm"
          />
        </div>

        {/* Upload Area */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">UPLOAD DOCUMENT<span className="text-red-500 ml-1">*</span></p>
          <div className="border-2 border-dashed border-gray-100 rounded-md p-10 flex flex-col items-center justify-center bg-gray-50/10 group hover:border-[#2e7d32]/20 transition-all cursor-pointer shadow-sm">
            <div className="size-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2e7d32] mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="size-6" />
            </div>
            <p className="text-sm font-semibold text-gray-900 mb-1">Click to upload farm evidence</p>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest tracking-tighter">MAX FILE SIZE: 10MB (PDF, JPG, PNG)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button className="flex-1 h-14 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-md shadow-md text-base transition-all active:scale-95">
            Flag Operation
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 h-14 bg-[#1a4332] hover:bg-[#122e22] text-white font-semibold rounded-md shadow-md text-base transition-all active:scale-95"
          >
            {isSubmitting ? 'Processing...' : 'Log Farm Operation'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormGroup({ label, placeholder, isSelect }: { label: string; placeholder: string; isSelect?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#1a4332] tracking-tight">{label}</label>
      <div className="relative">
        <input 
          readOnly={isSelect}
          placeholder={placeholder}
          className={cn(
            "w-full h-12 rounded-md border border-gray-200 px-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none transition-all",
            isSelect && "cursor-pointer bg-white"
          )}
        />
        {isSelect && (
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-gray-400 rotate-90" />
        )}
      </div>
    </div>
  )
}
