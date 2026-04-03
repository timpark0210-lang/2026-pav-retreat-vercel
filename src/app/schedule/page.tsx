import React from "react";
import Navbar from "@/components/Navbar";
import { Calendar, Clock, MapPin, Info } from "lucide-react";

const scheduleData = {
  1: [
    { time: "09:00 - 10:00", program: "개회 예배", details: "찬양 및 수련회 선포 (강사: 양진우 전도사님)", location: "교회 본당" },
    { time: "10:00 - 11:30", program: "프로그램 1: 조모임", details: "조 이름/구호 정하기, 성경구절 및 UCC 주제 뽑기", location: "유주형 선생님" },
    { time: "11:30 - 13:00", program: "점심 식사 및 휴식", details: "맛있는 불고기 덮밥", location: "친교실" },
    { time: "13:00 - 15:00", program: "출발 및 현지 도착", details: "망가와이 이동", location: "Moirs Point" },
  ],
  2: [
    { time: "08:00 - 09:00", program: "기상 및 아침 묵상", details: "큐티 및 조용한 시간", location: "개별 숙소" },
    { time: "09:00 - 12:00", program: "공동체 게임", details: "7개 코너 게임 및 조별 단합 활동", location: "운동장" },
    { time: "19:00 - 21:00", program: "저녁 집회", details: "말씀 및 뜨거운 기도회", location: "메인 홀" },
  ],
  3: [
    { time: "10:00 - 11:30", program: "파송 예배", details: "UCC 상영 및 수료 (강사: 양진우 전도사님)", location: "메인 홀" },
    { time: "13:00 - 15:00", program: "짐 정리 및 귀가", details: "교회로 복귀", location: "교회" },
  ],
};

export default function SchedulePage() {
  return (
    <main className="min-h-screen pb-24 md:pb-0 md:pt-20 bg-slate-50 selection:bg-primary/30 selection:text-primary">
      <Navbar />

      <section className="px-6 py-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-amber-200/20">
            <Calendar size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black">수련회 상세 일정</h2>
            <p className="text-slate-400 font-bold text-sm">3일간의 은혜로운 여정을 확인하세요.</p>
          </div>
        </div>

        <div className="flex flex-col gap-16">
          {[1, 2, 3].map((day) => (
            <div key={day} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="px-5 py-2 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest">Day {day}</span>
                <span className="text-xl font-black text-slate-400">| 2026.04.1{6 + day}</span>
              </div>

              <div className="flex flex-col gap-4">
                {(scheduleData as any)[day].map((item: any, idx: number) => (
                  <div 
                    key={idx} 
                    className="glass p-6 rounded-[1.5rem] shadow-premium flex flex-col md:flex-row md:items-center gap-6 border-none group hover:bg-white transition-all"
                  >
                    <div className="flex flex-col items-center justify-center min-w-[140px] border-r border-slate-100 pr-6">
                      <Clock size={16} className="text-primary mb-1" />
                      <span className="text-sm font-black text-slate-700">{item.time}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="text-xl font-black text-slate-900 flex items-center gap-2">
                        {item.program}
                      </div>
                      <div className="text-slate-500 font-bold text-sm flex items-center gap-2">
                        <Info size={14} className="text-slate-300" />
                        {item.details}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500">
                      <MapPin size={14} />
                      {item.location}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center opacity-40">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">P</div>
            <span className="font-black tracking-tight">PAV SPIRITUAL RETREAT 2026</span>
          </div>
          <p className="text-xs font-bold">© 1994-2026 PAV Youth. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
