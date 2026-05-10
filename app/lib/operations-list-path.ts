/** Path to the "pick a crop cycle" list for the current tenant (farmer vs processor/cooperative). */
export function getOperationsListPath(pathname: string): string {
  if (pathname.startsWith('/field-agent')) return '/field-agent/record-observation'
  if (pathname.startsWith('/processor')) return '/processor/batches'
  if (pathname.startsWith('/cooperative')) return '/cooperative/operations/record'
  return '/farmer/operations/new'
}
