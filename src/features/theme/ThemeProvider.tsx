import { useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../../shared/hooks/useLocalStorage";
import { THEME_STORAGE_KEY, themeSchema, ThemeContext } from "./themeContext";

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage(THEME_STORAGE_KEY, themeSchema, getSystemTheme);

  // Yan etki (Side effect): React dışı bir mutasyon (DOM'a müdahale)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Context optimizasyonu: Provider render olsa bile 'theme' değişmedikçe referans aynı kalır
  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext value={value}>
      {children}
    </ThemeContext>
  );
}