/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Github, Linkedin, Mail, MessageSquarePlus, X, Star, ChevronLeft, ChevronRight, Send, Phone } from "lucide-react";
import { Footer } from "./Footer";
import GradientText from "./GradientText";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/types/database";

// ── Fallback reviews ──────────────────────────────────────────────────────────
const FALLBACK_REVIEWS = [
    {
        id: "1",
        name: "Jerry",
        role: "dev",
        avatar: "/profile1.jpeg",
        rating: 5,
        message:
            "Share your experience by leaving a review",
    }
];

interface ReviewItem {
    id: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    message: string;
}

function mapReview(r: Review): ReviewItem {
    return {
        id: r.id,
        name: r.name,
        role: r.role,
        avatar: r.avatar_url,
        rating: r.rating,
        message: r.message,
    };
}

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({
    count,
    interactive = false,
    onSelect,
}: {
    count: number;
    interactive?: boolean;
    onSelect?: (n: number) => void;
}) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type={interactive ? "button" : undefined}
                    onClick={() => interactive && onSelect?.(n)}
                    onMouseEnter={() => interactive && setHovered(n)}
                    onMouseLeave={() => interactive && setHovered(0)}
                    className={cn(interactive ? "cursor-pointer" : "cursor-default pointer-events-none")}
                    aria-label={interactive ? `Rate ${n} stars` : undefined}
                >
                    <Star
                        size={interactive ? 18 : 15}
                        fill={(interactive ? (hovered || count) >= n : count >= n) ? "#FBBC04" : "transparent"}
                        stroke={(interactive ? (hovered || count) >= n : count >= n) ? "#FBBC04" : "currentColor"}
                        className={cn(
                            "transition-colors duration-150",
                            (interactive ? (hovered || count) >= n : count >= n)
                                ? ""
                                : "text-[#0D1B2A]/20 dark:text-white/20"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: ReviewItem }) {
    return (
        <div className="flex flex-col gap-5 rounded-[24px] border border-[#0D1B2A]/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl p-7 h-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-transform duration-300 hover:-translate-y-1 group">
            <Stars count={review.rating} />
            <p className="text-sm font-secondary leading-relaxed text-[#0D1B2A]/80 dark:text-white/80 flex-1">
                &ldquo;{review.message}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-4 border-t border-[#0D1B2A]/10 dark:border-white/10">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-[#0D1B2A]/08 dark:bg-white/10 shrink-0 border border-[#0D1B2A]/10 dark:border-white/10">
                    <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.style.display = "none";
                        }}
                    />
                </div>
                <div>
                    <p className="text-sm font-semibold font-secondary text-[#0D1B2A] dark:text-white leading-none">
                        {review.name}
                    </p>
                    <p className="text-xs font-secondary text-[#0D1B2A]/50 dark:text-white/50 mt-1 leading-none">
                        {review.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Review form ───────────────────────────────────────────────────────────────
function ReviewForm({ onClose }: { onClose: () => void }) {
    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [avatar, setAvatar] = useState<string | null>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatar(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {
            await supabase.from('reviews').insert({
                name: nameRef.current?.value || '',
                role: roleRef.current?.value || '',
                avatar_url: avatar || '',
                rating: rating || 5,
                message: messageRef.current?.value || '',
                status: 'pending',
            });
        } catch {
            // silently fail, show success either way
        }

        setSubmitted(true);
        setSubmitting(false);
    };

    if (submitted) {
        return (
            <div className="mt-6 rounded-[24px] border border-[#0D1B2A]/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl p-7 flex flex-col items-center gap-3 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <div className="w-10 h-10 rounded-full bg-[#2BC48A]/15 flex items-center justify-center">
                    <Star size={18} fill="#2BC48A" stroke="#2BC48A" />
                </div>
                <p className="text-sm font-semibold font-secondary text-[#0D1B2A] dark:text-white">
                    Review submitted!
                </p>
                <p className="text-xs font-secondary text-[#0D1B2A]/50 dark:text-white/50">
                    It will appear here after approval.
                </p>
                <button
                    onClick={onClose}
                    className="mt-1 text-xs font-secondary text-[#0D1B2A]/40 dark:text-white/40 hover:text-[#1A73E8] transition-colors underline underline-offset-2"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-[24px] border border-[#0D1B2A]/10 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] backdrop-blur-xl p-7 flex flex-col gap-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
        >
            {/* header */}
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold font-secondary text-[#0D1B2A] dark:text-white">
                    Leave a review
                </p>
                <button
                    type="button"
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#0D1B2A]/08 dark:bg-white/10 hover:bg-[#0D1B2A]/15 dark:hover:bg-white/20 transition-colors"
                    aria-label="Close form"
                >
                    <X size={12} className="text-[#0D1B2A]/70 dark:text-white/70" />
                </button>
            </div>

            {/* star rating */}
            <div className="flex flex-col gap-1.5">
                <label className="text-xs font-secondary text-[#0D1B2A]/50 dark:text-white/50">
                    Rating
                </label>
                <Stars count={rating} interactive onSelect={setRating} />
            </div>

            {/* avatar + name row */}
            <div className="flex items-center gap-3">
                <label className="relative w-10 h-10 rounded-full overflow-hidden bg-[#0D1B2A]/08 dark:bg-white/10 border border-[#0D1B2A]/10 dark:border-white/15 shrink-0 cursor-pointer group">
                    {avatar ? (
                        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-[#0D1B2A]/30 dark:text-white/30 text-[10px] font-secondary text-center leading-tight px-1">
                            Photo
                        </span>
                    )}
                    <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[9px]">Change</span>
                    </div>
                </label>

                <input
                    ref={nameRef}
                    required
                    type="text"
                    placeholder="Your name"
                    className={cn(
                        "flex-1 rounded-[14px] px-4 py-2.5 text-sm font-secondary outline-none transition-all duration-200",
                        "bg-white/60 dark:bg-white/[0.04]",
                        "border border-[#0D1B2A]/10 dark:border-white/10",
                        "text-[#0D1B2A] dark:text-white",
                        "placeholder:text-[#0D1B2A]/30 dark:placeholder:text-white/30",
                        "focus:border-[#1A73E8]/60 focus:bg-white dark:focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"
                    )}
                />
            </div>

            {/* role */}
            <input
                ref={roleRef}
                type="text"
                placeholder="Role · Company (e.g. CEO at Acme)"
                className={cn(
                    "rounded-[14px] px-4 py-2.5 text-sm font-secondary outline-none transition-all duration-200",
                    "bg-white/60 dark:bg-white/[0.04]",
                    "border border-[#0D1B2A]/10 dark:border-white/10",
                    "text-[#0D1B2A] dark:text-white",
                    "placeholder:text-[#0D1B2A]/30 dark:placeholder:text-white/30",
                    "focus:border-[#1A73E8]/60 focus:bg-white dark:focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"
                )}
            />

            {/* message */}
            <textarea
                ref={messageRef}
                required
                rows={3}
                placeholder="Share your experience working with Jerry..."
                className={cn(
                    "rounded-[14px] px-4 py-3 text-sm font-secondary outline-none transition-all duration-200 resize-none",
                    "bg-white/60 dark:bg-white/[0.04]",
                    "border border-[#0D1B2A]/10 dark:border-white/10",
                    "text-[#0D1B2A] dark:text-white",
                    "placeholder:text-[#0D1B2A]/30 dark:placeholder:text-white/30",
                    "focus:border-[#1A73E8]/60 focus:bg-white dark:focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"
                )}
            />

            <button
                type="submit"
                disabled={submitting}
                className={cn(
                    "flex items-center justify-center gap-2 rounded-[14px] py-3 mt-1",
                    "text-sm font-semibold font-secondary text-white",
                    "bg-[#1A73E8] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#155fc2] active:scale-[0.98]",
                    "shadow-[0_4px_20px_rgba(26,115,232,0.3)] hover:shadow-[0_8px_25px_rgba(26,115,232,0.4)]",
                    submitting && "opacity-60 cursor-not-allowed"
                )}
            >
                {submitting ? "Submitting..." : "Submit Review"}
                <Send size={13} />
            </button>
        </form>
    );
}

// ── Main section ──────────────────────────────────────────────────────────────
export function CTASection() {
    const [showForm, setShowForm] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);

    useEffect(() => {
        async function fetchReviews() {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setReviews(data.map(mapReview));
            }
        }
        fetchReviews();
    }, []);

    const prev = () => setActiveIdx((i) => (i - 1 + reviews.length) % reviews.length);
    const next = () => setActiveIdx((i) => (i + 1) % reviews.length);

    return (
        <section
            id="contact"
            className="relative w-full overflow-hidden pb-10 md:pb-15 bg-white dark:bg-black"
        >
            {/* grid texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.06] bg-[linear-gradient(#0D1B2A_1px,transparent_1px),linear-gradient(90deg,#0D1B2A_1px,transparent_1px)] dark:bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* bottom glow — toned down in light mode */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-56 z-0 opacity-20 dark:opacity-100">
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 60% at 30% 100%, rgba(139,92,246,0.55) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 70% 100%, rgba(26,115,232,0.45) 0%, transparent 60%)",
                        filter: "blur(18px)",
                    }}
                />
            </div>

            {/* glass card */}
            <div className="relative z-10 mx-auto max-w-6xl px-5 md:px-8">
                <div
                    className="relative rounded-[40px] overflow-hidden border border-[#0D1B2A]/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] backdrop-blur-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.05)] dark:shadow-[0_32px_64px_rgba(0,0,0,0.2)]"
                >
                    {/* inner bottom glow */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 opacity-15 dark:opacity-100"
                        style={{
                            background:
                                "radial-gradient(ellipse 90% 80% at 40% 100%, rgba(139,92,246,0.3) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 75% 100%, rgba(26,115,232,0.25) 0%, transparent 65%)",
                        }}
                    />

                    <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0">

                        {/* ── LEFT ───────────────────────────────────────────────── */}
                        <div className="flex flex-col justify-center gap-7 p-8 md:p-12">

                            <div>
                                <h2
                                    className="font-primary leading-[1.05] tracking-[-0.03em] text-[#0D1B2A] dark:text-white"
                                    style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
                                >
                                    Let&apos;s Build
                                    <br />
                                    <div className="inline-block mt-2">
                                        <GradientText
                                            colors={["#1A73E8", "#8B5CF6", "#2BC48A"]}
                                            animationSpeed={4}
                                            showBorder={false}
                                            className="pb-2 !m-0"
                                        >
                                            Something Great
                                        </GradientText>
                                    </div>
                                </h2>
                                <p className="mt-4 text-sm md:text-base font-secondary text-[#0D1B2A]/55 dark:text-white/55 leading-relaxed max-w-sm">
                                    Open to new projects, collaborations, and opportunities.
                                    If you have an idea — let&apos;s talk.
                                </p>
                            </div>

                            {/* social links */}
                            <div className="flex items-center gap-3">
                                {[
                                    { icon: <Github size={18} />, href: "https://github.com/JerryOffiicial", label: "GitHub" },
                                    { icon: <Linkedin size={18} />, href: "https://linkedin.com/in/jerryson", label: "LinkedIn" },
                                    { icon: <Mail size={18} />, href: "mailto:jerrysonjerry1234@gmail.com", label: "Email" },
                                    { icon: <Phone size={18} />, href: "tel:+94762307416", label: "Phone" },
                                ].map(({ icon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={href.startsWith("http") ? "_blank" : undefined}
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                                            "border border-[#0D1B2A]/12 dark:border-white/12",
                                            "bg-[#0D1B2A]/[0.04] dark:bg-white/[0.06]",
                                            "text-[#0D1B2A]/60 dark:text-white/60",
                                            "hover:text-[#1A73E8] hover:border-[#1A73E8]/40",
                                            "dark:hover:text-white dark:hover:border-white/30 dark:hover:bg-white/10"
                                        )}
                                    >
                                        {icon}
                                    </a>
                                ))}
                            </div>

                            {/* send review button */}
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className={cn(
                                        "self-start flex items-center gap-2 rounded-2xl px-5 py-2.5 transition-all duration-200",
                                        "text-sm font-semibold font-secondary",
                                        "border border-[#0D1B2A]/12 dark:border-white/12",
                                        "bg-[#0D1B2A]/[0.04] dark:bg-white/[0.06]",
                                        "text-[#0D1B2A]/70 dark:text-white/80",
                                        "hover:border-[#1A73E8]/40 hover:text-[#1A73E8]",
                                        "dark:hover:border-white/25 dark:hover:bg-white/10 dark:hover:text-white"
                                    )}
                                >
                                    <MessageSquarePlus size={15} />
                                    Send a Review
                                </button>
                            )}

                            {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
                        </div>

                        {/* ── RIGHT ──────────────────────────────────────────────── */}
                        <div className="flex flex-col justify-center gap-6 p-8 md:p-12">

                            {/* slider */}
                            {reviews.length > 0 && (
                                <>
                                    <div className="overflow-hidden">
                                        <div
                                            className="flex transition-transform duration-500 ease-in-out"
                                            style={{ transform: `translateX(-${activeIdx * 100}%)` }}
                                        >
                                            {reviews.map((review) => (
                                                <div key={review.id} className="w-full shrink-0">
                                                    <ReviewCard review={review} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* controls */}
                                    <div className="flex items-center justify-between">
                                        {/* dots */}
                                        <div className="flex items-center gap-2">
                                            {reviews.map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setActiveIdx(i)}
                                                    aria-label={`Go to review ${i + 1}`}
                                                    className={cn(
                                                        "rounded-full transition-all duration-300",
                                                        i === activeIdx
                                                            ? "w-2 h-2 bg-[#1A73E8]"
                                                            : "w-2 h-2 bg-[#0D1B2A]/20 dark:bg-white/25 hover:bg-[#0D1B2A]/40 dark:hover:bg-white/50"
                                                    )}
                                                />
                                            ))}
                                        </div>

                                        {/* arrows */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={prev}
                                                aria-label="Previous review"
                                                className={cn(
                                                    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
                                                    "border border-[#0D1B2A]/12 dark:border-white/12",
                                                    "bg-[#0D1B2A]/[0.04] dark:bg-white/[0.06]",
                                                    "text-[#0D1B2A]/60 dark:text-white/60",
                                                    "hover:border-[#1A73E8]/40 hover:text-[#1A73E8]",
                                                    "dark:hover:border-white/30 dark:hover:text-white"
                                                )}
                                            >
                                                <ChevronLeft size={16} />
                                            </button>
                                            <button
                                                onClick={next}
                                                aria-label="Next review"
                                                className={cn(
                                                    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
                                                    "border border-[#0D1B2A]/12 dark:border-white/12",
                                                    "bg-[#0D1B2A]/[0.04] dark:bg-white/[0.06]",
                                                    "text-[#0D1B2A]/60 dark:text-white/60",
                                                    "hover:border-[#1A73E8]/40 hover:text-[#1A73E8]",
                                                    "dark:hover:border-white/30 dark:hover:text-white"
                                                )}
                                            >
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="translate-y-10">
                    <Footer />
                </div>
            </div>
        </section>
    );
}