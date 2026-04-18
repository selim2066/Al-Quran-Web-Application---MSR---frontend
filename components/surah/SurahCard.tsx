import { Badge } from "@/components/ui/badge";
import { Surah } from "@/types";
import Link from "next/link";

interface Props {
  surah: Surah;
}

export default function SurahCard({ surah }: Props) {
  return (
    <Link href={`/surah/${surah.id}`}>
      <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer">

        {/* Left — Number + English Info */}
        <div className="flex items-center gap-4">
          {/* Surah Number */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {surah.id}
          </div>

          {/* English Name + Meaning */}
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {surah.nameEnglish}
            </h3>
            <p className="text-sm text-muted-foreground">{surah.nameMeaning}</p>
          </div>
        </div>

        {/* Right — Arabic Name + Meta */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-arabic text-xl text-foreground">
            {surah.nameArabic}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {surah.revelation}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {surah.ayahCount} ayahs
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}