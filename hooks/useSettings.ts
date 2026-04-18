"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

export type ArabicFont = "font-arabic-amiri" | "font-arabic-noto";

export interface Settings {
  arabicFont: ArabicFont;
  arabicSize: number;
  translationSize: number;
}

const DEFAULT_SETTINGS: Settings = {
  arabicFont: "font-arabic-amiri",
  arabicSize: 24,
  translationSize: 16,
};

const STORAGE_KEY = "quran-settings";

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_SETTINGS;
}

interface SettingsContextValue {
  settings: Settings;
  setArabicFont: (font: ArabicFont) => void;
  setArabicSize: (size: number) => void;
  setTranslationSize: (size: number) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const setArabicFont = (font: ArabicFont) =>
    setSettings((prev) => ({ ...prev, arabicFont: font }));

  const setArabicSize = (size: number) =>
    setSettings((prev) => ({ ...prev, arabicSize: size }));

  const setTranslationSize = (size: number) =>
    setSettings((prev) => ({ ...prev, translationSize: size }));

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const value: SettingsContextValue = {
    settings,
    setArabicFont,
    setArabicSize,
    setTranslationSize,
    resetSettings,
  };

return React.createElement(
  SettingsContext.Provider,
  { value: value },
  children
);
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}