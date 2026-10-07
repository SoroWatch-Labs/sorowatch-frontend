"use client";

import { useEffect, useState } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // The real theme is applied before paint by the script in <head>;
  // read it back so the button state matches.
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    setIsDark(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable: the theme still changes, it just won't persist.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isDark}
      onClick={toggle}
    >
      Dark mode
    </button>
  );
}
