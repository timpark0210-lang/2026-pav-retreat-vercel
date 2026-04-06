"use client";

import React from "react";
import { BookOpen, PlayCircle, Eye, ArrowRight, Bookmark } from "lucide-react";

interface ScriptureItem {
  category: string;
  verse: string;
  text: string;
  theme?: string;
  actionLabel?: string;
  actionLink?: string;
  metadata?: string;
}

export default function ScriptureCards({ items }: { items: ScriptureItem[] }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter text-slate-900 drop-shadow-sm uppercase">
          Scripture Messages
        </h1>
        <p className="text-slate-500 font-serif italic text-xl max-w-2xl mx-auto leading-relaxed">
          Watch and Follow: A collection of spiritual anchors for the PAV 2026 journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => {
          const isFeatured = item.category === "CORE GUIDANCE";
          
          return (
            <div 
              key={idx} 
              className={`relative overflow-hidden group rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] border ${
                isFeatured 
                  ? "bg-primary text-white border-primary/20 col-span-1 md:col-span-2 lg:col-span-1 shadow-xl shadow-primary/20" 
                  : "bg-white/80 backdrop-blur-xl text-slate-800 border-white/40 shadow-sm"
              }`}
            >
              {/* Category Pill */}
              <div className="flex items-center justify-between mb-8">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border ${
                  isFeatured 
                    ? "bg-white/20 border-white/20 text-white" 
                    : "bg-primary/5 border-primary/10 text-primary"
                }`}>
                  {item.category}
                </span>
                {isFeatured ? (
                    <BookOpen className="text-white/40" size={32} />
                ) : (
                    <Bookmark className="text-primary/20" size={20} />
                )}
              </div>

              {/* Verse & Text */}
              <div className="space-y-6">
                <h2 className={`text-3xl font-display font-black tracking-tight ${isFeatured ? "text-white" : "text-slate-900"}`}>
                  {item.verse}
                </h2>
                <blockquote className={`relative ${isFeatured ? "text-white/90" : "text-slate-600 font-serif italic"} text-xl leading-relaxed`}>
                   "{item.text}"
                </blockquote>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-current/10 flex items-end justify-between">
                <div className="space-y-4">
                   {item.theme && (
                     <div className={`text-[10px] font-bold tracking-widest uppercase opacity-40`}>
                       THEME: {item.theme}
                     </div>
                   )}
                   {item.metadata && (
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
                           <div className="w-full h-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">PAV</div>
                        </div>
                        <span className={`text-xs font-bold ${isFeatured ? "text-white/70" : "text-slate-400"}`}>
                           {item.metadata}
                        </span>
                     </div>
                   )}
                </div>

                {item.actionLabel && (
                  <button className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all active:scale-95 shadow-lg ${
                    isFeatured 
                      ? "bg-white text-primary hover:bg-white/90 shadow-white/10" 
                      : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                  }`}>
                    {item.actionLabel}
                    {item.actionLabel.includes("Listen") ? <PlayCircle size={18} /> : <ArrowRight size={18} />}
                  </button>
                )}
              </div>

              {/* Decorative Blur (only for featured) */}
              {isFeatured && (
                 <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 blur-3xl rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-20 text-center">
         <p className="text-slate-300 font-bold text-xs tracking-widest uppercase">
           © 2026 Digital Sanctuary. All rights reserved.
         </p>
      </div>
    </div>
  );
}
