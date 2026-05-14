function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Reads KYC / verification status from a user-shaped object returned by various API layers.
 * Handles camelCase / snake_case and nested `kyc` objects.
 */
export function getKycStatusStringFromUserLike(user: unknown): string | null | undefined {
  if (!isRecord(user)) return undefined

  const top =
    user.kycStatus ??
    user.kyc_status ??
    user.verificationStatus ??
    user.verification_status

  if (typeof top === 'string') return top

  const nestedKyc = user.kyc
  if (isRecord(nestedKyc)) {
    const nested =
      nestedKyc.status ??
      nestedKyc.verificationStatus ??
      nestedKyc.verification_status ??
      nestedKyc.state
    if (typeof nested === 'string') return nested
  }

  return undefined
}

/**
 * Parses GET /users/profile (and close variants): `{ success, user }`, `{ success, data: { user } }`,
 * or status fields on the envelope / `data` when `user` omits camelCase keys.
 */
export function getKycStatusFromUsersProfileBody(body: unknown): string | null | undefined {
  if (!isRecord(body)) return undefined

  const fromUser =
    getKycStatusStringFromUserLike(body.user) ??
    (isRecord(body.data) ? getKycStatusStringFromUserLike(body.data.user) : undefined)

  if (fromUser) return fromUser

  const onEnvelope = body.kycStatus ?? body.kyc_status
  if (typeof onEnvelope === 'string') return onEnvelope

  if (isRecord(body.data)) {
    const d = body.data
    const onData = d.kycStatus ?? d.kyc_status ?? d.verificationStatus ?? d.verification_status
    if (typeof onData === 'string') return onData
  }

  return undefined
}

export function isVerifiedKycStatus(status: string | null | undefined): boolean {
  if (!status) return false
  const normalized = status.trim().toLowerCase()
  return (
    normalized === 'verified' ||
    normalized === 'approved' ||
    normalized === 'complete' ||
    normalized === 'completed' ||
    normalized === 'passed' ||
    normalized === 'pass' ||
    normalized === 'success' ||
    normalized === 'validated' ||
    normalized === 'active'
  )
}
