"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
            {/* Background grid */}
            <div className="pointer-events-none fixed inset-0 opacity-[0.04] bg-[linear-gradient(#E6E9EC_1px,transparent_1px),linear-gradient(90deg,#E6E9EC_1px,transparent_1px)] bg-[size:60px_60px]" />

            {/* Glow */}
            <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]" style={{
                background: "radial-gradient(ellipse at center, rgba(26,115,232,0.15) 0%, transparent 70%)",
                filter: "blur(60px)",
            }} />

            <div className="relative w-full max-w-md">
                <div className="rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-10 shadow-[0_32px_64px_rgba(0,0,0,0.4)]">

                    {/* Logo / Title */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#1A73E8]/10 flex items-center justify-center border border-[#1A73E8]/20">
                            <LogIn size={24} className="text-[#1A73E8]" />
                        </div>
                        <h1 className="text-2xl font-primary font-bold tracking-[-0.03em] text-white">
                            Admin Dashboard
                        </h1>
                        <p className="mt-2 text-sm font-secondary text-white/40">
                            Sign in to manage your portfolio
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 font-secondary">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                        {/* Email */}
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                required
                                className="w-full rounded-[14px] pl-11 pr-4 py-3 text-sm font-secondary outline-none transition-all duration-200 bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60 focus:shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full rounded-[14px] pl-11 pr-4 py-3 text-sm font-secondary outline-none transition-all duration-200 bg-white/[0.04] border border-white/10 text-white placeholder:text-white/25 focus:border-[#1A73E8]/60 focus:shadow-[0_0_0_4px_rgba(26,115,232,0.1)]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 rounded-[14px] py-3.5 text-sm font-semibold font-secondary text-white bg-[#1A73E8] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#155fc2] active:scale-[0.98] shadow-[0_4px_20px_rgba(26,115,232,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                            <LogIn size={15} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
