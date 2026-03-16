"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { FAQ } from "@/types/database";
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminFAQs() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState({ question: "", answer: "" });
    const [isNew, setIsNew] = useState(false);

    const load = useCallback(async () => {
        const { data } = await supabase.from('faqs').select('*').order('sort_order');
        if (data) setFaqs(data);
    }, []);

    useEffect(() => { load(); }, [load]);

    const startNew = () => {
        setIsNew(true);
        setEditing("new");
        setForm({ question: "", answer: "" });
    };

    const startEdit = (faq: FAQ) => {
        setIsNew(false);
        setEditing(faq.id);
        setForm({ question: faq.question, answer: faq.answer });
    };

    const cancel = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        if (isNew) {
            await supabase.from('faqs').insert({
                question: form.question,
                answer: form.answer,
                sort_order: faqs.length,
            });
        } else if (editing) {
            await supabase.from('faqs').update({
                question: form.question,
                answer: form.answer,
            }).eq('id', editing);
        }
        cancel();
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return;
        await supabase.from('faqs').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">FAQs</h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">Manage the Q&A section on the About page.</p>
                </div>
                <button onClick={startNew} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] hover:bg-[#155fc2] transition-colors shadow-[0_4px_20px_rgba(26,115,232,0.3)]">
                    <Plus size={15} /> Add FAQ
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-4">
                    <input
                        value={form.question}
                        onChange={(e) => setForm({ ...form, question: e.target.value })}
                        placeholder="Question"
                        className="rounded-[14px] px-4 py-3 text-sm font-secondary outline-none bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60"
                    />
                    <textarea
                        value={form.answer}
                        onChange={(e) => setForm({ ...form, answer: e.target.value })}
                        placeholder="Answer"
                        rows={3}
                        className="rounded-[14px] px-4 py-3 text-sm font-secondary outline-none resize-none bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60"
                    />
                    <div className="flex items-center gap-2">
                        <button onClick={save} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold font-secondary text-white bg-[#2BC48A] hover:bg-[#24a775] transition-colors">
                            <Save size={14} /> Save
                        </button>
                        <button onClick={cancel} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-secondary text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                {faqs.length === 0 ? (
                    <p className="p-8 text-center text-sm font-secondary text-white/30">No FAQs yet. Click &quot;Add FAQ&quot; to create one.</p>
                ) : (
                    <div className="divide-y divide-white/[0.06]">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
                                <GripVertical size={16} className="text-white/15 mt-1 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold font-secondary text-white/90 truncate">{faq.question}</p>
                                    <p className="text-xs font-secondary text-white/40 mt-1 line-clamp-2">{faq.answer}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button onClick={() => startEdit(faq)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-[#1A73E8] transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => remove(faq.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-white/40 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
