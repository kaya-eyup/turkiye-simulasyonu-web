import { useTheme } from "./themeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      className="btn w-9 px-0"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
