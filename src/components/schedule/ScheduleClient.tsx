"use client";

import React, { useState } from "react";
import { Clock, MapPin, ChevronRight } from "lucide-react";

interface ScheduleItem {
  time: string;
  duration: string;
  program: string;
  detail: string;
  location: string;
}

interface ScheduleData {
  day1: ScheduleItem[];
  day2: ScheduleItem[];
  day3: ScheduleItem[];
  integrated: { day: string; date: string; theme: string }[];
}

export default function ScheduleClient({ initialData }: { initialData: ScheduleData }) {
  const [activeTab, setActiveTab] = useState<"integrated" | "day1" | "day2" | "day3">("integrated");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter uppercase transition-all">SCHEDULE</h1>
        <p className="text-slate-400 font-serif italic text-lg tracking-tight">Watch & Follow: Real-time Updated Timetable</p>
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
        ) : (
          <div className="space-y-4">
            {(initialData[activeTab] || []).length > 0 ? (
                initialData[activeTab].map((item, i) => (
                    <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border-l-4 border-primary/20 hover:border-primary transition-all group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm">
                            <Clock size={14} /> {item.time} {item.duration && `(${item.duration})`}
                            </div>
                            <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{item.program}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{item.detail}</p>
                        </div>
                        {item.location && (
                            <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-500 text-xs font-bold border border-slate-100">
                                <MapPin size={12} /> {item.location}
                            </div>
                        )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-surface-lowest rounded-[2rem] border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-serif italic">해당 일자의 스케줄이 준비 중입니다.</p>
                </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-12 text-center text-slate-300 text-xs font-bold tracking-widest uppercase">
        End of Timetable
      </div>
    </div>
  );
}
