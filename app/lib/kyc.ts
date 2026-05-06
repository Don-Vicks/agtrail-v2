export function isVerifiedKycStatus(status: string | null | undefined): boolean {
  if (!status) return false
  const normalized = status.trim().toLowerCase()
  return (
    normalized === 'verified' ||
    normalized === 'approved' ||
    normalized === 'completed'
  )
}

