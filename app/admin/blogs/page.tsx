"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import type { Blog } from "@/types/database";
import { Plus, Pencil, Trash2, Save, X, Calendar, Upload, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_FORM = {
    title: "", excerpt: "", content: "", category: "technologies",
    date: new Date().toISOString().split("T")[0], creator: "Jerry",
    image_url: "", tags: "",
};

export default function AdminBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isNew, setIsNew] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const load = useCallback(async () => {
        setIsLoading(true);
        const { data } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (data) setBlogs(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const startNew = () => { setIsNew(true); setEditing("new"); setForm(EMPTY_FORM); };

    const startEdit = (b: Blog) => {
        setIsNew(false);
        setEditing(b.id);
        setForm({
            title: b.title, excerpt: b.excerpt, content: b.content,
            category: b.category, date: b.date, creator: b.creator,
            image_url: b.image_url, tags: b.tags.join(", "),
        });
    };

    const cancel = () => { setEditing(null); setIsNew(false); };

    const save = async () => {
        const payload = {
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            category: form.category,
            date: form.date,
            creator: form.creator,
            image_url: form.image_url,
            tags: form.tags.split(",").map(s => s.trim()).filter(Boolean),
        };

        if (isNew) {
            await supabase.from('blogs').insert(payload);
        } else if (editing) {
            await supabase.from('blogs').update(payload).eq('id', editing);
        }
        cancel();
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Delete this blog post?")) return;
        await supabase.from('blogs').delete().eq('id', id);
        load();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const ext = file.name.split('.').pop();
        const fileName = `blogs/${Date.now()}.${ext}`;

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(fileName, file, { upsert: true });

        if (!error && data) {
            const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(data.path);
            setForm(prev => ({ ...prev, image_url: urlData.publicUrl }));
        } else {
            alert(`Upload failed: ${error?.message}`);
        }
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const InputCls = "rounded-[14px] px-4 py-3 text-sm font-secondary outline-none bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60 w-full";
    const CATEGORIES = ["technologies", "concepts", "projects", "solutions"];

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">Blogs</h1>
                    <p className="text-sm font-secondary text-white/40 mt-1">Manage your blog posts.</p>
                </div>
                <button onClick={startNew} className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] hover:bg-[#155fc2] transition-colors shadow-[0_4px_20px_rgba(26,115,232,0.3)]">
                    <Plus size={15} /> Add Post
                </button>
            </div>

            {/* Form */}
            {editing && (
                <div className="mb-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog post title" className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={cn(InputCls, "appearance-none cursor-pointer")}>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c} className="bg-[#111] text-white">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Date</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={InputCls} />
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Creator</label>
                            <input value={form.creator} onChange={(e) => setForm({ ...form, creator: e.target.value })} placeholder="Author name" className={InputCls} />
                        </div>
                        <div className="md:col-span-2">
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-xs font-secondary text-white/40">Cover Image</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="blog-image-upload"
                                    />
                                    <label
                                        htmlFor="blog-image-upload"
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
                            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/blogs/image.webp or upload above" className={InputCls} />
                            {form.image_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.image_url} alt="preview" className="mt-2 h-20 object-cover rounded-lg border border-white/10" />
                            )}
                        </div>
                        <div>
                            <label className="text-xs font-secondary text-white/40 mb-1 block">Tags (comma separated)</label>
                            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Next.js, React" className={InputCls} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-secondary text-white/40 mb-1 block">Excerpt (short preview)</label>
                        <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} placeholder="Short preview shown in the card..." className={cn(InputCls, "resize-none")} />
                    </div>
                    <div>
                        <label className="text-xs font-secondary text-white/40 mb-1 block">Full Content</label>
                        <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} placeholder="Full blog post content..." className={cn(InputCls, "resize-none")} />
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
                        <p className="text-xs font-secondary text-white/30">Loading blog posts...</p>
                    </div>
                </div>
            ) : (
                /* Blog list */
                <div className="rounded-2xl border border-white/[0.06] overflow-hidden">
                    {blogs.length === 0 ? (
                        <p className="p-8 text-center text-sm font-secondary text-white/30">No blog posts yet.</p>
                    ) : (
                        <div className="divide-y divide-white/[0.06]">
                            {blogs.map((blog) => (
                                <div key={blog.id} className="flex items-start gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
                                    {blog.image_url && (
                                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-white/[0.04]">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold font-secondary text-white/90 truncate">{blog.title}</p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] uppercase font-semibold font-secondary px-2 py-0.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/50">{blog.category}</span>
                                            <span className="flex items-center gap-1 text-xs font-secondary text-white/30">
                                                <Calendar size={10} /> {blog.date}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button onClick={() => startEdit(blog)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/30 hover:text-[#1A73E8] transition-colors">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => remove(blog.id)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
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
