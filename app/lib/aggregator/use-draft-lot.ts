import { useMemo } from 'react'
import { 
  useGetAggregatorLotsDraft, 
  usePostAggregatorLotsDraftScanBatch, 
  useDeleteAggregatorLotsDraftBatchesFarmProductId,
  getGetAggregatorLotsDraftQueryKey
} from '~/lib/api/generated/aggregator/aggregator'
import { getGetFarmersProductsQueryKey, getFarmersProductsId } from '~/lib/api/generated/farm-products/farm-products'
import { getProcessorsBatchesId } from '~/lib/api/generated/processors-batches/processors-batches'
import type { AggregatorBatch, AggregatorStats } from './types'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export function useDraftLot() {
  const queryClient = useQueryClient()
  const { data: draftData, isLoading, error } = useGetAggregatorLotsDraft()
  const scanBatchMutation = usePostAggregatorLotsDraftScanBatch({
    request: {
      headers: { 'X-Offline-Label': 'Draft new lot' }
    }
  } as any)
  const removeBatchMutation = useDeleteAggregatorLotsDraftBatchesFarmProductId({
    request: {
      headers: { 'X-Offline-Label': 'Remove batch from draft' }
    }
  } as any)

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

  const addBatch = async (batchNumberOrId: string) => {
    let finalBatchNumber = batchNumberOrId

    console.log('Attempting to add batch:', batchNumberOrId)

    // If it looks like a UUID, we need to resolve it to a batchNumber first
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (uuidRegex.test(batchNumberOrId)) {
      try {
        console.log('Resolving UUID...');
        // Try farmer product lookup first
        const productResponse = await getFarmersProductsId(batchNumberOrId)
        if (productResponse.data?.data?.batchNumber) {
          finalBatchNumber = productResponse.data.data.batchNumber
          console.log('Resolved to Farmer Batch Number:', finalBatchNumber)
        } else {
          // Try processor batch lookup as fallback
          const processorResponse = await getProcessorsBatchesId(batchNumberOrId)
          if (processorResponse.data?.data?.batchNumber) {
            finalBatchNumber = processorResponse.data.data.batchNumber
            console.log('Resolved to Processor Batch Number:', finalBatchNumber)
          }
        }
      } catch (err) {
        console.error('Failed to resolve UUID to batchNumber', err)
      }
    }

    try {
      console.log('Calling scan-batch API with:', finalBatchNumber);
      const result = await scanBatchMutation.mutateAsync({
        data: { batchNumber: finalBatchNumber }
      })
      
      console.log('API Result:', result);

      if (result.status !== 200 && result.status !== 201) {
        throw new Error(`API returned status ${result.status}`)
      }

      queryClient.invalidateQueries({ queryKey: getGetAggregatorLotsDraftQueryKey() })
      queryClient.invalidateQueries({ queryKey: getGetFarmersProductsQueryKey() })
      toast.success(`Batch ${finalBatchNumber} added to draft lot`)
    } catch (err: any) {
      console.error('Scan Batch API Error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Batch not found or permission denied'
      toast.error(`Error: ${errorMsg}`)
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

