---
description: Generate the TypeScript API SDK from the backend Swagger/OpenAPI spec
---

# Generate API SDK

Regenerate the typed API client (React Query hooks + models) from the backend's Swagger/OpenAPI specification using **Orval**.

## Prerequisites

- The backend must be running, or the Swagger JSON/YAML spec must be accessible at the URL
  configured in `orval.config.ts`

## Steps

// turbo

1. Generate the SDK:

```bash
pnpm generate:api
```

2. Verify the output was created:

```bash
ls app/lib/api/generated/
```

You should see directories/files grouped by OpenAPI tag, plus a `models/` directory with TypeScript interfaces.

3. If the backend spec URL has changed, update `orval.config.ts`:

```ts
input: {
  target: "https://your-new-url.com/swagger.json",
},
```

## Notes

- The generated files in `app/lib/api/generated/` are git-ignored — they are always regenerated
- The generated hooks use a custom fetch mutator at `app/lib/api/custom-fetch.ts` which reads `baseUrl` from `VITE_API_BASE_URL` (set in `.env`)
- Run this workflow any time the backend API changes
