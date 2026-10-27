import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || "light");
  const [manual, setManual] = useState(() => {
    try { return !!localStorage.getItem("theme"); } catch { return false; }
  });

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  // Follow the device while the user has not chosen manually
  useEffect(() => {
    if (manual || !window.matchMedia) return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const on = (e) => setTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [manual]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setManual(true);
    try { localStorage.setItem("theme", next); } catch { /* storage blocked: still works for this visit */ }
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
