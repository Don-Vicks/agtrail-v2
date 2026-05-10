import { useMemo } from 'react'
import { useGetFarmersProducts } from '~/lib/api/generated/farm-products/farm-products'
import { useGetPurchases } from '~/lib/api/generated/purchases/purchases'
import { mockIncomingBatches } from './mock-data'
import type { AggregatorBatch } from './types'

function statusFromQuantity(quantityKg: number): AggregatorBatch['verificationStatus'] {
  if (quantityKg < 80) return 'rejected'
  if (quantityKg < 140) return 'flagged'
  return 'verified'
}

export function useAggregatorIncomingBatches() {
  const productsQuery = useGetFarmersProducts()
  const purchasesQuery = useGetPurchases()

  const apiBatches = useMemo<AggregatorBatch[]>(() => {
    const products = productsQuery.data?.data?.data ?? []
    if (!products.length) return []

    return products.slice(0, 24).map((product, idx) => {
      const quantityKg = Number(product.quantityAvailable ?? product.quantityHarvested ?? 0)
      return {
        id: product.id,
        batchIdentifier: product.batchNumber ? `#${product.batchNumber}` : `#BT-${product.id.slice(-6)}`,
        farmId: product.farmId,
        cropCycleId: product.cropCycleId ?? undefined,
        farmerName: `Farmer ${idx + 1}`,
        farmerCode: `F - ${String(idx + 1).padStart(3, '0')}`,
        location: product.storageLocation || 'Location pending',
        harvestedAt: product.harvestDate || new Date().toISOString().slice(0, 10),
        quantityKg,
        fieldAgentName: 'Assigned Agent',
        verificationStatus: statusFromQuantity(quantityKg),
        estimatedInspectionMins: 30 + (idx % 5) * 5,
        goodsType: product.productName || product.category || 'Produce',
      }
    })
  }, [productsQuery.data?.data?.data])

  return {
    batches: apiBatches.length ? apiBatches : mockIncomingBatches,
    isLoading: productsQuery.isLoading || purchasesQuery.isLoading,
    hasApiData: apiBatches.length > 0,
    error: productsQuery.error ?? purchasesQuery.error,
  }
}
