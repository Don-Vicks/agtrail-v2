import { useMemo } from 'react'
import { 
  useGetAggregatorLotsDraft, 
  usePostAggregatorLotsDraftScanBatch, 
  useDeleteAggregatorLotsDraftBatchesFarmProductId,
  getGetAggregatorLotsDraftQueryKey
} from '~/lib/api/generated/aggregator/aggregator'
import { getGetFarmersProductsQueryKey } from '~/lib/api/generated/farm-products/farm-products'
import type { AggregatorBatch, AggregatorStats } from './types'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDraftLot() {
  const queryClient = useQueryClient()
  const { data: draftData, isLoading, error } = useGetAggregatorLotsDraft()
  const scanBatchMutation = usePostAggregatorLotsDraftScanBatch()
  const removeBatchMutation = useDeleteAggregatorLotsDraftBatchesFarmProductId()

  const draftLotBatches = useMemo<AggregatorBatch[]>(() => {
    const apiBatches = (draftData?.data?.data as any)?.batches ?? []
    return apiBatches.map((batch: any) => ({
      id: batch.id,
      batchIdentifier: batch.batchNumber || `#BT-${batch.id.slice(-6)}`,
      farmerName: batch.farmerName || batch.farmer?.name || 'Unknown Farmer',
      farmerId: batch.farmerId || batch.farmer?.id || '',
      location: batch.storageLocation || batch.farm?.name || 'Unknown Location',
      harvestedAt: batch.harvestDate || '',
      quantityKg: Number(batch.quantity || 0),
      verificationStatus: (batch.verificationStatus as any) || 'verified',
      goodsType: batch.productName || 'Produce',
      fieldAgentName: batch.fieldAgentName || 'N/A',
      estimatedInspectionMins: 15
    }))
  }, [draftData])

  const stats = useMemo<AggregatorStats>(() => {
    const scanned = draftLotBatches.length
    const verified = draftLotBatches.filter((b) => b.verificationStatus === 'verified').length
    const flagged = draftLotBatches.filter((b) => b.verificationStatus === 'flagged').length
    const rejected = draftLotBatches.filter((b) => b.verificationStatus === 'rejected').length
    const totalDraftWeightKg = draftLotBatches.reduce((sum, batch) => sum + batch.quantityKg, 0)

    return { scanned, verified, flagged, rejected, totalDraftWeightKg }
  }, [draftLotBatches])

  const addBatch = async (batchNumber: string) => {
    try {
      await scanBatchMutation.mutateAsync({
        data: { batchNumber }
      })
      queryClient.invalidateQueries({ queryKey: getGetAggregatorLotsDraftQueryKey() })
      queryClient.invalidateQueries({ queryKey: getGetFarmersProductsQueryKey() })
      toast.success('Batch added to draft lot')
    } catch (err) {
      toast.error('Failed to add batch')
      throw err
    }
  }

  const removeBatch = async (batchId: string) => {
    try {
      await removeBatchMutation.mutateAsync({
        farmProductId: batchId
      })
      queryClient.invalidateQueries({ queryKey: getGetAggregatorLotsDraftQueryKey() })
      queryClient.invalidateQueries({ queryKey: getGetFarmersProductsQueryKey() })
      toast.success('Batch removed from draft lot')
    } catch (err) {
      toast.error('Failed to remove batch')
    }
  }

  return { 
    draftLotBatches, 
    stats, 
    addBatch, 
    removeBatch, 
    isLoading,
    isAdding: scanBatchMutation.isPending,
    isRemoving: removeBatchMutation.isPending,
    error 
  }
}

