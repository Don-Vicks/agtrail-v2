import { useMemo, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup
} from '~/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { MoreVertical, Search, UserPlus, Filter, Download, Calendar, ShieldCheck, Briefcase, Users } from 'lucide-react'
import { cn } from '~/lib/utils'
import { EmptyState } from '~/components/empty-state'
import { toast } from 'sonner'
import {
  getGetPersonnelQueryKey,
  useDeletePersonnelId,
  useGetPersonnel,
  usePatchPersonnelId,
  usePostPersonnel,
} from '~/lib/api/generated/personnel/personnel'
import type {
  CreatePersonnelRequestStatus,
  CreatePersonnelRequestType,
  Personnel,
  UpdatePersonnelRequestStatus,
  UpdatePersonnelRequestType,
} from '~/lib/api/generated/models'
import { getApiErrorMessage } from '~/lib/api/error-message'

interface Person {
  id: string
  fullName: string
  phoneNumber: string
  emailAddress: string
  role: string
  farmAssignments: string[]
  employmentType: string
  employeeId: string
  startDate: string
  certifications: string[]
  emergencyContactName: string
  emergencyContactPhone: string
  status: string
  notes: string
}

const typeLabelMap: Record<string, string> = {
  permanent: 'Permanent',
  seasonal: 'Seasonal',
  contract: 'Contract',
}

const statusLabelMap: Record<string, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

const toPersonnelType = (
  value: string,
): CreatePersonnelRequestType | UpdatePersonnelRequestType =>
  value.toLowerCase() as CreatePersonnelRequestType | UpdatePersonnelRequestType

const toPersonnelStatus = (
  value: string,
): CreatePersonnelRequestStatus | UpdatePersonnelRequestStatus =>
  value.toLowerCase() as CreatePersonnelRequestStatus | UpdatePersonnelRequestStatus

const mapApiPersonnel = (item: Personnel): Person => ({
  id: item.id,
  fullName: item.fullName,
  phoneNumber: item.phoneNumber ?? '',
  emailAddress: item.emailAddress ?? '',
  role: item.designatedRole ?? 'Staff',
  farmAssignments: item.farmId ? [item.farmId] : ['Default Assignment'],
  employmentType: typeLabelMap[item.type] ?? 'Permanent',
  employeeId: item.employeeId ?? '',
  startDate: item.startDate?.split('T')[0] ?? '',
  certifications: [],
  emergencyContactName: item.emergencyContactName ?? '',
  emergencyContactPhone: item.emergencyContactPhone ?? '',
  status: statusLabelMap[item.status] ?? 'Active',
  notes: item.professionalNotes ?? '',
})

export function meta() {
  return [{ title: 'Personnel | Agtrail' }]
}

