/**
 * Shared footer fields for `OperationFormLayout` (energy, weather, area, cost).
 * Values are appended to the API `description` because `LogFarmOperationRequest`
 * only accepts a single description string.
 */
export type OperationFormFooterValues = {
  renewableEnergy: string
  mainEnergySource: string
  weatherConditions: string
  areaHectares: string
  costNgn: string
  additionalNotes: string
}

export const DEFAULT_OPERATION_FOOTER: OperationFormFooterValues = {
  renewableEnergy: 'no_traditional',
  mainEnergySource: '',
  weatherConditions: 'sunny',
  areaHectares: '',
  costNgn: '',
  additionalNotes: '',
}

const RENEWABLE_LABEL: Record<string, string> = {
  no_traditional: 'No — traditional energy',
  solar: 'Yes — solar',
  wind: 'Yes — wind',
}

const ENERGY_LABEL: Record<string, string> = {
  grid: 'Grid electricity',
  diesel: 'Diesel generator',
}

const WEATHER_LABEL: Record<string, string> = {
  sunny: 'Sunny',
  cloudy: 'Cloudy',
  rainy: 'Rainy',
}

export function validateOperationFormFooter(
  v: OperationFormFooterValues,
): { ok: true } | { ok: false; message: string } {
  if (!v.mainEnergySource) {
    return { ok: false, message: 'Select your main energy source.' }
  }
  const area = parseFloat(String(v.areaHectares).replace(/,/g, '').trim())
  if (!Number.isFinite(area) || area <= 0) {
    return { ok: false, message: 'Enter a valid area covered greater than zero (hectares).' }
  }
  const costRaw = String(v.costNgn).replace(/,/g, '').trim()
  if (costRaw !== '') {
    const cost = parseFloat(costRaw)
    if (!Number.isFinite(cost) || cost < 0) {
      return { ok: false, message: 'Enter a valid cost (₦), or leave it blank.' }
    }
  }
  return { ok: true }
}

export function formatOperationLogDescription(
  mainDescription: string,
  footer: OperationFormFooterValues,
): string {
  const lines = [mainDescription.trim(), '', '[Operation details]']
  lines.push(
    `Renewable energy: ${RENEWABLE_LABEL[footer.renewableEnergy] ?? footer.renewableEnergy}`,
  )
  lines.push(
    `Main energy source: ${ENERGY_LABEL[footer.mainEnergySource] ?? footer.mainEnergySource}`,
  )
  lines.push(
    `Weather: ${WEATHER_LABEL[footer.weatherConditions] ?? footer.weatherConditions}`,
  )
  lines.push(`Area covered (ha): ${String(footer.areaHectares).trim()}`)
  const costRaw = String(footer.costNgn).replace(/,/g, '').trim()
  lines.push(costRaw === '' ? 'Cost (₦): not recorded' : `Cost (₦): ${costRaw}`)
  const notes = footer.additionalNotes.trim()
  if (notes) lines.push(`Additional notes: ${notes}`)
  return lines.join('\n')
}
