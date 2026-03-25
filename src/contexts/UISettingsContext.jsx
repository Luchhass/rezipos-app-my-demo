"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const UISettingsContext = createContext(null);

function applyThemeToDocument(value) {
  const root = document.documentElement;

  if (value === "dark") {
    root.classList.add("dark");
    return;
  }

  if (value === "light") {
    root.classList.remove("dark");
    return;
  }

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.classList.toggle("dark", isDark);
}

function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

export function UISettingsProvider({
  children,
  initialTheme = "system",
  initialLanguage = "tr",
  initialOrdersViewMode = "grid",
}) {
  const [theme, setThemeState] = useState(initialTheme);
  const [language, setLanguageState] = useState(initialLanguage);
  const [ordersViewMode, setOrdersViewModeState] = useState(
    initialOrdersViewMode === "list" ? "list" : "grid"
  );

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const setTheme = (value) => {
    const nextValue =
      value === "dark" || value === "light" || value === "system"
        ? value
        : "system";

    setThemeState(nextValue);
    localStorage.setItem("app-theme", nextValue);
    setCookie("app-theme", nextValue);
    applyThemeToDocument(nextValue);
  };

  const setLanguage = (value) => {
    const nextValue = value === "en" ? "en" : "tr";
    setLanguageState(nextValue);
    localStorage.setItem("app-language", nextValue);
    setCookie("app-language", nextValue);
  };

  const setOrdersViewMode = (value) => {
    const nextValue = value === "list" ? "list" : "grid";
    setOrdersViewModeState(nextValue);
    localStorage.setItem("orders-view-mode", nextValue);
    setCookie("orders-view-mode", nextValue);
  };

  const contextValue = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      ordersViewMode,
      setOrdersViewMode,
    }),
    [theme, language, ordersViewMode]
  );

  return (
    <UISettingsContext.Provider value={contextValue}>
      {children}
    </UISettingsContext.Provider>
  );
}

export function useUISettings() {
  const context = useContext(UISettingsContext);

  if (!context) {
    throw new Error("useUISettings must be used within UISettingsProvider");
  }

  return context;
}