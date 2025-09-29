"use client";

import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "dropdown";
  className?: string;
}

export default function ThemeToggle({
  showLabel = false,
  size = "md",
  variant = "button",
  className = "",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  if (variant === "dropdown") {
    return (
      <div className={`relative ${className}`}>
        <div className="flex flex-col space-y-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 shadow-lg">
          {[
            { key: "light", icon: Sun, label: "Light" },
            { key: "dark", icon: Moon, label: "Dark" },
            { key: "system", icon: Monitor, label: "System" },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setTheme(key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                theme === key
                  ? "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
              aria-label={`Switch to ${label.toLowerCase()} theme`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {theme === key && (
                <motion.div
                  layoutId="theme-indicator"
                  className="w-2 h-2 bg-teal-500 rounded-full ml-auto"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Button variant (default)
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        onClick={toggleTheme}
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${
          resolvedTheme === "light" ? "dark" : "light"
        } theme`}
      >
        <motion.div
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {resolvedTheme === "light" ? (
            <Sun className={`${iconSizes[size]} text-yellow-500`} />
          ) : (
            <Moon className={`${iconSizes[size]} text-blue-400`} />
          )}
        </motion.div>
      </motion.button>

      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {resolvedTheme}
        </span>
      )}
    </div>
  );
}
