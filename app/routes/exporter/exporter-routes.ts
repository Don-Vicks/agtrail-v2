import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export const exporterRoutes: RouteConfig = [
  layout('routes/exporter/layout.tsx', [
    ...prefix('exporter', [
      index('routes/exporter/dashboard.tsx'),
      route('products', 'routes/exporter/products.tsx'),
      route('scan-qr', 'routes/exporter/scan-qr.tsx'),
      route('batch-details', 'routes/exporter/batch-details.tsx'),
      route('weight', 'routes/exporter/weight.tsx'),
      route('lot-draft', 'routes/exporter/lot-draft.tsx'),
      route('tress', 'routes/exporter/tress.tsx'),
      route('consolidation', 'routes/exporter/consolidation.tsx'),
      route('storage', 'routes/exporter/storage.tsx'),
      route('record-operation', 'routes/exporter/record-operation.tsx'),
      route('view-operation', 'routes/exporter/view-operation.tsx'),
      route('product-transfer', 'routes/exporter/product-transfer.tsx'),
      route('product-pickup', 'routes/exporter/product-pickup.tsx'),
      ...prefix('export', [
        route('draft', 'routes/exporter/export/draft.tsx'),
        route('destination', 'routes/exporter/export/destination.tsx'),
        route('compliance', 'routes/exporter/export/compliance.tsx'),
        route('manifest', 'routes/exporter/export/manifest.tsx'),
        route('add-docus', 'routes/exporter/export/add-docus.tsx'),
        route('inspection', 'routes/exporter/export/inspection.tsx'),
        route('passport', 'routes/exporter/export/passport.tsx'),
      ]),
    ]),
  ]),
]
