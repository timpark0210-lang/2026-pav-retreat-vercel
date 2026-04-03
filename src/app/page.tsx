import React from "react";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import NoticeSection from "@/components/NoticeSection";
import { getAnnouncements, getStudentData } from "@/services/data-service";
import { ShieldCheck, CreditCard, Clock, Map } from "lucide-react";

export default async function HomePage() {
  // Fetch data on the server
  const announcements = await getAnnouncements();
  const studentData = await getStudentData();

  // For initial demo, we'll use a hardcoded form URL if not in sheets.
  // In production, we'd fetch this from MainData sheet.
  const formUrl = "https://forms.gle/vP7fK9aMscZ6X9N38";

  return (
    <main className="min-h-screen pb-24 md:pb-0 md:pt-20 bg-surface selection:bg-primary/30 selection:text-primary">
      <Navbar />

      {/* Main Hero Section */}
      <Hero formUrl={formUrl} />

      {/* Announcements Section */}
      <NoticeSection notices={announcements} />

      {/* Information Cards */}
      <section className="px-6 py-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-[2rem] shadow-premium hover:-translate-y-2 transition-all">
          <div className="w-12 h-12 bg-blue-100 text-primary rounded-2xl flex items-center justify-center mb-6">
            <CreditCard size={24} />
          </div>
          <h3 className="text-xl font-black mb-3">회비 납부 정보</h3>
          <p className="text-sm text-slate-500 font-bold mb-4">Account Number:</p>
          <div className="p-4 bg-slate-50 rounded-xl font-mono text-sm font-black text-slate-700">
            06-0293-0328156-01
          </div>
          <p className="text-xs text-slate-400 mt-4 italic font-bold">Ref: [Student Name] Retreat</p>
        </div>

        <div className="glass p-8 rounded-[2rem] shadow-premium hover:-translate-y-2 transition-all">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
            <Clock size={24} />
          </div>
          <h3 className="text-xl font-black mb-3">일정 및 장소</h3>
          <p className="text-sm text-slate-700 font-bold leading-relaxed">
            4월 17일(금) 오후 1시 교회 출발 <br />
            4월 19일(주일) 오후 1시 현지 출발
          </p>
        </div>

        <div className="glass p-8 rounded-[2rem] shadow-premium hover:-translate-y-2 transition-all col-span-1 md:col-span-2">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
            <Map size={24} />
          </div>
          <h3 className="text-xl font-black mb-3">숙소 위치: Moirs Point</h3>
          <p className="text-sm text-slate-700 font-bold mb-4">
            Moirs Point Christian Centre, Mangawhai <br />
            아름다운 망가와이 해변 근처의 쾌적한 시설입니다.
          </p>
          <a 
            href="https://maps.app.goo.gl/pWf1YmKsh5zY8G3v5" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-slate-800 transition-colors"
          >
            기기로 지도 보기
          </a>
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center opacity-40">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">P</div>
            <span className="font-black tracking-tight">PAV SPIRITUAL RETREAT 2026</span>
          </div>
          <p className="text-xs font-bold">© 2026 PAV Youth. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
