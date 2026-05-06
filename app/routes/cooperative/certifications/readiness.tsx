import { PageHeader } from '~/components/page-header'

export default function CertificationReadiness() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/cooperative' },
    { label: 'Certification' },
    { label: 'Readiness' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader items={breadcrumbs} />
      <div>
        <h1 className="text-xl font-bold text-gray-900">Certification Readiness</h1>
        <p className="mt-1 text-sm text-gray-500">Track your progress towards certification</p>
      </div>
      <div className="bg-white border border-gray-100 rounded-md p-8 shadow-sm text-center">
        <p className="text-gray-500 italic">Readiness assessment content coming soon...</p>
      </div>
    </div>
  )
}
