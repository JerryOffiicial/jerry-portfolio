"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FolderKanban, FileText, Star, HelpCircle, Sparkles, Clock, ArrowUpRight, Activity } from "lucide-react";
import Link from "next/link";

interface Stats {
    projects: number;
    blogs: number;
    skills: number;
    faqs: number;
    approvedReviews: number;
    pendingReviews: number;
}

export default function AdminOverview() {
    const [stats, setStats] = useState<Stats>({ projects: 0, blogs: 0, skills: 0, faqs: 0, approvedReviews: 0, pendingReviews: 0 });

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/admin?endpoint=stats');
                const result = await response.json();
                
                if (!response.ok) {
                    console.error('Failed to fetch stats:', result.error);
                    return;
                }

                setStats(result.data);
            } catch (error) {
                console.error('Stats fetch error:', error);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { label: "Projects", value: stats.projects, icon: FolderKanban, color: "#1A73E8", href: "/admin/projects" },
        { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "#2BC48A", href: "/admin/blogs" },
        { label: "Skills", value: stats.skills, icon: Sparkles, color: "#8B5CF6", href: "/admin/skills" },
        { label: "FAQs", value: stats.faqs, icon: HelpCircle, color: "#FBBC04", href: "/admin/faqs" },
        { label: "Reviews (Approved)", value: stats.approvedReviews, icon: Star, color: "#2BC48A", href: "/admin/reviews" },
        { label: "Reviews (Pending)", value: stats.pendingReviews, icon: Clock, color: "#EA4335", href: "/admin/reviews" },
    ];

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] border border-white/[0.05] p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#1A73E8]/10 blur-[100px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-primary font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                        Dashboard <Activity className="text-[#1A73E8] animate-pulse" size={28} />
                    </h1>
                    <p className="text-sm md:text-base font-secondary text-white/50">
                        Overview of your portfolio content and metrics.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {cards.map((card) => (
                    <Link href={card.href} key={card.label} className="block group">
                        <div
                            className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8 flex flex-col gap-6 overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl transition-opacity duration-500 opacity-0 group-hover:opacity-20" style={{ background: card.color }} />
                            
                            <div className="flex items-center justify-between relative z-10">
                                <div
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-lg"
                                    style={{ background: `${card.color}15`, border: `1px solid ${card.color}30` }}
                                >
                                    <card.icon size={24} style={{ color: card.color }} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowUpRight size={16} className="text-white/70" />
                                </div>
                            </div>
                            
                            <div className="relative z-10">
                                <p className="text-4xl md:text-5xl font-primary font-bold tracking-[-0.03em] text-white mb-2">{card.value}</p>
                                <p className="text-sm md:text-base font-secondary tracking-wide text-white/50 uppercase">{card.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
