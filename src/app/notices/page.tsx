import React from "react";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import { getAnnouncements } from "@/services/data-service";
import { Bell, User, Clock, FileText } from "lucide-react";

export default async function NoticesPage() {
  const announcements = await getAnnouncements();

  return (
    <main className="min-h-screen pb-24 md:pb-0 md:pt-20 bg-slate-50 selection:bg-primary/30 selection:text-primary">
      <Navbar />

      <section className="px-6 py-12 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-primary text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-primary/20">
            <Bell size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black">공지사항 및 새소식</h2>
            <p className="text-slate-400 font-bold text-sm">PAV 수련회의 실시간 소식을 확인하세요.</p>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {announcements.length > 0 ? (
            announcements.map((notice) => (
              <div 
                key={notice.id} 
                className="glass p-8 rounded-[2rem] shadow-premium flex flex-col gap-6 relative border-none"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 font-black text-primary">
                    <User size={18} />
                    {notice.author}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100/50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                    <Clock size={14} />
                    {notice.timeStr}
                  </div>
                </div>

                <div className="text-slate-800 font-bold text-lg leading-relaxed whitespace-pre-wrap">
                  {notice.content}
                </div>

                {notice.fileUrl && (
                  <a 
                    href={notice.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-primary font-black text-sm hover:bg-primary/10 transition-colors group"
                  >
                    <FileText size={20} className="group-hover:scale-110 transition-transform" />
                    첨부파일: {notice.fileName || "파일 보기"}
                  </a>
                )}
              </div>
            ))
          ) : (
            <div className="py-40 text-center flex flex-col items-center gap-4 text-slate-300">
              <Bell size={60} strokeWidth={1} className="opacity-20 translate-y-4" />
              <p className="text-xl font-black italic">아직 등록된 새소식이 없습니다.</p>
            </div>
          )}
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
