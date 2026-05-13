import { useMemo } from 'react'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import type { AggregatorBatch } from './types'

function statusFromQuantity(quantityKg: number): AggregatorBatch['verificationStatus'] {
  if (quantityKg < 80) return 'rejected'
  if (quantityKg < 140) return 'flagged'
  return 'verified'
}

export function useAggregatorIncomingBatches() {
  const productsQuery = useGetFarmersProducts()

  const batches = useMemo<AggregatorBatch[]>(() => {
    const apiProducts = productsQuery.data?.data?.data ?? []
    
    return apiProducts.map((product: any, idx) => {
      const quantityKg = Number(product.quantityAvailable || product.quantityHarvested || 0)
      return {
        id: product.id,
        batchIdentifier: product.batchNumber || `#BT-${product.id.slice(-6)}`,
        farmId: product.farmId,
        cropCycleId: product.cropCycleId ?? undefined,
        farmerName: product.farmerName || `Farmer ${idx + 1}`,
        farmerId: product.farmerId || product.farmId || '',
        farmerCode: product.farmId ? `F-${product.farmId.slice(-4)}` : `F-${String(idx + 1).padStart(3, '0')}`,
        location: product.storageLocation || 'Location pending',
        harvestedAt: product.harvestDate || new Date().toISOString().slice(0, 10),
        quantityKg,
        fieldAgentName: product.fieldAgentName || 'Assigned Agent',
        verificationStatus: (product.verificationStatus as any) || statusFromQuantity(quantityKg),
        estimatedInspectionMins: 30 + (idx % 5) * 5,
        goodsType: product.productName || product.category || 'Produce',
      }
    })
  }, [productsQuery.data])

  return {
    batches,
    isLoading: productsQuery.isLoading,
    hasApiData: batches.length > 0,
    error: productsQuery.error,
  }
}
