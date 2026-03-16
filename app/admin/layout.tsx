"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    LayoutDashboard,
    HelpCircle,
    Sparkles,
    FolderKanban,
    FileText,
    Star,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    { label: "Skills", href: "/admin/skills", icon: Sparkles },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Blogs", href: "/admin/blogs", icon: FileText },
    { label: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Skip auth check for login page
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (isLoginPage) {
            setChecking(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.replace("/admin/login");
            } else {
                setChecking(false);
            }
        });
    }, [router, isLoginPage]);

    // If login page, render children directly
    if (isLoginPage) {
        return <>{children}</>;
    }

    if (checking) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex">
            {/* Background grid */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.03] bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:60px_60px] z-0" />

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:sticky top-0 left-0 h-screen w-[260px] z-50 flex flex-col transition-transform duration-300",
                    "border-r border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-white/[0.06]">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#1A73E8]/15 flex items-center justify-center border border-[#1A73E8]/25">
                            <LayoutDashboard size={15} className="text-[#1A73E8]" />
                        </div>
                        <span className="font-primary text-sm font-semibold tracking-[-0.02em] text-white">
                            Jerry Admin
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <div className="flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-secondary transition-all duration-200",
                                        isActive
                                            ? "bg-[#1A73E8]/10 text-[#1A73E8] font-semibold border border-[#1A73E8]/15"
                                            : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                                    )}
                                >
                                    <item.icon size={17} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-white/[0.06]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-secondary text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={17} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen relative z-10">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="text-sm font-secondary text-white/30">
                        Portfolio Management
                    </div>
                    <div />
                </header>

                {/* Page content */}
                <main className="flex-1 p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
