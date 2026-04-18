"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import SettingsSidebar from "@/components/layout/SettingsSidebar";

const NAV_LINKS = [
  { href: "/", label: "Surahs", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
        >
          <span className="font-arabic-amiri text-2xl">القرآن</span>
          <span className="text-sm hidden sm:inline text-muted-foreground">
            The Holy Quran
          </span>
        </Link>

        {/* Nav Links + Settings */}
        <div className="flex items-center gap-2">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {/* Settings Sidebar Trigger */}
          <SettingsSidebar />
        </div>

      </div>
    </header>
  );
}