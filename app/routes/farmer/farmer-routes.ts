import {
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export const farmerRoutes = [
  layout('routes/farmer/layout.tsx', [
    ...prefix('farmer', [
      index('routes/farmer/dashboard.tsx'),
      route('farms', 'routes/farmer/farms.tsx'),
      route('crop-cycle', 'routes/farmer/crop-cycle.tsx'),
      route('products', 'routes/farmer/products/index.tsx'),
      route('products/:id', 'routes/farmer/products/story.tsx'),
      route('farms/:id', 'routes/farmer/farm-detail.tsx'),
      route('inventory', 'routes/farmer/inventory.tsx'),
      route('personnel', 'routes/farmer/personnel.tsx'),

      // Operations Routes
      route('operations/new', 'routes/farmer/record-operation.tsx'),
      route(
        'operations/new/:cropCycleId/land-prep',
        'routes/farmer/operations/land-prep.tsx',
      ),
      route(
        'operations/new/:cropCycleId/planting',
        'routes/farmer/operations/planting.tsx',
      ),
      route(
        'operations/new/:cropCycleId/fertilizer',
        'routes/farmer/operations/fertilizer.tsx',
      ),
      route(
        'operations/new/:cropCycleId/irrigation',
        'routes/farmer/operations/irrigation.tsx',
      ),
      route(
        'operations/new/:cropCycleId/weeding',
        'routes/farmer/operations/weeding.tsx',
      ),
      ...prefix('operations/new/:cropCycleId', [
        route('pest-control', 'routes/farmer/operations/pest-control.tsx'),
        route('pruning', 'routes/farmer/operations/pruning.tsx'),
        route('harvesting', 'routes/farmer/operations/harvesting.tsx'),
        route('sorting', 'routes/farmer/operations/sorting.tsx'),
        route('drying', 'routes/farmer/operations/drying.tsx'),
        route('processing', 'routes/farmer/operations/processing.tsx'),
        route('packaging', 'routes/farmer/operations/packaging.tsx'),
        route('storage', 'routes/farmer/operations/storage.tsx'),
      ]),
      route(
        'certifications/product',
        'routes/farmer/certifications/product-certification.tsx',
      ),
      route(
        'certifications/farm',
        'routes/farmer/certifications/farm-certification.tsx',
      ),
      route(
        'certifications/view',
        'routes/farmer/certifications/view-certifications.tsx',
      ),
      route(
        'finance/record-purchase',
        'routes/farmer/finance/record-purchase.tsx',
      ),
      route('finance/receivables', 'routes/farmer/finance/receivables.tsx'),

      // Reports & Analytics
      ...prefix('reports', [
        index('routes/farmer/reports/reports-analytics.tsx'),
        route('crop-cycle', 'routes/farmer/reports/crop-cycle-summary.tsx'),
        route('harvest-sales', 'routes/farmer/reports/harvest-sales-report.tsx'),
        route('farm', 'routes/farmer/reports/farm-report.tsx'),
        route('financial', 'routes/farmer/reports/financial-summary.tsx'),
        route('payments', 'routes/farmer/reports/payment-history.tsx'),
      ]),

      // Compliance Analysis
      // Compliance Analysis Workflow
      ...prefix('compliance', [
        index('routes/farmer/compliance/compliance-analysis.tsx'),
        route('risk-assessment', 'routes/farmer/compliance/risk-assessment.tsx'),
        route('market', 'routes/farmer/compliance/market-selection.tsx'),
        route('readiness', 'routes/farmer/compliance/readiness-check.tsx'),
        route('report', 'routes/farmer/compliance/compliance-report.tsx'),
      ]),

      // Settings
      route('settings', 'routes/farmer/settings/settings-root.tsx'),

      // Transfer
      route('transfer/product-transfer', 'routes/farmer/farmer-product-transfer.tsx'),
      route('transfer/pickup', 'routes/farmer/transfer/pickup.tsx'),
      route('transfer/history', 'routes/farmer/farmer-transfer-history.tsx'),
    ]),
  ]),
]
