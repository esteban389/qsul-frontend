'use client';

import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function ReactQueryContext({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1, // Retry failed requests once
          refetchOnWindowFocus: false, // Refetch data when the window regains focus
          refetchOnReconnect: true, // Refetch data when reconnecting to the internet
          retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Delay between retries
        },
      },
    }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
