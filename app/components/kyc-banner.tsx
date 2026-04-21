import { Link } from 'react-router'
import { useGetUsersProfile } from '~/lib/api/generated/users/users'

function isVerifiedKycStatus(status: string | null | undefined): boolean {
  if (!status) return false
  const normalized = status.trim().toLowerCase()
  return normalized === 'verified' || normalized === 'approved' || normalized === 'completed'
}

export function KYCBanner() {
  const { data: profileResponse, isLoading } = useGetUsersProfile()
  const kycStatus = profileResponse?.data?.user?.kycStatus
  const isVerified = isVerifiedKycStatus(kycStatus)

  if (isLoading || isVerified) return null

  return (
    <div className="flex items-center justify-between rounded-md border border-orange-200 bg-brand-accent-surface px-5 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-accent/10">
          <svg className="size-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Complete Your KYC Verification</p>
          <p className="text-xs text-gray-500">Verify your identity to unlock all features and build trust with buyers.</p>
        </div>
      </div>
      <Link
        to="/farmer/settings?tab=kyc"
        className="shrink-0 rounded-md border border-brand bg-white px-4 py-2 text-sm font-medium text-brand hover:bg-brand-surface transition-colors"
      >
        Complete KYC
      </Link>
    </div>
  )
}
