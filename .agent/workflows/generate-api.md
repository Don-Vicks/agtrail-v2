---
description: Generate the TypeScript API SDK from the backend Swagger/OpenAPI spec
---

# Generate API SDK

Regenerate the typed API client from the backend's Swagger/OpenAPI specification.

## Prerequisites

- The backend must be running, or the Swagger JSON/YAML spec must be accessible at the URL
  configured in `openapi-ts.config.ts`

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

You should see files like `client.gen.ts`, `sdk.gen.ts`, `types.gen.ts`, etc.

3. If the backend spec URL has changed, update `openapi-ts.config.ts`:

```ts
input: "https://your-new-url.com/swagger.json",
```

## Notes

- The generated files in `app/lib/api/generated/` are git-ignored — they are always regenerated
- The generated client reads its `baseUrl` from `VITE_API_BASE_URL` (set in `.env`)
- Run this workflow any time the backend API changes
