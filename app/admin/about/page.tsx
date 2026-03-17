"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Bot, RefreshCw } from "lucide-react";

const DEFAULT_CONTENT = `You are an AI assistant for Gunaseelan Jerryson's portfolio. Answer questions about Jerry naturally and helpfully.

About:
- Full Stack Developer based in Kandy, Sri Lanka
- Skilled in React, Next.js, TypeScript, Tailwind CSS, Node.js, Express.js, Supabase, Sanity.io
- Also knows Java, C#, .NET, MongoDB, SQL Server, Firebase

Experience:
- Junior Full Stack Developer at Global Island (Pvt) Ltd – LK Web Design (Nov 2025 – Feb 2026)

Projects:
- Elephant Tours: full-stack travel app, Next.js + Supabase + Sanity.io, live at elephant-travels-revamp.vercel.app
- LK Web Design: frontend contributions, live at lkwebdesign.vercel.app

Education:
- Higher Diploma in Computing & Software Engineering, ICBT Campus Kandy (2025)

Contact:
- Email: jerrysonjerry1234@gmail.com
- Phone: +94-76-230-7416
- GitHub: github.com/JerryOffiicial

Always respond in first person as Jerry. Be friendly, concise, and professional.`;

export default function AdminAbout() {
    const [content, setContent] = useState("");
    const [rowId, setRowId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedAt, setSavedAt] = useState<string | null>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        const { data } = await supabase
            .from('knowledge_base')
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(1)
            .single();

        if (data) {
            setContent(data.content);
            setRowId(data.id);
            setSavedAt(new Date(data.updated_at).toLocaleString());
        } else {
            // If no row exists yet, start with the default
            setContent(DEFAULT_CONTENT);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const save = async () => {
        setIsSaving(true);
        const now = new Date().toISOString();

        if (rowId) {
            await supabase
                .from('knowledge_base')
                .update({ content, updated_at: now })
                .eq('id', rowId);
        } else {
            const { data } = await supabase
                .from('knowledge_base')
                .insert({ content, updated_at: now })
                .select()
                .single();
            if (data) setRowId(data.id);
        }

        setSavedAt(new Date(now).toLocaleString());
        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white flex items-center gap-3">
                        <Bot size={24} className="text-[#1A73E8]" /> AI Knowledge Base
                    </h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">
                        Edit the context that the AI chat uses to answer questions about you.
                        Changes are live immediately after saving.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={load}
                        disabled={isLoading}
                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={save}
                        disabled={isSaving || isLoading}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] hover:bg-[#155fc2] transition-colors shadow-[0_4px_20px_rgba(26,115,232,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={15} />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

            {/* Tips */}
            <div className="mb-4 rounded-2xl border border-[#1A73E8]/20 bg-[#1A73E8]/05 p-4">
                <p className="text-xs font-secondary text-[#1A73E8]/80 leading-relaxed">
                    <strong>Tips:</strong> Write in plain text. Use bullet points to structure information (skills, projects, experience, etc.).
                    The AI will use this as its entire knowledge of you — keep it accurate and up to date.
                    The instruction at the top ("You are an AI assistant for...") tells the AI how to behave.
                </p>
            </div>

            {isLoading ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-secondary text-white/30">Loading knowledge base...</p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={28}
                        spellCheck={false}
                        className="w-full px-6 py-5 text-sm font-secondary text-white/80 bg-transparent outline-none resize-none placeholder:text-white/20 leading-relaxed"
                        placeholder="Write your AI knowledge base here..."
                    />
                    <div className="border-t border-white/[0.06] px-6 py-3 flex items-center justify-between">
                        <p className="text-[11px] font-secondary text-white/20">
                            {content.length.toLocaleString()} characters
                        </p>
                        {savedAt && (
                            <p className="text-[11px] font-secondary text-white/20">
                                Last saved: {savedAt}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
