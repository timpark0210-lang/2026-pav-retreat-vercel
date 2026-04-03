"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { LayoutDashboard, FilePlus, Users, Bell, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleCreateForm = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/admin/create-form", { method: "POST" });
      const data = await response.json();

      if (response.ok) {
        setSuccess(`구글 폼이 성공적으로 생성되었습니다: ${data.url}`);
      } else {
        setError(data.error || "폼 생성에 실패했습니다.");
      }
    } catch (err) {
      setError("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pb-24 md:pb-0 md:pt-20 bg-slate-50">
      <Navbar />

      <section className="px-6 py-12 max-w-7xl mx-auto flex flex-col gap-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black">수련회 관리 센터</h1>
              <p className="text-slate-400 font-bold text-sm italic">Admin Control Center</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="glass p-8 rounded-[2rem] shadow-premium col-span-1 md:col-span-2 border-primary/10">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                <FilePlus className="text-primary" />
                수련회 신청 폼 관리
            </h3>
            
            <p className="text-slate-500 font-bold mb-8 leading-relaxed max-w-xl text-sm">
                신규 구글 폼을 자동으로 생성하고 전체 공지 버튼의 URL을 업데이트합니다. 
                <br /> 기존 폼이 있더라도 실행 시 새로 생성됩니다. (SSOT 기반 최신화)
            </p>

            <button
                onClick={handleCreateForm}
                disabled={loading}
                className="group px-8 py-4 bg-primary text-white rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all border-none"
            >
                {loading ? <RefreshCw className="animate-spin" size={20} /> : <FilePlus size={20} />}
                {loading ? "구글 폼 생성 중..." : "신규 참가 신청 폼 생성하기"}
            </button>

            {success && (
                <div className="mt-8 p-6 bg-green-50 text-green-600 rounded-2xl border border-green-100 flex flex-col gap-3 animate-fade-in shadow-inner">
                    <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider">
                        <CheckCircle size={18} />
                        Successfully Created
                    </div>
                    <a href={success.split(": ")[1]} target="_blank" className="font-bold text-xs truncate underline transition-opacity hover:opacity-70">
                        {success.split(": ")[1]}
                    </a>
                </div>
            )}

            {error && (
                <div className="mt-8 p-6 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-3 animate-shake shadow-inner font-black text-sm">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="glass p-8 rounded-[2rem] shadow-premium flex flex-col gap-8">
            <h3 className="text-xl font-black flex items-center gap-2">
                <Users className="text-primary" />
                통계 및 현황
            </h3>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">전체 학생</span>
                    <span className="text-3xl font-black text-slate-800 tracking-tight">-- 명</span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">참가 확정</span>
                    <span className="text-3xl font-black text-green-500 tracking-tight">-- 명</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-[10px] font-bold text-slate-400 italic">
                    * 통계 로직은 Phase 5에서 <br /> 실시간 Sheets 연동 예정입니다.
                </div>
            </div>
          </div>
        </div>

        {/* Placeholders for other admin modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 opacity-40 grayscale pointer-events-none">
            <div className="glass p-8 rounded-[2rem] border-dashed border-2 border-slate-200">
                <h3 className="text-lg font-black flex items-center gap-2 mb-4">
                    <Bell size={20} />
                    공지사항 게시/관리
                </h3>
                <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            </div>
            <div className="glass p-8 rounded-[2rem] border-dashed border-2 border-slate-200">
                <h3 className="text-lg font-black flex items-center gap-2 mb-4">
                    <Users size={20} />
                    출석부 명단 편집
                </h3>
                <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
            </div>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center opacity-40">
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">P</div>
                <span className="font-black tracking-tight">PAV SPIRITUAL RETREAT 2026</span>
            </div>
            <p className="text-xs font-bold">© PAV Admin System. Developed with Antigravity.</p>
        </div>
      </footer>
    </main>
  );
}
