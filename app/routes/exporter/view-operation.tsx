import { PageHeader } from '~/components/page-header'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  MapPin,
  QrCode,
  Share2,
  Calendar,
  Leaf,
  Wind,
  Scale,
  Award,
  History
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { operationJourney } from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterViewOperationPage() {
  return (
    <div className='space-y-8 pb-12'>
      <PageHeader
        items={[
          { label: 'Exporter', href: '/exporter' },
          { label: 'View Operation' },
        ]}
      />

      {/* Header Profile Section */}
      <div className="bg-white rounded-md border border-gray-100 shadow-sm p-8 flex flex-col lg:flex-row gap-12">
         <div className="size-64 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center shrink-0 shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=500&fit=crop" 
              alt="Cherry Tomatoes" 
              className="size-full object-cover mix-blend-multiply"
            />
         </div>
         <div className="flex-1 space-y-8">
            <div className="space-y-2">
               <h2 className="text-3xl font-black text-[#1a4332] tracking-tighter uppercase">Cherry Tomatoes</h2>
               <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">BATCH-1758381538182</p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 text-sm font-bold text-[#1a4332]">
                  <MapPin className="size-4 text-brand" />
                  Zone 16, Kute, Iwo Road
               </div>
               <div className="flex items-center gap-3 text-sm font-bold text-[#1a4332]">
                  <Calendar className="size-4 text-brand" />
                  Planted: 3rd, January 2020
               </div>
            </div>

            <div className="flex flex-wrap gap-3">
               <Button className="h-10 px-6 text-[11px] font-bold bg-[#1a4332] text-white gap-2 rounded-md shadow-sm">
                  <QrCode className="size-4" /> QR Code
               </Button>
               <Button variant="outline" className="h-10 px-6 text-[11px] font-bold border-gray-100 text-[#1a4332] gap-2 rounded-md">
                  <Download className="size-4" /> Download
               </Button>
               <Button variant="outline" className="h-10 px-6 text-[11px] font-bold border-gray-100 text-[#1a4332] gap-2 rounded-md">
                  <Share2 className="size-4" /> Share
               </Button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-3 shrink-0">
            {[
               { label: 'Sustainability Score', value: '56', icon: <Leaf className="size-4" /> },
               { label: 'kg CO₂ eq', value: '0.0', icon: <Wind className="size-4" /> },
               { label: 'Total Weight', value: '1,680Kg', icon: <Scale className="size-4" /> },
               { label: 'Certifications', value: '2', icon: <Award className="size-4" /> },
            ].map((stat, i) => (
               <div key={i} className="w-36 rounded-md border border-gray-50 bg-gray-50/50 p-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="text-brand">{stat.icon}</div>
                  <div className="space-y-0.5">
                     <h4 className="text-xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                     <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Tabs Section */}
      <div className="flex flex-col items-center gap-6">
         <div className="flex p-1 bg-gray-50 rounded-md gap-1">
            {['Journey', 'Impact', 'Quality', 'People'].map((tab) => (
               <Button 
                 key={tab} 
                 variant={tab === 'Journey' ? 'default' : 'ghost'}
                 className={cn(
                   "h-8 px-8 text-[11px] font-bold rounded-md transition-all",
                   tab === 'Journey' ? "bg-white text-[#1a4332] shadow-sm border-gray-100" : "text-gray-400 hover:text-gray-600"
                 )}
               >
                  {tab}
               </Button>
            ))}
         </div>

         <div className="flex items-center gap-2 text-[12px] font-bold text-gray-600">
            This is a Consolidated batch of <ChevronRight className="size-3 rotate-90" />
         </div>

         <div className="flex gap-2">
            {['BATCH-101', 'BATCH-102', 'BATCH-103', 'BATCH-104'].map((batch) => (
               <div key={batch} className="px-3 py-1 rounded-md border border-brand/20 bg-brand/5 text-[10px] font-bold text-brand uppercase tracking-widest">
                  {batch}
               </div>
            ))}
         </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-4xl mx-auto space-y-12 relative pt-8">
         {/* Vertical Line */}
         <div className="absolute left-[31px] top-0 bottom-0 w-[2px] bg-gray-100" />

         {operationJourney.map((step, i) => (
            <div key={i} className="relative pl-20 group">
               {/* Dot */}
               <div className="absolute left-[24px] top-4 size-4 rounded-full border-4 border-white bg-brand shadow-sm z-10" />
               
               <div className="bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                        <div className="space-y-0.5">
                           <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">{step.stage}</h3>
                           <p className="text-[10px] font-medium text-gray-400">{step.description.split('.')[0]}.</p>
                        </div>
                        <div className="flex gap-8">
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Date</p>
                              <p className="text-[10px] font-bold text-gray-900 uppercase">{step.date}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Time</p>
                              <p className="text-[10px] font-bold text-gray-900 uppercase">{step.time}</p>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <p className="text-[11px] font-medium text-gray-500 leading-relaxed max-w-3xl">
                           {step.description}
                        </p>

                        {step.details.length > 0 && (
                           <div className="space-y-4">
                              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Operations Details</h4>
                              <div className="flex flex-wrap gap-x-8 gap-y-2">
                                 {step.details.map((detail, idx) => (
                                    <div key={idx} className="flex gap-2 text-[10px] font-bold">
                                       <span className="text-gray-400 uppercase tracking-tight">{detail.label}:</span>
                                       <span className="text-gray-900 uppercase tracking-tight">{detail.value}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  )
}
