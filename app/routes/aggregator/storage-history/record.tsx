import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import { ChevronRight, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { cn } from '~/lib/utils'

export default function RecordOperationPage() {
  const [searchParams] = useSearchParams()
  const operationType = searchParams.get('type') || 'Operation'

  return (
    <div className="space-y-6 pb-20">
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
        <h1 className="text-2xl font-bold text-[#1a4332] tracking-tight uppercase">Record New {operationType}</h1>
        <p className="text-sm text-gray-500 font-medium">Here's a list of your tasks for this month!</p>
      </div>

      {/* Summary Bar */}
      <div className="bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm flex flex-col md:flex-row">
        <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Selected Farm</p>
          <h3 className="text-lg font-bold text-[#1a4332] tracking-tight mb-1">Debs Debs Farm</h3>
          <p className="text-sm text-gray-500 font-medium">Kute, Iwo Road, Ibadan 8996.30 hectares</p>
        </div>
        <div className="p-8 flex-1 bg-gray-50/30 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Selected Product</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Maize</h3>
          <p className="text-sm text-gray-500 font-medium">Variety A</p>
        </div>
        <div className="p-8 flex-1 border-b md:border-b-0 md:border-r border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Last Operation</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Cleaning</h3>
          <p className="text-sm text-gray-500 font-medium">08/08/2024</p>
        </div>
        <div className="p-8 flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Next Operation</p>
          <h3 className="text-lg font-bold text-[#2e7d32] tracking-tight mb-1">Land Preparation</h3>
          <p className="text-sm text-gray-500 font-medium">08/08/2024</p>
        </div>
      </div>

      {/* Form Area */}
      <div className="space-y-8 pt-4">
        <div>
          <h2 className="text-lg font-bold text-[#1a4332] tracking-tight">Operations Details</h2>
          <p className="text-sm text-gray-500 font-medium">When and where it took place, and who performed it.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormGroup label="Date" placeholder="Select Tillage Method" isSelect />
          <FormGroup label="Time" placeholder="Select Preparation Techniques" isSelect />
          <FormGroup label="Weight" placeholder="Select Pre-plant Inputs" isSelect />
          <FormGroup label="Quantity" placeholder="Enter Quantity" />
          <FormGroup label="Location" placeholder="Select rate" isSelect />
          <FormGroup label="Conservation Practices" placeholder="Select Clearing Method" isSelect />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a4332] tracking-tight">Description (Optional)</label>
            <textarea 
              placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
              className="w-full h-32 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none resize-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a4332] tracking-tight">Log Operation</label>
            <textarea 
              placeholder="Enter description"
              className="w-full h-24 rounded-md border border-gray-200 p-4 text-sm font-medium text-gray-900 focus:border-[#2e7d32] outline-none resize-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Document<span className="text-red-500 ml-1">*</span></p>
          <div className="border-2 border-dashed border-gray-100 rounded-md p-12 flex flex-col items-center justify-center bg-gray-50/20 group hover:border-[#2e7d32]/20 transition-all cursor-pointer">
            <div className="size-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-[#2e7d32] mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Upload className="size-6" />
            </div>
            <p className="text-sm font-bold text-gray-900 mb-1">Click to upload farm evidence</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max file size: 10MB (PDF, JPG, PNG)</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button className="flex-1 h-14 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold rounded-md shadow-md text-base transition-all active:scale-95">
            Flag Operation
          </Button>
          <Button className="flex-1 h-14 bg-[#1a4332] hover:bg-[#122e22] text-white font-bold rounded-md shadow-sm text-base transition-all active:scale-95">
            Log Farm Operation
          </Button>
        </div>
      </div>
    </div>
  )
}

function FormGroup({ label, placeholder, isSelect }: { label: string; placeholder: string; isSelect?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-[#1a4332] tracking-tight">{label}</label>
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
