"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AyahList from "@/components/ayah/AyahList";
import { cn } from "@/lib/utils";

type Surah = {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameMeaning: string;
  revelation: string;
  ayahCount: number;
};

type Ayah = {
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
};

interface Props {
  surah: Surah;
  ayahs: Ayah[];
  prevSurah: Surah | null;
  nextSurah: Surah | null;
  surahId: number;
}

function GeometricCorner({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
    >
      <path d="M48 4L92 48L48 92L4 48Z" stroke="currentColor" strokeWidth="0.7" />
      <path d="M48 16L80 48L48 80L16 48Z" stroke="currentColor" strokeWidth="0.5" />
      <path d="M48 28L68 48L48 68L28 48Z" stroke="currentColor" strokeWidth="0.4" />
      <path d="M48 38L58 48L48 58L38 48Z" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function StarOrnament({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      className={className}
      style={style}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 0.5L7.3 4.4H11.4L8.1 6.7L9.3 10.6L6 8.3L2.7 10.6L3.9 6.7L0.6 4.4H4.7Z" />
    </svg>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
};

function NavCard({
  surah,
  direction,
}: {
  surah: Surah;
  direction: "prev" | "next";
}) {
  const isPrev = direction === "prev";
  return (
    <Link href={`/surah/${surah.id}`} className="flex-1 min-w-0">
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5",
          "transition-all duration-200",
          !isPrev && "flex-row-reverse text-right"
        )}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-gold-glow)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
      >
        <div className="flex-shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-[--color-gold]">
          {isPrev ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </div>
        <div className={cn("min-w-0", !isPrev && "text-right")}>
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-0.5">
            {isPrev ? "Previous" : "Next"}
          </p>
          <p className="text-sm font-medium text-foreground truncate">
            {surah.nameEnglish}
          </p>
          <p
            className="font-arabic-amiri text-base text-muted-foreground leading-loose"
            dir="rtl"
          >
            {surah.nameArabic}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function SurahPageClient({
  surah,
  ayahs,
  prevSurah,
  nextSurah,
  surahId,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  });
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <>
      <motion.div
        className="reading-progress"
        style={{ scaleX }}
        aria-hidden="true"
      />

      <main ref={contentRef} className="container mx-auto px-4 py-10 max-w-2xl">
        <motion.div variants={stagger} initial="hidden" animate="show">

          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="group inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.12em] uppercase text-muted-foreground mb-10 transition-colors duration-150 hover:text-[--color-gold]"
            >
              <ChevronLeft className="h-3 w-3 transition-transform duration-150 group-hover:-translate-x-0.5" />
              All Surahs
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative mb-8 rounded-2xl border border-border bg-card p-8 pt-9 text-center overflow-hidden"
          >
            <GeometricCorner className="absolute -top-3 -left-3 pointer-events-none opacity-[0.08] text-[--color-gold]" />
            <GeometricCorner className="absolute -bottom-3 -right-3 pointer-events-none opacity-[0.08] rotate-180 text-[--color-gold]" />

            <p
              className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5"
              style={{ color: "var(--color-gold)" }}
            >
              Surah · {surahId}
            </p>

            <p
              className="font-arabic-amiri text-5xl md:text-6xl text-foreground leading-[1.6] mb-3"
              dir="rtl"
            >
              {surah.nameArabic}
            </p>

            <h1 className="text-xl font-semibold tracking-tight text-foreground mb-1">
              {surah.nameEnglish}
            </h1>

            <p className="text-sm italic text-muted-foreground font-serif-lora mb-6">
              {surah.nameMeaning}
            </p>

            <div className="flex items-center justify-center gap-3 mb-6" aria-hidden="true">
              <div className="h-px w-14 bg-border" />
              <div
                className="w-1.5 h-1.5 rotate-45 flex-shrink-0"
                style={{ background: "var(--color-gold)" }}
              />
              <div className="h-px w-14 bg-border" />
            </div>

            <div className="flex items-center justify-center gap-2">
              <Badge
                variant="outline"
                className="text-[11px] tracking-wide"
                style={{
                  borderColor: "var(--color-quran-border-hover)",
                  color: "var(--color-gold)",
                  background: "var(--color-gold-dim)",
                }}
              >
                {surah.revelation}
              </Badge>
              <Badge variant="secondary" className="text-[11px] tracking-wide">
                {surah.ayahCount} Ayahs
              </Badge>
            </div>
          </motion.div>

          {surahId !== 9 && (
            <motion.div variants={fadeUp} className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4" aria-hidden="true">
                <div className="h-px flex-1 max-w-[80px] bg-border" />
                <StarOrnament style={{ color: "var(--color-gold)" }} />
                <div className="h-px flex-1 max-w-[80px] bg-border" />
              </div>

              <p
                className="font-arabic-amiri text-[2rem] md:text-[2.25rem] text-foreground leading-[1.8] mb-2.5"
                dir="rtl"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-[10px] font-medium tracking-[0.12em] uppercase text-muted-foreground">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </motion.div>
          )}

          <motion.div variants={fadeUp}>
            <AyahList ayahs={ayahs} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center justify-between gap-3"
          >
            {prevSurah ? (
              <NavCard surah={prevSurah} direction="prev" />
            ) : (
              <div className="flex-1" />
            )}

            <span className="text-[11px] tracking-widest text-muted-foreground flex-shrink-0">
              {surahId}&thinsp;/&thinsp;114
            </span>

            {nextSurah ? (
              <NavCard surah={nextSurah} direction="next" />
            ) : (
              <div className="flex-1" />
            )}
          </motion.div>

        </motion.div>
      </main>
    </>
  );
}