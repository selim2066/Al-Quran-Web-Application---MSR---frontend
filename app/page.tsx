import SurahCard from "@/components/surah/SurahCard";
import { getAllSurahs } from "@/services/api";

// This page is fully static — built once at deploy time
export const revalidate = false;

export default async function Home() {
  const surahs = await getAllSurahs();

  return (
    <main className="container mx-auto px-4 py-8">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          The Holy Quran
        </h1>
        <p className="text-muted-foreground">
          114 Surahs · 6236 Ayahs
        </p>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {surahs.map((surah) => (
          <SurahCard key={surah.id} surah={surah} />
        ))}
      </div>

    </main>
  );
}