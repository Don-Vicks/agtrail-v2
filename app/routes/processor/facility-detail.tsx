import { useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Activity, ArrowUpRight, Building2, MapPin, Settings2, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils'
import { getOrganizationHeaders } from '~/lib/organization-context'
import {
  getGetFacilitiesIdQueryKey,
  getGetFacilitiesQueryKey,
  useGetFacilitiesId,
  usePatchFacilitiesId,
} from '~/lib/api/generated/facilities/facilities'
import type { UpdateFacilityRequestStatus } from '~/lib/api/generated/models'

type FacilityStatus = UpdateFacilityRequestStatus

const STATUS_OPTIONS: Array<{ value: FacilityStatus; label: string }> = [
  { value: 'operational', label: 'Operational' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inactive', label: 'Inactive' },
]

export default function FacilityDetailPage() {
  const { id = '' } = useParams()
  const queryClient = useQueryClient()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [statusInput, setStatusInput] = useState<FacilityStatus>('operational')
  const headers = getOrganizationHeaders()

  const { data, isLoading, isError, refetch } = useGetFacilitiesId(id, {
    request: { headers },
  })
  const updateMutation = usePatchFacilitiesId({ request: { headers } })
  const facility = data?.data?.data

  const utilization = useMemo(() => {
    const cap = Number(facility?.capacity ?? 0)
    if (!facility) return 0
    if (facility.status === 'maintenance') return 0
    if (facility.status === 'inactive') return 10
    return Math.min(95, Math.max(20, Math.round(cap / 10)))
  }, [facility])

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: getGetFacilitiesQueryKey() })
    if (id) await queryClient.invalidateQueries({ queryKey: getGetFacilitiesIdQueryKey(id) })
  }

  const saveFacility = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!facility) return
    const form = new FormData(e.currentTarget)
    const name = String(form.get('name') ?? '').trim()
    if (!name) return toast.error('Facility name is required.')
    try {
      await updateMutation.mutateAsync({
        id: facility.id,
        data: {
          name,
          location: String(form.get('location') ?? ''),
          status: statusInput,
          capacity: String(form.get('capacity') ?? ''),
          processingLineType: String(form.get('lineType') ?? ''),
          facilityManagerId: String(form.get('manager') ?? ''),
        },
      })
      await invalidate()
      setIsEditOpen(false)
      toast.success('Facility record updated.')
    } catch (error) {
      console.error(error)
      toast.error('Unable to update facility record.')
    }
  }

  const logMaintenance = async () => {
    if (!facility) return
    try {
      await updateMutation.mutateAsync({ id: facility.id, data: { status: 'maintenance' } })
      await invalidate()
      toast.success('Maintenance status recorded.')
    } catch (error) {
      console.error(error)
      toast.error('Unable to record maintenance.')
    }
  }

  if (isLoading) return <div className="h-44 rounded-2xl border border-gray-100 bg-gray-50 animate-pulse" />
  if (isError) return <EmptyState icon={<Building2 className="size-10" />} title="Facility failed to load" description="Check your connection and retry." action={{ label: 'Retry', onClick: () => refetch() }} />
  if (!facility) return <EmptyState icon={<Building2 className="size-10" />} title="Facility not found" description="This facility is unavailable for your organization." />

  return (
    <div className="space-y-6 pb-20">
      <PageHeader items={[{ label: 'Dashboard', href: '/processor' }, { label: 'Facilities', href: '/processor/facilities' }, { label: facility.name }]} />

      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className={cn('size-16 rounded-2xl flex items-center justify-center shadow-inner', facility.status === 'operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}>
              <Building2 className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{facility.name}</h1>
                <Badge className={cn('uppercase tracking-widest font-bold text-[10px] px-3 py-1 rounded-full', facility.status === 'operational' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700')}>
                  {STATUS_OPTIONS.find((s) => s.value === facility.status)?.label ?? facility.status}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-2"><MapPin className="size-4 text-brand" />{facility.location ?? 'No location set'}</span>
                <span className="flex items-center gap-2"><Activity className="size-4 text-blue-500" />{facility.processingLineType ?? 'No line type'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={() => setStatusInput(facility.status as FacilityStatus)}
                  >
                    <Settings2 className="size-4 mr-2" />
                    Edit Site
                  </Button>
                }
              />
              <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>Edit Facility</DialogTitle></DialogHeader>
                <form onSubmit={saveFacility} className="space-y-4 pt-4" id="facility-edit-form">
                  <div className="space-y-2"><Label htmlFor="name">Facility Name</Label><Input id="name" name="name" defaultValue={facility.name} required /></div>
                  <div className="space-y-2"><Label htmlFor="location">Location</Label><Input id="location" name="location" defaultValue={facility.location ?? ''} /></div>
                  <div className="space-y-2"><Label>Status</Label><Select value={statusInput} onValueChange={(value) => setStatusInput(value as FacilityStatus)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><Label htmlFor="capacity">Capacity</Label><Input id="capacity" name="capacity" defaultValue={facility.capacity ?? ''} /></div>
                  <div className="space-y-2"><Label htmlFor="lineType">Line Type</Label><Input id="lineType" name="lineType" defaultValue={facility.processingLineType ?? ''} /></div>
                  <div className="space-y-2"><Label htmlFor="manager">Manager ID</Label><Input id="manager" name="manager" defaultValue={facility.facilityManagerId ?? ''} /></div>
                  <DialogFooter>
                    <Button type="submit" form="facility-edit-form" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Saving...' : 'Save changes'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button className="bg-[#1d3d1e] hover:bg-black text-white h-11" onClick={logMaintenance} disabled={updateMutation.isPending}>
              <Wrench className="size-4 mr-2" />Log Maintenance
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Current Utilization" value={`${utilization}%`} icon={<Activity className="size-5 text-brand" />} />
        <StatCard title="Monthly Capacity" value={`${facility.capacity ?? 0}T`} icon={<ArrowUpRight className="size-5 text-blue-500" />} />
        <StatCard title="Manager ID" value={facility.facilityManagerId ?? 'Unassigned'} icon={<Building2 className="size-5 text-amber-500" />} />
      </div>
    </div>
  )
}
