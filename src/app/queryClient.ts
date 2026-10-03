import { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ConfigError, HttpError } from "../shared/api/client";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Kalıcı hatalar: tekrar denemek sonucu değiştirmez
        if (error instanceof ConfigError || error instanceof z.ZodError)
          return false;
        if (error instanceof HttpError && error.status < 500) return false;
        // Geçici hatalar (ağ kopması, 5xx): en fazla 3 kez dene
        return failureCount < 3;
      },
    },
  },
});
