/**
 * Sample route demonstrating how to use the generated API SDK
 * with TanStack Query for data fetching.
 *
 * Once you've generated the SDK (pnpm generate:api), uncomment
 * the imports and hook usage below.
 */

// ─── Step 1: Import from the generated SDK ───────────────────────
// import { getUsers } from "~/lib/api/generated";
// import { client } from "~/lib/api/generated/client.gen";

// ─── Step 2: Import TanStack Query hook ──────────────────────────
// import { useQuery } from "@tanstack/react-query";

export default function ApiSample() {
  // ─── Step 3: Fetch data using the SDK + TanStack Query ─────────
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: () =>
  //     getUsers({
  //       client,         // uses the pre-configured client instance
  //     }),
  // });

  // if (isLoading) return <p>Loading…</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <main style={{ padding: "2rem", fontFamily: "Inter, sans-serif" }}>
      <h1>API Sample Route</h1>
      <p>
        This route is a placeholder. Once you generate the SDK, uncomment the
        code in <code>app/routes/api-sample.tsx</code> to see live API data.
      </p>
      <h2>Quick Start</h2>
      <ol>
        <li>
          Update <code>openapi-ts.config.ts</code> with your real Swagger URL
        </li>
        <li>
          Run <code>pnpm generate:api</code>
        </li>
        <li>Uncomment the imports and hook in this file</li>
        <li>Start the dev server and visit this route</li>
      </ol>
    </main>
  );
}
