import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'https://api.example.com/swagger.json', // ← replace with your real Swagger URL
  output: {
    path: 'app/lib/api/generated',
    clean: true,
  },
  plugins: [
    '@hey-api/typescript',
    '@hey-api/sdk',
    {
      name: '@hey-api/client-fetch',
      runtimeConfigPath: './app/lib/api/client.ts',
    },
  ],
})
