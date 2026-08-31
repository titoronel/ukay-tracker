"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const icons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const nextTheme = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
  const Icon = icons[theme] || Monitor;

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
      title={`Theme: ${theme}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}