// React Query (TanStack Query) Configuration
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before considering it stale
      staleTime: 5 * 60 * 1000, // 5 minutes

      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

      // Don't refetch on window focus (can be annoying)
      refetchOnWindowFocus: false,

      // Don't refetch on reconnect (we have manual refresh)
      refetchOnReconnect: false,

      // Retry failed requests once
      retry: 1,

      // Retry delay
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Only refetch when explicitly requested or data is stale
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});
