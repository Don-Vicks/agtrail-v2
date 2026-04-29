import type { AuthResponseDataUser } from '~/lib/api/generated/models/authResponseDataUser'

export type TenantRole = 'farmer' | 'processor' | 'cooperative' | 'aggregator'

export function getTenantFromPathname(pathname: string): TenantRole {
  if (pathname.startsWith('/aggregator')) return 'aggregator'
  if (pathname.startsWith('/processor')) return 'processor'
  if (pathname.startsWith('/cooperative')) return 'cooperative'
  return 'farmer'
}

export function getTenantSelectValue(role: TenantRole): string {
  if (role === 'aggregator') return 'Aggregator'
  if (role === 'processor') return 'Processor'
  if (role === 'cooperative') return 'Cooperative'
  return 'Farmer'
}

export function getTenantOperationAction(role: TenantRole) {
  if (role === 'processor') {
    return {
      href: '/processor/batches',
      label: 'Manage Batches',
    }
  }

  if (role === 'cooperative') {
    return {
      href: '/cooperative/operations/record',
      label: 'Record Operation',
    }
  }

  if (role === 'aggregator') {
    return {
      href: '/cooperative/farmers',
      label: 'Add Farmer',
    }
  }

  return {
    href: '/farmer/operations/new',
    label: 'Log Operation',
  }
}

export function getUserDisplayName(user: AuthResponseDataUser | null | undefined) {
  const explicitName = user?.name?.trim()
  if (explicitName) return explicitName

  const emailPrefix = user?.email?.split('@')[0]
  if (!emailPrefix) return 'User'

  return emailPrefix
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (value) => value.toUpperCase())
}

export function getUserInitials(user: AuthResponseDataUser | null | undefined) {
  const displayName = getUserDisplayName(user)
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

  return initials || 'AG'
}
