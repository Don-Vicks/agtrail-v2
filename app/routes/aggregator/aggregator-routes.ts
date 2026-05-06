import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export const aggregatorRoutes: RouteConfig = [
  layout('routes/aggregator/layout.tsx', [
    ...prefix('aggregator', [
      index('routes/aggregator/dashboard.tsx'),
      route('batch-qr-scan', 'routes/aggregator/batch-qr-scan.tsx'),
      route('batch/:id', 'routes/aggregator/batch/$id.tsx'),
      route('draft-lot', 'routes/aggregator/draft-lot.tsx'),
      route('lot-consolidation', 'routes/aggregator/lot-consolidation.tsx'),
      route('lot-storage', 'routes/aggregator/lot-storage.tsx'),
      route('storage-history', 'routes/aggregator/storage-history.tsx'),
      route('storage-history/record', 'routes/aggregator/storage-history/record.tsx'),
      route('products/:id', 'routes/aggregator/products/story.tsx'),
      route('transfer/product-transfer', 'routes/aggregator/aggregator-product-transfer.tsx'),
      route('transfer/pickup', 'routes/aggregator/aggregator-pickup.tsx'),
      route('transfer/history', 'routes/aggregator/aggregator-transfer-history.tsx'),
      route('weight-reconciliation', 'routes/aggregator/weight-reconciliation.tsx'),
      route('settings', 'routes/aggregator/settings.tsx'),
    ]),
  ]),
]
