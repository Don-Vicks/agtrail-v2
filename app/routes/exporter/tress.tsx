import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Plus,
  ShieldCheck,
  User,
  Activity,
  History
} from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  auditLogs,
  lotTreeData
} from '~/lib/mock-data/exporter'
import { cn } from '~/lib/utils'

export default function ExporterLotTressPage() {
  return (
    <div className='space-y-6 pb-12'>
      <div className="flex items-center gap-2 text-[#1a4332] text-[11px] font-bold uppercase tracking-widest">
        <div className="size-4 rounded-sm border border-[#1a4332] flex items-center justify-center">
          <Plus className="size-3" />
        </div>
        Add Farmer
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#1a4332] tracking-tight">Lot Composition Tress</h2>
          <p className="text-[12px] text-gray-500 font-medium tracking-tight">Visualizing the full lineage and source distribution of agricultural assets.</p>
        </div>
        <div className="size-10 rounded-full border-2 border-[#1a4332] p-0.5">
          <div className="size-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
             <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="size-full object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Tree Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-8 shadow-sm min-h-[500px] flex flex-col items-center relative overflow-hidden">
            {/* Tree Structure */}
            <div className="relative flex flex-col items-center gap-16 z-10">
              {/* Root Node */}
              <div className="w-64 rounded-md bg-[#1a4332] p-6 text-white shadow-xl relative">
                <div className="flex items-center justify-between mb-4">
                   <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">TOP LEVEL NODE</div>
                   <div className="size-6 flex items-center justify-center">
                     <svg viewBox="0 0 24 24" className="size-4 fill-white opacity-40"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
                   </div>
                </div>
                <h3 className="text-lg font-bold mb-1 tracking-tight">New Lot Creation</h3>
                <p className="text-[11px] font-bold text-brand uppercase tracking-widest mb-6">{lotTreeData.id}</p>
                <div className="flex items-center justify-between text-[11px] font-bold border-t border-white/10 pt-4">
                  <span>{lotTreeData.weight}</span>
                  <span className="opacity-60">{lotTreeData.grade}</span>
                </div>
                
                {/* Connector Line to Children */}
                <div className="absolute left-1/2 -bottom-16 w-[2px] h-16 bg-gray-200 -translate-x-1/2" />
              </div>

              {/* Children Nodes Wrapper */}
              <div className="relative flex items-start gap-12 pt-8">
                {/* Horizontal Connector Line */}
                <div className="absolute top-0 left-[25%] right-[25%] h-[2px] bg-gray-200" />
                
                {lotTreeData.farmers.map((farmer, idx) => (
                  <div key={idx} className="relative flex flex-col items-center gap-12">
                    {/* Vertical Connector Line to this child */}
                    <div className="absolute -top-8 left-1/2 w-[2px] h-8 bg-gray-200 -translate-x-1/2" />
                    
                    <div className="w-56 rounded-md border border-gray-100 bg-white p-4 shadow-md">
                      <div className="flex items-center gap-3 mb-4">
                        <img src={farmer.avatar} alt={farmer.name} className="size-10 rounded-md object-cover" />
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{farmer.name}</h4>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{farmer.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold pt-3 border-t border-gray-50">
                        <span className="text-gray-400">Contribution:</span>
                        <span className="text-[#1a4332]">{farmer.contribution}</span>
                      </div>
                      
                      {/* Connector Line to Batches */}
                      <div className="absolute left-1/2 -bottom-12 w-[2px] h-12 bg-gray-200 -translate-x-1/2" />
                    </div>

                    {/* Batch Nodes */}
                    <div className="flex gap-4 pt-4 relative">
                      {/* Horizontal Connector Line for batches */}
                      <div className="absolute top-0 left-[20%] right-[20%] h-[2px] bg-gray-200" />
                      
                      {farmer.batches.map((batch, bIdx) => (
                        <div key={bIdx} className="relative flex flex-col items-center">
                          {/* Vertical Connector Line to this batch */}
                          <div className="absolute -top-4 left-1/2 w-[2px] h-4 bg-gray-200 -translate-x-1/2" />
                          <div className="w-24 rounded-md border border-gray-100 bg-gray-50/50 p-2.5 text-center space-y-1">
                            <p className="text-[9px] font-bold text-brand uppercase tracking-tight">{batch.id}</p>
                            <p className="text-[10px] font-bold text-gray-900">{batch.weight}</p>
                            <p className="text-[8px] font-bold text-gray-400 uppercase">{batch.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons Overlaid at bottom */}
            <div className="mt-auto pt-16 flex items-center gap-3 relative z-10">
              <Button variant="outline" className="h-9 px-6 text-[11px] font-bold border-gray-200 text-gray-600 uppercase tracking-widest rounded-md">
                Cancel
              </Button>
              <Link 
                to="/exporter/consolidation"
                className={cn(
                  "inline-flex items-center justify-center h-9 px-6 text-[11px] font-bold bg-[#1a4332] hover:bg-[#1a4332]/90 text-white uppercase tracking-widest gap-2 rounded-md shadow-sm transition-colors"
                )}
              >
                Continue to Next Step <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Compliance Section */}
        <div className="space-y-6">
          <div className="rounded-md border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#1a4332] mb-8 uppercase tracking-widest">Compliance Summary</h3>
            
            {/* Compliance Score Chart Placeholder */}
            <div className="flex flex-col items-center justify-center mb-10">
              <div className="size-24 rounded-full border-4 border-gray-50 flex flex-col items-center justify-center relative">
                <svg className="absolute inset-0 size-full -rotate-90">
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                  <circle cx="48" cy="48" r="44" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="276" strokeDashoffset="5.5" />
                </svg>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">98</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">SCORE</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Traceability Score</p>
            </div>

            <div className="space-y-6">
              {[
                { title: 'Farmer Identity Verified', desc: 'Digital signatures confirmed for all source farmers.', status: 'success' },
                { title: 'Weight Verification', desc: 'Batch sums match final lot weight (12,450 kg).', status: 'success' },
                { title: 'Location Provenance', desc: 'Geofence validation successful for harvest areas.', status: 'success' },
                { title: 'Lab Report Pending', desc: 'Final quality grading lab report awaiting upload.', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    item.status === 'success' ? "border-green-500 bg-green-500 text-white" : "border-gray-200 bg-white text-gray-300"
                  )}>
                    {item.status === 'success' ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-bold text-gray-900 leading-tight">{item.title}</h4>
                    <p className="text-[9px] font-medium text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-10 h-10 text-[10px] font-bold bg-[#1a4332] text-white border-none gap-2 hover:bg-[#1a4332]/90 rounded-md">
              Compliance Docs <ChevronRight className="size-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Audit Log Section */}
      <div className='bg-white rounded-md border border-gray-100 shadow-sm overflow-hidden'>
        <div className='p-6 border-b border-gray-50 flex items-center justify-between'>
          <h3 className='text-sm font-bold text-[#1a4332] uppercase tracking-widest'>Audit Log</h3>
          <Button variant="ghost" className="text-[10px] font-bold text-[#1a4332] uppercase tracking-widest gap-2 hover:bg-transparent hover:underline">
            View Full History <ArrowRight className="size-3" />
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-gray-50/50 border-b border-gray-50'>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Timestamp</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Action</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Entity</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest'>Performed By</th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center'>Status</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {auditLogs.map((log, i) => (
                <tr key={i} className='hover:bg-gray-50/50 transition-colors'>
                  <td className='px-6 py-4'>
                    <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{log.timestamp}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-[12px] font-bold text-gray-900 tracking-tight'>{log.action}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-[12px] font-bold text-gray-600 tracking-tight'>{log.entity}</span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className="flex items-center gap-2">
                       <div className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                         {log.performedBy[0]}
                       </div>
                       <span className='text-[12px] font-bold text-gray-900 tracking-tight'>{log.performedBy}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4 text-center'>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                      log.status === 'COMPLETED' ? "bg-green-50 text-green-600" : "bg-brand/10 text-brand"
                    )}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
