import { useMemo, useState } from 'react'
import { useLocation } from 'react-router'
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
import { MoreVertical, Search, Plus, UserPlus, Filter, Download } from 'lucide-react'
import { cn } from '~/lib/utils'
import { EmptyState } from '~/components/empty-state'

const mockPersonnel = [
  {
    id: '1',
    fullName: 'Olamide Olutekunbi',
    phoneNumber: '+234 801 234 5678',
    emailAddress: 'olamide@example.com',
    role: 'Farm Manager',
    farmAssignments: ['Farm A', 'Farm B'],
    employmentType: 'Permanent',
    employeeId: 'EMP001',
    startDate: '2023-01-15',
    certifications: ['Pesticide License', 'Organic Farming Cert'],
    emergencyContactName: 'Adebayo Olutekunbi',
    emergencyContactPhone: '+234 802 345 6789',
    status: 'Active',
    notes: 'Experienced manager with 5+ years in agribusiness'
  },
  {
    id: '2',
    fullName: 'Grace Adebayo',
    phoneNumber: '+234 803 456 7890',
    emailAddress: 'grace@example.com',
    role: 'Supervisor',
    farmAssignments: ['Farm A'],
    employmentType: 'Permanent',
    employeeId: 'EMP002',
    startDate: '2023-03-01',
    certifications: ['Safety Training'],
    emergencyContactName: 'John Adebayo',
    emergencyContactPhone: '+234 804 567 8901',
    status: 'Active',
    notes: 'Dedicated supervisor focused on quality control'
  },
  {
    id: '3',
    fullName: 'Ahmed Musa',
    phoneNumber: '+234 805 678 9012',
    emailAddress: 'ahmed@example.com',
    role: 'Field Operator',
    farmAssignments: ['Farm B'],
    employmentType: 'Seasonal',
    employeeId: 'EMP003',
    startDate: '2024-01-01',
    certifications: [],
    emergencyContactName: 'Fatima Musa',
    emergencyContactPhone: '+234 806 789 0123',
    status: 'Active',
    notes: 'Seasonal worker specializing in maize cultivation'
  },
]

export function meta() {
  return [{ title: 'Personnel | Agtrail' }]
}

export default function FarmerPersonnel() {
  const [search, setSearch] = useState('')
  const [newPerson, setNewPerson] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [employmentFilter, setEmploymentFilter] = useState('All')

  const location = useLocation()
  const basePath = location.pathname.startsWith('/processor') 
    ? '/processor' 
    : location.pathname.startsWith('/cooperative') 
      ? '/cooperative' 
      : '/farmer'

  const roles = useMemo(() => {
    const uniqueRoles = Array.from(new Set(mockPersonnel.map(p => p.role)))
    return ['All', ...uniqueRoles]
  }, [])

  const filtered = useMemo(() => {
    return mockPersonnel.filter((p) => {
      const matchesSearch = p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase()) ||
        p.employeeId.toLowerCase().includes(search.toLowerCase())
      
      const matchesRole = roleFilter === 'All' || p.role === roleFilter
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter
      const matchesEmployment = employmentFilter === 'All' || p.employmentType === employmentFilter

      return matchesSearch && matchesRole && matchesStatus && matchesEmployment
    })
  }, [search, roleFilter, statusFilter, employmentFilter])

  const personnelStats = useMemo(() => {
    const total = mockPersonnel.length
    const active = mockPersonnel.filter(p => p.status === 'Active').length
    const permanent = mockPersonnel.filter(p => p.employmentType === 'Permanent').length
    const seasonal = mockPersonnel.filter(p => p.employmentType === 'Seasonal').length
    return { total, active, permanent, seasonal }
  }, [])

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
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">PERSONNEL MANAGEMENT</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your farm workforce, roles, and assignments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-gray-600">
            <Download className="size-4" />
            <span className="hidden sm:inline">Export Staff List</span>
          </Button>
          <Button className="bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2">
            <UserPlus className="size-4" />
            <span>Add Personnel</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Personnel" 
          value={personnelStats.total.toString()} 
          subtitle="Registered staff"
          description="Total workforce size"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
        />
        <StatCard 
          title="Active Staff" 
          value={personnelStats.active.toString()} 
          subtitle="Currently on duty"
          description="Ready for operations"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          className="border-green-100 bg-green-50/10"
        />
        <StatCard 
          title="Permanent" 
          value={personnelStats.permanent.toString()} 
          subtitle="Full-time employees"
          description="Long-term contracts"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
        />
        <StatCard 
          title="Seasonal" 
          value={personnelStats.seasonal.toString()} 
          subtitle="Temporary workers"
          description="Peak season support"
          icon={<svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
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
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className={cn("flex items-center gap-2", (roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && "border-brand text-brand")}>
                  <Filter className="size-4" />
                  <span>Advanced Filter</span>
                  {(roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && <div className="size-2 rounded-full bg-brand" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Role</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={roleFilter} onValueChange={setRoleFilter}>
                    {roles.map(r => (
                      <DropdownMenuRadioItem key={r} value={r}>{r}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                    <DropdownMenuRadioItem value="All">All Statuses</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Active">Active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Inactive">Inactive</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Employment</DropdownMenuLabel>
                  <DropdownMenuRadioGroup value={employmentFilter} onValueChange={setEmploymentFilter}>
                    <DropdownMenuRadioItem value="All">All Types</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Permanent">Permanent</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Seasonal">Seasonal</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                {(roleFilter !== 'All' || statusFilter !== 'All' || employmentFilter !== 'All') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => { setRoleFilter('All'); setStatusFilter('All'); setEmploymentFilter('All') }}
                      className="text-center justify-center font-bold text-brand"
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
              {filtered.map((person) => (
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
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-gray-100">
                          <MoreVertical className="size-4 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Manage Assignments</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">View Emergency Contact</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-600">Deactivate Staff</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
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
          )}
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
