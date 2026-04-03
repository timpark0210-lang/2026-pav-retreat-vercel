"use client";

import React, { useState, Suspense } from "react";
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const from = searchParams.get("from") || "/admin";
        router.replace(from);
      } else {
        const data = await response.json();
        setError(data.error || "부적절한 비밀번호입니다.");
      }
    } catch (err) {
      setError("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md glass p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center border-none">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-[1.75rem] flex items-center justify-center mb-8 shadow-inner">
        <ShieldCheck size={36} />
      </div>

      <h1 className="text-3xl font-black mb-4 tracking-tight">관리자 인증</h1>
      <p className="text-sm text-slate-400 font-bold mb-10 text-center leading-relaxed">
        수련회 운영 정보 관리를 위해 <br /> 비밀번호를 입력해주세요.
      </p>

      <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
        <div className="relative group">
          <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="password"
            placeholder="Admin Password"
            className="w-full pl-14 pr-6 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-500 font-black text-xs px-2 animate-shake">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {loading ? "인증 중..." : "인증하기"}
          {!loading && <ArrowRight size={20} />}
        </button>
      </form>

      <div className="mt-12 text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose text-center">
          2026 pav youth retreat <br /> admin portal security
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <Suspense fallback={
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-200 rounded-3xl mb-8" />
          <div className="h-8 bg-slate-200 w-32 rounded mb-4" />
          <div className="h-4 bg-slate-200 w-48 rounded" />
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
