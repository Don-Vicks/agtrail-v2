import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export const processorRoutes: RouteConfig[] = [
  layout('routes/processor/layout.tsx', [
    ...prefix('processor', [
      index('routes/processor/dashboard.tsx'),
      route('batches', 'routes/processor/batches.tsx'),
      route('batches/new', 'routes/processor/batches/new.tsx'),
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
      route('settings', 'routes/processor/settings/settings-root.tsx'),
    ]),
  ]),
]
