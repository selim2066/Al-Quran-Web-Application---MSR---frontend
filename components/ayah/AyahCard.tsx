"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Settings } from "@/hooks/useSettings";

type Ayah = {
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
};

interface Props {
  ayah: Ayah;
  isActive: boolean;
  onSelect: () => void;
  settings: Settings;
}

export default function AyahCard({ ayah, isActive, onSelect, settings }: Props) {
  return (
    <motion.div
      onClick={onSelect}
      whileTap={{ scale: 0.999 }}
      className={cn(
        "relative flex gap-4 px-4 py-5 cursor-pointer select-none",
        "transition-colors duration-150",
        "hover:bg-accent/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
        isActive ? "ayah-active-bar" : "border-l-2 border-l-transparent"
      )}
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-label={`Ayah ${ayah.ayahNumber}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {/* Ayah number badge */}
      <div className="flex-shrink-0 pt-[6px]">
        <div
          className={cn(
            "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium border transition-all duration-200",
            isActive ? "ayah-badge-active" : "ayah-badge-idle"
          )}
        >
          {ayah.ayahNumber}
        </div>
      </div>

      {/* Ayah content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* ✅ Arabic text — font class + size from settings */}
        <p
          className={cn(
            "leading-[2.1] text-foreground text-right transition-all duration-300",
            settings.arabicFont
          )}
          style={{ fontSize: `${settings.arabicSize}px` }}
          dir="rtl"
          lang="ar"
        >
          {ayah.arabic}
        </p>

        {/* ✅ Translation size from settings */}
        <p
          className="leading-[1.75] transition-all duration-300"
          style={{
            fontSize: `${settings.translationSize}px`,
            color: isActive
              ? "var(--color-quran-text-muted)"
              : "var(--color-muted-foreground)",
          }}
        >
          {ayah.translation}
        </p>
      </div>

      {isActive && (
        <motion.div
          layoutId="reading-indicator"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-7 rounded-full"
          style={{ background: "var(--color-gold)" }}
          initial={{ opacity: 0, scaleY: 0.3 }}
          animate={{ opacity: 1, scaleY: 1 }}
          exit={{ opacity: 0, scaleY: 0.3 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </motion.div>
  );
}