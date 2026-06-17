import { QueryClient } from "@tanstack/react-query"

// Shared TanStack Query defaults for retry and refetch behavior.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000 // 10 mins
    },
  },
})
