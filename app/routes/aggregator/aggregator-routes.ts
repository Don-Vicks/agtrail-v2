import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export const aggregatorRoutes: RouteConfig = [
  layout('routes/aggregator/layout.tsx', [
    ...prefix('aggregator', [
      index('routes/aggregator/dashboard.tsx'),
      route('batch-qr-scan', 'routes/aggregator/batch-qr-scan.tsx'),
      route('draft-lot', 'routes/aggregator/draft-lot.tsx'),
      route('lot-consolidation', 'routes/aggregator/lot-consolidation.tsx'),
      route('lot-storage', 'routes/aggregator/lot-storage.tsx'),
      route('transfer', 'routes/aggregator/transfer.tsx'),
      route('weight-reconciliation', 'routes/aggregator/weight-reconciliation.tsx'),
      route('settings', 'routes/aggregator/settings.tsx'),
    ]),
  ]),
]
