"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Clock, MapPin, User, ChevronRight, Bookmark } from "lucide-react";

interface ScheduleItem {
  time: string;
  duration: string;
  program: string;
  detail: string;
  location: string;
  staff: string;
}

interface ScheduleData {
  day1: ScheduleItem[];
  day2: ScheduleItem[];
  day3: ScheduleItem[];
  integrated: { day: string; date: string; theme: string }[];
}

export default function ScheduleClient({ initialData }: { initialData: ScheduleData }) {
  const [activeTab, setActiveTab] = useState<"summary" | "day1" | "day2" | "day3">("summary");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if a program is currently active
  const checkIsActive = (dayIdx: number, timeStr: string, durationStr: string) => {
    try {
      const retreatDates = [
        new Date("2026-04-17"),
        new Date("2026-04-18"),
        new Date("2026-04-19")
      ];
      
      const targetDate = retreatDates[dayIdx - 1];
      if (currentTime.toDateString() !== targetDate.toDateString()) return false;

      // Parse current time in minutes from midnight
      const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
      
      // Parse program start time (e.g., "09:00" or "09:00 - 10:00")
      const startPart = timeStr.split("-")[0].trim();
      const [h, m] = startPart.split(":").map(Number);
      const startMins = h * 60 + m;
      
      // Parse duration (e.g., "60분" or "60")
      const durationMins = parseInt(durationStr) || 0;
      const endMins = startMins + durationMins;

      return nowMins >= startMins && nowMins < endMins;
    } catch (e) {
      return false;
    }
  };

  // --- Sub-components ---

  // 1. Matrix Summary (Desktop View - Image 3)
  const SummaryMatrix = () => {
    const timeSlots = [
      "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:30", "15:30", "18:00", "19:00", "22:00"
    ];

    return (
      <div className="hidden md:block overflow-x-auto pb-4">
        <div className="min-w-[800px] bg-slate-50/50 p-4 rounded-[3rem] border border-slate-100">
          <div className="schedule-matrix-grid">
            {/* Header */}
            <div className="schedule-matrix-cell bg-slate-50 font-bold text-slate-400 text-xs">시간 (소요시간)</div>
            <div className="schedule-matrix-cell bg-slate-50 font-bold text-primary">제1일: 4/17 (금)</div>
            <div className="schedule-matrix-cell bg-slate-50 font-bold text-primary">제2일: 4/18 (토)</div>
            <div className="schedule-matrix-cell bg-slate-50 font-bold text-primary">제3일: 4/19 (주일)</div>

            {/* Matrix Body */}
            {timeSlots.map((slot, idx) => (
              <React.Fragment key={idx}>
                <div className="schedule-matrix-cell bg-white font-mono text-sm font-bold text-slate-500">{slot}</div>
                {[1, 2, 3].map(day => {
                  const program = (initialData[`day${day}` as keyof ScheduleData] as ScheduleItem[])?.find(p => p.time.startsWith(slot));
                  return (
                    <div key={day} className={`schedule-matrix-cell bg-white ${program ? "bg-blue-50/30" : ""}`}>
                      {program ? (
                        <>
                          <span className="font-bold text-sm text-slate-800 line-clamp-1">{program.program}</span>
                          {program.duration && <span className="text-[10px] text-slate-400 font-bold">({program.duration})</span>}
                        </>
                      ) : (
                        <span className="text-slate-200">-</span>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 2. Summary List (Mobile View - Image 1)
  const SummaryList = () => (
    <div className="md:hidden space-y-6">
      {initialData.integrated.map((item, i) => (
        <div 
          key={i} 
          className="bg-white p-8 rounded-[2rem] shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer border border-transparent hover:border-primary/10"
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
  );

  // 3. Detailed Item (Image 2 style)
  const DetailedItem = ({ item, dayIdx }: { item: ScheduleItem, dayIdx: number }) => {
    const isActive = checkIsActive(dayIdx, item.time, item.duration);
    
    return (
      <div className={`
        relative bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all group
        flex flex-col md:flex-row gap-6 md:gap-12
        ${isActive ? "animate-pulse-primary ring-2 ring-primary ring-offset-4" : "hover:shadow-lg hover:-translate-y-1"}
      `}>
        {isActive && (
          <div className="absolute -top-3 -right-3 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-bounce">
            LIVE NOW
          </div>
        )}

        {/* Left: Time Range */}
        <div className="md:w-32 flex-shrink-0 flex flex-col justify-center">
          <div className="text-3xl font-display font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">
            {item.time.split("-")[0].trim()}
          </div>
          <div className="text-slate-300 font-mono text-xs font-bold mt-1">
            {item.time.includes("-") ? item.time.split("-")[1].trim() : ""}
          </div>
        </div>

        {/* Vertical Divider (Desktop) */}
        <div className="hidden md:block w-[1px] bg-slate-100 self-stretch" />

        {/* Right: Content */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-800">{item.program}</h3>
            {item.duration && (
              <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest">
                {item.duration}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {item.location && (
              <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-bold h-7 px-3 bg-slate-50 rounded-full border border-slate-100">
                <MapPin size={12} className="text-primary" /> {item.location}
              </div>
            )}
            {item.staff && (
              <div className="inline-flex items-center gap-1.5 text-slate-400 text-xs font-bold h-7 px-3 bg-slate-50 rounded-full border border-slate-100">
                <User size={12} className="text-blue-400" /> {item.staff}
              </div>
            )}
          </div>

          <p className="text-slate-500 text-sm leading-relaxed font-medium">
            {item.detail}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-full border border-primary/10">
          <Bookmark size={10} fill="currentColor" /> Real-time Timetable
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter uppercase transition-all">SCHEDULE</h1>
        <p className="text-slate-400 font-serif italic text-lg tracking-tight">
          Watch & Follow: Theme-based Detailed Program
        </p>
      </div>

      {/* Premium Tabs */}
      <div className="flex p-1.5 bg-surface-container rounded-[2rem] sticky top-24 z-40 shadow-sm border border-white/40 backdrop-blur-xl">
        {(["summary", "day1", "day2", "day3"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-4 rounded-[1.5rem] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === tab 
                ? "bg-white text-primary shadow-xl shadow-primary/10 scale-[1.02] z-10" 
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
            }`}
          >
            {tab === "summary" ? "SUMMARY" : `DAY ${tab.slice(-1)}`}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="space-y-8 min-h-[400px]">
        {activeTab === "summary" ? (
          <>
            <SummaryMatrix />
            <SummaryList />
          </>
        ) : (
          <div className="space-y-6">
            {(initialData[activeTab] || []).length > 0 ? (
                initialData[activeTab].map((item, i) => (
                    <DetailedItem key={i} item={item} dayIdx={parseInt(activeTab.slice(-1))} />
                ))
            ) : (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                    <Clock size={48} className="text-slate-200" />
                    <p className="text-slate-400 font-serif italic text-xl">해당 일자의 스케줄이 준비 중입니다.</p>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="py-20 flex flex-col items-center gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase">
          End of 2026 Timetable
        </div>
      </div>
    </div>
  );
}
