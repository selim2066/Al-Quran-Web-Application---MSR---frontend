"use client";

import { Surah } from "@/types";
import Link from "next/link";
import { useRef } from "react";

interface Props {
  surah: Surah;
}

export default function SurahCard({ surah }: Props) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x.toFixed(1)}%`);
    el.style.setProperty("--my", `${y.toFixed(1)}%`);
  };

  const isMeccan = surah.revelation === "Meccan";

  return (
    <Link
      ref={cardRef}
      href={`/surah/${surah.id}`}
      onMouseMove={handleMouseMove}
      className={[
        // base
        "surah-card surah-card-enter",
        "group relative block overflow-hidden rounded-[14px]",
        "border p-4",
        "bg-[#162010]",
        "border-[rgba(201,168,76,0.12)]",
        // transition
        "transition-all duration-300 ease-out",
        // hover lift + scale
        "hover:-translate-y-[3px] hover:scale-[1.012]",
        "hover:border-[rgba(201,168,76,0.4)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,168,76,0.18),0_4px_16px_rgba(201,168,76,0.12)]",
        // active press
        "active:translate-y-[-1px] active:scale-[1.004] active:duration-75",
        // focus ring
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#C9A84C]",
      ].join(" ")}
    >
      {/* Radial mouse-follow glow */}
      <div
        className="surah-card-glow pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Shimmer border sweep */}
      <div
        className="surah-card-shimmer pointer-events-none absolute inset-[-1px] rounded-[14px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Card content */}
      <div className="relative z-10 flex items-center justify-between gap-3">

        {/* Left — number + name */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Octagonal number badge */}
          <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 38 38"
              className="absolute inset-0 h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="19,2 33,8 36,22 29,34 9,34 2,22 5,8"
                fill="rgba(201,168,76,0.08)"
                stroke="rgba(201,168,76,0.35)"
                strokeWidth="0.8"
              />
            </svg>
            <span className="relative z-10 font-arabic text-xs font-bold text-[#C9A84C]">
              {surah.id}
            </span>
          </div>

          {/* English name + meaning */}
          <div className="min-w-0">
            <h3 className="font-serif-lora truncate text-sm font-semibold text-[#F5EDD6] transition-colors duration-200 group-hover:text-[#E8CC7A]">
              {surah.nameEnglish}
            </h3>
            <p className="font-serif-lora truncate text-[11.5px] italic text-[#6B6050]">
              {surah.nameMeaning}
            </p>
          </div>
        </div>

        {/* Right — Arabic + meta */}
        <div className="flex flex-shrink-0 flex-col items-end gap-[5px]">
          <span
            className="font-arabic text-xl leading-snug text-[#F5EDD6] transition-colors duration-200 group-hover:text-[#E8CC7A]"
            dir="rtl"
          >
            {surah.nameArabic}
          </span>

          <div className="flex items-center gap-1.5">
            {/* Revelation badge */}
            <span
              className={[
                "rounded-full border px-2 py-0.5 font-serif-lora text-[10px]",
                "font-medium uppercase tracking-wide",
                isMeccan
                  ? "border-[rgba(201,168,76,0.25)] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]"
                  : "border-[rgba(27,107,74,0.3)] bg-[rgba(27,107,74,0.15)] text-[#5DB88A]",
              ].join(" ")}
            >
              {surah.revelation}
            </span>

            {/* Ayah count */}
            <span className="font-serif-lora text-[10.5px] text-[#6B6050]">
              {surah.ayahCount} ayahs
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

// import { Badge } from "@/components/ui/badge";
// import { Surah } from "@/types";
// import Link from "next/link";

// interface Props {
//   surah: Surah;
// }

// export default function SurahCard({ surah }: Props) {
//   return (
//     <Link href={`/surah/${surah.id}`}>
//       <div className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/50 hover:shadow-md cursor-pointer">

//         {/* Left — Number + English Info */}
//         <div className="flex items-center gap-4">
//           {/* Surah Number */}
//           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
//             {surah.id}
//           </div>

//           {/* English Name + Meaning */}
//           <div>
//             <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
//               {surah.nameEnglish}
//             </h3>
//             <p className="text-sm text-muted-foreground">{surah.nameMeaning}</p>
//           </div>
//         </div>

//         {/* Right — Arabic Name + Meta */}
//         <div className="flex flex-col items-end gap-1">
//           <span className="font-arabic text-xl text-foreground">
//             {surah.nameArabic}
//           </span>
//           <div className="flex items-center gap-2">
//             <Badge variant="secondary" className="text-xs">
//               {surah.revelation}
//             </Badge>
//             <span className="text-xs text-muted-foreground">
//               {surah.ayahCount} ayahs
//             </span>
//           </div>
//         </div>

//       </div>
//     </Link>
//   );
// }