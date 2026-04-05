import React from "react";
import { Metadata } from "next";
import { getSheetValues } from "@/lib/google-sheets";
import { groupTimelineByDay } from "@/lib/utils/grouping";
import { Clock, Info, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Schedule | PAV 2026",
};

export default async function SchedulePage() {
  let timeline: Record<string, any[]> = { '1': [], '2': [], '3': [] };
  
  try {
    const rows = await getSheetValues("Timetable_Detailed!A:F");
    if (rows && Array.isArray(rows)) {
      timeline = groupTimelineByDay(rows);
    }
  } catch (error) {
    console.error("Failed to fetch schedule for SSG:", error);
  }

  const days = ['1', '2', '3'];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-20">
      <header className="space-y-4 max-w-2xl">
        <div className="badge badge-primary">Retreat Timeline</div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">
          THE <br/> SCHEDULE
        </h1>
        <p className="font-serif text-slate-400 text-xl leading-relaxed italic">
          "3일간의 은혜로운 여정"
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 ">
        {days.map((day) => (
          <div key={day} className="space-y-8">
            <div className="sticky top-24 z-10 glass border border-slate-50 p-6 rounded-3xl shadow-sm text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Day</span>
              <span className="text-5xl font-display font-black text-primary">0{day}</span>
            </div>

            <div className="space-y-6">
              {timeline[day]?.map((item: any, i: number) => (
                <div key={i} className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Clock size={16} /> {item?.time || "--:--"}
                    </div>
                    <span className="badge badge-outline text-[9px]">{item?.duration || "0m"}</span>
                  </div>
                  
                  <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                    {item?.program || "Untitled Program"}
                    {item?.program?.includes?.("예배") && <ShieldCheck size={16} className="text-primary" />}
                  </h3>
                  
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    {item?.details || "No details provided."}
                  </p>

                  {item?.bigo && (
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
                      <Info size={12} /> {item?.bigo}
                    </div>
                  )}

                  {/* Indicator Line */}
                  <div className="absolute top-8 bottom-8 -left-4 w-1 bg-slate-100 rounded-full group-hover:bg-primary transition-all" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <section className="bg-surface-lowest p-12 rounded-[2.5rem] border-2 border-primary/5 text-center mt-20">
         <p className="text-2xl font-serif text-slate-500 leading-relaxed">
            "모든 순서마다 주의 임재가 가득하길 소망합니다."
         </p>
      </section>
    </div>
  );
}
