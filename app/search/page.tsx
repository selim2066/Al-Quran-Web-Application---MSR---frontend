"use client";

import { useState, useEffect, useCallback } from "react";
import { searchAyahs } from "@/services/api";
import { AyahWithSurah } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, SearchX, BookOpen } from "lucide-react";
import Link from "next/link";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AyahWithSurah[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false); // tracks if user has searched

  // ── Debounced search ────────────────────────────────────────────────────────
  // Waits 500ms after user stops typing before hitting the API
  // Prevents a request on every single keystroke
  const handleSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setCount(null);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await searchAyahs(q.trim());
      console.log("Full response:", JSON.stringify(res));
  console.log("data:", res.data, "count:", res.count);
      setResults(res.data);
      setCount(res.count);
    } catch {
      setError("Something went wrong. Please try again.");
      setResults([]);
      setCount(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Set a 500ms delay before calling the API
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);

    // Cleanup: if user types again before 500ms, cancel previous timer
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">

      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Search Ayahs
        </h1>
        <p className="text-muted-foreground">
          Search through the English translation
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="e.g. mercy, patience, paradise..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
          autoFocus
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Result Count */}
      {count !== null && !loading && (
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">
            {count} {count === 1 ? "ayah" : "ayahs"} found
          </Badge>
          <span className="text-sm text-muted-foreground">
            for &quot;{query}&quot;
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty State — no results */}
      {searched && !loading && count === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <SearchX className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            No ayahs found for &quot;{query}&quot;
          </p>
          <p className="text-sm text-muted-foreground">
            Try a different word or phrase
          </p>
        </div>
      )}

      {/* Initial State — before any search */}
      {!searched && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
          <BookOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">
            Type at least 2 characters to search
          </p>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && !loading && (
        <div className="space-y-4">
          {results.map((ayah) => (
            <Link
              key={ayah.id}
              href={`/surah/${ayah.surahId}`}
              className="block"
            >
              <div className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer group">

                {/* Surah Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {ayah.surahId}
                    </span>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {ayah.surah.nameEnglish}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground font-arabic">
                      {ayah.surah.nameArabic}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      Ayah {ayah.ayahNumber}
                    </Badge>
                  </div>
                </div>

                {/* Arabic */}
                <p
                  className="font-arabic text-right text-xl leading-loose text-foreground"
                  dir="rtl"
                >
                  {ayah.arabic}
                </p>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Translation with highlight */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <HighlightedText text={ayah.translation} query={query} />
                </p>

              </div>
            </Link>
          ))}
        </div>
      )}

    </main>
  );
}

// ── Highlight matched text in translation ────────────────────────────────────
function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(`(${query.trim()})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-primary/20 text-foreground rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}