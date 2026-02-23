---
name: project-context
description: Core project context, tech stack, structure, and conventions for frontend-v2
---

# Project Context

## Tech Stack

| Layer       | Technology                         | Version |
| ----------- | ---------------------------------- | ------- |
| Framework   | React Router (framework mode)      | 7.12.0  |
| Bundler     | Vite                               | 7.x     |
| Styling     | Tailwind CSS (CSS-first, v4)       | 4.x     |
| Language    | TypeScript (strict mode)           | 5.x     |
| Runtime     | React                              | 19.x    |
| Data        | TanStack React Query               | 5.x     |
| API Codegen | Orval (React Query + fetch)        | 8.x     |
| Pkg Manager | pnpm                               | —       |
| Deployment  | Docker (node:20-alpine) / Node SSR | —       |

## Project Structure

```
frontend-v2/
├── app/
│   ├── root.tsx           # Root layout, meta, links, ErrorBoundary
│   ├── routes.ts          # Route definitions (explicit, not file-convention)
│   ├── routes/            # Route modules
│   │   └── home.tsx       # Example route module
│   ├── app.css            # Global styles (Tailwind v4 entry)
│   └── welcome/           # Feature/component directories
├── public/                # Static assets
├── .react-router/         # Auto-generated types (do NOT edit)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── react-router.config.ts
└── Dockerfile
```

## Key Conventions

### Path Alias

- `~/` maps to `./app/` (configured in `tsconfig.json` under `paths`)
- Always use `~/` for imports within the app: `import { Foo } from "~/components/foo"`

### Routing

- Routes are defined **explicitly** in `app/routes.ts` using `@react-router/dev/routes` helpers (`index`, `route`, `layout`, `prefix`)
- This project does **NOT** use file-convention routing — every route must be registered in `routes.ts`
- Route modules live in `app/routes/`

### SSR

- Server-side rendering is **enabled** (`ssr: true` in `react-router.config.ts`)
- Be mindful of server/client boundaries; use `.server/` and `.client/` directories when needed

### Styling

- Tailwind CSS v4 via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**
- Global styles in `app/app.css` using `@import "tailwindcss"` and `@theme` blocks
- Dark mode via `prefers-color-scheme` media query
- Font: Inter (loaded via Google Fonts in `root.tsx` links)

### TypeScript

- Strict mode enabled
- Auto-generated route types in `.react-router/types/` — import from `./+types/<routename>`
- Example: `import type { Route } from "./+types/home"`

### Package Manager

- Use `pnpm` for all install/add/remove operations
- Lock file: `pnpm-lock.yaml`

### Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Start dev server with HMR            |
| `pnpm build`        | Production build                     |
| `pnpm start`        | Serve production build               |
| `pnpm typecheck`    | Generate route types + run `tsc`     |
| `pnpm generate:api` | Generate API hooks from OpenAPI spec |
