"use client";

import { useState, useEffect, useRef } from "react";

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
  } catch {
    // corrupted — fall through
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  // useRef instead of useState — no re-render, no effect setState error
  const isFirstRender = useRef(true);

  // Save to localStorage on every settings change, skip first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // don't save on initial load
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage unavailable
    }
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
    } catch {
      // ignore
    }
  };

  return {
    settings,
    setArabicFont,
    setArabicSize,
    setTranslationSize,
    resetSettings,
  };
}