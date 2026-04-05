"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react";

const SCHEDULE_DATA = {
  integrated: [
    { day: "Day 1", date: "4/17 (Fri)", theme: "Opening & Vision" },
    { day: "Day 2", date: "4/18 (Sat)", theme: "Community & Growth" },
    { day: "Day 3", date: "4/19 (Sun)", theme: "Sending & Mission" },
  ],
  day1: [
    { time: "09:00 - 10:00", program: "개회 예배", detail: "찬양 및 수련회 선포 (강사: 양진우 전도사님)", location: "교회 본당" },
    { time: "10:00 - 11:30", program: "조모임", detail: "조 이름/구호 정하기, 성경구절 및 UCC 주제 뽑기", location: "유주형 선생님" },
    { time: "11:30 - 12:30", program: "점심 식사", detail: "교회 내 식사 (배달음식 주문)", location: "이경희 선생님" },
    { time: "12:30 - 14:30", program: "이동", detail: "Mangawhai Moirs Point로 이동", location: "안전운전" },
    { time: "14:30 - 15:30", program: "짐 정리", detail: "시설 안내 및 Map 공유", location: "차준호 선생님" },
    { time: "15:30 - 18:00", program: "UCC 준비", detail: "조별 UCC 콘티 기획 및 준비 시간", location: "권희운 선생님" },
    { time: "18:00 - 19:00", program: "저녁 식사", detail: "맛있는 저녁 시간", location: "주방팀" },
    { time: "19:00 - 22:00", program: "저녁 집회 (1)", detail: "말씀 (강사: 유명종 목사님)", location: "Main Hall" },
  ],
  day2: [
    { time: "07:00 - 08:00", program: "기상 및 QT", detail: "하루를 여는 말씀 묵상", location: "조별 모임" },
    { time: "08:00 - 09:00", program: "아침 식사", detail: "활기찬 하루 시작", location: "주방팀" },
    { time: "09:00 - 12:00", program: "공동체 게임", detail: "7개 코너 게임 및 조별 단합 활동", location: "권희운 선생님 외" },
    { time: "12:00 - 13:00", program: "점심 식사", detail: "에너지 충전", location: "주방팀" },
    { time: "13:00 - 15:00", program: "레크리에이션", detail: "전체가 하나 되는 시간", location: "유주형 선생님" },
    { time: "15:00 - 18:00", program: "UCC 제작", detail: "오후 집중 촬영 및 영상 편집", location: "자유시간 병행" },
    { time: "18:00 - 19:00", program: "저녁 식사", detail: "든든한 저녁", location: "주방팀" },
    { time: "19:00 - 22:00", program: "저녁 집회 (2)", detail: "말씀 (강사: 조준목 목사님)", location: "Main Hall" },
    { time: "22:00 - 23:30", program: "PAV Celebration", detail: "축제 및 찬양의 밤 (졸업생 찬양팀)", location: "Main Hall" },
  ],
  day3: [
    { time: "07:00 - 08:00", program: "기상 및 QT", detail: "마지막 날 아침 묵상", location: "조별 모임" },
    { time: "08:00 - 09:00", program: "식사 및 정리", detail: "개인 짐 꾸리기 및 방 정리", location: "주방팀" },
    { time: "09:00 - 10:00", program: "도전! 골든벨", detail: "주일 성경퀴즈 및 QT 주제 기반", location: "김경희 선생님" },
    { time: "10:00 - 11:30", program: "파송 예배", detail: "UCC 상영 및 수료 (강사: 양진우 전도사님)", location: "Main Hall" },
    { time: "11:30 - 12:00", program: "점심 식사", detail: "마지막 식사 (간단히)", location: "주방팀" },
    { time: "12:00 - 13:00", program: "숙소 대청소", detail: "시설 원상복구 및 주변 정리", location: "전원 참여" },
    { time: "13:00 - ", program: "해산 및 귀가", detail: "오클랜드 교회로 출발", location: "안녕히 가세요!" },
  ],
};

export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<"integrated" | "day1" | "day2" | "day3">("integrated");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter">SCHEDULE</h1>
        <p className="text-slate-400 font-serif italic text-lg">Watch & Follow: Detailed Timetable</p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-surface-container rounded-2xl sticky top-24 z-30 shadow-sm border border-white/40">
        {(["integrated", "day1", "day2", "day3"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab 
                ? "bg-white text-primary shadow-md translate-y-[-2px]" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "integrated" ? (
          <div className="grid gap-6">
            {SCHEDULE_DATA.integrated.map((item, i) => (
              <div 
                key={i} 
                className="bg-white p-8 rounded-[2rem] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setActiveTab(`day${i+1}` as any)}
              >
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                      {item.day.split(" ")[1]}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black">{item.day}: {item.theme}</h3>
                      <p className="text-slate-400 font-bold">{item.date}</p>
                   </div>
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-primary group-hover:translate-x-2 transition-all" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {SCHEDULE_DATA[activeTab].map((item, i) => (
              <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border-l-4 border-primary/20 hover:border-primary transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary font-bold text-sm">
                      <Clock size={14} /> {item.time}
                    </div>
                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{item.program}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-xs font-bold border border-slate-100">
                    <MapPin size={12} /> {item.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-12 text-center text-slate-300 text-xs font-bold tracking-widest uppercase">
        End of Timetable
      </div>
    </div>
  );
}
