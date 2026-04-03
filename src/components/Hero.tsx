import React from "react";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

interface HeroProps {
  formUrl: string;
}

export default function Hero({ formUrl }: HeroProps) {
  return (
    <section className="relative overflow-hidden min-h-[500px] flex flex-col justify-center bg-primary rounded-[2rem] text-white shadow-2xl mx-4 md:mx-6 my-8">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform hover:scale-105 duration-700" 
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/d/1emJNOnZDniLZxLhAH6moAkFdaMzlS1Tl')",
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(26, 115, 232, 0.45)"
        }}
      />
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-20 px-8 py-12 flex flex-col max-w-4xl mx-auto text-center items-center">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-6 animate-fade-in">
          <span className="text-xs font-black uppercase tracking-widest text-[#FFD700]">Watch & Follow</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg">
          2026 PAV Youth Retreat: <br />
          <span className="text-[#FFD700]">"Watch and Follow"</span>
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm font-bold bg-slate-900/30 backdrop-blur-sm px-4 py-2 rounded-xl">
            <Calendar size={18} className="text-[#FFD700]" />
            <span>4월 17일(금) ~ 19일(주일)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold bg-slate-900/30 backdrop-blur-sm px-4 py-2 rounded-xl">
            <MapPin size={18} className="text-[#FFD700]" />
            <span>Moirs Point, Mangawhai</span>
          </div>
        </div>

        <a 
          href={formUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 px-8 py-4 bg-[#FFD700] text-slate-900 font-extrabold text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_8px_30px_rgba(255,215,0,0.3)] hover:shadow-[0_12px_40px_rgba(255,215,0,0.5)]"
        >
          참가 신청하기
          <ArrowRight className="transition-transform group-hover:translate-x-1" />
        </a>

        <div className="mt-12 pt-8 border-t border-white/20 max-w-2xl text-white/90">
          <p className="text-base md:text-lg font-bold italic leading-relaxed drop-shadow-md">
            "내가 진실로 진실로 너희에게 이르노니 나를 믿는 자는 내가 하는 일을 그도 할 것이요 
            또한 그보다 큰 일도 하리니 이는 내가 아버지께로 감이라"
          </p>
          <span className="block mt-2 text-sm font-black text-[#FFD700]">요한복음 14:12</span>
        </div>
      </div>
    </section>
  );
}
