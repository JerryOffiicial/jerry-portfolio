"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, User, ArrowRight } from "lucide-react";

// ── Blog data ─────────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with Next.js 14 App Router",
    excerpt: "Exploring the new App Router paradigm and how it changes the way we build Next.js applications. The App Router introduces a new file-system based router built on top of React Server Components, which supports layouts, nested routes, loading states, error handling, and more.",
    fullContent: "Exploring the new App Router paradigm and how it changes the way we build Next.js applications. The App Router introduces a new file-system based router built on top of React Server Components, which supports layouts, nested routes, loading states, error handling, and more. This fundamental shift from the Pages Router requires understanding new concepts like Server Components vs Client Components, streaming, and the new data-fetching patterns. In this comprehensive guide, we'll walk through everything you need to know to migrate your existing applications or start fresh with the App Router. We'll cover practical examples, best practices, and common pitfalls to avoid when making the transition.",
    category: "technologies",
    date: "2026-03-15",
    creator: "Jerry",
    image: "/blogs/blog1.webp",
    tags: ["Next.js", "React", "Web Development"]
  },
  {
    id: 2,
    title: "Why Developers Are Choosing Supabase Over Firebase",
    excerpt: "A deep dive into the advantages of Supabase over Firebase for modern web applications. Supabase has been gaining significant traction in the developer community as an open-source alternative to Firebase.",
    fullContent: "A deep dive into the advantages of Supabase over Firebase for modern web applications. Supabase has been gaining significant traction in the developer community as an open-source alternative to Firebase. While both platforms offer similar functionality including real-time databases, authentication, and storage, there are key differences that make Supabase more appealing for certain use cases. From PostgreSQL instead of NoSQL to better SQL querying capabilities and more transparent pricing, we'll explore why developers are making the switch.",
    category: "technologies",
    date: "2026-03-10",
    creator: "Jerry",
    image: "/blogs/blog2.webp",
    tags: ["Supabase", "Firebase", "Backend"]
  },
  {
    id: 3,
    title: "What is Server-Side Rendering in Next.js?",
    excerpt: "A comprehensive guide to SSR, SSG, and ISR in Next.js and when to use each approach. Understanding the different rendering strategies in Next.js is crucial for building performant web applications.",
    fullContent: "A comprehensive guide to SSR, SSG, and ISR in Next.js and when to use each approach. Understanding the different rendering strategies in Next.js is crucial for building performant web applications. Server-Side Rendering (SSR) generates HTML on each request, Static Site Generation (SSG) builds pages at build time, and Incremental Static Regeneration (ISR) combines the best of both worlds. We'll dive deep into each approach with practical examples and performance comparisons.",
    category: "concepts",
    date: "2026-02-28",
    creator: "Jerry",
    image: "/blogs/blog3.jpg",
    tags: ["SSR", "Next.js", "Performance"]
  },
  {
    id: 4,
    title: "How I Built Elephant Tours with Next.js and Supabase",
    excerpt: "The complete journey of building a full-stack travel application from concept to deployment. This project was an ambitious endeavor to create a comprehensive travel booking platform with real-time availability.",
    fullContent: "The complete journey of building a full-stack travel application from concept to deployment. This project was an ambitious endeavor to create a comprehensive travel booking platform with real-time availability, payment processing, and admin dashboard. I'll walk through the entire development process including architecture decisions, challenges faced, and lessons learned along the way.",
    category: "projects",
    date: "2026-02-10",
    creator: "Jerry",
    image: "/blogs/blog1.webp",
    tags: ["Next.js", "Supabase", "Full Stack"]
  },
  {
    id: 5,
    title: "Fixing iOS Gradient Issues in CSS",
    excerpt: "How I solved persistent gradient rendering problems on iOS devices with practical CSS solutions. iOS Safari has long been notorious for its inconsistent handling of CSS gradients, leading to frustrating visual bugs.",
    fullContent: "How I solved persistent gradient rendering problems on iOS devices with practical CSS solutions. iOS Safari has long been notorious for its inconsistent handling of CSS gradients, leading to frustrating visual bugs that only appear on Apple devices. After countless hours of debugging and testing, I've compiled a comprehensive guide to identifying and fixing these gradient issues once and for all.",
    category: "solutions",
    date: "2026-01-30",
    creator: "Jerry",
    image: "/blogs/blog2.webp",
    tags: ["CSS", "iOS", "Bug Fix"]
  },
  {
    id: 6,
    title: "REST API vs GraphQL Explained Simply",
    excerpt: "Comparing REST and GraphQL architectures to help you choose the right approach for your project. The debate between REST and GraphQL has been ongoing since GraphQL's introduction by Facebook in 2015.",
    fullContent: "Comparing REST and GraphQL architectures to help you choose the right approach for your project. The debate between REST and GraphQL has been ongoing since GraphQL's introduction by Facebook in 2015. Both have their strengths and weaknesses, and the choice depends heavily on your specific use case. We'll break down the key differences with practical examples, performance considerations, and implementation complexity.",
    category: "concepts",
    date: "2026-02-20",
    creator: "Jerry",
    image: "/blogs/blog3.jpg",
    tags: ["API", "GraphQL", "REST"]
  },
  {
    id: 7,
    title: "Handling Image Uploads with Supabase Storage",
    excerpt: "A practical guide to implementing secure image uploads with Supabase Storage and React. Image uploads can be surprisingly complex when you consider security, optimization, and user experience.",
    fullContent: "A practical guide to implementing secure image uploads with Supabase Storage and React. Image uploads can be surprisingly complex when you consider security, optimization, and user experience. This guide walks through implementing a robust image upload system using Supabase Storage, complete with progress indicators, error handling, and automatic optimization.",
    category: "solutions",
    date: "2026-01-25",
    creator: "Jerry",
    image: "/blogs/blog1.webp",
    tags: ["Supabase", "Storage", "React"]
  },
  {
    id: 8,
    title: "Creating an Admin Dashboard with React and TypeScript",
    excerpt: "Building a responsive admin dashboard with real-time data visualization and user management. Admin dashboards are the backbone of most web applications, providing essential tools for content management.",
    fullContent: "Building a responsive admin dashboard with real-time data visualization and user management. Admin dashboards are the backbone of most web applications, providing essential tools for content management and user oversight. This tutorial covers building a modern, responsive dashboard with real-time updates, interactive charts, and comprehensive user management features.",
    category: "projects",
    date: "2026-02-05",
    creator: "Jerry",
    image: "/blogs/blog2.webp",
    tags: ["React", "TypeScript", "Dashboard"]
  },
  {
    id: 9,
    title: "What is tRPC and Why People Like It",
    excerpt: "Understanding tRPC and how it simplifies API development in full-stack TypeScript applications. tRPC has been gaining popularity as a way to build type-safe APIs without the complexity of GraphQL.",
    fullContent: "Understanding tRPC and how it simplifies API development in full-stack TypeScript applications. tRPC has been gaining popularity as a way to build type-safe APIs without the complexity of GraphQL. We'll explore how tRPC leverages TypeScript to provide end-to-end type safety from your database to your frontend components.",
    category: "technologies",
    date: "2026-03-05",
    creator: "Jerry",
    image: "/blogs/blog3.jpg",
    tags: ["tRPC", "TypeScript", "API"]
  }
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "All", color: "#1A73E8" },
  { id: "technologies", name: "Technologies", color: "#1A73E8" },
  { id: "concepts", name: "Concepts", color: "#2BC48A" },
  { id: "projects", name: "Projects", color: "#EA4335" },
  { id: "solutions", name: "Solutions", color: "#FBBC04" },
];

