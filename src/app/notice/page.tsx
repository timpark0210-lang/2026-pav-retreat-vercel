import Link from "next/link";
import { Metadata } from "next";
import { getNoticeData } from "@/lib/google-sheets";
import { Megaphone, Calendar, FileText, ExternalLink, Bell, Info, AlertCircle, ClipboardCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Notice | PAV 2026",
};

export default async function NoticePage() {
  const notices = await getNoticeData();
  const sortedNotices = [...notices].reverse();

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
      <header className="space-y-4 max-w-2xl">
        <div className="badge badge-primary">Announcements</div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">
          NOTICE <br/> BOARD
        </h1>
        <p className="font-serif text-slate-400 text-xl leading-relaxed italic">
          "중요한 소식과 안내사항을 확인하세요"
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
        {sortedNotices.length > 0 ? (
          sortedNotices.map((notice, i) => {
            let Icon = Bell;
            if (notice.type === "urgent") Icon = AlertCircle;
            if (notice.type === "info") Icon = Info;
            if (notice.content?.includes("준비물") || notice.title?.includes("준비물")) Icon = ClipboardCheck;

            return (
              <Link 
                key={i} 
                href={`/notice/${notice.id}`}
                className="group bg-white p-8 rounded-[2rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 active:scale-[0.98]"
              >
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner shrink-0">
                  <Icon size={28} strokeWidth={2} />
                </div>
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-3 mb-1">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{notice.author || "Admin"}</span>
                     <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{notice.time}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight truncate">
                    {notice.title}
                  </h3>
                  {notice.content && (
                    <p className="text-slate-400 text-sm font-bold line-clamp-1 leading-relaxed italic opacity-70">
                      {notice.content}
                    </p>
                  )}
                </div>

                <div className="p-3 text-slate-200 group-hover:text-primary transition-all group-hover:translate-x-1">
                   <ChevronRight size={20} />
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-40 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-100 italic">
             <p className="text-2xl font-serif text-slate-400 font-bold">등록된 공지사항이 아직 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
