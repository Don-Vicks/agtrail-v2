export type BatchVerificationStatus = 'verified' | 'flagged' | 'rejected' | 'pending'

export interface AggregatorBatch {
  id: string
  batchIdentifier: string
  farmId?: string
  cropCycleId?: string
  farmerName: string
  farmerCode: string
  location: string
  harvestedAt: string
  quantityKg: number
  fieldAgentName: string
  verificationStatus: BatchVerificationStatus
  estimatedInspectionMins: number
  goodsType: string
}

export interface AggregatorLot {
  id: string
  createdAt: string
  status: 'pending' | 'confirmed'
  batches: AggregatorBatch[]
  consolidationLocation: string
}

export interface AggregatorStats {
  scanned: number
  verified: number
  flagged: number
  rejected: number
  totalDraftWeightKg: number
}
