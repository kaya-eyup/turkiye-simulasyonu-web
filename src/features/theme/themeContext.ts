import { createContext, useContext } from "react";
import { z } from "zod";

export const THEME_STORAGE_KEY = "tsim:theme:v1";
export const themeSchema = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof themeSchema>;

type ThemeContextValue = { 
  theme: Theme; 
  toggleTheme: () => void 
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (value === null) {
    throw new Error("useTheme, ThemeProvider içinde kullanılmalı");
  }
  return value;
}