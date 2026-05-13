import { ChevronRight, Info, Leaf, ShieldCheck } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

interface AuditLog {
  timestamp: string
  action: string
  entity: string
  performedBy: string
  status: string
}

interface CompositionTreeProps {
  auditLogs: AuditLog[]
  onBack: () => void
  onContinue: () => void
}

export function CompositionTree({ auditLogs, onBack, onContinue }: CompositionTreeProps) {
  return (
    <div className='space-y-8'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-bold text-[#2e7d32] tracking-tight'>
          Lot Composition Tress
        </h1>
        <p className='text-[13px] text-gray-500 font-medium'>
          Visualizing the full lineage and source distribution of
          agricultural assets.
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-8 items-start'>
        {/* Tree Area */}
        <div className='flex-1 bg-white rounded-md border border-gray-100 p-6 md:p-10 flex justify-center overflow-x-auto shadow-sm min-h-[500px]'>
          <div className='flex flex-col items-center relative pt-4 md:pt-8 w-full min-w-[320px]'>
            {/* Root Node */}
            <div className='bg-[#2e7d32] text-white rounded-md p-6 w-full max-w-xs md:w-80 shadow-md z-10 relative'>
              <div className='flex justify-between items-start mb-2'>
                <span className='text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest'>
                  Top Level Node
                </span>
                <Leaf className='size-4' />
              </div>
              <h3 className='text-xl font-bold mb-1'>New Lot Creation</h3>
              <p className='text-sm font-medium text-white/80 mb-6 tracking-wide'>
                LOT-2023-001
              </p>
              <div className='flex justify-between text-[11px] font-bold border-t border-white/20 pt-3'>
                <span>12,450 kg</span>
                <span>Arabica Grade A</span>
              </div>
            </div>

            {/* Desktop Lines */}
            <div className='hidden md:block text-center'>
              <div className='w-px h-8 bg-gray-200 mx-auto'></div>
              <div className='w-[440px] border-t border-gray-200'></div>
              <div className='flex justify-between w-[440px]'>
                <div className='w-px h-8 bg-gray-200'></div>
                <div className='w-px h-8 bg-gray-200'></div>
              </div>
            </div>

            {/* Mobile Line */}
            <div className='md:hidden w-px h-8 bg-gray-200'></div>

            {/* Farmers Container */}
            <div className='flex flex-col md:flex-row justify-between items-center md:items-start gap-8 md:gap-0 md:w-[640px] relative -top-px w-full'>
              {/* Farmer 1 */}
              <div className='flex flex-col items-center w-full md:w-auto'>
                <div className='bg-white border border-gray-200 rounded-md p-5 w-full max-w-xs md:w-72 shadow-sm z-10 relative text-left'>
                  <div className='flex items-center gap-4 mb-5'>
                    <div className='size-12 rounded-md bg-gray-100 overflow-hidden shrink-0'>
                      <img
                        src='https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80'
                        alt='Jonathan'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-sm font-bold text-[#1a4332]'>
                        Jonathan Arable
                      </h4>
                      <p className='text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5'>
                        Source Farmer
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-xs pt-3 border-t border-gray-100'>
                    <span className='font-bold text-gray-500'>
                      Contribution:
                    </span>
                    <span className='font-bold text-[#1a4332]'>
                      7,200 kg
                    </span>
                  </div>
                </div>
                
                {/* Lines to Batches */}
                <div className='w-px h-6 bg-gray-200'></div>
                <div className='w-32 border-t border-gray-200'></div>
                <div className='flex justify-between w-32'>
                  <div className='w-px h-6 bg-gray-200'></div>
                  <div className='w-px h-6 bg-gray-200'></div>
                </div>

                {/* Batches for Farmer 1 */}
                <div className='flex gap-3 md:gap-4'>
                  <div className='bg-gray-50 border border-gray-200 rounded-md p-3 w-28 text-center shadow-sm'>
                    <p className='text-[10px] font-bold text-gray-900'>
                      BATCH-A12
                    </p>
                    <p className='text-[11px] font-medium text-gray-600 my-1'>
                      3,600 kg
                    </p>
                    <p className='text-[9px] text-gray-400 font-medium'>
                      Oct 12, 2023
                    </p>
                  </div>
                  <div className='bg-gray-50 border border-gray-200 rounded-md p-3 w-28 text-center shadow-sm'>
                    <p className='text-[10px] font-bold text-gray-900'>
                      BATCH-A15
                    </p>
                    <p className='text-[11px] font-medium text-gray-600 my-1'>
                      3,600 kg
                    </p>
                    <p className='text-[9px] text-gray-400 font-medium'>
                      Oct 15, 2023
                    </p>
                  </div>
                </div>
                
                <div className='md:hidden w-px h-8 bg-gray-200'></div>
              </div>

              {/* Farmer 2 */}
              <div className='flex flex-col items-center w-full md:w-auto'>
                <div className='bg-white border border-gray-200 rounded-md p-5 w-full max-w-xs md:w-72 shadow-sm z-10 relative text-left'>
                  <div className='flex items-center gap-4 mb-5'>
                    <div className='size-12 rounded-md bg-gray-100 overflow-hidden shrink-0'>
                      <img
                        src='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
                        alt='Sarah'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h4 className='text-sm font-bold text-[#1a4332]'>
                        Sarah Greenfield
                      </h4>
                      <p className='text-[10px] text-gray-500 uppercase font-bold tracking-wider mt-0.5'>
                        Source Farmer
                      </p>
                    </div>
                  </div>
                  <div className='flex justify-between items-center text-xs pt-3 border-t border-gray-100'>
                    <span className='font-bold text-gray-500'>
                      Contribution:
                    </span>
                    <span className='font-bold text-[#1a4332]'>
                      5,250 kg
                    </span>
                  </div>
                </div>
                
                {/* Lines to Batches */}
                <div className='w-px h-6 bg-gray-200'></div>
                <div className='w-32 border-t border-gray-200'></div>
                <div className='flex justify-between w-32'>
                  <div className='w-px h-6 bg-gray-200'></div>
                  <div className='w-px h-6 bg-gray-200'></div>
                </div>
                {/* Batches for Farmer 2 */}
                <div className='flex gap-3 md:gap-4'>
                  <div className='bg-gray-50 border border-gray-200 rounded-md p-3 w-28 text-center shadow-sm'>
                    <p className='text-[10px] font-bold text-gray-900'>
                      BATCH-G02
                    </p>
                    <p className='text-[11px] font-medium text-gray-600 my-1'>
                      2,625 kg
                    </p>
                    <p className='text-[9px] text-gray-400 font-medium'>
                      Oct 18, 2023
                    </p>
                  </div>
                  <div className='bg-gray-50 border border-gray-200 rounded-md p-3 w-28 text-center shadow-sm'>
                    <p className='text-[10px] font-bold text-gray-900'>
                      BATCH-G05
                    </p>
                    <p className='text-[11px] font-medium text-gray-600 my-1'>
                      2,625 kg
                    </p>
                    <p className='text-[9px] text-gray-400 font-medium'>
                      Oct 20, 2023
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Sidebar */}
        <div className='w-full lg:w-80 bg-white border border-gray-100 rounded-md p-6 shadow-sm shrink-0'>
          <h3 className='text-base font-bold text-[#1a4332] mb-6'>
            Compliance
            <br />
            Summary
          </h3>

          <div className='flex flex-col items-center justify-center mb-8'>
            <div className='size-20 rounded-full border-[3px] border-[#2e7d32] flex flex-col items-center justify-center mb-2 shadow-sm'>
              <span className='text-xl font-bold text-[#2e7d32]'>
                98
              </span>
              <span className='text-[8px] font-bold text-[#2e7d32] uppercase tracking-widest'>
                Score
              </span>
            </div>
            <p className='text-[11px] font-bold text-[#1a4332]'>
              Traceability Score
            </p>
          </div>

          <div className='space-y-6 mb-8 text-left'>
            <ComplianceItem
              status='success'
              title='Farmer Identity Verified'
              desc='Digital signatures confirmed for all 2 source farmers.'
            />
            <ComplianceItem
              status='success'
              title='Weight Verification'
              desc='Batch sums match final lot weight (12,450 kg).'
            />
            <ComplianceItem
              status='success'
              title='Location Provenance'
              desc='Geofence validation successful for harvest areas.'
            />
            <ComplianceItem
              status='pending'
              title='Lab Report Pending'
              desc='Final quality grading lab report awaiting upload.'
            />
          </div>

          <Button className='w-full bg-[#1a4332] hover:bg-[#122e22] text-white font-bold h-11 rounded-md shadow-sm'>
            Compliance Docs
          </Button>
        </div>
      </div>

      <div className='space-y-4 pt-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-900 tracking-tight'>
            Audit Log
          </h2>
          <button className='text-sm font-bold text-[#2e7d32] hover:underline flex items-center gap-1'>
            View Full History <ChevronRight className='size-4' />
          </button>
        </div>
        <div className='rounded-md border border-gray-100 bg-white overflow-x-auto shadow-sm'>
          <table className='w-full text-left border-collapse min-w-[800px]'>
            <thead>
              <tr className='bg-[#fdfdfc] border-b border-gray-100'>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
                  Timestamp
                </th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
                  Action
                </th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
                  Entity
                </th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest'>
                  Performed By
                </th>
                <th className='px-6 py-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest text-right'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {auditLogs.map((log, idx) => (
                <tr
                  key={idx}
                  className='hover:bg-gray-50/50 transition-colors'
                >
                  <td className='px-6 py-4 text-xs font-medium text-gray-600'>
                    {log.timestamp}
                  </td>
                  <td className='px-6 py-4 text-sm font-bold text-gray-900'>
                    {log.action}
                  </td>
                  <td className='px-6 py-4 text-sm font-medium text-gray-600'>
                    {log.entity}
                  </td>
                  <td className='px-6 py-4 flex items-center gap-2'>
                    <div className='size-6 rounded-full bg-gray-200'></div>
                    <span className='text-sm font-medium text-gray-600'>
                      {log.performedBy}
                    </span>
                  </td>
                  <td className='px-6 py-4 text-right'>
                    <span
                      className={cn(
                        'px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border',
                        log.status === 'COMPLETED' ||
                          log.status === 'VERIFIED'
                          ? 'bg-[#e8f5e9]/50 text-[#2e7d32] border-[#2e7d32]/20'
                          : 'bg-gray-100 text-gray-600 border-gray-200',
                      )}
                    >
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className='flex justify-end gap-3 pt-4 pb-8 border-t border-gray-100'>
        <Button
          onClick={onBack}
          variant='outline'
          className='h-11 px-6 rounded-md font-bold text-gray-600'
        >
          Cancel
        </Button>
        <Button
          onClick={onContinue}
          className='h-11 px-6 rounded-md bg-[#1a4332] hover:bg-[#122e22] font-bold text-white shadow-sm'
        >
          Continue to Next Step <ChevronRight className='ml-2 size-4' />
        </Button>
      </div>
    </div>
  )
}

function ComplianceItem({ status, title, desc }: { status: 'success' | 'pending'; title: string; desc: string }) {
  return (
    <div className='flex gap-3 items-start'>
      {status === 'success' ? (
        <ShieldCheck className='size-5 text-[#2e7d32] shrink-0 mt-0.5' />
      ) : (
        <Info className='size-5 text-gray-400 shrink-0 mt-0.5' />
      )}
      <div>
        <p className='text-sm font-bold text-gray-900 mb-0.5'>{title}</p>
        <p className='text-[11px] text-gray-500 font-medium leading-relaxed'>{desc}</p>
      </div>
    </div>
  )
}
