"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query-client";
import { ReactNode } from "react";

interface QueryProvidersProps {
  children: ReactNode;
}

export function QueryProviders({ children }: QueryProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools - only visible in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
