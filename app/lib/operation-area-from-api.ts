/**
 * Resolve planted / farm sizes for operation forms when API field names or shapes differ.
 *
 * Crop cycle fallback order (first positive finite wins):
 * 1. `areaPlantedHectares`, `area_planted_hectares`, `hectaresPlanted`, `hectares_planted` (already hectares)
 * 2. `areaPlanted` / `area_planted` interpreted with `areaUnit` / `area_unit` (default hectares)
 *
 * Farm fallback order:
 * 1. `sizeHectares`, `size_hectares`
 * 2. `totalArea`, `total_area`, `hectares`, `landArea`, `land_area`, `grossArea`, `gross_area`
 *
 * Omits ambiguous fields (e.g. undocumented m² vs ha) to avoid inventing hectares.
 */

function parsePositiveNumber(value: unknown): number | null {
  if (value == null || value === '') return null
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null
  }
  const cleaned = String(value).replace(/,/g, '').trim()
  if (!cleaned) return null
  const n = parseFloat(cleaned)
  return Number.isFinite(n) && n > 0 ? n : null
}

function toHectares(amount: number, unit: string): number {
  const u = unit.toLowerCase()
  if (u === 'hectares' || u === 'hectare' || u === 'ha' || u === '') return amount
  if (u === 'acres' || u === 'acre') return amount * 0.40468564224
  if (u === 'sqm' || u === 'm2' || u === 'square_meters' || u === 'square meters') return amount / 10_000
  return amount
}

export function cropCyclePlantedAreaHectaresFromApi(cycle: unknown): number | null {
  if (!cycle || typeof cycle !== 'object') return null
  const c = cycle as Record<string, unknown>

  const directHectareFields: unknown[] = [
    c.areaPlantedHectares,
    c.area_planted_hectares,
    c.hectaresPlanted,
    c.hectares_planted,
  ]
  for (const v of directHectareFields) {
    const n = parsePositiveNumber(v)
    if (n != null) return n
  }

  const planted = c.areaPlanted ?? c.area_planted
  const amount = parsePositiveNumber(planted)
  if (amount == null) return null

  const unitRaw = c.areaUnit ?? c.area_unit
  const unit =
    typeof unitRaw === 'string' && unitRaw.trim()
      ? unitRaw.trim()
      : 'hectares'

  const ha = toHectares(amount, unit)
  return Number.isFinite(ha) && ha > 0 ? ha : null
}

export function farmSizeHectaresFromApi(farm: unknown): number | null {
  if (!farm || typeof farm !== 'object') return null
  const f = farm as Record<string, unknown>

  const candidates: unknown[] = [
    f.sizeHectares,
    f.size_hectares,
    f.totalArea,
    f.total_area,
    f.hectares,
    f.landArea,
    f.land_area,
    f.grossArea,
    f.gross_area,
  ]

  for (const v of candidates) {
    const n = parsePositiveNumber(v)
    if (n != null) return n
  }
  return null
}
