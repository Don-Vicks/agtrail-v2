import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data stays fresh for 5 minutes before a background refetch
      staleTime: 1000 * 60 * 5,
      // Retry failed requests once
      retry: 1,
    },
  },
})
