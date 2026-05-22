"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem("careeros-theme");
    const initialDark = saved ? saved === "dark" : true;
    setDarkMode(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  function toggleTheme() {
    setDarkMode((current) => {
      const next = !current;
      window.localStorage.setItem("careeros-theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  }

  return (
    <Button onClick={toggleTheme} className="gap-2 bg-white/10 text-slate-100 hover:bg-white/15 dark:bg-white/10 dark:text-slate-100">
      {darkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      {darkMode ? "Light mode" : "Dark mode"}
    </Button>
  );
}
