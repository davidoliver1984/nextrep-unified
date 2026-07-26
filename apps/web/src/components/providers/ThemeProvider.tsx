import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { ThemeContextValue, ThemeMode } from "@/types/theme";
import { ThemeContext } from "@/components/providers/theme-context";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");

    return () => root.classList.remove("dark");
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  const value = useMemo<ThemeContextValue>(() => {
    return { theme, setTheme, toggleTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
