import { useEffect, useMemo, useState } from 'react'
import type { AggregatorBatch, AggregatorStats } from './types'

const DRAFT_LOT_KEY = 'aggregator_draft_lot_v2'

const MOCK_BATCHES: AggregatorBatch[] = [
  {
    id: 'b1',
    batchIdentifier: '#BT-98442',
    farmerName: 'Marcus Chen',
    location: 'Takoradi, GHA',
    harvestedAt: '2025-04-13',
    quantityKg: 250.00,
    verificationStatus: 'verified',
    goodsType: 'Cocoa Beans',
    fieldAgentName: 'John Doe',
    estimatedInspectionMins: 15
  },
  {
    id: 'b2',
    batchIdentifier: '#BT-98443',
    farmerName: 'Sarah Rogers',
    location: 'Soubre, CV',
    harvestedAt: '2025-04-13',
    quantityKg: 250.00,
    verificationStatus: 'verified',
    goodsType: 'Cocoa Beans',
    fieldAgentName: 'Jane Smith',
    estimatedInspectionMins: 20
  },
  {
    id: 'b3',
    batchIdentifier: '#BT-98444',
    farmerName: 'Alex Jenkins',
    location: 'Kumasi, GHA',
    harvestedAt: '2025-04-13',
    quantityKg: 250.00,
    verificationStatus: 'verified',
    goodsType: 'Cocoa Beans',
    fieldAgentName: 'Bob Wilson',
    estimatedInspectionMins: 12
  }
]

function readStoredDraftLot(): AggregatorBatch[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(DRAFT_LOT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useDraftLot() {
  const [draftLotBatches, setDraftLotBatches] = useState<AggregatorBatch[]>(() => readStoredDraftLot())

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(DRAFT_LOT_KEY, JSON.stringify(draftLotBatches))
  }, [draftLotBatches])

  const stats = useMemo<AggregatorStats>(() => {
    const scanned = draftLotBatches.length
    const verified = draftLotBatches.filter((b) => b.verificationStatus === 'verified').length
    const flagged = draftLotBatches.filter((b) => b.verificationStatus === 'flagged').length
    const rejected = draftLotBatches.filter((b) => b.verificationStatus === 'rejected').length
    const totalDraftWeightKg = draftLotBatches.reduce((sum, batch) => sum + batch.quantityKg, 0)

    return { scanned, verified, flagged, rejected, totalDraftWeightKg }
  }, [draftLotBatches])

  const addBatch = (batch: AggregatorBatch) => {
    setDraftLotBatches((prev) => {
      if (prev.some((item) => item.id === batch.id)) return prev
      return [...prev, batch]
    })
  }

  const removeBatch = (batchId: string) => {
    setDraftLotBatches((prev) => prev.filter((item) => item.id !== batchId))
  }

  const clearDraftLot = () => setDraftLotBatches([])

  return { draftLotBatches, stats, addBatch, removeBatch, clearDraftLot }
}
