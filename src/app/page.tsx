import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Users, 
  Info, 
  Bell, 
  Bus, 
  ClipboardCheck, 
  ArrowRight,
  Sparkles
} from "lucide-react";
import { getSheetValues, getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

export const metadata: Metadata = {
  title: "Home | PAV Power Wave 2026",
  description: "WATCH & FOLLOW - 2026 PAV Power Wave Youth Retreat",
};

async function getAnnouncements() {
  try {
    const rows = await getSheetValues("Notice!A:G");
    return rows.slice(1, 4).map((row, i) => ({
      id: row[0] || i,
      content: row[1],
      author: row[2],
      time: row[3],
    }));
  } catch (e) {
    return [];
  }
}

export default async function HomePage() {
  const notices = await getAnnouncements();
  const mainData = await getMainData();
  
  // Dynamic Assets & Strings
  const heroUrl = getGoogleDriveUrl(mainData?.hero_image_id) || "/pav_2026_retreat_poster_1775388297277.png";
  const appTitle = mainData?.app_title || "2026 PAV Power Wave 수련회";
  const heroTitleTop = mainData?.hero_title_top || "ANNUAL RETREAT";
  const heroTitleMain = mainData?.hero_title_main || "Watch and Follow";
  const heroSubtext = mainData?.hero_subtext || "그들이 주를 보며 배우고 따라가는 수련회";

  return (
    <div className="flex flex-col gap-20 pb-32">
      {/* 1. Premium Backdrop Hero */}
      <section className="hero-backdrop group">
        <Image 
          src={heroUrl}
          alt={heroTitleMain}
          fill
          className="object-cover brightness-[0.6] group-hover:scale-105 transition-transform duration-[2000ms]"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-primary/10 to-surface/40" />
        
        <div className="relative z-10 space-y-4 px-6">
          <span className="inline-block text-white/60 tracking-[0.4em] font-bold text-xs md:text-sm uppercase animate-fade-in">
            {heroTitleTop}
          </span>
          <h1 className="text-5xl md:text-8xl font-display font-black text-white tracking-tighter drop-shadow-2xl">
            {heroTitleMain}
          </h1>
        </div>
      </section>

      {/* 2. Main Title & Dynamic Info Cards */}
      <section className="px-6 max-w-4xl mx-auto w-full -mt-24 z-20 space-y-12">
        <div className="text-center space-y-8 mb-16">
           <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-on-surface drop-shadow-sm uppercase">
             {appTitle}
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Date Card */}
           <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                <Calendar size={28} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-800">{mainData?.info_date_value || "2026.04.17 - 19"}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {mainData?.info_date_sub || "3일간의 믿음의 여정"}
                 </p>
              </div>
           </div>

           {/* Location Card */}
           <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 flex items-center gap-6 group hover:translate-y-[-4px] transition-all">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                <MapPin size={28} />
              </div>
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-slate-800 line-clamp-1">
                   {mainData?.info_location_value || "Moirs Point Christian Centre"}
                 </h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
                   {mainData?.info_location_sub || "Mangawhai, Northland"}
                 </p>
              </div>
              {/* Optional MAP Icon in mobile reference */}
              <div className="ml-auto w-12 h-12 bg-green-50 rounded-xl overflow-hidden shrink-0 hidden sm:block opacity-40">
                 <div className="w-full h-full bg-primary/10 flex items-center justify-center font-bold text-[10px] text-primary">MAP</div>
              </div>
           </div>
        </div>
      </section>

      {/* 3. Core Message (Mission Statement) */}
      <section className="px-6 max-w-4xl mx-auto w-full py-10">
        <div className="space-y-8">
           <div className="flex items-center gap-3">
              <Sparkles className="text-primary animate-pulse" size={24} />
              <h2 className="text-2xl font-black tracking-tight uppercase">
                {mainData?.core_message_title || "Core Message"}
              </h2>
           </div>
           
           <div className="core-message-box group">
             <p className="font-serif italic text-2xl md:text-3xl text-slate-700 leading-snug tracking-tight">
               "{mainData?.core_message_quote || "예수님께서 가신 길을 바라보고(Watch), 그분의 발자취를 온전히 따라가는(Follow) PAV 청소년이 되기를 소망합니다."}"
             </p>
             <div className="mt-10 pt-8 border-t border-slate-100">
                <p className="text-slate-400 font-medium text-sm md:text-base italic">
                  {mainData?.core_message_ref || "Hebrews 12:2"}
                </p>
             </div>
           </div>
        </div>
      </section>

      {/* 4. Ministry Team */}
      <section className="px-6 max-w-5xl mx-auto w-full space-y-12">
         <h2 className="text-2xl font-black tracking-tight uppercase">
           {mainData?.section_staff_title || "Key Staff"}
         </h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => {
              const name = mainData?.[`staff_${i}_name`];
              const role = mainData?.[`staff_${i}_role`];
              const imgId = mainData?.[`staff_${i}_img`];
              const imgUrl = getGoogleDriveUrl(imgId);

              if (!name) return null;

              return (
                <div key={i} className="staff-card group border border-slate-50 hover:bg-white transition-colors">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 rounded-full mb-6 relative overflow-hidden group-hover:scale-110 shadow-inner">
                     {imgUrl ? (
                        <Image src={imgUrl} alt={name} fill className="object-cover" />
                     ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary/20">
                           <Users size={32} />
                        </div>
                     )}
                  </div>
                  <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none">{name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{role}</p>
                </div>
              );
            })}
          </div>
      </section>

      {/* 5. List-style Announcements */}
      {notices.length > 0 && (
        <section className="px-6 max-w-4xl mx-auto w-full space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight uppercase">
              {mainData?.section_notice_title || "Announcements"}
            </h2>
            <Link href="/notice" className="text-primary font-bold flex items-center gap-1 hover:underline text-sm uppercase tracking-widest">
              See All <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-4">
            {notices.map((notice, i) => {
              // Simple icon mapping based on content keywords
              let Icon = Bell;
              if (notice.content?.includes("준비물")) Icon = ClipboardCheck;
              if (notice.content?.includes("집합") || notice.content?.includes("시간")) Icon = Bus;

              return (
                <div key={i} className="list-notice-card group">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon size={24} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-lg text-slate-800 tracking-tight leading-none">
                      {notice.content?.split("\n")[0]}
                    </h4>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Dynamic Call to Action */}
      <section className="px-6 max-w-4xl mx-auto w-full text-center">
         <Link 
           href="/schedule" 
           className="btn-primary w-full py-5 text-xl tracking-tight flex items-center justify-center gap-3 shadow-2xl shadow-primary/40 group"
         >
           {mainData?.btn_action_label || "View Full Schedule"}
           <ArrowRight className="group-hover:translate-x-2 transition-transform" />
         </Link>
      </section>
    </div>
  );
}
