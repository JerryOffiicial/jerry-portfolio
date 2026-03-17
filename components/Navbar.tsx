"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

const IconHome = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const IconAbout = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const IconProjects = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="8" height="8" rx="1.5"/>
    <rect x="13" y="3" width="8" height="8" rx="1.5"/>
    <rect x="3" y="13" width="8" height="8" rx="1.5"/>
    <rect x="13" y="13" width="8" height="8" rx="1.5"/>
  </svg>
);

const IconBlog = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h-7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/>
    <path d="M8 10h8M8 14h4"/>
    <path d="M17 17l2 2 4-4"/>
  </svg>
);

const IconContact = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = stored ?? preferred;
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  const navLinks = [
    { name: "Home", href: "#home", icon: IconHome },
    { name: "About", href: "#about", icon: IconAbout },
    { name: "Projects", href: "#projects", icon: IconProjects },
    { name: "Blog", href: "#blog", icon: IconBlog },
    { name: "Contact", href: "#contact", icon: IconContact },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 w-full">
      <header
        className={cn(
          "w-full max-w-3xl rounded-4xl transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] px-6 py-3",
          "relative overflow-hidden",
          "bg-white/30 dark:bg-white/[0.04]",
          "backdrop-blur-2xl",
          "border border-white/40 dark:border-white/[0.08]",
          "shadow-[0_2px_0_0_rgba(255,255,255,0.6)_inset,0_-1px_0_0_rgba(0,0,0,0.04)_inset,0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_0_0_rgba(255,255,255,0.06)_inset,0_8px_32px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.04)]",
          isScrolled ? "scale-[0.97] py-2" : "scale-100"
        )}
      >
        {/* Frosted shimmer overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.0) 100%)",
          }}
        />

        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-[-0.04em] text-[#0D1B2A] dark:text-white/90 hover:text-[#1A73E8] dark:hover:text-white transition-colors duration-200 select-none"
          >
            Jerryson<span className="text-[#1A73E8] dark:text-white/40">.</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 font-secondary">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "group relative flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full",
                    "text-[#0D1B2A]/60 dark:text-white/60",
                    "hover:text-[#1A73E8] dark:hover:text-white",
                    "transition-colors duration-200"
                  )}
                >
                  {/* Icon — spring bounce up on hover, no bg */}
                  <span
                    className={cn(
                      "text-[#0D1B2A]/40 dark:text-white/35 flex-shrink-0",
                      "group-hover:text-[#1A73E8] dark:group-hover:text-white/80",
                      "transition-[color,transform] duration-[180ms,280ms]",
                      "group-hover:-translate-y-[3px] group-hover:scale-[1.2]",
                      "[transition-timing-function:ease,cubic-bezier(0.34,1.56,0.64,1)]",
                      "inline-flex"
                    )}
                    style={{ willChange: "transform" }}
                  >
                    <Icon size={14} />
                  </span>

                  <span className="tracking-[-0.01em]">{link.name}</span>

                  {/* Blue dot — scales in from center below text on hover */}
                  <span
                    className={cn(
                      "absolute bottom-[3px] left-1/2 -translate-x-1/2",
                      "w-[4px] h-[4px] rounded-full bg-[#1A73E8]",
                      "scale-x-0 opacity-0",
                      "group-hover:scale-x-100 group-hover:opacity-100",
                      "transition-[transform,opacity] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Right side: theme toggle + hamburger */}
          <div className="flex items-center gap-2">

            {/* ── Sliding Track Toggle ── */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              role="switch"
              aria-checked={theme === "light"}
              className={cn(
                "relative flex items-center w-[52px] h-[26px] rounded-full cursor-pointer",
                "border transition-[background,border-color,box-shadow,transform] duration-300",
                theme === "light"
                  ? "bg-amber-400/15 border-amber-400/40 shadow-[0_0_0_3px_rgba(251,191,36,0.10)]"
                  : "bg-indigo-500/15 dark:bg-indigo-400/10 border-indigo-400/30 shadow-[0_0_0_3px_rgba(99,102,241,0.08)]",
                theme === "light"
                  ? "hover:shadow-[0_0_0_4px_rgba(251,191,36,0.20)]"
                  : "hover:shadow-[0_0_0_4px_rgba(99,102,241,0.16)]",
                "active:scale-[0.96]"
              )}
            >
              {/* Sliding thumb */}
              <span
                className={cn(
                  "absolute top-[2px] flex items-center justify-center",
                  "w-[22px] h-[22px] rounded-full",
                  "bg-white dark:bg-[#1c1c2e]",
                  "border shadow-[0_1px_4px_rgba(0,0,0,0.14)]",
                  "transition-[left] duration-[300ms] ease-[cubic-bezier(0.34,1.4,0.64,1)]",
                  theme === "light"
                    ? "left-[27px] border-amber-300/50"
                    : "left-[2px] border-indigo-400/25 dark:border-indigo-400/20"
                )}
              >
                <Sun
                  size={12}
                  className={cn(
                    "absolute text-amber-500 transition-all duration-300",
                    theme === "light"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 rotate-90 scale-50"
                  )}
                />
                <Moon
                  size={12}
                  className={cn(
                    "absolute text-indigo-400 dark:text-indigo-300 transition-all duration-300",
                    theme === "dark"
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-50"
                  )}
                />
              </span>
            </button>

            {/* ── Mobile Hamburger ── */}
            <button
              className={cn(
                "md:hidden relative flex items-center justify-center w-10 h-10 rounded-xl",
                "text-[#0D1B2A]/70 dark:text-white/70",
                "hover:text-[#1A73E8] dark:hover:text-white",
                "hover:bg-[#1A73E8]/10 dark:hover:bg-white/[0.08]",
                "hover:scale-[1.06] active:scale-[0.95]",
                "transition-all duration-200"
              )}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="overflow-visible"
              >
                <line
                  x1="3" y1="8" x2="19" y2="8"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  style={{
                    transformOrigin: "11px 8px",
                    transform: mobileMenuOpen ? "translateY(3px) rotate(45deg)" : "none",
                    transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
                <line
                  x1="3" y1="14" x2="14" y2="14"
                  stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                  style={{
                    transformOrigin: "8.5px 14px",
                    transform: mobileMenuOpen
                      ? "translateX(2.5px) translateY(-3px) scaleX(1.18) rotate(-45deg)"
                      : "none",
                    transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
            mobileMenuOpen ? "max-h-72 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="flex flex-col gap-0.5 pb-3 pt-3 border-t border-foreground/[0.06] font-secondary">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-xl",
                    "text-[#0D1B2A]/70 dark:text-white/60",
                    "hover:text-[#1A73E8] dark:hover:text-white",
                    "hover:bg-[#0D1B2A]/[0.04] dark:hover:bg-white/[0.04]",
                    "text-[15px] font-medium tracking-[-0.01em]",
                    "transition-colors duration-200"
                  )}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${i * 40}ms` : "0ms",
                  }}
                >
                  {/* Mobile icon — spring bounce, no bg wrapper */}
                  <span
                    className={cn(
                      "text-[#0D1B2A]/40 dark:text-white/35 flex-shrink-0 inline-flex",
                      "group-hover:text-[#1A73E8] dark:group-hover:text-white/80",
                      "transition-[color,transform] duration-[180ms,280ms]",
                      "group-hover:-translate-y-[2px] group-hover:scale-[1.18]",
                      "[transition-timing-function:ease,cubic-bezier(0.34,1.56,0.64,1)]"
                    )}
                    style={{ willChange: "transform" }}
                  >
                    <Icon size={16} />
                  </span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
    </div>
  );
}