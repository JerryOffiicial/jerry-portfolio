"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Home, User, FolderGit2, Mail, Sun, Moon } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync theme with <html> class
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = stored ?? preferred;
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
    { name: "Home", href: "#home", icon: Home },
    { name: "About", href: "#about", icon: User },
    { name: "Projects", href: "#projects", icon: FolderGit2 },
    { name: "Contact", href: "#contact", icon: Mail },
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
                    "text-[#0D1B2A]/60 dark:text-white/60 hover:text-[#1A73E8] dark:hover:text-white",
                    "hover:bg-[#0D1B2A]/[0.06] dark:hover:bg-white/[0.06]",
                    "transition-all duration-200"
                  )}
                >
                  <Icon size={14} className="text-[#0D1B2A]/40 dark:text-white/40 group-hover:text-[#1A73E8] dark:group-hover:text-white/70 transition-colors duration-200" />
                  <span className="tracking-[-0.01em]">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side: theme toggle + hamburger */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className={cn(
                "relative flex items-center justify-center w-9 h-9",
                "text-[#0D1B2A]/50 dark:text-white/50 hover:text-[#1A73E8] dark:hover:text-white",
                "hover:bg-[#0D1B2A]/[0.06] dark:hover:bg-white/[0.06]",
                "transition-all duration-200 rounded-lg"
              )}
            >
              <Sun
                size={16}
                className={cn(
                  "absolute transition-all duration-300",
                  theme === "dark"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 rotate-90 scale-75"
                )}
              />
              <Moon
                size={16}
                className={cn(
                  "absolute transition-all duration-300",
                  theme === "light"
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75"
                )}
              />
            </button>

            {/* Mobile Hamburger */}
            <button
              className={cn(
                "md:hidden relative flex items-center justify-center w-10 h-10",
                "text-[#0D1B2A]/70 dark:text-white/70 hover:text-[#1A73E8] dark:hover:text-white",
                "hover:bg-[#0D1B2A]/[0.06] dark:hover:bg-white/[0.06]",
                "transition-colors duration-200 rounded-lg"
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
          <div className="flex flex-col gap-1 pb-3 pt-3 border-t border-foreground/[0.06]">
            {navLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5",
                    "text-[#0D1B2A]/70 dark:text-white/70 hover:text-[#1A73E8] dark:hover:text-white",
                    "hover:bg-[#0D1B2A]/[0.05] dark:hover:bg-white/[0.05]",
                    "text-[15px] font-medium tracking-[-0.01em]",
                    "transition-all duration-200"
                  )}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${i * 40}ms` : "0ms",
                  }}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-sm bg-[#0D1B2A]/[0.04] dark:bg-white/[0.04]">
                    <Icon size={15} className="text-[#0D1B2A]/50 dark:text-white/50" />
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