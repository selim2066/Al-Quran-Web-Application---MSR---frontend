"use client";

import { useSettings } from "@/hooks/useSettings";
import AyahCard from "@/components/ayah/AyahCard";
import { Ayah } from "@/types";

interface Props {
  ayahs: Ayah[];
}

export default function AyahList({ ayahs }: Props) {
  const { settings } = useSettings();

  return (
    <div className="space-y-4">
      {ayahs.map((ayah) => (
        <AyahCard
          key={ayah.id}
          ayah={ayah}
          arabicFont={settings.arabicFont}
          arabicSize={settings.arabicSize}
          translationSize={settings.translationSize}
        />
      ))}
    </div>
  );
}