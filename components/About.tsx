"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ProfileCard from "@/components/ProfileCard";
import profile_img from '@/public/profile2.png'
// ── Q&A data ────────────────────────────────────────────────────────────────
const QA = [
  {
    q: "What drives you as a developer?",
    a: "Building things that actually work — fast, beautiful, and scalable. I love the moment a complex idea becomes a clean, working product.",
  },
  {
    q: "What's your current stack?",
    a: "React, Next.js, TypeScript, Tailwind CSS on the frontend. Node.js, Express, and Supabase on the backend — with a healthy respect for SQL and a soft spot for MongoDB.",
  },
  {
    q: "What have you deployed recently?",
    a: "Elephant Tours — a full-stack travel app with a hybrid CMS (Supabase + Sanity.io), admin dashboard, and zero-downtime Vercel deployment. Also contributed frontend work at Global Island (LK Web Design).",
  },
  {
    q: "How do you approach a new project?",
    a: "Understand the problem first, then the user. Architecture before aesthetics — but I won't build something that looks bad either.",
  },
  {
    q: "Where are you based?",
    a: "Kandy, Sri Lanka. Open to remote collaboration anywhere.",
  },
  {
    q: "What are you working toward?",
    a: "Growing into a senior full-stack role — deepening my systems thinking, contributing to open source, and building scalable projects that matter.",
  },
];

// ── Infinity carousel items ──────────────────────────────────────────────────
const SKILLS = [
  "React.js", "Next.js", "TypeScript", "Tailwind CSS",
  "Node.js", "Express.js", "Supabase", "Sanity.io",
  "MongoDB", "SQL Server", "Firebase", ".NET",
  "Java", "C#", "Git", "Vercel",
];

// duplicate for seamless loop
const TRACK = [...SKILLS, ...SKILLS];

export function About() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="about"
      className="relative w-full bg-white dark:bg-black overflow-hidden py-24 md:py-32"
    >
      {/* subtle grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04] bg-[linear-gradient(#0D1B2A_1px,transparent_1px),linear-gradient(90deg,#0D1B2A_1px,transparent_1px)] dark:bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">

        {/* ── ROW 1 : Quote ─────────────────────────────────────────── */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <span className="mb-4 inline-block text-xs uppercase tracking-[0.25em] text-[#1A73E8] font-semibold font-secondary">
            About
          </span>
          <h2 className="font-primary text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.03em] text-[#0D1B2A] dark:text-[#E6E9EC]">
            Code is craft.{" "}
            <span className="text-[#1A73E8]">I build</span> with
            precision,{" "}
            <span className="text-[#2BC48A]">ship</span> with purpose.
          </h2>
          <p className="mt-5 text-sm md:text-base text-[#0D1B2A]/50 dark:text-[#E6E9EC]/50 leading-relaxed font-secondary max-w-xl mx-auto">
            Junior Full Stack Developer — turning ideas into fast, scalable web
            experiences with React, Next.js, and a relentless eye for detail.
          </p>
        </div>

        {/* ── ROW 2 : Two columns ───────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start mb-20 md:mb-28">

          {/* LEFT — Profile card + name */}
          <div className="flex flex-col items-center gap-5">
            <ProfileCard
              name="Gunaseelan Jerryson"
              title="Full Stack Developer"
              handle="jerryson"
              status="Available"
              contactText="Contact"
              showUserInfo={true}
              /* swap these for real URLs */
              avatarUrl={profile_img}
              miniAvatarUrl="/profile1.jpeg"
              behindGlowEnabled={true}
              behindGlowColor="rgba(26,115,232,0.5)"
              enableTilt={true}
            />
            <div className="text-center">
              <p className="font-primary text-lg md:text-xl font-medium tracking-[-0.02em] text-[#0D1B2A] dark:text-[#E6E9EC]">
                Gunaseelan Jerryson
              </p>
              <p className="mt-1 text-sm font-secondary text-[#0D1B2A]/50 dark:text-[#E6E9EC]/50 tracking-wide uppercase">
                Full Stack Developer
              </p>
            </div>
          </div>

          {/* RIGHT — Q&A accordion */}
          <div className="flex flex-col justify-center">
            {QA.map((item, i) => (
              <QAItem
                key={i}
                index={i}
                item={item}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 3 : Infinity carousel ──────────────────────────────── */}
      <SkillsCarousel />
    </section>
  );
}

// ── QA Item ──────────────────────────────────────────────────────────────────
function QAItem({
  item,
  isOpen,
  onToggle,
  index,
}: {
  item: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(bodyRef.current.scrollHeight);
  }, [item.a]);

  return (
    <div
      className={cn(
        "border-b border-[#0D1B2A]/10 dark:border-[#E6E9EC]/10",
        "transition-colors duration-200",
        isOpen && "border-[#1A73E8]/30 dark:border-[#1A73E8]/30"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-4 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-sm md:text-base font-semibold font-secondary tracking-[-0.01em] transition-colors duration-200",
            isOpen
              ? "text-[#1A73E8]"
              : "text-[#0D1B2A]/80 dark:text-[#E6E9EC]/80 group-hover:text-[#0D1B2A] dark:group-hover:text-[#E6E9EC]"
          )}
        >
          {item.q}
        </span>

        {/* animated plus / minus */}
        <span className="relative flex shrink-0 h-5 w-5 items-center justify-center">
          <span
            className={cn(
              "absolute h-[1.5px] w-4 rounded-full transition-colors duration-200",
              isOpen ? "bg-[#1A73E8]" : "bg-[#0D1B2A]/40 dark:bg-[#E6E9EC]/40"
            )}
          />
          <span
            className={cn(
              "absolute h-4 w-[1.5px] rounded-full transition-all duration-300",
              isOpen
                ? "bg-[#1A73E8] rotate-90 opacity-0"
                : "bg-[#0D1B2A]/40 dark:bg-[#E6E9EC]/40 rotate-0 opacity-100"
            )}
          />
        </span>
      </button>

      {/* answer — height animation */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${height}px` : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <div ref={bodyRef} className="pb-4">
          <p className="text-sm font-secondary text-[#0D1B2A]/55 dark:text-[#E6E9EC]/55 leading-relaxed">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Skills Carousel ───────────────────────────────────────────────────────────
function SkillsCarousel() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white dark:from-black to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white dark:from-black to-transparent" />

      <div
        className="flex gap-3 w-max"
        style={{
          animation: "carousel-scroll 35s linear infinite",
        }}
      >
        {TRACK.map((skill, i) => (
          <div
            key={i}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5",
              "border border-[#0D1B2A]/10 dark:border-[#E6E9EC]/10",
              "bg-[#0D1B2A]/[0.03] dark:bg-[#E6E9EC]/[0.04]",
              "text-sm font-semibold font-secondary tracking-[-0.01em]",
              "text-[#0D1B2A]/70 dark:text-[#E6E9EC]/70",
              "hover:border-[#1A73E8]/40 hover:text-[#1A73E8] dark:hover:border-[#1A73E8]/40 dark:hover:text-[#1A73E8]",
              "transition-colors duration-200 cursor-default select-none"
            )}
          >
            {skill}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}