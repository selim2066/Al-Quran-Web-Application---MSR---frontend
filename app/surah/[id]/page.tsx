// import AyahCard from "@/components/ayah/AyahCard";
// import AyahList from "@/components/ayah/AyahList";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { getAllSurahs, getAyahsBySurah } from "@/services/api";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Link from "next/link";

// // Tells Next.js which pages to pre-render at build time
// // Generates /surah/1, /surah/2, ... /surah/114 statically
// export async function generateStaticParams() {
//   return Array.from({ length: 114 }, (_, i) => ({
//     id: String(i + 1),
//   }));
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const surahs = await getAllSurahs();
//   const surah = surahs.find((s) => s.id === parseInt(id));

//   return {
//     title: surah ? `${surah.nameEnglish} — Quran` : "Surah — Quran",
//   };
// }

// export default async function SurahPage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const surahId = parseInt(id);

//   // Fetch both in parallel — faster
//   const [ayahs, surahs] = await Promise.all([
//     getAyahsBySurah(id),
//     getAllSurahs(),
//   ]);

//   const surah = surahs.find((s) => s.id === surahId);
//   const prevSurah = surahs.find((s) => s.id === surahId - 1);
//   const nextSurah = surahs.find((s) => s.id === surahId + 1);

//   if (!surah) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center">
//         <p className="text-muted-foreground">Surah not found.</p>
//         <Link href="/" className="text-primary underline mt-4 inline-block">
//           Back to home
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <main className="container mx-auto px-4 py-8 max-w-3xl">
//       {/* Back Button */}
//       <Link
//         href="/"
//         className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
//       >
//         <ChevronLeft className="h-4 w-4" />
//         All Surahs
//       </Link>

//       {/* Surah Header */}
//       <div className="mb-8 rounded-xl border border-border bg-card p-6 text-center space-y-3">
//         <p className="font-arabic-amiri text-4xl text-foreground" dir="rtl">
//           {surah.nameArabic}
//         </p>
//         <h1 className="text-2xl font-bold text-foreground">
//           {surah.nameEnglish}
//         </h1>
//         <p className="text-muted-foreground">{surah.nameMeaning}</p>
//         <div className="flex items-center justify-center gap-3">
//           <Badge variant="secondary">{surah.revelation}</Badge>
//           <span className="text-sm text-muted-foreground">
//             {surah.ayahCount} Ayahs
//           </span>
//         </div>
//       </div>

//       {/* Bismillah — shown for all surahs except Al-Tawbah (9) */}
//       {surahId !== 9 && (
//         <div className="mb-6 text-center">
//           <p className="font-arabic-amiri text-2xl text-foreground" dir="rtl">
//             بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
//           </p>
//           <p className="text-xs text-muted-foreground mt-1">
//             In the name of Allah, the Most Gracious, the Most Merciful
//           </p>
//         </div>
//       )}

//       {/* Ayah List */}
//       {/* 
//         Default font/size here — settings sidebar will override
//         via CSS variables set on <html> in Step 6 
//       */}
//       <AyahList ayahs={ayahs} />

//       {/* Prev / Next Navigation */}
//       <div className="mt-10 flex items-center justify-between">
//         {prevSurah ? (
//           <Link href={`/surah/${prevSurah.id}`}>
//             <Button variant="outline" className="flex items-center gap-2">
//               <ChevronLeft className="h-4 w-4" />
//               <span className="hidden sm:inline">{prevSurah.nameEnglish}</span>
//               <span className="sm:hidden">Previous</span>
//             </Button>
//           </Link>
//         ) : (
//           <div />
//         )}

//         <span className="text-sm text-muted-foreground">{surahId} / 114</span>

//         {nextSurah ? (
//           <Link href={`/surah/${nextSurah.id}`}>
//             <Button variant="outline" className="flex items-center gap-2">
//               <span className="hidden sm:inline">{nextSurah.nameEnglish}</span>
//               <span className="sm:hidden">Next</span>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </Link>
//         ) : (
//           <div />
//         )}
//       </div>
//     </main>
//   );
// }


import SurahPageClient from "@/components/surah/SurahPageClient";
import { getAllSurahs, getAyahsBySurah } from "@/services/api";
// import SurahPageClient from "@/components/surah/SurahPageClient";
import Link from "next/link";

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: String(i + 1),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const surahs = await getAllSurahs();
  const surah = surahs.find((s) => s.id === parseInt(id));
  return {
    title: surah ? `${surah.nameEnglish} — Al-Quran` : "Surah — Al-Quran",
  };
}

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const surahId = parseInt(id);

  const [ayahs, surahs] = await Promise.all([
    getAyahsBySurah(id),
    getAllSurahs(),
  ]);

  const surah = surahs.find((s) => s.id === surahId);
  const prevSurah = surahs.find((s) => s.id === surahId - 1);
  const nextSurah = surahs.find((s) => s.id === surahId + 1);

  if (!surah) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Surah not found.</p>
        <Link href="/" className="text-primary underline mt-4 inline-block">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <SurahPageClient
      surah={surah}
      ayahs={ayahs}
      prevSurah={prevSurah ?? null}
      nextSurah={nextSurah ?? null}
      surahId={surahId}
    />
  );
}