"use client";

import GradientText from "@/components/GradientText";
import Orb from "@/components/Orb";
import { ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Hero() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-white dark:bg-black"
    >
      {/* Orb */}
      <div className="absolute inset-0 z-0 scale-100">
        <Orb
          hue={265}
          hoverIntensity={0.6}
          rotateOnHover={true}
          forceHoverState={false}
          backgroundColor={isDark ? "#000000" : "#ffffff"}
        />
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_30%,#ffffff_80%)] dark:bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_30%,#000000_80%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-5 md:px-8 text-center w-full max-w-5xl mx-auto pt-24 pb-10">

        {/* Badge */}
        <div
          className="mb-6 md:mb-8 inline-flex items-center gap-2.5 rounded-full border border-[#1A73E8]/25 px-4 py-1.5 text-xs md:text-sm font-medium text-[#0D1B2A]/70 dark:text-[#E6E9EC]/80 backdrop-blur-md"
          style={{ background: "rgba(26,115,232,0.08)" }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2BC48A] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2BC48A]" />
          </span>
          Available for new projects
        </div>

        {/* Headline */}
        <h1
          className="mb-4 md:mb-5 w-full tracking-[-0.03em] text-[#0D1B2A] dark:text-white font-medium leading-[1.05] font-primary"
          style={{ fontSize: "clamp(2.6rem, 7vw, 5.5rem)" }}
        >
          Crafting Digital
          <br />
          <span className="inline-flex items-center mt-1">
            <GradientText
              colors={["#1A73E8", "#2BC48A", "#E6E9EC", "#1A73E8"]}
              animationSpeed={6}
              showBorder={false}
              direction="horizontal"
              className="font-medium tracking-[-0.03em] leading-[1.05] font-primary text-[clamp(2.6rem,7vw,5.5rem)]"
            >
              Experiences
            </GradientText>
          </span>
        </h1>

        {/* Sub */}
        <p className="mb-8 md:mb-10 max-w-sm md:max-w-xl text-sm md:text-base lg:text-lg text-[#0D1B2A]/55 dark:text-[#E6E9EC]/55 leading-relaxed tracking-[-0.01em] font-secondary">
          I build premium web applications merging dynamic design,
          robust engineering, and interactive animations to elevate your brand.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 md:flex-row font-primary w-full max-w-2xs md:max-w-lg">
          <Link
            href="#projects"
            className={cn(
              "group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-4xl px-8 py-3.5 text-sm font-semibold text-white tracking-[-0.01em]",
              "bg-[#1A73E8] transition-all duration-300 hover:-translate-y-0.5",
              "shadow-[0_0_0_1px_rgba(26,115,232,0.5),0_4px_24px_rgba(26,115,232,0.35)]",
              "hover:shadow-[0_0_0_1px_rgba(26,115,232,0.8),0_8px_32px_rgba(26,115,232,0.55)]"
            )}
          >
            Explore My Work
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <button
            onClick={() => alert("Please contact me at jerrysonjerry1234@gmail.com or via LinkedIn to request my CV.")}
            className={cn(
              "group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-4xl px-8 py-3.5 text-sm font-semibold tracking-[-0.01em]",
              "border border-[#0D1B2A]/15 dark:border-[#E6E9EC]/12",
              "bg-[#0D1B2A]/[0.04] dark:bg-[#E6E9EC]/[0.04]",
              "text-[#0D1B2A]/70 dark:text-[#E6E9EC]/70",
              "hover:border-[#0D1B2A]/30 dark:hover:border-[#E6E9EC]/25",
              "hover:bg-[#0D1B2A]/[0.08] dark:hover:bg-[#E6E9EC]/[0.08]",
              "hover:text-[#0D1B2A] dark:hover:text-[#E6E9EC]",
              "transition-all duration-300 hover:-translate-y-0.5"
            )}
          >
            <Download size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            Download Resume
          </button>
        </div>

        {/* Scroll hint */}
        <div className="mt-12 md:mt-16 flex flex-col items-center gap-2 opacity-40">
          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-[#0D1B2A]/60 dark:via-[#E6E9EC]/60 to-transparent" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#0D1B2A]/60 dark:text-[#E6E9EC]/60 font-medium">
            scroll
          </span>
        </div>
      </div>
    </section>
  );
}
