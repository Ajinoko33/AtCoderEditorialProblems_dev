'use client';

import { ProblemSearchContextProvider } from '@/contexts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const ContextProviders = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ProblemSearchContextProvider>{children}</ProblemSearchContextProvider>
    </QueryClientProvider>
  );
};
