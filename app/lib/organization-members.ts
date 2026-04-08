import type { OrganizationMember } from '~/lib/api/generated/models'

export interface OrganizationMemberView {
  id: string
  userId: string
  name: string
  email: string
  role: string
  createdAt: string
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function getNestedRecord(value: Record<string, unknown>, key: string) {
  return asRecord(value[key])
}

function pickFirstString(
  record: Record<string, unknown>,
  candidates: Array<string | [string, string]>,
) {
  for (const candidate of candidates) {
    if (typeof candidate === 'string') {
      const value = record[candidate]
      if (typeof value === 'string' && value.trim()) return value
      continue
    }

    const [outer, inner] = candidate
    const nested = getNestedRecord(record, outer)
    const value = nested?.[inner]
    if (typeof value === 'string' && value.trim()) return value
  }

  return null
}

function titleizeRole(value: string | null | undefined) {
  if (!value) return 'Member'
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (part) => part.toUpperCase())
}

export function normalizeOrganizationMember(
  member: OrganizationMember | Record<string, unknown>,
): OrganizationMemberView {
  const record = member as Record<string, unknown>
  const userId =
    pickFirstString(record, ['userId', ['user', 'id']]) ??
    `member-${String(record.id ?? 'unknown')}`
  const email = pickFirstString(record, ['email', ['user', 'email']]) ?? ''
  const derivedNameFromEmail = email
    ? email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (part) => part.toUpperCase())
    : ''

  return {
    id: String(record.id ?? userId),
    userId,
    name:
      pickFirstString(record, ['name', ['user', 'name']]) ??
      derivedNameFromEmail ??
      `Member ${userId.slice(0, 8)}`,
    email,
    role: titleizeRole(pickFirstString(record, ['role', ['user', 'role']])),
    createdAt: pickFirstString(record, ['createdAt']) ?? '',
  }
}
