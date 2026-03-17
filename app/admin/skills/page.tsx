"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Skill } from "@/types/database";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "" });
    const [isNew, setIsNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const load = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await supabase.from('skills').select('*').order('sort_order');
            if (data) setSkills(data);
        } catch (err) {
            console.error('Failed to load skills:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const startNew = () => { setIsNew(true); setEditing("new"); setForm({ name: "" }); };
    const startEdit = (s: Skill) => { setIsNew(false); setEditing(s.id); setForm({ name: s.name }); };
    const cancel = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        if (isNew) {
            await supabase.from('skills').insert({ name: form.name, sort_order: skills.length });
        } else if (editing) {
            await supabase.from('skills').update({ name: form.name }).eq('id', editing);
        }
        cancel();
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this skill?")) return;
        await supabase.from('skills').delete().eq('id', id);
        load();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">Skills</h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">Manage the skills carousel on the About page.</p>
                </div>
                <button onClick={startNew} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] hover:bg-[#155fc2] transition-colors shadow-[0_4px_20px_rgba(26,115,232,0.3)]">
                    <Plus size={15} /> Add Skill
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex items-center gap-3">
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ name: e.target.value })}
                        placeholder="Skill name (e.g. React.js)"
                        className="flex-1 rounded-[14px] px-4 py-3 text-sm font-secondary outline-none bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60"
                    />
                    <button onClick={save} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#2BC48A] hover:bg-[#24a775] transition-colors">
                        <Save size={14} /> Save
                    </button>
                    <button onClick={cancel} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-secondary text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* Loading State */}
            {isLoading ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-secondary text-white/30">Loading skills...</p>
                    </div>
                </div>
            ) : (
                /* Skills grid */
                <div className="flex flex-wrap gap-2">
                    {skills.length === 0 && (
                        <p className="p-8 text-center text-sm font-secondary text-white/30 w-full">No skills yet.</p>
                    )}
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="group flex items-center gap-2 rounded-full px-4 py-2 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                        >
                            <span className="text-sm font-secondary text-white/70">{skill.name}</span>
                            <button onClick={() => startEdit(skill)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-[#1A73E8] transition-all">
                                <Pencil size={12} />
                            </button>
                            <button onClick={() => remove(skill.id)} className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
