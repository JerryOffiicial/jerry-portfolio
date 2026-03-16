"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, Github } from "lucide-react";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import TiltedCard from "@/components/TitledCard";

// ── Project data ─────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    title: "Elephant Tours",
    category: "Full Stack · Travel",
    overview:
      "Designed and built end-to-end — from data architecture to deployment. The goal was to give non-technical clients full content control through a custom admin dashboard and a dual-CMS strategy that separates dynamic tour data from editorial content.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Sanity.io", "Vercel"],
    live: "https://elephant-travels-revamp.vercel.app/",
    github: "",
    images: ["/projects/elephant-tours/elephant-tours.png", "/projects/elephant-tours/elephant-tours2.png","/projects/elephant-tours/elephant-tours3.png","/projects/elephant-tours/elephant-tours4.png","/projects/elephant-tours/elephant-tours5.png"],
    year: "2026",
    accent: "#1A73E8",
    bg: "bg-[#F4F7FF] dark:bg-[#080D1A]",
  },
  {
    title: "LK Web Design",
    category: "Frontend · Agency",
    overview:
      "A professional engagement embedded into an existing team at Global Island (Pvt) Ltd. Focused on component quality, responsive design, and maintainable code within a live production codebase.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    live: "https://lkwebdesign.vercel.app/about",
    github: "",
    images: ["/projects/lkwebdesign/lkwebdesign.png", "/projects/lkwebdesign/lkwebdesign.png"],
    year: "2025–2026",
    accent: "#2BC48A",
    bg: "bg-[#F3FBF7] dark:bg-[#070F0B]",
  },
];

export function Projects() {
  return (
    <section
      id="projects"
      className="relative w-full bg-white dark:bg-black"
    >
      {/* grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04] bg-[linear-gradient(#0D1B2A_1px,transparent_1px),linear-gradient(90deg,#0D1B2A_1px,transparent_1px)] dark:bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="pt-24 md:pt-32 pb-8 text-center max-w-2xl mx-auto px-5 md:px-8">
          <span className="mb-4 inline-block text-xs uppercase tracking-[0.25em] text-[#1A73E8] font-semibold font-secondary">
            Projects
          </span>
          <h2 className="font-primary text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.03em] text-[#0D1B2A] dark:text-[#E6E9EC]">
            Things I&apos;ve{" "}
            <span className="text-[#2BC48A]">shipped</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#0D1B2A]/50 dark:text-[#E6E9EC]/50 leading-relaxed font-secondary">
            Real projects, real users, real deployments.
          </p>
        </div>

        {/* ── ScrollStack ─────────────────────────────────────────── */}
        <ScrollStack
          useWindowScroll={true}
          itemDistance={120}
          itemScale={0.04}
          itemStackDistance={24}
          stackPosition="15%"
          baseScale={0.88}
        >
          {PROJECTS.map((project, i) => (
            <ScrollStackItem
              key={i}
              itemClassName={cn(
                "mx-auto max-w-5xl !h-auto !py-0 !px-0 overflow-hidden",
                "border border-[#0D1B2A]/08 dark:border-[#E6E9EC]/08",
                project.bg
              )}
            >
              {/* Card inner: two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[380px]">

                {/* LEFT — text */}
                <div className="flex flex-col justify-center gap-5 p-8 md:p-10">

                  {/* category + year */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs uppercase tracking-[0.2em] font-semibold font-secondary"
                      style={{ color: project.accent }}
                    >
                      {project.category}
                    </span>
                    <span className="text-xs font-secondary text-[#0D1B2A]/30 dark:text-[#E6E9EC]/30">
                      · {project.year}
                    </span>
                  </div>

                  {/* title */}
                  <h3 className="font-primary text-[clamp(1.6rem,3vw,2.4rem)] leading-tight tracking-[-0.03em] text-[#0D1B2A] dark:text-[#E6E9EC]">
                    {project.title}
                  </h3>

                  {/* overview */}
                  <p className="text-sm md:text-base font-secondary text-[#0D1B2A]/60 dark:text-[#E6E9EC]/55 leading-relaxed">
                    {project.overview}
                  </p>

                  {/* stack pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold font-secondary",
                          "border border-[#0D1B2A]/10 dark:border-[#E6E9EC]/10",
                          "bg-white/70 dark:bg-[#E6E9EC]/[0.04]",
                          "text-[#0D1B2A]/60 dark:text-[#E6E9EC]/60"
                        )}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* links */}
                  <div className="flex items-center gap-3 mt-1">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group flex items-center gap-2 rounded-2xl px-5 py-2.5",
                          "text-sm font-semibold font-secondary text-white",
                          "transition-all duration-300 hover:-translate-y-0.5"
                        )}
                        style={{
                          background: project.accent,
                          boxShadow: `0 0 0 1px ${project.accent}80, 0 4px 20px ${project.accent}40`,
                        }}
                      >
                        Live Site
                        <ArrowUpRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group flex items-center gap-2 rounded-2xl px-5 py-2.5",
                          "text-sm font-semibold font-secondary",
                          "border border-[#0D1B2A]/15 dark:border-[#E6E9EC]/12",
                          "bg-white/60 dark:bg-[#E6E9EC]/[0.04]",
                          "text-[#0D1B2A]/70 dark:text-[#E6E9EC]/70",
                          "hover:border-[#0D1B2A]/30 dark:hover:border-[#E6E9EC]/25",
                          "transition-all duration-300 hover:-translate-y-0.5"
                        )}
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* RIGHT — TiltedCard */}
                <div className="flex items-center justify-center p-6 md:p-8">
                  <TiltedCard
                    images={project.images}
                    altText={project.title}
                    captionText={project.title}
                    containerHeight="280px"
                    containerWidth="100%"
                    imageHeight="280px"
                    imageWidth="100%"
                    scaleOnHover={1.05}
                    rotateAmplitude={12}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={
                      <span className="mt-3 ml-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 text-xs font-semibold text-white font-secondary">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: project.accent }}
                        />
                        {project.year}
                      </span>
                    }
                  />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}