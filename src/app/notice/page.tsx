import React from "react";
import { Metadata } from "next";
import { getSheetValues } from "@/lib/google-sheets";
import { Megaphone, Calendar, FileText, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Notice | PAV 2026",
};

export default async function NoticePage() {
  let notices: any[] = [];
  
  try {
    const rows = await getSheetValues("Notice!A:E");
    if (rows && Array.isArray(rows)) {
      notices = rows.slice(1).map((row) => ({
        time: row[0] || "No Time",
        author: row[1] || "Admin",
        content: row[2] || "",
        fileName: row[3] || null,
        fileUrl: row[4] || null,
      })).reverse();
    }
  } catch (error) {
    console.error("Failed to fetch notices for SSG:", error);
  }

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

      <div className="grid grid-cols-1 gap-12">
        {notices.length > 0 ? (
          notices.map((notice, i) => (
            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-50 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
                  <Megaphone size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{notice.author || "Admin"}</span>
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Calendar size={12} className="text-primary/40" /> 
                    {notice.time?.toString().slice(0, 16) || "Recent"}
                  </span>
                </div>
              </div>

              <p className="text-2xl font-medium leading-relaxed text-slate-800 mb-8 whitespace-pre-wrap">
                {notice.content || "소식이 없습니다."}
              </p>

              {notice.fileUrl && (
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 group-hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                    <FileText size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Attachment</p>
                    <p className="text-sm font-bold text-slate-700 truncate max-w-[200px] md:max-w-md">{notice.fileName || "Download Attachment"}</p>
                  </div>
                  <a href={notice.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm rounded-xl gap-2">
                    <ExternalLink size={14} /> Open
                  </a>
                </div>
              )}

              {/* Decorative accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-12 -mt-12 transition-all group-hover:scale-150 group-hover:bg-primary/10" />
            </div>
          ))
        ) : (
          <div className="text-center py-40 bg-surface-lowest rounded-[3rem] border-2 border-dashed border-slate-100">
             <p className="text-xl font-serif text-slate-400">등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
