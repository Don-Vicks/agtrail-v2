import { useQueryClient } from '@tanstack/react-query'
import { Archive, ClipboardList, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { PageHeader } from '~/components/page-header'
import { Button } from '~/components/ui/button'
import {
  getGetFieldAgentsObservationsQueryKey,
  usePostFieldAgentsObservations,
} from '~/lib/api/generated/field-agent/field-agent'
import { useGetFarmsCropCyclesIdOperations } from '~/lib/api/generated/farms-operations/farms-operations'
import type { CropCycle } from '~/lib/api/generated/models/cropCycle'
import {
  useGetFarmsIdCropCycles,
} from '~/lib/api/generated/farms-crop-cycles/farms-crop-cycles'
import { useGetFarms } from '~/lib/api/generated/farms/farms'
import { usePostUpload } from '~/lib/api/generated/upload/upload'
import { resolveDocumentUrlForApi } from '~/lib/api/custom-fetch'
import { extractDataArray, readFieldAgentLastCheckIn } from '~/lib/field-agent-utils'
import { formatFarmLocation } from '~/lib/record-operation-dashboard'

function operationLabel(operationParam: string | undefined) {
  if (!operationParam) return 'Observation'
  return operationParam.replace(/-/g, ' ')
}

export default function RecordObservationForm() {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const cropCycleId = params.id ?? ''
  const operationSlug = params.operation ?? ''
  const farmId = searchParams.get('farmId') ?? ''

  const [cropGrowthStage, setCropGrowthStage] = useState('')
  const [observationNote, setObservationNote] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)

  const { data: farmsResponse } = useGetFarms()
  const farms = farmsResponse?.data?.data ?? []
  const farm = useMemo(() => farms.find((f) => f.id === farmId) ?? null, [farms, farmId])

  const { data: cropCyclesResponse } = useGetFarmsIdCropCycles(farmId || '_', {
    query: { enabled: Boolean(farmId) },
  })

  const cropCycles = useMemo(
    () => extractDataArray<CropCycle>(cropCyclesResponse?.data),
    [cropCyclesResponse?.data],
  )
  const cycle = useMemo(
    () => cropCycles.find((c) => c.id === cropCycleId) ?? null,
    [cropCycles, cropCycleId],
  )
  const { data: operationsResponse } = useGetFarmsCropCyclesIdOperations(cropCycleId, {
    query: { enabled: Boolean(cropCycleId) },
  })
  const operations = useMemo(() => extractDataArray<any>(operationsResponse?.data), [operationsResponse?.data])
  const selectedOperation = useMemo(() => {
    if (!operations.length) return null
    const normalizedSlug = operationSlug.toLowerCase().replace(/-/g, '_')
    const matches = operations.filter((op) => {
      const type = String(op.operationType ?? '').toLowerCase()
      const cat = String(op.operationCategory ?? '').toLowerCase()
      return type.includes(operationSlug.toLowerCase()) || type.includes(normalizedSlug) || cat.includes(normalizedSlug)
    })
    const list = matches.length ? matches : operations
    return [...list].sort(
      (a, b) => new Date(b.operationDate ?? b.createdAt ?? 0).getTime() - new Date(a.operationDate ?? a.createdAt ?? 0).getTime(),
    )[0]
  }, [operations, operationSlug])

  const lastCheckIn = readFieldAgentLastCheckIn()
  const checkInReady = Boolean(lastCheckIn && farmId && lastCheckIn.farmId === farmId)

  const { mutateAsync: submitObservation, isPending } = usePostFieldAgentsObservations({
    request: {
      headers: { 'X-Offline-Label': 'Submit observation' }
    }
  } as any)
  const { mutateAsync: uploadFile, isPending: isUploading } = usePostUpload()

  const handleSubmit = async () => {
    if (!farmId || !farm) {
      toast.error('Missing farm context. Re-open this form from Record Observation.')
      return
    }
    if (!cropCycleId) {
      toast.error('Missing crop cycle.')
      return
    }
    const last = readFieldAgentLastCheckIn()
    if (!last || last.farmId !== farmId) {
      toast.error('Check in at this farm first (Farm Assets → Check in), then submit your observation.')
      return
    }

    if (!observationNote.trim()) {
      toast.error('Please enter your observation.')
      return
    }
    if (!evidenceFile) {
      toast.error('Upload a document before submitting observation.')
      return
    }

    let uploadedDocumentUrl: string | undefined
    try {
      const uploadRes = await uploadFile({ data: { files: [evidenceFile] } })
      uploadedDocumentUrl = resolveDocumentUrlForApi(uploadRes.data?.urls?.[0])
      if (!uploadedDocumentUrl) {
        toast.error('Document upload failed. Please try again.')
        return
      }
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Could not upload document.')
      return
    }

    try {
      const res = await submitObservation({
        data: {
          checkInId: last.checkInId,
          farmId,
          cropCycleId,
          cropGrowthStage: cropGrowthStage.trim() || selectedOperation?.operationType || undefined,
          notes: `${observationNote.trim()}\n\n[Operation Prefill]\nType: ${selectedOperation?.operationType || 'N/A'}\nDate: ${selectedOperation?.operationDate || 'N/A'}\nDescription: ${selectedOperation?.description || 'N/A'}`,
          photos: uploadedDocumentUrl ? [uploadedDocumentUrl] : [],
        },
      })

      const body = res.data as { offlineQueued?: boolean; message?: string }
      if (body && typeof body === 'object' && 'offlineQueued' in body && body.offlineQueued) {
        toast.message(body.message ?? 'Observation queued for sync.')
        navigate('/field-agent/record-observation')
        return
      }

      toast.success('Observation saved.')
      void queryClient.invalidateQueries({ queryKey: getGetFieldAgentsObservationsQueryKey() })
      navigate('/field-agent/record-observation')
    } catch (e: unknown) {
      const err = e as { message?: string }
      toast.error(err.message ?? 'Could not save observation.')
    }
  }

  const opTitle = operationLabel(operationSlug)

  // Extract efficient key-value pairs for the dynamic form
  const dynamicFields = useMemo(() => {
    if (!selectedOperation) return []
    const fields: { label: string; value: string }[] = []
    
    if (selectedOperation.operatorName) fields.push({ label: 'Operator Name', value: selectedOperation.operatorName })
    if (selectedOperation.operationType) fields.push({ label: 'Operation Type', value: selectedOperation.operationType })
    if (selectedOperation.operationDate) {
      fields.push({ label: 'Operation Date', value: new Date(selectedOperation.operationDate).toLocaleDateString() })
    }
    if (selectedOperation.cost) {
      fields.push({ label: 'Cost', value: `${selectedOperation.currency || ''} ${selectedOperation.cost}`.trim() })
    }
    if (selectedOperation.areaCovered) {
      fields.push({ label: 'Area Covered', value: `${selectedOperation.areaCovered} ${selectedOperation.areaUnit || ''}`.trim() })
    }
    if (selectedOperation.equipmentUsed?.length) {
      fields.push({ label: 'Equipment Used', value: selectedOperation.equipmentUsed.join(', ') })
    }
    if (selectedOperation.weatherConditions) {
      const w = selectedOperation.weatherConditions
      const wStr = typeof w === 'string' ? w : JSON.stringify(w)
      fields.push({ label: 'Weather Conditions', value: wStr })
    }
    
    // Add any quality assessment or extra parsed fields efficiently
    if (selectedOperation.qualityAssessment && typeof selectedOperation.qualityAssessment === 'object') {
      Object.entries(selectedOperation.qualityAssessment).forEach(([k, v]) => {
        if (v && typeof v === 'string' || typeof v === 'number') {
          // Capitalize and split camel case
          const formattedKey = k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
          fields.push({ label: formattedKey, value: String(v) })
        }
      })
    }

    return fields
  }, [selectedOperation])

  return (
    <div className='space-y-6 pb-20 text-left'>
      <PageHeader
        items={[
          { label: 'Field Agent', href: '/field-agent' },
          { label: 'Record observation', href: '/field-agent/record-observation' },
          { label: opTitle, href: '#' },
        ]}
      />

      <div className='space-y-1'>
        <h1 className='text-xl font-bold text-[#1a4332] tracking-tight uppercase'>Record farm observation</h1>
        <p className='text-sm text-gray-500 font-medium'>
          Here's a list of your tasks for this month!
        </p>
      </div>

      {!farmId && (
        <div className='rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
          Missing <code className='font-mono'>farmId</code> in the URL. Use &quot;Submit observation log&quot; from the list so
          the farm is included.
        </div>
      )}

      {farmId && !checkInReady && (
        <div className='rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900'>
          No check-in found for this farm in this session.{' '}
          <a className='font-semibold underline' href={`/field-agent/farms/check-in?farmId=${encodeURIComponent(farmId)}`}>
            Check in here
          </a>{' '}
          first, then return to submit the observation.
        </div>
      )}

      {/* Top Header Card */}
      <div className='bg-white border border-gray-100 rounded-md overflow-hidden shadow-sm flex flex-col md:flex-row mb-12'>
        <div className='p-6 flex-1 border-b md:border-b-0 md:border-r border-gray-100'>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2'>Selected Farm</p>
          <h3 className='text-sm font-bold text-gray-900 tracking-tight mb-1'>{farm?.name ?? '—'}</h3>
          <p className='text-xs text-gray-500 font-medium'>{formatFarmLocation(farm)}</p>
        </div>
        <div className='p-6 flex-1 bg-gray-50/30 border-b md:border-b-0 md:border-r border-gray-100'>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2'>Selected Product</p>
          <h3 className='text-sm font-bold text-[#2e7d32] tracking-tight mb-1'>
            {cycle?.productName ?? '—'}
          </h3>
          <p className='text-xs text-gray-500 font-medium'>
            {cycle?.variety ? `Variety: ${cycle.variety}` : 'Variety not set'}
          </p>
        </div>
        <div className='p-6 flex-1 border-b md:border-b-0 md:border-r border-gray-100'>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2'>Last Operation</p>
          <h3 className='text-sm font-bold text-[#1a4332] tracking-tight mb-1'>
            {selectedOperation?.operationType || opTitle || 'Nil'}
          </h3>
          <p className='text-xs text-gray-500 font-medium'>
            {selectedOperation?.operationDate ? new Date(selectedOperation.operationDate).toLocaleDateString() : '—'}
          </p>
        </div>
        <div className='p-6 flex-1 bg-gray-50/30'>
          <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2'>Check-in</p>
          <p className='text-sm font-bold text-[#1a4332] tracking-tight mb-1'>
             {checkInReady ? 'Active' : 'Missing'}
          </p>
          <p className='text-xs font-mono text-gray-500 truncate'>
            {checkInReady ? lastCheckIn?.checkInId : 'Required'}
          </p>
        </div>
      </div>

      {/* Prefilled Farm Operations Section */}
      <div className="space-y-6 pt-4 mb-12 border-b border-gray-100 pb-12">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Farm Operations</h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mt-1">All operations are automatically timestamped and include environmental conditions, safety measures, and compliance information.</p>
        </div>
        
        {dynamicFields.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dynamicFields.map((field, idx) => (
              <div key={idx} className="space-y-1.5">
                <label className="text-sm font-bold text-gray-900">{field.label}</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={field.value} 
                    disabled
                    className="w-full h-11 rounded-md border border-gray-200 px-3.5 text-sm text-gray-500 bg-gray-50/50 cursor-not-allowed appearance-none"
                  />
                  {/* Fake dropdown chevron to mimic the disabled select look if it's a short value */}
                  {field.value.length < 50 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                      <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-md border border-gray-100">
            No additional operation data fields available for {selectedOperation?.operationType || 'this operation'}.
          </div>
        )}

        {/* Operation Description (Prefilled) */}
        {selectedOperation?.description && (
          <div className="space-y-1.5 pt-4">
            <label className="text-sm font-bold text-gray-900">Description (Optional)</label>
            <textarea
              value={selectedOperation.description}
              disabled
              className="w-full min-h-[100px] rounded-md border border-gray-200 p-3.5 text-sm text-gray-500 bg-gray-50/50 cursor-not-allowed resize-none"
            />
          </div>
        )}
      </div>

      {/* Field Agent Input Section */}
      <div className='space-y-6 pt-2'>
        <label className='space-y-2 block'>
          <span className='text-sm font-bold text-gray-900'>Log Observation</span>
          <textarea
            value={observationNote}
            onChange={(e) => setObservationNote(e.target.value)}
            placeholder='Enter description'
            className='w-full min-h-[120px] rounded-md border border-gray-200 p-3.5 text-sm focus:border-[#2e7d32] outline-none resize-none'
          />
        </label>

        <div className='space-y-3'>
          <label className='text-[11px] font-semibold text-gray-900 uppercase tracking-widest'>Upload document *</label>
          <label
            htmlFor='field-observation-document'
            className='block rounded-md border-2 border-dashed border-gray-100 bg-white p-8 text-center group hover:border-brand/20 transition-all cursor-pointer'
          >
            <div className='mx-auto mb-3 size-10 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50 group-hover:scale-110 transition-transform'>
              <Upload className='size-4 text-brand' />
            </div>
            <p className='text-sm font-semibold text-gray-800'>
              {evidenceFile ? evidenceFile.name : 'Click to upload farm evidence'}
            </p>
            <p className='text-[10px] uppercase tracking-wider text-gray-400 mt-0.5'>Max file size: 10MB (PDF, JPG, PNG)</p>
            <input
              id='field-observation-document'
              type='file'
              accept='.pdf,.jpg,.jpeg,.png'
              className='hidden'
              onChange={(e) => setEvidenceFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
          <Button
            type='button'
            className='flex-1 h-12 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-semibold text-base'
            onClick={() => navigate('/field-agent/record-observation')}
          >
            Flag Operation
          </Button>
          <Button
            type='button'
            disabled={isPending || isUploading || !checkInReady}
            onClick={() => void handleSubmit()}
            className='flex-1 h-12 bg-[#2e5a27] hover:bg-[#1a4332] text-white font-semibold text-base'
          >
            {isUploading ? 'Uploading document…' : isPending ? 'Saving…' : 'Log Farm Operation'}
          </Button>
        </div>
      </div>

      <p className='text-xs text-gray-400 flex items-center gap-2'>
        <Archive className='size-3.5 shrink-0' />
        Operation details are prefilled from the selected cycle operation and attached to the observation record.
      </p>
    </div>
  )
}