const INITIAL_VISIBLE = 3;

function formatDate(dateString: string) {
  return new Date(dateString)
    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    .toUpperCase();
}

// ── Blog Card ─────────────────────────────────────────────────────────────────
function BlogCard({ post, visible }: { post: typeof BLOG_POSTS[0]; visible: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded]);

  // reset expand when card becomes hidden
  useEffect(() => {
    if (!visible) setExpanded(false);
  }, [visible]);

  const shortText = `${post.excerpt.slice(0, 140)}...`;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 transition-all duration-500",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Row 1 — image */}
      <div className="w-full rounded-2xl overflow-hidden aspect-[16/9]">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Row 2 — date + creator */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-xs font-secondary text-[#0D1B2A]/45 dark:text-[#E6E9EC]/45 uppercase tracking-wide">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{formatDate(post.date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-secondary text-[#0D1B2A]/45 dark:text-[#E6E9EC]/45">
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>{post.creator}</span>
        </div>
      </div>

      {/* Row 3 — title + excerpt + read more */}
      <div className="flex flex-col gap-2">
        <h3 className="font-primary text-base md:text-lg leading-snug tracking-[-0.02em] text-[#0D1B2A] dark:text-[#E6E9EC]">
          {post.title}{" "}
          <ArrowRight className="inline w-4 h-4 -mt-0.5 text-[#0D1B2A]/40 dark:text-[#E6E9EC]/40" />
        </h3>

        <div
          className="overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{ maxHeight: expanded ? `${height + 8}px` : "4.5rem" }}
        >
          <p
            ref={contentRef}
            className="text-sm font-secondary text-[#0D1B2A]/60 dark:text-[#E6E9EC]/55 leading-relaxed"
          >
            {expanded ? post.fullContent : shortText}
          </p>
        </div>

        <button
          onClick={() => setExpanded(v => !v)}
          className="self-start text-sm font-semibold font-secondary underline underline-offset-2 transition-colors duration-200 text-[#0D1B2A]/50 dark:text-[#E6E9EC]/50 hover:text-[#1A73E8]"
        >
          {expanded ? "show less" : "read more"}
        </button>
      </div>
    </article>
  );
}

