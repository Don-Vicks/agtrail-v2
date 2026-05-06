import { Archive, ClipboardList, MapPin, Sprout } from 'lucide-react'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { StatCard } from '~/components/stat-card'

export function meta() {
  return [{ title: 'Field Agent Dashboard | Agrolinking' }]
}

export default function FieldAgentDashboard() {
  return (
    <div className='space-y-6 pb-10'>
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/field-agent',
            icon: <Archive className='size-4 text-gray-400' />,
          },
          { label: 'Field Agent' },
        ]}
      />

      <div>
        <h1 className='text-2xl font-bold text-[#2e7d32]'>Field Agent Dashboard</h1>
        <p className='text-sm text-gray-500 mt-1'>Operational monitoring and farm check-in workflow</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <StatCard title='Farm Assets' value='--' subtitle='Tracked farms' icon={<MapPin className='size-4' />} />
        <StatCard title='Observations' value='--' subtitle='Pending logs' icon={<ClipboardList className='size-4' />} />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Link to='/field-agent/farms' className='group rounded-md border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow flex items-start gap-4'>
          <div className='size-10 rounded-md bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors'>
            <MapPin className='size-5 text-[#2e7d32]' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900'>Farm Assets Inventory</h3>
            <p className='text-sm text-gray-500 mt-1'>View assets and submit farm check-ins.</p>
          </div>
        </Link>
        <Link to='/field-agent/record-observation' className='group rounded-md border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow flex items-start gap-4'>
          <div className='size-10 rounded-md bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors'>
            <ClipboardList className='size-5 text-[#cc5e00]' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900'>Record Observation</h3>
            <p className='text-sm text-gray-500 mt-1'>Capture field observation logs per crop cycle.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
