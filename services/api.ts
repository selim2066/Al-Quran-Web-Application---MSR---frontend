import { ApiResponse, AyahWithSurah, SearchResponse, Surah, Ayah } from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL;

// ─── Surah ────────────────────────────────────────────────────────────────────

export async function getAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/api/surahs`, {
    cache: "force-cache", // SSG — fetch once at build time
  });

  if (!res.ok) throw new Error("Failed to fetch surahs");

  const json: ApiResponse<Surah[]> = await res.json();
  return json.data;
}

// ─── Ayah ─────────────────────────────────────────────────────────────────────

export async function getAyahsBySurah(surahId: string): Promise<Ayah[]> {
  const res = await fetch(`${BASE}/api/surahs/${surahId}/ayahs`, {
    cache: "force-cache", // SSG — pre-rendered at build time
  });

  if (!res.ok) throw new Error(`Failed to fetch ayahs for surah ${surahId}`);

  const json: ApiResponse<Ayah[]> = await res.json();
  return json.data;
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchAyahs(query: string): Promise<SearchResponse> {
  const res = await fetch(
    `${BASE}/api/search?q=${encodeURIComponent(query)}`,
    { cache: "no-store" } // CSR — always fresh
  );

  if (!res.ok) throw new Error("Search failed");

  return res.json();
}