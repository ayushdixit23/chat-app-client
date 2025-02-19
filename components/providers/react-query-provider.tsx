"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useState } from "react";

// Create a client

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );
    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

export default ReactQueryProvider;
