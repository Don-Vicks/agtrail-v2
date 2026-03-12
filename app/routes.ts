import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),

  // Auth
  layout('routes/auth/layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('forgot-password', 'routes/auth/forgot-password.tsx'),
    route('register/farmer', 'routes/auth/farmer-registration.tsx'),
  ]),

  // Farmer tenant
  layout('routes/farmer/layout.tsx', [
    ...prefix('farmer', [
      index('routes/farmer/dashboard.tsx'),
      route('farms', 'routes/farmer/farms.tsx'),
      route('crop-cycle', 'routes/farmer/crop-cycle.tsx'),
      route('products', 'routes/farmer/products/index.tsx'),
      route('products/:id', 'routes/farmer/products/story.tsx'),
      route('farms/:id', 'routes/farmer/farm-detail.tsx'),
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
      route(
        'operations/new/:cropCycleId/pest-control',
        'routes/farmer/operations/pest-control.tsx',
      ),
      route(
        'operations/new/:cropCycleId/pruning',
        'routes/farmer/operations/pruning.tsx',
      ),
      route(
        'operations/new/:cropCycleId/harvesting',
        'routes/farmer/operations/harvesting.tsx',
      ),
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
      route('reports', 'routes/farmer/reports/reports-analytics.tsx'),

      // Compliance Analysis
      route('compliance', 'routes/farmer/compliance/compliance-analysis.tsx'),

      // Settings
      route('settings', 'routes/farmer/settings/settings-root.tsx'),
    ]),
  ]),

  // Future: buyer, admin tenants follow the same pattern
  // layout('routes/buyer/layout.tsx', [
  //   ...prefix('buyer', [
  //     index('routes/buyer/dashboard.tsx'),
  //   ]),
  // ]),
] satisfies RouteConfig
