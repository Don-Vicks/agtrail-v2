import { getClientOrganizationId } from '~/lib/organization-context'

/** Cooperative report GETs require `X-Organization-Id` (see API docs). */
export function cooperativeReportsQueryEnabled(): boolean {
  return Boolean(getClientOrganizationId())
}

export function MissingCooperativeOrgBanner() {
  if (getClientOrganizationId()) return null
  return (
    <div
      role="alert"
      className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
    >
      <p className="font-bold">Organization required</p>
      <p className="mt-1 text-amber-900/90">
        Cooperative report APIs require the{' '}
        <code className="rounded bg-amber-100/80 px-1 font-mono text-xs">X-Organization-Id</code> header.
        Use a cooperative login context or select an organization so requests include your cooperative org
        id.
      </p>
    </div>
  )
}
