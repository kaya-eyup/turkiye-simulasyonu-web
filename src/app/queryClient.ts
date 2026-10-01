import { QueryClient, QueryCache } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (import.meta.env.DEV) console.error("[query]", query.queryKey, error);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});