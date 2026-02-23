import { defineConfig } from 'orval'

export default defineConfig({
  agtrail: {
    input: {
      target: 'https://api.example.com/swagger.json', // ← replace with your real Swagger URL
    },
    output: {
      mode: 'tags-split',
      target: 'app/lib/api/generated',
      schemas: 'app/lib/api/generated/models',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: {
          path: './app/lib/api/custom-fetch.ts',
          name: 'customFetch',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
})