export default function FarmerPersonnel() {
  const queryClient = useQueryClient()
  const { data: personnelResponse, isLoading, isError, refetch } = useGetPersonnel()
  const { mutateAsync: createPersonnel, isPending: isCreating } = usePostPersonnel()
  const { mutateAsync: updatePersonnel, isPending: isUpdating } = usePatchPersonnelId()
  const { mutateAsync: removePersonnel, isPending: isDeleting } = useDeletePersonnelId()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [employmentFilter, setEmploymentFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [employmentTypeValue, setEmploymentTypeValue] =
    useState<CreatePersonnelRequestType>('permanent')
  const [statusValue, setStatusValue] =
    useState<CreatePersonnelRequestStatus>('active')

  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor')
    ? '/processor'
    : location.pathname.startsWith('/cooperative')
      ? '/cooperative'
      : '/farmer'

  const personnel = useMemo(
    () => (personnelResponse?.data?.data ?? []).map(mapApiPersonnel),
    [personnelResponse],
  )

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(personnel.map(p => p.role)))
    return ['All', ...uniqueRoles]
  }, [personnel])

  const filtered = useMemo(() => {
    return personnel.filter((p) => {
      const matchesSearch = [p.fullName, p.role, p.employeeId, p.emailAddress].some(v => v.toLowerCase().includes(search.toLowerCase()))
      const matchesRole = roleFilter === 'All' || p.role === roleFilter
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      const matchesEmployment = employmentFilter === 'All' || p.employmentType === employmentFilter
      return matchesSearch && matchesRole && matchesStatus && matchesEmployment
    })
  }, [search, roleFilter, statusFilter, employmentFilter, personnel])

  const stats = useMemo(() => {
    const total = personnel.length
    const active = personnel.filter(p => p.status === 'Active').length
    const permanent = personnel.filter(p => p.employmentType === 'Permanent').length
    const seasonal = personnel.filter(p => p.employmentType === 'Seasonal').length
    return { total, active, permanent, seasonal }
  }, [personnel])

  const handleSavePerson = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const fullName = String(formData.get('fullName') ?? '').trim()
    const emailAddress = String(formData.get('email') ?? '').trim()
    const phoneDigits = String(formData.get('phone') ?? '').replace(/\D/g, '')
    const role = String(formData.get('role') ?? '').trim()
    const employeeId = String(formData.get('employeeId') ?? '').trim()

    if (!fullName) {
      toast.error('Full name is required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      toast.error('Enter a valid email address.')
      return
    }
    if (phoneDigits.length < 7) {
      toast.error('Enter a valid phone number.')
      return
    }
    if (!role) {
      toast.error('Designated role is required.')
      return
    }
    if (!employeeId) {
      toast.error('Employee ID is required.')
      return
    }

    try {
      const payload = {
        fullName,
        emailAddress,
        phoneNumber: String(formData.get('phone') ?? '').trim(),
        designatedRole: role,
        type: employmentTypeValue as CreatePersonnelRequestType | UpdatePersonnelRequestType,
        employeeId,
        status: statusValue as CreatePersonnelRequestStatus | UpdatePersonnelRequestStatus,
        startDate: String(formData.get('startDate') ?? '') || new Date().toISOString().split('T')[0],
        emergencyContactName: String(formData.get('emergencyName') ?? ''),
        emergencyContactPhone: String(formData.get('emergencyPhone') ?? ''),
        professionalNotes: String(formData.get('notes') ?? ''),
      }

      if (editingPerson) {
        await updatePersonnel({ id: editingPerson.id, data: payload })
        toast.success('Personnel record updated')
      } else {
        await createPersonnel({ data: payload })
        toast.success('New personnel added successfully')
      }

      await queryClient.invalidateQueries({ queryKey: getGetPersonnelQueryKey() })
      handleCloseModal()
    } catch (error) {
      console.error('Failed to save personnel record', error)
      toast.error(
        getApiErrorMessage(error, 'Unable to save personnel record. Please try again.'),
      )
    }
  }

  const handleEditClick = (p: Person) => {
    setEditingPerson(p)
    setEmploymentTypeValue(toPersonnelType(p.employmentType))
    setStatusValue(toPersonnelStatus(p.status))
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    void (async () => {
      try {
        await removePersonnel({ id })
        await queryClient.invalidateQueries({ queryKey: getGetPersonnelQueryKey() })
        toast.success('Personnel record removed')
      } catch (error) {
        console.error('Failed to remove personnel record', error)
        toast.error(
          getApiErrorMessage(
            error,
            'Unable to remove personnel record. Please try again.',
          ),
        )
      }
    })()
  }

  const handleCloseModal = () => {
    if (isCreating || isUpdating) return
    setIsModalOpen(false)
    setEditingPerson(null)
    setEmploymentTypeValue('permanent')
    setStatusValue('active')
  }

  const handleExport = () => {
    toast.info('Exporting staff list as CSV...')
    setTimeout(() => toast.success('Export complete! staff_list_2024.csv downloaded.'), 1500)
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: basePath,
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'Personnel' },
        ]}
      />

      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2e7d32]">Personnel Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your farm workforce and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExport} className="flex items-center gap-2 text-gray-600">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export Staff List</span>
          </Button>
          
          <Dialog
            open={isModalOpen}
            onOpenChange={(open) => (open ? setIsModalOpen(true) : handleCloseModal())}
          >
            <DialogTrigger render={
              <Button
                onClick={() => {
                  setEditingPerson(null)
                  setEmploymentTypeValue('permanent')
                  setStatusValue('active')
                }}
                className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2"
              >
                <UserPlus className="size-4" />
                <span>Add Personnel</span>
              </Button>
            } />
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold uppercase tracking-tighter">
                  {editingPerson ? 'Edit Personnel Data' : 'Onboard New Personnel'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSavePerson} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6" id="person-form">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</Label>
                    <Input id="fullName" name="fullName" defaultValue={editingPerson?.fullName} required placeholder="e.g. Olamide Olutekunbi" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</Label>
                    <Input id="email" name="email" type="email" defaultValue={editingPerson?.emailAddress} required placeholder="name@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</Label>
                    <Input id="phone" name="phone" defaultValue={editingPerson?.phoneNumber} required placeholder="+234 ..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeId" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Employee ID</Label>
                    <Input id="employeeId" name="employeeId" defaultValue={editingPerson?.employeeId} required placeholder="EMP-000" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Designated Role</Label>
                    <Input name="role" defaultValue={editingPerson?.role} required placeholder="e.g. Farm Manager" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Type</Label>
                      <Select
                        value={employmentTypeValue}
                        onValueChange={(value) =>
                          setEmploymentTypeValue(value as CreatePersonnelRequestType)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</Label>
                      <Select
                        value={statusValue}
                        onValueChange={(value) =>
                          setStatusValue(value as CreatePersonnelRequestStatus)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startDate" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Start Date</Label>
                    <Input id="startDate" name="startDate" type="date" defaultValue={editingPerson?.startDate} />
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-gray-100 pt-6 mt-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4">Emergency Contact & Notes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Person</Label>
                      <Input id="emergencyName" name="emergencyName" defaultValue={editingPerson?.emergencyContactName} placeholder="Emergency contact name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact Phone</Label>
                      <Input id="emergencyPhone" name="emergencyPhone" defaultValue={editingPerson?.emergencyContactPhone} placeholder="Emergency contact phone" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="notes" className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Professional Notes</Label>
                      <Input id="notes" name="notes" defaultValue={editingPerson?.notes} placeholder="Additional details..." />
                    </div>
                  </div>
                </div>

                <DialogFooter className="md:col-span-2 pt-4">
                  <Button type="button" variant="ghost" onClick={handleCloseModal} className="font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                  <Button type="submit" form="person-form" disabled={isCreating || isUpdating} className="bg-[#1d3d1e] hover:bg-black text-white px-10 font-bold uppercase tracking-widest text-[10px] shadow-md">
                    {isCreating || isUpdating ? 'Saving...' : editingPerson ? 'Update Personnel' : 'Add to Staff'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Personnel" 
          value={stats.total.toString()} 
          subtitle="Registered staff"
          description="Total workforce size"
          icon={<Users className="size-4" />}
        />
        <StatCard 
          title="Active Staff" 
          value={stats.active.toString()} 
          subtitle="Currently on duty"
          description="Ready for operations"
          icon={<ShieldCheck className="size-4" />}
          className="border-green-100 bg-green-50/10"
        />
        <StatCard 
          title="Permanent" 
          value={stats.permanent.toString()} 
          subtitle="Full-time employees"
          description="Long-term contracts"
          icon={<Briefcase className="size-4" />}
        />
        <StatCard 
          title="Seasonal" 
          value={stats.seasonal.toString()} 
          subtitle="Temporary workers"
          description="Peak season support"
          icon={<Calendar className="size-4" />}
        />
      </div>

      {/* Main Container */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Filters Header */}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, role or ID..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className={cn("flex items-center gap-2", (roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && "border-brand text-brand")}>
                  <Filter className="size-4" />
                  <span>Advanced Filter</span>
                  {(roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && <div className="size-2 rounded-full bg-brand" />}
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={roleFilter} onValueChange={(v) => setRoleFilter(v || 'All')}>
                    {roles.map(r => (
                      <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={(v) => setStatusFilter(v || 'All')}>
                    <DropdownMenuRadioItem value="All">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Inactive">Inactive</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Employment</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={employmentFilter} onValueChange={(v) => setEmploymentFilter(v || 'All')}>
                    <DropdownMenuRadioItem value="All">All Types</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Permanent">Permanent</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Seasonal">Seasonal</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Contract">Contract</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                {(roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => { setRoleFilter('All'); setStatusFilter('All'); setEmploymentFilter('All') }}
                      className="text-center justify-center font-bold text-brand cursor-pointer"
                    >
                      Reset Filters
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-gray-600">Personnel</th>
                <th className="px-6 py-4 font-semibold text-gray-600">ID & Status</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Employment</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Assignments</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Certifications</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8"><div className="h-8 bg-gray-50 rounded-lg w-full" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <EmptyState
                      icon={<Search className="size-10" />}
                      title="Personnel failed to load"
                      description="Check your connection and retry."
                      action={{ label: 'Retry', onClick: () => refetch() }}
                    />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <EmptyState
                      icon={<Search className="size-10" />}
                      title="No personnel found"
                      description="Try adjusting your search or filters to find what you're looking for."
                      action={{
                        label: "Clear all filters",
                        onClick: () => {
                          setSearch('')
                          setRoleFilter('All')
                          setStatusFilter('All')
                          setEmploymentFilter('All')
                        }
                      }}
                    />
                  </td>
                </tr>
              ) : filtered.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-brand-surface flex items-center justify-center text-brand font-bold shrink-0 border border-brand/10 uppercase">
                        {person.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-brand transition-colors leading-tight">{person.fullName}</span>
                        <span className="text-xs text-gray-500 font-medium">{person.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-gray-700">{person.employeeId}</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-1.5 rounded-full ${person.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${person.status === 'Active' ? 'text-green-600' : 'text-gray-400'}`}>
                          {person.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-xs">
                      <p className="text-gray-900 font-bold">{person.employmentType}</p>
                      <p className="text-gray-400 mt-0.5">Since {person.startDate}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {person.farmAssignments.map(farm => (
                        <Badge key={farm} variant="outline" className="text-[9px] px-1.5 py-0 bg-brand-surface/30 border-brand/10 text-brand-dark font-medium">
                          {farm}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1">
                      {person.certifications.length > 0 ? (
                        <div className="flex -space-x-2">
                           {person.certifications.slice(0, 2).map((cert, i) => (
                             <div key={i} title={cert} className="size-6 rounded-full bg-brand border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                               {cert[0]}
                             </div>
                           ))}
                           {person.certifications.length > 2 && (
                             <div className="size-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] text-gray-500 font-bold">
                               +{person.certifications.length - 2}
                             </div>
                           )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No certs</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                          <MoreVertical className="size-4 text-gray-400" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEditClick(person)} className="cursor-pointer">Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Manage Assignments</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">View Emergency Contact</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(person.id)} disabled={isDeleting} className="cursor-pointer text-red-600">Deactivate Staff</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer */}
        <div className="p-5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <p>Showing 1 to {filtered.length} of {filtered.length} personnel</p>
          <div className="flex items-center gap-1">
             <Button variant="outline" size="sm" className="h-8 px-3" disabled>Previous</Button>
             <Button variant="outline" size="sm" className="h-8 px-3" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
