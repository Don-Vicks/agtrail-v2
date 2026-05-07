import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { PageHeader } from '~/components/page-header'
import { Skeleton } from '~/components/ui/skeleton'
import { useGetCertifications } from '~/lib/api/generated/certifications/certifications'
import type { Route } from './+types/view-certifications'

export function meta({ }: Route.MetaArgs) {
  return [
    { title: 'Certifications | Agtrail' },
    { name: 'description', content: 'View and manage all your farm and product certifications' },
  ]
}

/* ─── Icons ─── */
function SearchIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

function ChevronDown() {
  return (
    <svg className="size-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

function CertRibbonIcon() {
  return (
    <svg className="size-5 text-[#3b82f6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  )
}

function ActiveCertIcon() {
  return (
    <svg className="size-5 text-[#22c55e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ExpiredCertIcon() {
  return (
    <svg className="size-5 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function PendingCertIcon() {
  return (
    <svg className="size-5 text-[#eab308]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ListBadgeIcon() {
  return (
    <svg className="size-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  )
}

/* ─── Mock Data ─── */
type CertType = 'Farm' | 'Product';
type CertStatus = 'Active' | 'Expired' | 'Pending';

interface CertificationInfo {
  id: string;
  title: string;
  subtitle: string;
  status: CertStatus;
  verified: boolean;
  certNo: string;
  issueDate: string;
  expiryDate: string;
  appliedTo: string;
  type: CertType;
  documentUrl: string;
}

/* ─── Page Component ─── */
export default function ViewCertificationsPage() {
  const { data: certsResp, isLoading } = useGetCertifications()
  const apiCertifications = useMemo(() => {
    const rawData = certsResp?.data?.data
    if (!Array.isArray(rawData)) return []
    return rawData.map((cert: any) => ({
      id: cert.id || `cert-${Math.random()}`,
      title: cert.title || cert.certificationName || cert.certificationType || 'Unknown Certification',
      subtitle: cert.subtitle || cert.organization || cert.issuingOrganization || '',
      status: cert.status || 'Pending',
      verified: !!cert.verified,
      certNo: cert.certNo || cert.certificateNumber || 'N/A',
      issueDate: cert.issueDate || cert.issuedAt || 'N/A',
      expiryDate: cert.expiryDate || cert.expiresAt || 'N/A',
      appliedTo: cert.appliedTo || cert.entityName || (cert.certifiedEntityType === 'FARM' ? 'Farm' : 'Product'),
      type: cert.type || (cert.certifiedEntityType === 'FARM' ? 'Farm' : 'Product'),
      documentUrl: cert?.documentUrl,
    })) as CertificationInfo[]
  }, [certsResp])
  const [activeTab, setActiveTab] = useState<'All' | 'Farm' | 'Product'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // Compute stats
  const totalCerts = apiCertifications.length
  const activeCerts = apiCertifications.filter(c => c.status === 'Active').length
  const expiredCerts = apiCertifications.filter(c => c.status === 'Expired').length
  const pendingCerts = apiCertifications.filter(c => c.status === 'Pending').length

  const farmCertsCount = apiCertifications.filter(c => c.type === 'Farm').length
  const productCertsCount = apiCertifications.filter(c => c.type === 'Product').length

  // Filter lists
  const filteredCerts = useMemo(() => {
    return apiCertifications.filter(cert => {
      // Type Match
      if (activeTab === 'Farm' && cert.type !== 'Farm') return false;
      if (activeTab === 'Product' && cert.type !== 'Product') return false;

      // Status Match
      if (statusFilter && cert.status !== statusFilter) return false;

      // Search Match
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !cert.title.toLowerCase().includes(query) &&
          !cert.certNo.toLowerCase().includes(query) &&
          !cert.appliedTo.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      return true;
    })
  }, [activeTab, searchQuery, statusFilter, apiCertifications])

  return (
    <div className="space-y-6">
      {/* Header & Breadcrumbs */}
      <PageHeader
        items={[
          {
            label: 'Dashboard',
            href: '/farmer',
            icon: (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            ),
          },
          { label: 'View Certifications' },
        ]}
      />
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2e7d32]">Certifications</h1>
            <p className="mt-1 text-sm text-gray-500">View and manage all your farm and product certifications</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/farmer/certifications/farm"
              aria-label="Upload farm certification"
              title="Upload farm certification"
              className="flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            >
              <UploadIcon />
              Farm Cert
            </Link>
            <Link
              to="/farmer/certifications/product"
              aria-label="Upload product certification"
              title="Upload product certification"
              className="flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
            >
              <UploadIcon />
              Product Cert
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-blue-50/80">
            <CertRibbonIcon />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{totalCerts}</div>
            <div className="text-sm text-gray-500">Total Certifications</div>
          </div>
        </div>
        {/* Active */}
        <div className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-green-50/80">
            <ActiveCertIcon />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{activeCerts}</div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
        </div>
        {/* Expired */}
        <div className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-red-50/80">
            <ExpiredCertIcon />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{expiredCerts}</div>
            <div className="text-sm text-gray-500">Expired</div>
          </div>
        </div>
        {/* Pending */}
        <div className="flex items-center gap-4 rounded-md border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-yellow-50/80">
            <PendingCertIcon />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">{pendingCerts}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
        </div>
      </div>

      {/* Main List Section */}
      <div className="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
        {/* Toolbar */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">

          {/* Segmented Control / Tabs */}
          <div className="inline-flex max-w-full overflow-x-auto rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('All')}
              className={`flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${activeTab === 'All' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              All ({totalCerts})
            </button>
            <button
              onClick={() => setActiveTab('Farm')}
              className={`flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${activeTab === 'Farm' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Farm ({farmCertsCount})
            </button>
            <button
              onClick={() => setActiveTab('Product')}
              className={`flex h-8 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors ${activeTab === 'Product' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Product ({productCertsCount})
            </button>
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search certifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand sm:w-64"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 appearance-none rounded-md border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ChevronDown />
              </div>
            </div>
          </div>
        </div>

        {/* List of Certs */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-md border border-gray-200 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                    <div className="flex min-w-0 items-start gap-4">
                      <Skeleton className="size-12 rounded-md" />
                      <div className="min-w-0 space-y-2">
                        <Skeleton className="h-5 w-56 max-w-full" />
                        <Skeleton className="h-4 w-44 max-w-full" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 lg:grid-cols-5">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex items-end justify-end sm:col-span-4 lg:col-span-1">
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredCerts.length > 0 ? (
            filteredCerts.map((cert) => (
              <div key={cert.id} className="overflow-hidden rounded-md border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-[#e8f5e9]">
                      <ListBadgeIcon />
                    </div>
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-bold text-gray-900">{cert.title}</h3>
                      <p className="break-words text-sm text-gray-500">{cert.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {cert.status === 'Active' && (
                      <div className="inline-flex rounded-full bg-[#e8f5e9] px-2.5 py-1 text-xs font-bold text-[#1b5e20]">
                        active
                      </div>
                    )}
                    {cert.status === 'Pending' && (
                      <div className="inline-flex rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-800">
                        pending
                      </div>
                    )}
                    {cert.status === 'Expired' && (
                      <div className="inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-800">
                        expired
                      </div>
                    )}

                    <div className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                      {cert.verified ? 'Verified' : 'Unverified'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4 lg:grid-cols-5">
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Certificate No.</p>
                    <p className="break-words text-sm font-semibold text-gray-900">{cert.certNo}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Issue Date</p>
                    <p className="text-sm font-semibold text-gray-900">{cert.issueDate}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Expiry Date</p>
                    <p className="text-sm font-semibold text-gray-900">{cert.expiryDate}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-500">Applied To</p>
                    <p className="flex min-w-0 items-center gap-1.5 break-words text-sm font-semibold text-gray-900">
                      {cert.type === 'Farm' ? (
                        <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                      ) : (
                        <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                      {cert.appliedTo}
                    </p>
                  </div>

                  <div className="flex items-end justify-end sm:col-span-4 lg:col-span-1">
                    <Link
                      to={cert.documentUrl || '#'}
                      className="inline-flex items-center gap-2 break-words text-sm font-bold text-brand hover:text-brand-light"
                    >
                      <ExternalLinkIcon />
                      View Document
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-sm text-gray-500">
              No certifications found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
