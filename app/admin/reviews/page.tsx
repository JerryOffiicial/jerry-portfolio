"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Review } from "@/types/database";
import { Check, Trash2, Star, Clock, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(async () => {
        setIsLoading(true);
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
        if (data) setReviews(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const approve = async (id: string) => {
        const { error } = await supabase.from('reviews').update({ status: 'approved' }).eq('id', id);
        if (error) { alert(`Failed to approve review: ${error.message}`); return; }
        load();
    };

    const reject = async (id: string) => {
        const { error } = await supabase.from('reviews').update({ status: 'rejected' }).eq('id', id);
        if (error) { alert(`Failed to reject review: ${error.message}`); return; }
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this review permanently?")) return;
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) { alert(`Failed to delete review: ${error.message}`); return; }
        load();
    };

    const filtered = filter === "all" ? reviews : reviews.filter(r => r.status === filter);

    const statusColors: Record<string, string> = {
        pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
        approved: "text-green-400 bg-green-500/10 border-green-500/20",
        rejected: "text-red-400 bg-red-500/10 border-red-500/20",
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">Reviews</h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">Approve, reject, or remove visitor reviews.</p>
                </div>
                <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
                    {(["all", "pending", "approved", "rejected"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "rounded-lg px-3 py-1.5 text-xs font-semibold font-secondary transition-colors capitalize",
                                filter === f ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center gap-1.5 text-xs font-secondary text-yellow-400">
                    <Clock size={12} /> {reviews.filter(r => r.status === "pending").length} pending
                </span>
                <span className="flex items-center gap-1.5 text-xs font-secondary text-green-400">
                    <CheckCircle size={12} /> {reviews.filter(r => r.status === "approved").length} approved
                </span>
                <span className="flex items-center gap-1.5 text-xs font-secondary text-red-400">
                    <XCircle size={12} /> {reviews.filter(r => r.status === "rejected").length} rejected
                </span>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-12 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-secondary text-white/30">Loading reviews...</p>
                    </div>
                </div>
            ) : (
                /* Reviews list */
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                    {filtered.length === 0 ? (
                        <p className="p-8 text-center text-sm font-secondary text-white/30">No reviews to show.</p>
                    ) : (
                        <div className="divide-y divide-white/[0.06]">
                            {filtered.map((review) => (
                                <div key={review.id} className="p-5 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <p className="text-sm font-semibold font-secondary text-white">{review.name}</p>
                                                <span className={cn("text-[10px] font-semibold font-secondary px-2 py-0.5 rounded-full border capitalize", statusColors[review.status] || statusColors.pending)}>
                                                    {review.status}
                                                </span>
                                            </div>
                                            <p className="text-xs font-secondary text-white/40 mb-2">{review.role}</p>
                                            {/* Stars */}
                                            <div className="flex items-center gap-0.5 mb-2">
                                                {[1, 2, 3, 4, 5].map((n) => (
                                                    <Star key={n} size={12} fill={n <= review.rating ? "#FBBC04" : "transparent"} stroke={n <= review.rating ? "#FBBC04" : "#ffffff30"} />
                                                ))}
                                            </div>
                                            <p className="text-sm font-secondary text-white/60 leading-relaxed">&ldquo;{review.message}&rdquo;</p>
                                            <p className="text-[10px] font-secondary text-white/20 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                                        </div>

                                        <div className="flex flex-col gap-1 shrink-0">
                                            {/* Show Approve for pending OR rejected reviews */}
                                            {(review.status === "pending" || review.status === "rejected") && (
                                                <button onClick={() => approve(review.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold font-secondary text-green-400 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 transition-colors">
                                                    <Check size={12} /> Approve
                                                </button>
                                            )}
                                            {/* Show Reject for pending OR approved reviews */}
                                            {(review.status === "pending" || review.status === "approved") && (
                                                <button onClick={() => reject(review.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-secondary text-white/40 hover:text-red-400 border border-white/10 hover:border-red-500/20 hover:bg-red-500/10 transition-colors">
                                                    Reject
                                                </button>
                                            )}
                                            <button onClick={() => remove(review.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-secondary text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                                                <Trash2 size={12} /> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
