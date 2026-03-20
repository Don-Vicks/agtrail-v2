import { type RouteConfig, layout, route } from '@react-router/dev/routes'

export const cooperativeRoutes: RouteConfig = [
  layout('routes/cooperative/layout.tsx', [
    route('cooperative', 'routes/cooperative/dashboard.tsx'),
    route('cooperative/farmers', 'routes/cooperative/farmers.tsx'),
    route('cooperative/farmers/:id', 'routes/cooperative/farmer-details.tsx'),
    route('cooperative/farmers/:id/farms', 'routes/cooperative/farmer-farms.tsx'),
    route('cooperative/farms', 'routes/cooperative/farms.tsx'),
    route('cooperative/farms/:id', 'routes/cooperative/farm-details.tsx'),
    
    // Operations mapped to reuse the core templates from farmer routes
    route('cooperative/operations/new', 'routes/farmer/record-operation.tsx', { id: 'cooperative-record-operation' }),
    route('cooperative/operations/new/:cropCycleId/land-prep', 'routes/farmer/operations/land-prep.tsx', { id: 'cooperative-land-prep' }),
    route('cooperative/operations/new/:cropCycleId/planting', 'routes/farmer/operations/planting.tsx', { id: 'cooperative-planting' }),
    route('cooperative/operations/new/:cropCycleId/fertilizer', 'routes/farmer/operations/fertilizer.tsx', { id: 'cooperative-fertilizer' }),
    route('cooperative/operations/new/:cropCycleId/irrigation', 'routes/farmer/operations/irrigation.tsx', { id: 'cooperative-irrigation' }),
    route('cooperative/operations/new/:cropCycleId/weeding', 'routes/farmer/operations/weeding.tsx', { id: 'cooperative-weeding' }),
    route('cooperative/operations/new/:cropCycleId/pest-control', 'routes/farmer/operations/pest-control.tsx', { id: 'cooperative-pest-control' }),
    route('cooperative/operations/new/:cropCycleId/pruning', 'routes/farmer/operations/pruning.tsx', { id: 'cooperative-pruning' }),
    route('cooperative/operations/new/:cropCycleId/harvesting', 'routes/farmer/operations/harvesting.tsx', { id: 'cooperative-harvesting' }),
  ])
]
