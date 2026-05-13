/**
 * Normalize text read from a batch QR (URL, path, UUID, or raw batch id / batch number)
 * into a single segment used in `/aggregator/batch/:id` (farm product id or identifier).
 */
export function parseBatchScannedText(raw: string): string {
  const t = raw.trim()
  if (!t) return ''

  const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidLike.test(t)) return t

  if (/^https?:\/\//i.test(t) || t.startsWith('/')) {
    try {
      const base =
        typeof window !== 'undefined' && window.location?.origin
          ? window.location.origin
          : 'https://localhost'
      const u = t.startsWith('/') ? new URL(t, base) : new URL(t)
      const segments = u.pathname.split('/').filter(Boolean)
      const batchIdx = segments.indexOf('batch')
      if (batchIdx >= 0 && segments[batchIdx + 1]) {
        return decodeURIComponent(segments[batchIdx + 1])
      }
      const last = segments[segments.length - 1]
      if (last) return decodeURIComponent(last)
    } catch {
      // ignore malformed URL
    }
  }

  return t
}
