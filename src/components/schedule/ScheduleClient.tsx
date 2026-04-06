"use client";

import React, { useState, useEffect, useRef } from "react";
import { Clock, MapPin, User, Bookmark, MousePointer2, Calendar, LayoutList } from "lucide-react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

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
  const [viewMode, setViewMode] = useState<"detailed" | "timeline">("detailed");
  const [activeDay, setActiveDay] = useState<number>(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Progress bar implementation for long-scroll
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const checkIsActive = (dayIdx: number, timeStr: string, durationStr: string) => {
    try {
      const retreatDates = [
        new Date("2026-04-17"),
        new Date("2026-04-18"),
        new Date("2026-04-19")
      ];
      
      const targetDate = retreatDates[dayIdx - 1];
      if (currentTime.toDateString() !== targetDate.toDateString()) return false;

      const nowMins = currentTime.getHours() * 60 + currentTime.getMinutes();
      const startPart = timeStr.split("-")[0].trim();
      const [h, m] = startPart.split(":").map(Number);
      const startMins = h * 60 + m;
      const durationMins = parseInt(durationStr) || 0;
      const endMins = startMins + durationMins;

      return nowMins >= startMins && nowMins < endMins;
    } catch (e) {
      return false;
    }
  };

  const DetailedItem = ({ item, dayIdx }: { item: ScheduleItem, dayIdx: number }) => {
    const isActive = checkIsActive(dayIdx, item.time, item.duration);
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`
          relative bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border transition-all duration-500
          flex flex-col md:flex-row gap-6 md:gap-12 group
          ${isActive ? "ring-4 ring-primary/10 border-primary/20 bg-primary/[0.01]" : "border-slate-50 hover:shadow-2xl hover:border-primary/5"}
        `}
      >
        {isActive && (
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-black text-primary tracking-widest uppercase">Live Now</span>
          </div>
        )}

        <div className="md:w-32 flex-shrink-0 flex flex-col justify-center">
          <div className="text-4xl font-display font-black tracking-tighter text-slate-900 group-hover:text-primary transition-colors">
            {item.time.split("-")[0].trim()}
          </div>
          <div className="text-slate-300 font-mono text-xs font-bold mt-1">
            {item.time.includes("-") ? item.time.split("-")[1].trim() : "TBD"}
          </div>
        </div>

        <div className="hidden md:block w-px bg-slate-100 self-stretch my-2" />

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black tracking-tight text-slate-800 leading-tight">
              {item.program}
            </h3>
            {item.duration && (
              <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-slate-100">
                {item.duration}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            {item.location && (
              <div className="inline-flex items-center gap-1.5 text-slate-400 text-[10px] font-bold h-7 px-3 bg-white rounded-full border border-slate-100 shadow-sm">
                <MapPin size={10} className="text-primary" /> {item.location}
              </div>
            )}
            {item.staff && (
              <div className="inline-flex items-center gap-1.5 text-slate-400 text-[10px] font-bold h-7 px-3 bg-white rounded-full border border-slate-100 shadow-sm">
                <User size={10} className="text-blue-400" /> {item.staff}
              </div>
            )}
          </div>

          {item.detail && (
            <p className="text-slate-500 text-sm leading-relaxed font-normal opacity-80">
              {item.detail}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-12" ref={containerRef}>
      {/* Visual Scroll Progress (Only in Timeline Mode) */}
      {viewMode === "timeline" && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
          style={{ scaleX }}
        />
      )}

      {/* Header Section */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black tracking-[0.3em] uppercase px-5 py-2 rounded-full border border-primary/10">
              <Bookmark size={10} fill="currentColor" /> {viewMode === "detailed" ? "Detailed View" : "Unified Timeline"}
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.9]">
              RETREAT <br/> <span className="text-primary">{viewMode === "detailed" ? "SESSIONS" : "JOURNEY"}</span>
            </h1>
          </div>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-[2rem] border border-slate-200/50 self-start">
            <button 
              onClick={() => setViewMode("detailed")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-xs font-black tracking-widest uppercase transition-all
                ${viewMode === "detailed" ? "bg-white text-primary shadow-lg" : "text-slate-400 hover:text-slate-600"}
              `}
            >
              <Calendar size={14} strokeWidth={3} /> By Day
            </button>
            <button 
              onClick={() => setViewMode("timeline")}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-xs font-black tracking-widest uppercase transition-all
                ${viewMode === "timeline" ? "bg-white text-primary shadow-lg" : "text-slate-400 hover:text-slate-600"}
              `}
            >
              <LayoutList size={14} strokeWidth={3} /> Full Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === "detailed" ? (
          <motion.div 
            key="detailed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-12"
          >
            {/* Day Tabs */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 border-b border-slate-100 pb-10">
              {[1, 2, 3].map((day) => {
                const config = initialData.integrated[day - 1];
                const active = activeDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`
                      p-3 md:p-6 rounded-2xl md:rounded-[2rem] border transition-all duration-500 flex flex-col items-center text-center gap-1 group
                      ${active ? "bg-primary border-primary shadow-xl shadow-primary/20 scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-primary/30"}
                    `}
                  >
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${active ? "text-white/60" : "text-primary/60 group-hover:text-primary"}`}>Day {day}</span>
                    <span className={`text-sm md:text-xl font-display font-black tracking-tight ${active ? "text-white" : "text-slate-800"}`}>{config?.date || `Day ${day}`}</span>
                    {active && <p className="hidden md:block text-[10px] text-white/50 font-serif italic mt-1">{config?.theme}</p>}
                  </button>
                );
              })}
            </div>

            {/* Current Day Schedule */}
            <div className="space-y-6">
              {(initialData[`day${activeDay}` as keyof ScheduleData] as ScheduleItem[]).map((item, i) => (
                <DetailedItem key={i} item={item} dayIdx={activeDay} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="timeline"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-24"
          >
            {[1, 2, 3].map((dayIdx) => {
              const dayKey = `day${dayIdx}` as keyof ScheduleData;
              const config = initialData.integrated[dayIdx - 1];
              return (
                <section key={dayIdx} className="space-y-12">
                   <div className="sticky top-20 z-30 py-4 -mx-6 px-6 bg-surface/80 backdrop-blur-xl border-b border-slate-100 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Day {dayIdx}</div>
                      <h2 className="text-3xl font-display font-black tracking-tighter uppercase">{config?.date}</h2>
                    </div>
                    <div className="text-right pb-1">
                      <p className="text-slate-400 font-serif italic text-sm">{config?.theme}</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    {(initialData[dayKey] as ScheduleItem[]).map((item, i) => (
                      <DetailedItem key={i} item={item} dayIdx={dayIdx} />
                    ))}
                  </div>
                </section>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <div className="py-32 flex flex-col items-center gap-8">
        <div className="w-px h-32 bg-gradient-to-b from-primary/30 to-transparent" />
        <div className="text-slate-300 text-[10px] font-black tracking-[0.5em] uppercase text-center">
          End of 2026 Retreat Schedule <br/>
          <span className="mt-2 block opacity-50">See you in vision</span>
        </div>
      </div>
    </div>
  );
}
