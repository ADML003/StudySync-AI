"use client";

import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";

interface UseThemeReturn {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "studysync-theme";

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Get system preference
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  }, []);

  // Resolve theme based on current setting
  const resolveTheme = useCallback(
    (currentTheme: Theme): "light" | "dark" => {
      if (currentTheme === "system") {
        return getSystemTheme();
      }
      return currentTheme;
    },
    [getSystemTheme]
  );

  // Apply theme to document
  const applyTheme = useCallback((themeToApply: "light" | "dark") => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (themeToApply === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }

      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          "content",
          themeToApply === "dark" ? "#000000" : "#ffffff"
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = themeToApply === "dark" ? "#000000" : "#ffffff";
        document.head.appendChild(meta);
      }
    }
  }, []);

  // Set theme and persist to localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);

      if (typeof window !== "undefined") {
        try {
          if (newTheme === "system") {
            localStorage.removeItem(THEME_STORAGE_KEY);
          } else {
            localStorage.setItem(THEME_STORAGE_KEY, newTheme);
          }
        } catch (error) {
          console.warn("Failed to save theme preference:", error);
        }
      }

      const resolved = resolveTheme(newTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    },
    [resolveTheme, applyTheme]
  );

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get saved theme from localStorage
      let savedTheme: Theme = "system";
      try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (saved && ["light", "dark"].includes(saved)) {
          savedTheme = saved;
        }
      } catch (error) {
        console.warn("Failed to load theme preference:", error);
      }

      setThemeState(savedTheme);
      const resolved = resolveTheme(savedTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleSystemThemeChange = () => {
        const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
        if (!currentTheme || currentTheme === "system") {
          const newResolved = getSystemTheme();
          setResolvedTheme(newResolved);
          applyTheme(newResolved);
        }
      };

      mediaQuery.addEventListener("change", handleSystemThemeChange);
      return () =>
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
    }
  }, []); // Remove circular dependencies

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };
}
