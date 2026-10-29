import { StrictMode } from "react";
// Windows'taki Chrome/Edge bayrak emojisi çizemez, "TR" gibi harf gösterir.
// Tarayıcı çizemiyorsa sadece bayrakları içeren küçük bir yazı tipi ekler; çizebiliyorsa hiçbir şey yapmaz.
polyfillCountryFlagEmojis("Twemoji Country Flags", flagFontUrl);
import { createRoot } from "react-dom/client";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/600.css";
import "@fontsource/barlow-condensed/600.css";
import "@fontsource/barlow-condensed/700.css";
import "./index.css";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
// ?url: Vite yazı tipini kendi çıktısına kopyalar ve adresini verir (CDN'e gitmez)
import flagFontUrl from "country-flag-emoji-polyfill/dist/TwemojiCountryFlags.woff2?url";
import { RouterProvider } from "react-router";
import { router } from "./app/router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./app/queryClient";
import { ThemeProvider } from "./features/theme/ThemeProvider";
import { VotesProvider } from "./features/votes/VotesProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <VotesProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </VotesProvider>
    </ThemeProvider>
  </StrictMode>,
);
