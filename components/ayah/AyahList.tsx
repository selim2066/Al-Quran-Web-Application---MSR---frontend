"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AyahCard from "./AyahCard";
import { useSettings } from "@/hooks/useSettings";

type Ayah = {
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
};

interface Props {
  ayahs: Ayah[];
}

export default function AyahList({ ayahs }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // ✅ subscribe here — re-renders AyahList (and all AyahCards) on any setting change
  const { settings } = useSettings();

  const handleSelect = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      className="divide-y divide-border rounded-xl border border-border overflow-hidden"
      role="list"
      aria-label="Ayah list"
    >
      {ayahs.map((ayah, index) => (
        <motion.div
          key={`${ayah.surahId}-${ayah.ayahNumber}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: Math.min(index * 0.035, 0.6),
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          role="listitem"
        >
          <AyahCard
            ayah={ayah}
            isActive={activeIndex === index}
            onSelect={() => handleSelect(index)}
            settings={settings}
          />
        </motion.div>
      ))}
    </div>
  );
}