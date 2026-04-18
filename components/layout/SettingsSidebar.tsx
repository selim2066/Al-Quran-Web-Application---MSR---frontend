"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArabicFont, useSettings } from "@/hooks/useSettings";
import { RotateCcw, Settings2 } from "lucide-react";

const FONT_OPTIONS: { label: string; value: ArabicFont; preview: string }[] = [
  {
    label: "Amiri",
    value: "font-arabic-amiri",
    preview: "بِسْمِ ٱللَّهِ",
  },
  {
    label: "Noto Naskh",
    value: "font-arabic-noto",
    preview: "بِسْمِ ٱللَّهِ",
  },
];

export default function SettingsSidebar() {
  const {
    settings,
    setArabicFont,
    setArabicSize,
    setTranslationSize,
    resetSettings,
  } = useSettings();

  return (
    <Sheet>
      {/* ← No asChild, just wrap Button inside trigger */}
      <SheetTrigger
        aria-label="Open settings"
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Settings2 className="h-4 w-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Display Settings
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {/* ── Arabic Font Selection ───────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Arabic Font
              </h3>
              <Badge variant="secondary" className="text-xs">
                {
                  FONT_OPTIONS.find((f) => f.value === settings.arabicFont)
                    ?.label
                }
              </Badge>
            </div>

            <div className="space-y-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setArabicFont(font.value)}
                  className={`w-full rounded-lg border p-3 text-right transition-all duration-150
                    ${
                      settings.arabicFont === font.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <p
                    className={`text-xl leading-loose text-foreground ${font.value}`}
                    dir="rtl"
                  >
                    {font.preview}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    {font.label}
                  </p>
                </button>
              ))}
            </div>
          </section>

          <div className="border-t border-border" />

          {/* ── Arabic Font Size ────────────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Arabic Size
              </h3>
              <Badge variant="secondary" className="text-xs">
                {settings.arabicSize}px
              </Badge>
            </div>

            <p
              className={`text-right leading-loose text-foreground ${settings.arabicFont}`}
              style={{ fontSize: `${settings.arabicSize}px` }}
              dir="rtl"
            >
              ٱلْحَمْدُ لِلَّهِ
            </p>

            <input
              type="range"
              min={16}
              max={40}
              step={2}
              value={settings.arabicSize}
              onChange={(e) => setArabicSize(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>16px</span>
              <span>40px</span>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* ── Translation Font Size ───────────────────────────────────── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Translation Size
              </h3>
              <Badge variant="secondary" className="text-xs">
                {settings.translationSize}px
              </Badge>
            </div>

            <p
              className="text-muted-foreground leading-relaxed"
              style={{ fontSize: `${settings.translationSize}px` }}
            >
              In the name of Allah
            </p>

            <input
              type="range"
              min={12}
              max={24}
              step={1}
              value={settings.translationSize}
              onChange={(e) => setTranslationSize(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12px</span>
              <span>24px</span>
            </div>
          </section>

          <div className="border-t border-border" />

          {/* ── Reset ───────────────────────────────────────────────────── */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={resetSettings}
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
