import type { Farm, FarmProduct } from '~/lib/api/generated/models'

export interface ReceivableView {
  id: string
  date: string
  payer: string
  farm: string
  productName: string
  batchId: string
  quantity: string
  amount: string
  status: string
}

interface LookupContext {
  farms: Farm[]
  products: FarmProduct[]
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object') return null
  return value as Record<string, unknown>
}

function pickValue(record: Record<string, unknown>, paths: string[][]): unknown {
  for (const path of paths) {
    let current: unknown = record

    for (const part of path) {
      const currentRecord = asRecord(current)
      if (!currentRecord) {
        current = undefined
        break
      }
      current = currentRecord[part]
    }

    if (current !== undefined && current !== null && current !== '') return current
  }

  return undefined
}

function pickString(record: Record<string, unknown>, paths: string[][]) {
  const value = pickValue(record, paths)
  return typeof value === 'string' ? value : ''
}

function pickNumber(record: Record<string, unknown>, paths: string[][]) {
  const value = pickValue(record, paths)
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function formatDate(value: string) {
  if (!value) return 'Unknown date'

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatAmount(amount: number | null, currency: string) {
  if (amount === null) return 'N/A'

  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency || 'NGN',
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency || 'NGN'} ${amount.toFixed(2)}`
  }
}

function formatQuantity(record: Record<string, unknown>) {
  const quantity = pickNumber(record, [
    ['quantity'],
    ['quantityTransferred'],
    ['quantityReceived'],
    ['amountReceived'],
  ])

  const unit = pickString(record, [['unit']])
  if (quantity === null) return 'N/A'
  return `${quantity}${unit ? ` ${unit}` : ''}`
}

function getReceivableRows(data: unknown) {
  if (Array.isArray(data)) return data

  const record = asRecord(data)
  if (!record) return []

  const nestedCandidates = ['receivables', 'items', 'results', 'data', 'payments', 'transfers']
  let rows: any[] = []
  
  for (const candidate of nestedCandidates) {
    const value = record[candidate]
    if (Array.isArray(value)) {
      if (candidate === 'transfers' || candidate === 'payments') {
         // Keep both transfers and payments for now as they represent different receivable aspects
         rows = rows.concat(value)
      } else {
         return value
      }
    }
  }

  return rows
}

export function normalizeReceivables(data: unknown, { farms, products }: LookupContext): ReceivableView[] {
  const farmMap = new Map(farms.map((farm) => [farm.id, farm.name]))
  const productMap = new Map(products.map((product) => [product.id, product]))

  return getReceivableRows(data)
    .map((item, index) => {
      const record = asRecord(item)
      if (!record) return null

      const productId = pickString(record, [['farmProductId'], ['productId'], ['batchProductId']])
      const product = productId ? productMap.get(productId) : null
      const farmId =
        pickString(record, [['farmId']]) ||
        product?.farmId ||
        ''

      const currency =
        pickString(record, [['currency']]) ||
        product?.priceCurrency ||
        'NGN'

      const amount = pickNumber(record, [
        ['amount'],
        ['totalAmount'],
        ['paymentAmount'],
        ['totalPrice'],
        ['grossAmount'],
        ['price'],
      ])

      const payer =
        pickString(record, [['farmer'], ['payerName'], ['customerName'], ['toUserName']]) ||
        pickString(record, [['toUserId']]) ||
        'Unknown payer'

      return {
        id: String(record.id ?? record.reference ?? `${productId || 'receivable'}-${index}`),
        date: formatDate(
          pickString(record, [['createdAt'], ['date'], ['paymentDate'], ['updatedAt']]),
        ),
        payer,
        farm:
          pickString(record, [['farm'], ['farmName']]) ||
          farmMap.get(farmId) ||
          'Unknown farm',
        productName:
          pickString(record, [['productName'], ['product']]) ||
          product?.productName ||
          'Unknown product',
        batchId:
          pickString(record, [['batchId'], ['reference']]) ||
          product?.batchNumber ||
          'N/A',
        quantity: formatQuantity(record),
        amount: formatAmount(amount, currency),
        status:
          pickString(record, [['status'], ['paymentStatus']]) ||
          'Pending',
      }
    })
    .filter((item): item is ReceivableView => Boolean(item))
}
