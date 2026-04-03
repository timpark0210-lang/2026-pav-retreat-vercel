import React from "react";
import { Bell, User, Clock, ChevronRight } from "lucide-react";
import { Announcement } from "@/services/data-service";

interface NoticeSectionProps {
  notices: Announcement[];
}

export default function NoticeSection({ notices }: NoticeSectionProps) {
  return (
    <section className="px-6 py-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Bell className="text-primary w-8 h-8" />
          공지사항 및 새소식
        </h2>
        <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
          더 보기 <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notices.length > 0 ? (
          notices.slice(0, 3).map((notice) => (
            <div 
              key={notice.id} 
              className="glass p-6 rounded-[1.5rem] flex flex-col gap-4 shadow-premium hover:shadow-xl transition-all border-none"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black text-slate-500">
                  <User size={14} className="text-primary" />
                  {notice.author}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Clock size={14} />
                  {notice.timeStr}
                </div>
              </div>

              <div className="text-slate-800 font-bold leading-relaxed line-clamp-3">
                {notice.content}
              </div>

              {notice.fileUrl && (
                <div className="mt-2 flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-primary font-bold">
                  첨부파일: {notice.fileName || "내용 보기"}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-400 font-black italic">
            등록된 공지사항이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
