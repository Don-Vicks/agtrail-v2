import { ShieldCheck } from 'lucide-react'
import { EmptyState } from '~/components/empty-state'
import { PageHeader } from '~/components/page-header'
import { useGetCertificationsReadiness } from '~/lib/api/generated/certifications/certifications'

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}) {
  return (
    <div className='flex items-center justify-between rounded-md border border-gray-200 bg-white p-5 shadow-sm'>
      <div>
        <h3 className='text-xs font-semibold text-gray-500 mb-1'>{label}</h3>
        <p className='text-3xl font-bold text-gray-900'>{value}</p>
      </div>
      <div
        className={`flex size-10 items-center justify-center rounded-md ${iconBg} ${iconColor}`}
      >
        {icon}
      </div>
    </div>
  )
}

export default function CertificationReadiness() {
  const { data: certificationsReadinessResp } = useGetCertificationsReadiness()

  const certificationsReadiness = certificationsReadinessResp?.data?.data

  return (
    <div className='pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/processor',
          },
          { label: 'Certification Readiness' },
        ]}
      />

      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-2'>
        <div>
          <h1 className='text-2xl font-bold text-brand'>
            Certification Readiness
          </h1>
          <p className='text-sm text-gray-500 mt-1'>
            Track your certification progress and requirements
          </p>
        </div>
        <div className='relative w-full sm:w-[250px]'>
          <select className='appearance-none w-full rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-brand outline-none hover:bg-gray-50'>
            <option>Select a product...</option>
          </select>
          <svg
            className='absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        <StatCard
          label='Total Certifications'
          value={certificationsReadiness?.totalCertifications || 0}
          icon={
            <svg
              className='size-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
          iconBg='bg-blue-50'
          iconColor='text-blue-500'
        />
        <StatCard
          label='In Progress'
          value={certificationsReadiness?.inProgress || 0}
          icon={
            <svg
              className='size-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          }
          iconBg='bg-orange-50'
          iconColor='text-orange-500'
        />
        <StatCard
          label='Completed'
          value={certificationsReadiness?.completed || 0}
          icon={
            <svg
              className='size-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M5 13l4 4L19 7'
              />
            </svg>
          }
          iconBg='bg-green-50'
          iconColor='text-green-500'
        />
        <StatCard
          label='Pending Review'
          value={certificationsReadiness?.pendingReview || 0}
          icon={
            <svg
              className='size-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          }
          iconBg='bg-purple-50'
          iconColor='text-purple-500'
        />
      </div>

      <div className='rounded-md border border-gray-200 bg-white shadow-sm'>
        <EmptyState
          className='py-20'
          icon={<ShieldCheck className='size-10 text-[#cfdfd6]' />}
          title='Select a product'
          description='Choose a product from the dropdown above to view certification readiness.'
        />
      </div>
    </div>
  )
}
