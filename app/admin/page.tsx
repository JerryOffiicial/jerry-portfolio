"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FolderKanban, FileText, Star, HelpCircle, Sparkles, Clock } from "lucide-react";

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
            const [projects, blogs, skills, faqs, approved, pending] = await Promise.all([
                supabase.from('projects').select('id', { count: 'exact', head: true }),
                supabase.from('blogs').select('id', { count: 'exact', head: true }),
                supabase.from('skills').select('id', { count: 'exact', head: true }),
                supabase.from('faqs').select('id', { count: 'exact', head: true }),
                supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
                supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
            ]);

            setStats({
                projects: projects.count ?? 0,
                blogs: blogs.count ?? 0,
                skills: skills.count ?? 0,
                faqs: faqs.count ?? 0,
                approvedReviews: approved.count ?? 0,
                pendingReviews: pending.count ?? 0,
            });
        }
        fetchStats();
    }, []);

    const cards = [
        { label: "Projects", value: stats.projects, icon: FolderKanban, color: "#1A73E8" },
        { label: "Blog Posts", value: stats.blogs, icon: FileText, color: "#2BC48A" },
        { label: "Skills", value: stats.skills, icon: Sparkles, color: "#8B5CF6" },
        { label: "FAQs", value: stats.faqs, icon: HelpCircle, color: "#FBBC04" },
        { label: "Reviews (Approved)", value: stats.approvedReviews, icon: Star, color: "#2BC48A" },
        { label: "Reviews (Pending)", value: stats.pendingReviews, icon: Clock, color: "#EA4335" },
    ];

    return (
        <div>
            <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white mb-2">
                Dashboard
            </h1>
            <p className="text-sm font-secondary text-white/40 mb-8">
                Overview of your portfolio content.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex items-start gap-4 transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.1]"
                    >
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: `${card.color}15`, border: `1px solid ${card.color}25` }}
                        >
                            <card.icon size={19} style={{ color: card.color }} />
                        </div>
                        <div>
                            <p className="text-3xl font-primary font-bold tracking-[-0.03em] text-white">{card.value}</p>
                            <p className="text-xs font-secondary text-white/40 mt-1">{card.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
