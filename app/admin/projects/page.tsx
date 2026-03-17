"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/database";
import { Plus, Pencil, Trash2, Save, X, ExternalLink, ImagePlus, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
    title: "", category: "", overview: "", stack: "",
    live_url: "", github_url: "", images: "",
    year: "", accent_color: "#1A73E8", bg_classes: "",
};

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isNew, setIsNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        const { data } = await supabase.from('projects').select('*').order('sort_order');
        if (data) setProjects(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const startNew = () => {
        setIsNew(true);
        setEditing("new");
        setForm(EMPTY_FORM);
    };

    const startEdit = (p: Project) => {
        setIsNew(false);
        setEditing(p.id);
        setForm({
            title: p.title,
            category: p.category,
            overview: p.overview,
            stack: p.stack.join(", "),
            live_url: p.live_url,
            github_url: p.github_url,
            images: p.images.join("\n"),
            year: p.year,
            accent_color: p.accent_color,
            bg_classes: p.bg_classes,
        });
    };

    const cancel = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        const payload = {
            title: form.title,
            category: form.category,
            overview: form.overview,
            stack: form.stack.split(",").map(s => s.trim()).filter(Boolean),
            live_url: form.live_url,
            github_url: form.github_url,
            images: form.images.split(/\r?\n/).map(s => s.trim()).filter(Boolean),
            year: form.year,
            accent_color: form.accent_color,
            bg_classes: form.bg_classes,
        };

        if (isNew) {
            await supabase.from('projects').insert({ ...payload, sort_order: projects.length });
        } else if (editing) {
            await supabase.from('projects').update(payload).eq('id', editing);
        }
        cancel();
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this project?")) return;
        await supabase.from('projects').delete().eq('id', id);
        load();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isUploading) return;
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const ext = file.name.split('.').pop();
        const fileName = `projects/${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file, { upsert: true });

        if (!error && data) {
            const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(data.path);
            const publicUrl = urlData.publicUrl;
            setForm(prev => ({
                ...prev,
                images: prev.images ? `${prev.images}\n${publicUrl}` : publicUrl,
            }));
        } else {
            alert(`Upload failed: ${error?.message}`);
        }
        setIsUploading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const InputCls = "rounded-[14px] px-4 py-3 text-sm font-secondary outline-none bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60 w-full";

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">Projects</h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">Manage your portfolio projects.</p>
                </div>
                <button onClick={startNew} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] hover:bg-[#155fc2] transition-colors shadow-[0_4px_20px_rgba(26,115,232,0.3)]">
                    <Plus size={15} /> Add Project
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project title" className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Category</label>
                            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Full Stack · Travel" className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Year</label>
                            <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2026" className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Stack (comma separated)</label>
                            <input value={form.stack} onChange={(e) => setForm({ ...form, stack: e.target.value })} placeholder="Next.js, TypeScript, ..." className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Live URL</label>
                            <input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} placeholder="https://..." className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">GitHub URL</label>
                            <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Accent Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer" />
                                <input value={form.accent_color} onChange={(e) => setForm({ ...form, accent_color: e.target.value })} className={InputCls} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">BG Classes</label>
                            <input value={form.bg_classes} onChange={(e) => setForm({ ...form, bg_classes: e.target.value })} placeholder="bg-[#F4F7FF] dark:bg-[#080D1A]" className={InputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-secondary text-white/40 mb-1 block">Overview</label>
                        <textarea value={form.overview} onChange={(e) => setForm({ ...form, overview: e.target.value })} rows={3} placeholder="Project overview..." className={cn(InputCls, "resize-none")} />
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-secondary text-white/40 flex items-center gap-1"><ImagePlus size={12} /> Images (one URL per line)</label>
                            <div className="flex items-center gap-2">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="project-image-upload"
                                    disabled={isUploading}
                                    aria-disabled={isUploading}
                                />
                                <label
                                    htmlFor="project-image-upload"
                                    className={cn(
                                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold font-secondary cursor-pointer border transition-colors",
                                        isUploading
                                            ? "border-white/10 text-white/30 cursor-not-allowed"
                                            : "border-[#1A73E8]/40 text-[#1A73E8] bg-[#1A73E8]/10 hover:bg-[#1A73E8]/20"
                                    )}
                                >
                                    {isUploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                    {isUploading ? "Uploading..." : "Upload Image"}
                                </label>
                            </div>
                        </div>
                        <textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} placeholder="/projects/my-project/image1.png&#10;or paste a URL here" className={cn(InputCls, "resize-none")} />
                    </div>
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

            {/* Loading State */}
            {isLoading ? (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-7 h-7 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-secondary text-white/30">Loading projects...</p>
                    </div>
                </div>
            ) : (
                /* Project cards */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.length === 0 && (
                        <p className="p-8 col-span-2 text-center text-sm font-secondary text-white/30">No projects yet.</p>
                    )}
                    {projects.map((p) => (
                        <div key={p.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 group hover:bg-white/[0.04] transition-colors">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h3 className="text-base font-primary font-semibold text-white">{p.title}</h3>
                                    <p className="text-xs font-secondary text-white/40 mt-0.5">{p.category} · {p.year}</p>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {p.live_url && (
                                        <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/30 hover:text-[#1A73E8] transition-colors">
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
                                    <button onClick={() => startEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/30 hover:text-[#1A73E8] transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs font-secondary text-white/40 line-clamp-2 mb-3">{p.overview}</p>
                            <div className="flex flex-wrap gap-1">
                                {p.stack.map((tech) => (
                                    <span key={tech} className="rounded-full px-2.5 py-0.5 text-[10px] font-secondary font-semibold border border-white/[0.08] bg-white/[0.03] text-white/50">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
