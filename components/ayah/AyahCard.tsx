import { Ayah } from "@/types";

interface Props {
  ayah: Ayah;
  arabicFont: string;
  arabicSize: number;
  translationSize: number;
}

export default function AyahCard({
  ayah,
  arabicFont,
  arabicSize,
  translationSize,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">

      {/* Ayah Number Badge */}
      <div className="flex justify-between items-center">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {ayah.ayahNumber}
        </span>
        <span className="text-xs text-muted-foreground">
          Verse {ayah.ayahNumber}
        </span>
      </div>

      {/* Arabic Text */}
      <p
        className={`text-right leading-loose text-foreground ${arabicFont}`}
        style={{ fontSize: `${arabicSize}px` }}
        dir="rtl"
      >
        {ayah.arabic}
      </p>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Translation */}
      <p
        className="text-muted-foreground leading-relaxed"
        style={{ fontSize: `${translationSize}px` }}
      >
        {ayah.translation}
      </p>

    </div>
  );
}