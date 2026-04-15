import {
  Eye,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Clock,
  Users,
  Download,
  LayoutDashboard,
  ArrowRight,
  ChevronDown,
  Mail,
  Calendar,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AddFarmersModal } from '~/components/add-farmers-modal'
import { CreateFarmModal } from '~/components/create-farm-modal'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { useGetCooperativesFarmers as useGetCooperativeFarmers } from '~/lib/api/generated/cooperatives/cooperatives'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { EmptyState } from '~/components/empty-state'
import type { Route } from './+types/farmers'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Farmers | Agtrail' },
    { name: 'description', content: 'Manage cooperative farmers' },
  ]
}

export default function CooperativeFarmers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteFarmerId, setDeleteFarmerId] = useState<string | null>(null)
  const [createFarmForFarmer, setCreateFarmForFarmer] = useState<string | null>(
    null,
  )

  const {
    data: membersResponse,
    isLoading,
    error,
  } = useGetCooperativeFarmers()
  const members = membersResponse?.data?.data || []

  const isVerifiedKyc = (status: string | null | undefined) => {
    const normalized = (status || '').toLowerCase()
    return (
      normalized === 'verified' ||
      normalized === 'approved' ||
      normalized === 'completed'
    )
  }

  const formatJoinedDate = (value: unknown) => {
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      !(value instanceof Date)
    ) {
      return 'N/A'
    }

    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return 'N/A'

    return parsedDate.toLocaleDateString(undefined, {
      month: 'short',
      year: 'numeric',
    })
  }

  const roles = useMemo(() => {
    const rawRoles = members.map((m) => m.systemRole || 'Member')
    const uniqueRoles = Array.from(new Set(rawRoles))
    return ['All', ...uniqueRoles]
  }, [members])

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        member.id.toLowerCase().includes(query) ||
        (member.name || '').toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        (member.phoneNumber || '').toLowerCase().includes(query) ||
        (member.systemRole || 'Member').toLowerCase().includes(query)

      const matchesRole =
        roleFilter === 'All' || (member.systemRole || 'Member') === roleFilter

      return matchesSearch && matchesRole
    })
  }, [members, searchQuery, roleFilter])

  const farmerStats = useMemo(() => {
    const total = members.length
    const verified = members.filter((m) => isVerifiedKyc(m.kycStatus)).length
    const pending = total - verified
    return { total, verified, pending }
  }, [members])

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='animate-pulse'>
          <div className='h-8 bg-gray-200 rounded w-1/4 mb-4'></div>
          <div className='h-4 bg-gray-200 rounded w-1/2 mb-6'></div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-64 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-12'>
          <div className='text-red-500 mb-4'>
            <svg
              className='size-12 mx-auto'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Failed to load farmers
          </h3>
          <p className='text-gray-500'>
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6 pb-10 px-1'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/cooperative',
            icon: <LayoutDashboard className='size-4 text-gray-400' />,
          },
          { label: 'Farmers' },
        ]}
      />

      {/* Page Title Section */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 uppercase tracking-tight'>
            Farmers
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Manage and monitor all cooperative members
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            className='flex items-center gap-2 h-11 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-600 border-gray-200'
          >
            <Download className='size-4' />
            <span className='hidden sm:inline'>Export Directory</span>
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className='bg-[#1d3d1e] hover:bg-black text-white flex items-center gap-2 h-11 px-6 shadow-sm'
          >
            <Plus className='size-4' />
            <span className='font-bold uppercase tracking-wide text-xs'>
              Register Farmer
            </span>
          </Button>
        </div>
      </div>

      {/* Summary Stats Overview */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <StatCard
          title='Total Farmers'
          value={farmerStats.total.toString()}
          subtitle='Collective workforce'
          description='Total registered participants'
          icon={<Users className='size-4' />}
          trend='neutral'
        />
        <StatCard
          title='Verified'
          value={farmerStats.verified.toString()}
          subtitle='KYC Compliant'
          description='Ready for transaction clearance'
          icon={<UserCheck className='size-4 text-brand' />}
          trend='up'
        />
        <StatCard
          title='Awaiting Review'
          value={farmerStats.pending.toString()}
          subtitle='Documentation queue'
          description='Pending manual verification'
          icon={<Clock className='size-4 text-orange-400' />}
          trend='down'
        />
      </div>

      {/* Global Filter Toolbar */}
      <div className='rounded-xl border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div className='relative w-full lg:max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
            <input
              type='text'
              placeholder='Search members by identity, role, or serial...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand focus:bg-white transition-all shadow-sm'
            />
          </div>

          <div className='flex flex-wrap items-center gap-4'>
            <div className='flex items-center gap-2'>
              <span className='text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1'>
                Role Filter
              </span>
              <div className='relative'>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className='h-10 rounded-lg border border-gray-200 pl-3 pr-8 text-[11px] font-bold uppercase tracking-wider text-gray-700 outline-none focus:border-brand focus:ring-1 focus:ring-brand bg-gray-50/50 appearance-none min-w-[160px]'
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r === 'All' ? 'All Roles' : r}
                    </option>
                  ))}
                </select>
                <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 size-3 text-gray-400 pointer-events-none' />
              </div>
            </div>

            {roleFilter !== 'All' && (
              <Button
                variant='ghost'
                className='h-10 px-4 gap-2 text-red-500 font-bold text-[11px] uppercase tracking-wider hover:bg-red-50'
                onClick={() => setRoleFilter('All')}
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* High Density Farmers Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className='relative rounded-xl border border-gray-200 bg-white p-6 flex flex-col items-center text-center group hover:border-brand/40 hover:shadow-lg transition-all'
          >
            <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-gray-300 hover:text-red-500'
                onClick={() => setDeleteFarmerId(member.id)}
              >
                <Trash2 className='size-4' />
              </Button>
            </div>

            <div className='relative mb-6'>
              <div className='size-24 rounded-2xl overflow-hidden bg-gray-50 border-2 border-white shadow-sm ring-1 ring-gray-100'>
                <img
                  src={
                    member.profilePhotoUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name || member.email)}&background=E5E7EB&color=374151`
                  }
                  alt={member.name || member.email}
                  className='size-full object-cover'
                />
              </div>
              <div className='absolute -bottom-2 -right-2 size-6 rounded-lg bg-white border border-gray-100 shadow-sm flex items-center justify-center'>
                <UserCheck className='size-3.5 text-brand' />
              </div>
            </div>

            <div className='mb-6'>
              <h3
                className='text-base font-bold text-gray-900 uppercase tracking-tight truncate w-48 mx-auto'
                title={member.name || member.email}
              >
                {member.name || member.email}
              </h3>
              <Badge
                variant='ghost'
                className='text-[10px] font-bold text-gray-400 uppercase tracking-widest p-0 mt-1'
              >
                {member.systemRole || 'Member'}
              </Badge>
            </div>

            <div className='w-full space-y-3 mb-6 pt-6 border-t border-gray-50'>
              <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                <span className='flex items-center gap-2 italic text-gray-300'>
                  <Calendar className='size-3' /> Date Joined
                </span>
                <span className='text-gray-900'>{formatJoinedDate(member.createdAt)}</span>
              </div>
              <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                <span className='flex items-center gap-2 italic text-gray-300'>
                  <UserCheck className='size-3' /> KYC
                </span>
                <span className={isVerifiedKyc(member.kycStatus) ? 'text-brand' : 'text-orange-500'}>
                  {member.kycStatus || 'Pending'}
                </span>
              </div>
              <div className='flex items-center justify-between text-[11px] font-bold uppercase tracking-tight text-gray-400'>
                <span className='flex items-center gap-2 italic text-gray-300'>
                  <Mail className='size-3' /> Email
                </span>
                <span className='text-gray-900 truncate max-w-[140px]' title={member.email}>
                  {member.email}
                </span>
              </div>
            </div>

            <div className='w-full grid grid-cols-2 gap-2 mt-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCreateFarmForFarmer(member.id)}
                className='h-9 text-[10px] font-bold uppercase tracking-wider border-gray-100 hover:bg-gray-50 text-gray-600 gap-1.5'
              >
                <Plus className='size-3.5' />
                Add Farm
              </Button>
              <Link
                to={`/cooperative/farmers/${member.id}`}
                className='block'
              >
                <Button
                  size='sm'
                  className='w-full h-9 text-[10px] font-bold uppercase tracking-wider bg-brand/5 text-brand hover:bg-brand hover:text-white border border-brand/10 shadow-none gap-1.5'
                >
                  <Eye className='size-3.5' />
                  Profile
                </Button>
              </Link>
            </div>
          </div>
        ))}
        {filteredMembers.length === 0 && (
          <div className='col-span-full'>
            <EmptyState
              icon={<Users className='size-10' />}
              title='No farmers found'
              description="Try adjusting your search or filters to find what you're looking for."
              action={{
                label: 'Clear all filters',
                onClick: () => {
                  setSearchQuery('')
                  setRoleFilter('All')
                },
              }}
            />
          </div>
        )}
      </div>

      {/* Standardized Table Footer */}
      <div className='mt-12 border-t border-gray-100 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-bold uppercase tracking-tight bg-gray-50/20 rounded-xl'>
        <div className='flex items-center gap-2'>
          <span className='text-gray-300'>Total Farmers:</span>
          <span className='text-gray-900'>
            {filteredMembers.length} Registered Members
          </span>
        </div>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-2'>
            <span className='text-gray-300'>Show</span>
            <select className='bg-transparent border-none outline-none text-gray-900 font-bold'>
              <option>8</option>
              <option>25</option>
            </select>
          </div>
          <div className='flex items-center gap-4'>
            <span className='text-gray-300'>Page 1 / 1</span>
            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='icon'
                className='size-7 text-gray-300'
                disabled
              >
                <ArrowRight className='size-3.5 rotate-180' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='size-7 text-gray-400 hover:text-brand'
              >
                <ArrowRight className='size-3.5' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddFarmersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <CreateFarmModal
        isOpen={createFarmForFarmer !== null}
        onClose={() => setCreateFarmForFarmer(null)}
      />

      <AlertDialog
        open={deleteFarmerId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteFarmerId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Farmer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this farmer from the cooperative?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setDeleteFarmerId(null)}
              className='bg-red-600 text-white hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
