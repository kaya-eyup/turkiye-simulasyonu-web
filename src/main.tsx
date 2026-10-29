import { StrictMode } from "react";
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

// Windows'taki Chrome/Edge bayrak emojisi çizemez, "TR" gibi harf gösterir.
// Tarayıcı çizemiyorsa sadece bayrakları içeren küçük bir yazı tipi ekler; çizebiliyorsa hiçbir şey yapmaz.
polyfillCountryFlagEmojis("Twemoji Country Flags", flagFontUrl);
// Öğe oyları sunucuya taşındı; tarayıcıda kalan eski kayıt artık okunmuyor.
// Birkaç sürüm sonra bu satır da silinecek (eski kayıtlar o zamana kadar temizlenmiş olur).
try {
  localStorage.removeItem("tsim:votes:v1");
} catch {
  // Depolama kapalıysa silinecek bir şey de yok
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
