"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import SettingsSidebar from "@/components/layout/SettingsSidebar";

const NAV_LINKS = [
  { href: "/", label: "Surahs", icon: BookOpen },
  { href: "/search", label: "Search", icon: Search },
];

function StarMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2l2.09 6.26L20 9.27l-4.91 3.6L16.82 19 12 15.77 7.18 19l1.73-6.13L4 9.27l5.91-1.01z" />
      <path d="M12 0l1.5 4.5 4.5 1.5-4.5 1.5L12 12l-1.5-4.5L6 6l4.5-1.5z" opacity={0.4} />
    </svg>
  );
}

function KbdBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white/30"
      aria-hidden="true"
    >
      {children}
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const navGroupRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Scroll-aware elevation ────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Close mobile drawer on route change ──────────────────────────────────
  const prevPathnameRef = useRef(pathname);
  if (prevPathnameRef.current !== pathname) {
    prevPathnameRef.current = pathname;
    if (mobileOpen) setMobileOpen(false);
  }

  // ── Gliding pill: move to active link ────────────────────────────────────
  const movePill = useCallback(() => {
    const group = navGroupRef.current;
    const pill = pillRef.current;
    if (!group || !pill) return;
    const activeLink = group.querySelector<HTMLElement>("[data-active='true']");
    if (!activeLink) {
      pill.style.opacity = "0";
      return;
    }
    const groupRect = group.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    pill.style.left = `${linkRect.left - groupRect.left}px`;
    pill.style.top = `${linkRect.top - groupRect.top}px`;
    pill.style.width = `${linkRect.width}px`;
    pill.style.height = `${linkRect.height}px`;
    pill.style.opacity = "1";
  }, []);

  useEffect(() => {
    movePill();
    window.addEventListener("resize", movePill);
    return () => window.removeEventListener("resize", movePill);
  }, [pathname, movePill]);

  // ── ⌘K → focus search ────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.location.href = "/search";
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-x-0 top-0 z-40 px-4 pt-[72px] transition-all duration-300 sm:hidden
          ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
      >
        <div
          className={`overflow-hidden rounded-2xl border bg-[#121214]/95 backdrop-blur-2xl transition-all duration-400
            ${
              mobileOpen
                ? "max-h-64 translate-y-0 border-white/10 opacity-100"
                : "max-h-0 -translate-y-2 border-transparent opacity-0"
            }`}
        >
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5 text-sm font-medium tracking-wide transition-colors last:border-none
                  ${isActive ? "text-amber-400" : "text-white/50 hover:text-white/90"}`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main header ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-all duration-350
          ${scrolled ? "px-4 py-2" : "px-4 py-3"}`}
        role="banner"
      >
        <div
          className={`flex w-full max-w-[760px] items-center justify-between rounded-2xl border px-4 transition-all duration-350
            backdrop-blur-[20px] [backdrop-filter:blur(20px)_saturate(180%)]
            bg-[#121214]/70
            ${scrolled
              ? "border-amber-400/15 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.48),0_0_0_1px_rgba(212,175,55,0.12)]"
              : "border-white/[0.08] py-2.5 shadow-none"
            }`}
        >
          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            aria-label="Al-Quran — Home"
          >
            <StarMark className="h-[22px] w-[22px] text-amber-400 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-45" />
            <span className="font-['Amiri',serif] text-[22px] font-bold leading-none tracking-[0.01em] text-[#f5f0e8] transition-colors duration-200 group-hover:text-amber-400">
              القرآن
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <nav
            ref={navGroupRef}
            className="relative hidden items-center gap-0.5 sm:flex"
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Gliding pill */}
            <div
              ref={pillRef}
              className="pointer-events-none absolute rounded-[10px] border border-amber-400/25 bg-amber-400/10 transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ opacity: 0 }}
              aria-hidden="true"
            />

            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  data-active={isActive ? "true" : "false"}
                  className={`group/link relative z-10 flex items-center gap-1.5 rounded-[10px] px-3 py-[7px] text-[13px] font-medium tracking-[0.02em] transition-colors duration-200
                    ${isActive ? "text-amber-400" : "text-white/50 hover:text-white/85"}`}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={label === "Search" ? "Search (⌘K)" : label}
                >
                  <Icon
                    className="h-[15px] w-[15px] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/link:scale-110"
                    aria-hidden="true"
                  />
                  {label}
                  {label === "Search" && <KbdBadge>⌘K</KbdBadge>}
                </Link>
              );
            })}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-1 border-l border-white/[0.08] pl-2.5 ml-1.5">
            <SettingsSidebar />

            {/* Mobile hamburger */}
            <button
              className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] border border-white/[0.08] bg-transparent text-white/55 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/90 sm:hidden"
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <line
                  x1="3" y1="6" x2="21" y2="6"
                  className={`transition-all duration-300 origin-center ${mobileOpen ? "translate-y-[6px] rotate-45" : ""}`}
                  style={{ transformBox: "fill-box" }}
                />
                <line
                  x1="3" y1="12" x2="21" y2="12"
                  className={`transition-all duration-200 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <line
                  x1="3" y1="18" x2="21" y2="18"
                  className={`transition-all duration-300 origin-center ${mobileOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
                  style={{ transformBox: "fill-box" }}
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}