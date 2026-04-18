"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArabicFont, useSettings } from "@/hooks/useSettings";
import {
  Settings2,
  RotateCcw,
  BookOpen,
  Moon,
  Sun,
  Eye,
  Brain,
  Type,
  AlignJustify,
  Check,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";

// ─── Types ────────────────────────────────────────────────────────────────────

type ReadingMode = "default" | "focus" | "night" | "memorization";

interface ReadingModeConfig {
  id: ReadingMode;
  label: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FONT_OPTIONS: {
  label: string;
  value: ArabicFont;
  preview: string;
  description: string;
}[] = [
  {
    label: "Amiri",
    value: "font-arabic-amiri",
    preview: "بِسْمِ ٱللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    description: "Classical elegance",
  },
  {
    label: "Noto Naskh",
    value: "font-arabic-noto",
    preview: "بِسْمِ ٱللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    description: "Modern clarity",
  },
];

const READING_MODES: ReadingModeConfig[] = [
  {
    id: "default",
    label: "Default",
    description: "Balanced reading",
    icon: <BookOpen className="h-3.5 w-3.5" />,
    accent: "rgba(212,175,55,0.8)",
  },
  {
    id: "focus",
    label: "Focus",
    description: "Distraction free",
    icon: <Eye className="h-3.5 w-3.5" />,
    accent: "rgba(99,179,237,0.8)",
  },
  {
    id: "night",
    label: "Night",
    description: "Low eye strain",
    icon: <Moon className="h-3.5 w-3.5" />,
    accent: "rgba(167,139,250,0.8)",
  },
  {
    id: "memorization",
    label: "Memorize",
    description: "Large & spaced",
    icon: <Brain className="h-3.5 w-3.5" />,
    accent: "rgba(72,187,120,0.8)",
  },
];

// Reading mode → settings presets
const MODE_PRESETS: Record<ReadingMode, { arabicSize: number; translationSize: number }> = {
  default: { arabicSize: 28, translationSize: 16 },
  focus: { arabicSize: 30, translationSize: 15 },
  night: { arabicSize: 26, translationSize: 14 },
  memorization: { arabicSize: 38, translationSize: 18 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Custom slider — replaces the native input[type=range]
function PremiumSlider({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative group/slider">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}px`}
        className="sr-only"
        id={`slider-${label}`}
      />
      {/* Custom track */}
      <label
        htmlFor={`slider-${label}`}
        className="block cursor-pointer"
        aria-hidden="true"
      >
        <div
          className="relative h-1.5 w-full rounded-full bg-white/10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, x / rect.width));
            const raw = min + ratio * (max - min);
            const stepped = Math.round(raw / step) * step;
            onChange(Math.max(min, Math.min(max, stepped)));
          }}
        >
          {/* Fill */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-150"
            style={{
              width: `${percent}%`,
              background:
                "linear-gradient(90deg, rgba(212,175,55,0.6), rgba(212,175,55,1))",
            }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-amber-400 bg-[#1a1a1c] shadow-lg shadow-amber-400/20 transition-transform duration-150 group-hover/slider:scale-110"
            style={{ left: `${percent}%` }}
          />
        </div>
      </label>
    </div>
  );
}

// Section wrapper with consistent styling
function SettingsSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-white/[0.07] bg-white/[0.03] p-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/10 text-amber-400">
          {icon}
        </span>
        <h3 className="text-xs font-semibold uppercase tracking-[0.08em] text-white/40">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SettingsSidebar() {
  const { settings, setArabicFont, setArabicSize, setTranslationSize, resetSettings } =
    useSettings();
  const { theme, setTheme } = useTheme();
  const [activeMode, setActiveMode] = useState<ReadingMode>("default");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [savedPulse, setSavedPulse] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Saved pulse feedback ──────────────────────────────────────────────────
const triggerSaved = useCallback(() => {
  setSavedPulse(true);
  setTimeout(() => setSavedPulse(false), 1800);
}, []);

// ── Apply reading mode preset ─────────────────────────────────────────────
const applyMode = useCallback(
  (mode: ReadingMode) => {
    setActiveMode(mode);
    const preset = MODE_PRESETS[mode];
    setArabicSize(preset.arabicSize);
    setTranslationSize(preset.translationSize);
    if (mode === "night") setTheme("dark");
    triggerSaved();
  },
  [setArabicSize, setTranslationSize, setTheme]
);

// ── Reset with confirmation ───────────────────────────────────────────────
const handleReset = useCallback(() => {
  if (!showResetConfirm) {
    setShowResetConfirm(true);
    resetTimerRef.current = setTimeout(() => setShowResetConfirm(false), 3000);
    return;
  }
  if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  resetSettings();
  setActiveMode("default");
  setShowResetConfirm(false);
  triggerSaved();
}, [showResetConfirm, resetSettings, triggerSaved]);

  return (
    <Sheet>
      {/* ── Trigger ─────────────────────────────────────────────────────── */}
      <SheetTrigger
        aria-label="Open reader preferences"
        className="group/trigger inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-white/[0.08] bg-transparent text-white/45 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/85"
      >
        <Settings2 className="h-4 w-4 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/trigger:rotate-90" />
      </SheetTrigger>

      {/* ── Panel ───────────────────────────────────────────────────────── */}
      <SheetContent
        side="right"
        className="flex w-[360px] flex-col gap-0 overflow-hidden border-l border-white/[0.07] bg-[#111113] p-0 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold text-white/90 tracking-[-0.01em]">
              Reader Preferences
            </h2>
            <p className="text-[11px] text-white/35 mt-0.5">
              Personalize your reading experience
            </p>
          </div>
          {/* Auto-saved indicator */}
          <div
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-all duration-500
              ${
                savedPulse
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-400"
                  : "border-white/[0.06] bg-transparent text-white/20"
              }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                savedPulse ? "bg-emerald-400" : "bg-white/20"
              }`}
            />
            {savedPulse ? "Saved" : "Auto-saved"}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

          {/* ── Reading Mode Presets ───────────────────────────────────── */}
          <SettingsSection
            icon={<BookOpen className="h-3.5 w-3.5" />}
            title="Reading Mode"
          >
            <div className="grid grid-cols-2 gap-2">
              {READING_MODES.map((mode) => {
                const isActive = activeMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => applyMode(mode.id)}
                    className={`relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all duration-200
                      ${
                        isActive
                          ? "border-amber-400/30 bg-amber-400/[0.07]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                  >
                    <span
                      className={`transition-colors duration-200 ${
                        isActive ? "text-amber-400" : "text-white/40"
                      }`}
                    >
                      {mode.icon}
                    </span>
                    <div>
                      <p
                        className={`text-xs font-semibold transition-colors duration-200 ${
                          isActive ? "text-amber-400" : "text-white/70"
                        }`}
                      >
                        {mode.label}
                      </p>
                      <p className="text-[10px] text-white/30 leading-tight mt-0.5">
                        {mode.description}
                      </p>
                    </div>
                    {isActive && (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </SettingsSection>

          {/* ── Theme ─────────────────────────────────────────────────── */}
          <SettingsSection
            icon={<Sun className="h-3.5 w-3.5" />}
            title="Appearance"
          >
            <div className="flex rounded-lg border border-white/[0.07] bg-white/[0.03] p-1 gap-1">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTheme(t); triggerSaved(); }}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-[11px] font-medium capitalize transition-all duration-200
                    ${
                      theme === t
                        ? "bg-amber-400/15 text-amber-400 border border-amber-400/25"
                        : "text-white/35 hover:text-white/60"
                    }`}
                >
                  {t === "light" && <Sun className="h-3 w-3" />}
                  {t === "dark" && <Moon className="h-3 w-3" />}
                  {t === "system" && <AlignJustify className="h-3 w-3" />}
                  {t}
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* ── Arabic Font ────────────────────────────────────────────── */}
          <SettingsSection
            icon={<Type className="h-3.5 w-3.5" />}
            title="Arabic Font"
          >
            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => {
                const isActive = settings.arabicFont === font.value;
                return (
                  <button
                    key={font.value}
                    onClick={() => { setArabicFont(font.value); triggerSaved(); }}
                    className={`group/font relative w-full rounded-lg border p-3.5 text-right transition-all duration-250
                      ${
                        isActive
                          ? "border-amber-400/30 bg-amber-400/[0.06]"
                          : "border-white/[0.06] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"
                      }`}
                  >
                    {/* Font preview */}
                    <p
                      className={`text-2xl leading-loose transition-all duration-300 ${font.value} ${
                        isActive ? "text-white/90" : "text-white/50 group-hover/font:text-white/70"
                      }`}
                      dir="rtl"
                      lang="ar"
                    >
                      {font.preview}
                    </p>
                    {/* Meta row */}
                    <div className="mt-1.5 flex items-center justify-between">
                      <span
                        className={`text-[11px] font-medium transition-colors duration-200 ${
                          isActive ? "text-amber-400" : "text-white/30"
                        }`}
                      >
                        {font.label}
                      </span>
                      <span className="text-[10px] text-white/20">
                        {font.description}
                      </span>
                    </div>
                    {/* Active check */}
                    {isActive && (
                      <span className="absolute right-3 top-3 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400/20">
                        <Check className="h-2.5 w-2.5 text-amber-400" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </SettingsSection>

          {/* ── Typography Sizing ──────────────────────────────────────── */}
          <SettingsSection
            icon={<AlignJustify className="h-3.5 w-3.5" />}
            title="Typography"
          >
            {/* Live preview sandbox */}
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-white/20 mb-3">
                Live Preview
              </p>
              <p
                className={`text-right leading-loose text-white/85 transition-all duration-300 ${settings.arabicFont}`}
                style={{ fontSize: `${settings.arabicSize}px` }}
                dir="rtl"
                lang="ar"
              >
                ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
              </p>
              <p
                className="text-white/35 leading-relaxed transition-all duration-300"
                style={{ fontSize: `${settings.translationSize}px` }}
              >
                All praise is due to Allah, Lord of all the worlds
              </p>
            </div>

            {/* Arabic size slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/50">Arabic size</label>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-amber-400">
                  {settings.arabicSize}px
                </span>
              </div>
              <PremiumSlider
                min={16}
                max={40}
                step={2}
                value={settings.arabicSize}
                onChange={(v) => { setArabicSize(v); triggerSaved(); }}
                label="Arabic font size"
              />
              <div className="flex justify-between text-[10px] text-white/20">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Translation size slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-white/50">Translation size</label>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-mono text-amber-400">
                  {settings.translationSize}px
                </span>
              </div>
              <PremiumSlider
                min={12}
                max={24}
                step={1}
                value={settings.translationSize}
                onChange={(v) => { setTranslationSize(v); triggerSaved(); }}
                label="Translation font size"
              />
              <div className="flex justify-between text-[10px] text-white/20">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>
          </SettingsSection>
        </div>

        {/* ── Sticky footer ──────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.06] px-4 py-3">
          <button
            onClick={handleReset}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-medium transition-all duration-200
              ${
                showResetConfirm
                  ? "border-red-400/40 bg-red-400/10 text-red-400 hover:bg-red-400/15"
                  : "border-white/[0.07] bg-white/[0.03] text-white/40 hover:border-white/15 hover:bg-white/[0.06] hover:text-white/70"
              }`}
          >
            <RotateCcw
              className={`h-3.5 w-3.5 transition-transform duration-500 ${
                showResetConfirm ? "rotate-180" : ""
              }`}
            />
            {showResetConfirm
              ? "Click again to confirm reset"
              : "Reset to defaults"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}