export const DEFAULT_ORGANIZATION_ID = ''

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length < 2) return null
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    return null
  }
}

export function getClientOrganizationId(): string | null {
  if (typeof window === 'undefined') {
    return DEFAULT_ORGANIZATION_ID || null
  }

  const explicit = localStorage.getItem('agrolinking_organization_id')
  if (explicit) return explicit

  const storedUser = localStorage.getItem('agrolinking_user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser) as Record<string, unknown>
      const fromUser =
        (user.organizationId as string | undefined) ||
        (user.currentOrganizationId as string | undefined) ||
        (user.orgId as string | undefined)
      if (fromUser) {
        localStorage.setItem('agrolinking_organization_id', fromUser)
        return fromUser
      }
    } catch {
      // Ignore storage parse failures.
    }
  }

  const token = localStorage.getItem('agrolinking_token')
  if (token) {
    const payload = decodeJwtPayload(token)
    const fromToken =
      (payload?.organizationId as string | undefined) ||
      (payload?.currentOrganizationId as string | undefined) ||
      (payload?.orgId as string | undefined)
    if (fromToken) {
      localStorage.setItem('agrolinking_organization_id', fromToken)
      return fromToken
    }
  }

  return null
}

export function getOrganizationHeaders(): Record<string, string> {
  const organizationId = getClientOrganizationId()
  return organizationId ? { 'X-Organization-Id': organizationId } : {}
}
