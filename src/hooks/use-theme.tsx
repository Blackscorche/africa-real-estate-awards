import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "area-theme";
const EVENT = "area-theme-change";

/** Runs in <head> before paint so the saved theme never flashes. Defaults to light mode. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${KEY}");if(t!=="light"&&t!=="dark"){t="light"}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t}catch(e){}})();`;

function readTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(t: Theme) {
  const r = document.documentElement;
  r.classList.remove("light", "dark");
  r.classList.add(t);
  r.style.colorScheme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* storage blocked */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const sync = () => setTheme(readTheme());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return { theme, toggle: () => applyTheme(theme === "dark" ? "light" : "dark") };
}
