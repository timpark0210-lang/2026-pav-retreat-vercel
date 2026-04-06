"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Users, 
  Bell, 
  ClipboardCheck, 
  ArrowRight,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { motion, Variants } from "framer-motion";

interface HomeClientProps {
  notices: any[];
  mainData: any;
  heroUrl: string;
}

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 20
    } 
  }
};

export default function HomeClient({ notices, mainData, heroUrl }: HomeClientProps) {
  const appTitle = mainData?.app_title || "2026 PAV Power Wave 수련회";
  const heroTitleTop = mainData?.hero_title_top || "ANNUAL RETREAT";
  const heroTitleMain = mainData?.hero_title_main || "Watch and Follow";

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="flex flex-col gap-24 pb-40"
    >
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-end justify-start p-6 md:p-12 lg:p-20">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src={heroUrl}
            alt={heroTitleMain}
            fill
            className="object-cover brightness-[0.45] saturate-[0.8]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        </motion.div>
        
        <div className="relative z-10 max-w-5xl space-y-8">
          <motion.div variants={item} className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <Sparkles size={16} className="text-primary animate-pulse" />
            <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">
              {heroTitleTop}
            </span>
          </motion.div>
          
          <motion.h1 
            variants={item}
            className="text-7xl md:text-[10rem] font-display font-black text-white tracking-tighter uppercase leading-[0.8] mb-4 drop-shadow-2xl"
          >
            {heroTitleMain.split(' ').map((word: string, i: number) => (
              <span key={i} className={i === 1 ? "text-primary block md:inline" : "block md:inline"}>
                {word}{' '}
              </span>
            ))}
          </motion.h1>

          <motion.p variants={item} className="font-serif italic text-white/50 text-xl md:text-2xl max-w-xl leading-relaxed">
            {mainData?.hero_subtext || "그들이 주를 보며 배우고 따라가는 수련회"}
          </motion.p>
        </div>
      </section>

      {/* 2. Key Information Grid (Asymmetric) */}
      <section className="px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div variants={item} className="lg:col-span-12 mb-10">
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase">
             {appTitle}
          </h2>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-7">
           <Link href="/schedule" className="group relative block h-full bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-slate-100 group-hover:text-primary/20 transition-colors">
               <Calendar size={120} strokeWidth={1} />
             </div>
             <div className="relative z-10 h-full flex flex-col justify-between gap-20">
                <div className="space-y-4">
                  <span className="text-primary font-black text-[10px] tracking-widest uppercase">Timing</span>
                  <h3 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tighter">
                    {mainData?.info_date_value || "2026.04.17 - 19"}
                  </h3>
                  <p className="text-slate-400 font-serif italic text-base">{mainData?.info_date_sub || "3일간의 믿음의 여정"}</p>
                </div>
                <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest">
                  View Full Schedule <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
             </div>
           </Link>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-5">
           <a 
             href="https://www.google.com/maps/place/Moirs+Point+Christian+Centre/@-36.1264841,174.5663731,17z/data=!3m1!4b1!4m6!3m5!1s0x6d0d5885e3506141:0xe28f80456108151b!8m2!3d-36.1264884!4d174.568948!16s%2Fg%2F1tdr9v0z?entry=ttu" 
             target="_blank" 
             className="group block h-full bg-slate-900 rounded-[3rem] p-10 text-white hover:bg-slate-800 transition-all duration-500 shadow-xl shadow-slate-900/10"
           >
             <div className="h-full flex flex-col justify-between gap-12">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-6">
                    <MapPin size={24} />
                  </div>
                  <h3 className="text-3xl font-display font-black tracking-tight leading-tight uppercase">
                    {mainData?.info_location_value || "Moirs Point Centre"}
                  </h3>
                  <p className="text-white/40 font-serif italic text-base">{mainData?.info_location_sub || "Mangawhai, Northland"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Open Maps</span>
                  <ExternalLink size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                </div>
             </div>
           </a>
        </motion.div>
      </section>

      {/* 3. Core Message (Asymmetric Typography) */}
      <section className="px-6 max-w-7xl mx-auto w-full py-20 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <motion.div variants={item} className="lg:col-span-5">
            <h2 className="text-2xl font-black tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              {mainData?.core_message_title || "Vision"}
            </h2>
            <p className="text-slate-400 font-medium text-sm md:text-base italic leading-relaxed">
              {mainData?.core_message_ref || "Hebrews 12:2"}
            </p>
          </motion.div>
          
          <motion.div variants={item} className="lg:col-span-7">
            <blockquote className="space-y-10 group">
              <p className="text-3xl md:text-5xl font-display font-black text-slate-800 leading-[1.1] tracking-tighter uppercase group-hover:text-primary transition-colors duration-700">
                "{mainData?.core_message_quote || "예수님께서 가신 길을 바라보고(Watch), 따라가는(Follow) PAV 청소년"}"
              </p>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* 4. Operational Excellence (Contacts & Rules) */}
      <section className="px-6 max-w-7xl mx-auto w-full">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-[4rem] p-10 md:p-20 border border-slate-50 shadow-sm">
            <motion.div variants={item} className="space-y-12">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                   <Users size={24} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight uppercase">{mainData?.section_contacts_title || "주요 담당자"}</h2>
               </div>
               <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const label = mainData?.[`contact_${i}_label`];
                    const value = mainData?.[`contact_${i}_value`];
                    if (!label) return null;
                    return (
                      <div key={i} className="flex items-end justify-between border-b border-slate-100 pb-4 group">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</span>
                        <span className="text-xl font-display font-black text-slate-900 group-hover:text-primary transition-colors">{value}</span>
                      </div>
                    );
                  })}
               </div>
            </motion.div>

            <motion.div variants={item} className="space-y-12">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                   <ClipboardCheck size={24} />
                 </div>
                 <h2 className="text-2xl font-black tracking-tight uppercase">{mainData?.section_programs_title || "프로그램 요약"}</h2>
               </div>
               <div className="space-y-6">
                  {[1, 2, 3, 4].map((i) => {
                    const label = mainData?.[`program_${i}_label`];
                    const value = mainData?.[`program_${i}_value`];
                    if (!label) return null;
                    return (
                      <div key={i} className="space-y-1 group">
                        <h4 className="text-xl font-display font-black text-slate-800 group-hover:text-primary transition-colors">{label}</h4>
                        <p className="text-sm font-bold text-slate-400 tracking-tight leading-relaxed">{value}</p>
                      </div>
                    );
                  })}
               </div>
            </motion.div>
         </div>
      </section>

      {/* 5. Ministry Team (Editorial Stagger) */}
      <section className="px-6 max-w-7xl mx-auto w-full space-y-16">
         <motion.h2 variants={item} className="text-4xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase">
           {mainData?.section_staff_title || "Ministry Team"}
         </motion.h2>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => {
              const name = mainData?.[`staff_${i}_name`];
              const role = mainData?.[`staff_${i}_role`];
              const imgId = mainData?.[`staff_${i}_img`];

              if (!name) return null;

              return (
                <motion.div 
                  key={i} 
                  variants={item}
                  whileHover={{ y: -10 }}
                  className="flex flex-col items-center text-center gap-4 group"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 rounded-full relative overflow-hidden shadow-inner">
                     {imgId ? (
                        <Image src={`https://lh3.googleusercontent.com/d/${imgId}`} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary/10">
                           <Users size={32} strokeWidth={1} />
                        </div>
                     )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-display font-black text-slate-900 tracking-tighter">{name}</h4>
                    <p className="text-sm md:text-base font-bold text-primary uppercase tracking-tight leading-tight mt-1">{role}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
      </section>

      {/* 6. Notifications Feed */}
      {notices.length > 0 && (
        <section className="px-6 max-w-7xl mx-auto w-full space-y-16">
          <div className="flex items-end justify-between border-b border-slate-100 pb-8">
            <motion.h2 variants={item} className="text-4xl md:text-6xl font-display font-black tracking-tighter text-slate-900 uppercase leading-none">
              Feed
            </motion.h2>
            <Link href="/notice" className="text-primary font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
              View All Archive
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notices.slice(0, 4).map((notice, i) => (
              <motion.div variants={item} key={i}>
                <Link href={`/notice/${notice.id}`} className="block p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 group">
                  <div className="flex items-start justify-between gap-6">
                    <div className="space-y-4">
                      <div className="inline-block px-3 py-1 bg-primary/5 rounded-lg text-primary text-[9px] font-black uppercase tracking-widest">Update</div>
                      <h4 className="text-2xl font-display font-black text-slate-800 leading-tight group-hover:text-primary transition-colors">
                        {notice.title}
                      </h4>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed font-bold opacity-70">
                        {notice.content}
                      </p>
                    </div>
                    <div className="p-2 text-slate-100 group-hover:text-primary transition-colors flex-shrink-0">
                      <ChevronRight size={32} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
