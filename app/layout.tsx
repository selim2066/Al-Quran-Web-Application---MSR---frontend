import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { SettingsProvider } from "@/hooks/useSettings";
import { ThemeProvider } from "next-themes";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quran Web App",
  description: "Read and explore the Holy Quran",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
  className={`${geist.className} min-h-screen bg-background`}
  suppressHydrationWarning
>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <Navbar />
            <main>{children}</main>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}