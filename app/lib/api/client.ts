/**
 * Runtime configuration for the Hey API Fetch client.
 *
 * After running `pnpm generate:api`, the generated `client.gen.ts` will
 * import `createClientConfig` from this file and call it before initialising
 * the client instance.
 *
 * The `CreateClientConfig` type is exported by the generated code. Once the
 * SDK has been generated for the first time, you can add the explicit type:
 *
 *   import type { CreateClientConfig } from "./generated/client.gen";
 *   export const createClientConfig: CreateClientConfig = (config) => ({ ... });
 */
export const createClientConfig = (config: Record<string, unknown>) => ({
  ...config,
  baseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})
