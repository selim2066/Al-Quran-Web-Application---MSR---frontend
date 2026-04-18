export interface Surah {
  id: number;
  nameArabic: string;
  nameEnglish: string;
  nameMeaning: string;
  revelation: string;
  ayahCount: number;
}

export interface Ayah {
  id: number;
  surahId: number;
  ayahNumber: number;
  arabic: string;
  translation: string;
}

export interface AyahWithSurah extends Ayah {
  surah: {
    nameEnglish: string;
    nameArabic: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface SearchResponse {
  success: boolean;
  count: number;
  data: AyahWithSurah[];
}