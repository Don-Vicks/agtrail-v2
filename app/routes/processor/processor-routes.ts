import {
    type RouteConfig,
    index,
    layout,
    prefix,
    route,
} from '@react-router/dev/routes'

export const processorRoutes: RouteConfig = [
  layout('routes/processor/layout.tsx', [
    ...prefix('processor', [
      index('routes/processor/dashboard.tsx'),
      route('inventory', 'routes/farmer/inventory.tsx', { id: 'processor-inventory' }),
      route('personnel', 'routes/farmer/personnel.tsx', { id: 'processor-personnel' }),
      route('batches', 'routes/processor/batches.tsx'),
      route('batches/new', 'routes/processor/batches/new.tsx'),
      route('batches/:id', 'routes/processor/batches/detail.tsx'),
      route('materials', 'routes/processor/materials.tsx'),
      route('products', 'routes/processor/products.tsx'),
      route(
        'certifications/processor',
        'routes/processor/certifications/processor.tsx',
      ),
      route(
        'certifications/product',
        'routes/processor/certifications/product.tsx',
      ),
      route(
        'certifications/readiness',
        'routes/processor/certifications/readiness.tsx',
      ),
      route('finance/purchase', 'routes/processor/finance/purchase.tsx'),
      route('finance/receivables', 'routes/processor/finance/receivables.tsx'),
      route('operations/record', 'routes/processor/operations/record.tsx'),
      ...prefix('operations/new/:cropCycleId', [
        route('land-prep', 'routes/processor/operations/land-prep.tsx'),
        route('planting', 'routes/processor/operations/planting.tsx'),
        route('fertilizer', 'routes/processor/operations/fertilizer.tsx'),
        route('irrigation', 'routes/processor/operations/irrigation.tsx'),
        route('weeding', 'routes/processor/operations/weeding.tsx'),
        route('pest-control', 'routes/processor/operations/pest-control.tsx'),
        route('pruning', 'routes/processor/operations/pruning.tsx'),
        route('harvesting', 'routes/processor/operations/harvesting.tsx'),
        route('sorting', 'routes/processor/operations/sorting.tsx'),
        route('drying', 'routes/processor/operations/drying.tsx'),
        route('processing', 'routes/processor/operations/processing.tsx'),
        route('packaging', 'routes/processor/operations/packaging.tsx'),
        route('storage', 'routes/processor/operations/storage.tsx'),
      ]),
      route('settings', 'routes/processor/settings/settings-root.tsx'),
    ]),
  ]),
]
