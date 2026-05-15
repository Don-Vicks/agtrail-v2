import type { AuthResponseDataUser } from '~/lib/api/generated/models/authResponseDataUser'

export type TenantRole =
  | 'farmer'
  | 'processor'
  | 'cooperative'
  | 'aggregator'
  | 'transporter'
  | 'exporter'
  | 'regulator'
  | 'field-agent'

export function getTenantFromPathname(pathname: string): TenantRole {
  if (pathname.startsWith('/field-agent')) return 'field-agent'
  if (pathname.startsWith('/aggregator')) return 'aggregator'
  if (pathname.startsWith('/processor')) return 'processor'
  if (pathname.startsWith('/cooperative')) return 'cooperative'
  if (pathname.startsWith('/transporter')) return 'transporter'
  if (pathname.startsWith('/exporter')) return 'exporter'
  if (pathname.startsWith('/regulator')) return 'regulator'
  return 'farmer'
}

export function getTenantSelectValue(role: TenantRole): string {
  if (role === 'field-agent') return 'Field Agent'
  if (role === 'aggregator') return 'Aggregator'
  if (role === 'processor') return 'Processor'
  if (role === 'cooperative') return 'Cooperative'
  if (role === 'transporter') return 'Transporter'
  if (role === 'exporter') return 'Exporter'
  if (role === 'regulator') return 'Regulator'
  return 'Farmer'
}

export function getTenantOperationAction(role: TenantRole) {
  if (role === 'field-agent') {
    return {
      href: '/field-agent/record-observation',
      label: 'Record observation',
    }
  }
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
      href: '/aggregator/transfer/product-transfer',
      label: 'Initiate Transfer',
    }
  }

  if (role === 'transporter') {
    return {
      href: '/transporter/transfer/product-transfer',
      label: 'View Offers',
    }
  }

  if (role === 'exporter') {
    return {
      href: '/exporter/record-operation',
      label: 'Record Operation',
    }
  }
  
  if (role === 'regulator') {
    return {
      href: '/regulator/reports',
      label: 'Generate Reports',
    }
  }

  return {
    href: '/farmer/operations/new',
    label: 'Record Operation',
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
