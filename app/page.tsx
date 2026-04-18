import SurahCard from "@/components/surah/SurahCard";
import { getAllSurahs } from "@/services/api";

export const revalidate = false;

export default async function Home() {
  const surahs = await getAllSurahs();

  return (
    <main className="relative min-h-screen bg-[#0F1A14] py-20">

      {/* ── Ambient geometric background ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 overflow-hidden">
        <svg
          width="100%"
          height="320"
          viewBox="0 0 1200 320"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="geo-hex"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="40,2 78,20 78,60 40,78 2,60 2,20"
                fill="none"
                stroke="rgba(201,168,76,0.07)"
                strokeWidth="0.8"
              />
              <polygon
                points="40,14 66,26 66,54 40,66 14,54 14,26"
                fill="none"
                stroke="rgba(201,168,76,0.035)"
                strokeWidth="0.5"
              />
              <circle
                cx="40"
                cy="40"
                r="2.5"
                fill="none"
                stroke="rgba(201,168,76,0.09)"
                strokeWidth="0.6"
              />
            </pattern>
            <radialGradient id="geo-fade" cx="50%" cy="0%" r="75%">
              <stop offset="0%" stopColor="#1C2B1C" />
              <stop offset="100%" stopColor="#0F1A14" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="320" fill="url(#geo-fade)" />
          <rect width="100%" height="320" fill="url(#geo-hex)" />
        </svg>
      </div>

      <div className="container relative mx-auto max-w-5xl px-4 pb-20 md:px-10">

        {/* ── Hero ── */}
        <header className="relative z-10 pb-8 pt-12 text-center">
          {/* Arabic title */}
          <p className="font-arabic mb-1 text-[32px] leading-tight text-[#C9A84C]">
            القرآن الكريم
          </p>

          {/* English title */}
          <h1 className="font-serif-lora mb-4 text-2xl font-semibold tracking-[0.06em] text-[#F5EDD6] md:text-[28px]">
            The Holy Quran
          </h1>

          {/* Gold ornament divider */}
          <div className="mx-auto mb-4 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polygon
                points="7,0 14,7 7,14 0,7"
                fill="#C9A84C"
                opacity="0.9"
              />
              <polygon
                points="7,3 11,7 7,11 3,7"
                fill="#0F1A14"
              />
            </svg>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
          </div>

          {/* Stats */}
          <p className="font-serif-lora text-[11.5px] uppercase tracking-[0.16em] text-[#A89B78]">
            <span className="font-semibold text-[#E8CC7A]">114</span> Surahs
            &nbsp;·&nbsp;
            <span className="font-semibold text-[#E8CC7A]">6,236</span> Ayahs
            &nbsp;·&nbsp;
            <span className="font-semibold text-[#E8CC7A]">30</span> Juz
          </p>
        </header>

        {/* ── Section label ── */}
        <div className="relative z-10 mb-5 flex items-center gap-3">
          <span className="font-serif-lora text-[11px] uppercase tracking-[0.16em] text-[#6B6050]">
            All Surahs
          </span>
          <div className="h-px flex-1 bg-[rgba(201,168,76,0.1)]" />
          <span className="font-serif-lora text-[11px] text-[#6B6050]">
            {surahs.length}
          </span>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {surahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>

      </div>
    </main>
  );
}

// import SurahCard from "@/components/surah/SurahCard";
// import { getAllSurahs } from "@/services/api";

// // This page is fully static — built once at deploy time
// export const revalidate = false;

// export default async function Home() {
//   const surahs = await getAllSurahs();

//   return (
//     <main className="container mx-auto px-4 py-8 md:px-14 ">

//       {/* Header */}
//       <div className="mb-8 text-center">
//         <h1 className="text-3xl font-bold text-foreground mb-2">
//           The Holy Quran
//         </h1>
//         <p className="text-muted-foreground">
//           114 Surahs · 6236 Ayahs
//         </p>
//       </div>

//       {/* Surah Grid */}
//       <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
//         {surahs.map((surah) => (
//           <SurahCard key={surah.id} surah={surah} />
//         ))}
//       </div>

//     </main>
//   );
// }