// ── Blog Section ──────────────────────────────────────────────────────────────
export function BlogSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);

  // filter + reset showAll on category change
  useEffect(() => {
    setShowAll(false);
  }, [activeCategory]);

  const filtered = activeCategory === "all"
    ? BLOG_POSTS
    : BLOG_POSTS.filter(p => p.category === activeCategory);

  const visibleIds = new Set(
    (showAll ? filtered : filtered.slice(0, INITIAL_VISIBLE)).map(p => p.id)
  );

  const hasMore = filtered.length > INITIAL_VISIBLE;
  const activeCat = CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <section
      id="blog"
      className="relative w-full bg-white dark:bg-black overflow-hidden py-24 md:py-32"
    >
      {/* grid texture */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04] bg-[linear-gradient(#0D1B2A_1px,transparent_1px),linear-gradient(90deg,#0D1B2A_1px,transparent_1px)] dark:bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">

        {/* ── Section header ─────────────────────────────────────── */}
        <div className="mb-12 md:mb-16 text-center max-w-2xl mx-auto">
          <span className="mb-4 inline-block text-xs uppercase tracking-[0.25em] text-[#1A73E8] font-semibold font-secondary">
            Blog
          </span>
          <h2 className="font-primary text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.03em] text-[#0D1B2A] dark:text-[#E6E9EC]">
            Things I&apos;ve{" "}
            <span className="text-[#1A73E8]">written</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#0D1B2A]/50 dark:text-[#E6E9EC]/50 leading-relaxed font-secondary">
            Thoughts on modern web dev, technologies I explore, and problems I solve.
          </p>
        </div>

        {/* ── Category filters ────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-xs font-semibold font-secondary tracking-[-0.01em]",
                  "border transition-all duration-200",
                  isActive
                    ? "text-white border-transparent"
                    : "border-[#0D1B2A]/12 dark:border-[#E6E9EC]/12 bg-transparent text-[#0D1B2A]/55 dark:text-[#E6E9EC]/55 hover:border-[#0D1B2A]/25 dark:hover:border-[#E6E9EC]/25"
                )}
                style={isActive ? {
                  background: cat.color,
                  boxShadow: `0 0 0 1px ${cat.color}80, 0 4px 14px ${cat.color}35`
                } : {}}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* ── Cards grid — always render all, show/hide via opacity ── */}
        {/* ── Cards grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
          {BLOG_POSTS.filter(p =>
            activeCategory === "all" || p.category === activeCategory
          )
            .filter(p => visibleIds.has(p.id))  // ← only render visible ones
            .map(post => (
              <BlogCard
                key={post.id}
                post={post}
                visible={true}  // ← always true now since we pre-filter
              />
            ))}
        </div>

        {/* empty state */}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm font-secondary text-[#0D1B2A]/40 dark:text-[#E6E9EC]/40">
            No posts in this category yet.
          </p>
        )}

        {/* ── View all / Show less ─────────────────────────────────── */}
        {hasMore && (
          <div className="mt-14 flex justify-start">
            <button
              onClick={() => setShowAll(v => !v)}
              className={cn(
                "group inline-flex items-center gap-2 rounded-full px-6 py-2.5",
                "text-sm font-semibold font-secondary tracking-[-0.01em]",
                "border border-[#0D1B2A]/15 dark:border-[#E6E9EC]/15",
                "text-[#0D1B2A]/70 dark:text-[#E6E9EC]/70",
                "hover:border-[#0D1B2A]/35 dark:hover:border-[#E6E9EC]/35",
                "transition-all duration-200"
              )}
            >
              {showAll ? "Show less" : `View all ${filtered.length}`}
              <ArrowRight
                size={14}
                className={cn(
                  "transition-transform duration-300",
                  showAll ? "rotate-90" : "group-hover:translate-x-0.5"
                )}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}