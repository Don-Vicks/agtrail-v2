import type { LGA, State } from 'ng-geo-data'
import { getAllStates, getLGAsByState, getLGAsByStateName } from 'ng-geo-data'

/** All Nigerian states (+ FCT), A–Z by name. */
export function sortedNigeriaStates(): State[] {
  return [...getAllStates()].sort((a, b) => a.name.localeCompare(b.name))
}

/** LGAs for a state two-letter code, A–Z by name. */
export function sortedLgasForStateCode(stateCode: string): LGA[] {
  const code = stateCode.trim()
  if (!code) return []
  return [...getLGAsByState(code)].sort((a, b) => a.name.localeCompare(b.name))
}

/** LGAs for a state full name (case-insensitive), A–Z by name. */
export function sortedLgasForStateName(stateName: string): LGA[] {
  const name = stateName.trim()
  if (!name) return []
  return [...getLGAsByStateName(name)].sort((a, b) => a.name.localeCompare(b.name))
}
