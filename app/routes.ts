import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('api-sample', 'routes/api-sample.tsx'),
] satisfies RouteConfig
