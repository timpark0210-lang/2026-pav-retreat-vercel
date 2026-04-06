import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Users, Info } from "lucide-react";
import { getSheetValues, getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";

export const metadata: Metadata = {
  title: "Home | PAV 2026",
  description: "WATCH & FOLLOW - 2026 PAV Youth Retreat",
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
  const heroUrl = getGoogleDriveUrl(mainData?.hero_image_id) || "/pav_2026_retreat_poster_1775388297277.png";

  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* Hero Section */}
      <section className="px-6 pt-12 max-w-7xl mx-auto w-full">
        <div className="hero-card flex flex-col md:flex-row items-center justify-between gap-12 group">
          <div className="flex-1 space-y-8 z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-bold animate-pulse">
              <Calendar size={16} /> 2026-04-17 ~ 04-19
            </div>
            <h1 className="text-5xl md:text-8xl font-display font-black tracking-tighter leading-none mb-6">
              WATCH <br />
              <span className="text-white/50">&</span> <br />
              FOLLOW
            </h1>
            <p className="font-serif text-xl md:text-2xl text-white/80 max-w-lg leading-relaxed italic">
              "그들이 주를 보며 배우고 따라가는 수련회"
            </p>
            <div className="flex items-center gap-6 pt-4">
              <Link href="/register">
                <button className="bg-white text-primary px-10 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-all text-lg">
                  Register Now
                </button>
              </Link>
              <Link href="/schedule" className="group/btn flex items-center gap-2 text-white font-bold text-lg">
                View Schedule <ChevronRight className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative aspect-square md:aspect-auto md:h-[600px] w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-700">
             <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
             <Image 
               src={heroUrl}
               alt="Watch & Follow 2026"
               fill
               className="object-cover group-hover:scale-105 transition-transform duration-1000"
               priority
             />
          </div>

          {/* Background Decorative Element */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col gap-6 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <MapPin size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Location</h3>
            <p className="text-slate-400 leading-relaxed">
              Moirs Point Christian Centre <br/>
              Mangawhai, Northland
            </p>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col gap-6 hover:shadow-xl transition-all group">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Staffing</h3>
            <p className="text-slate-400 leading-relaxed">
              7 Classes with dedicated Teachers <br/>
              Praise Team & Media Support
            </p>
         </div>

         <div className="bg-white p-10 rounded-[2.5rem] shadow-sm flex flex-col gap-6 hover:shadow-xl transition-all group border-2 border-primary/5">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white">
              <Info size={32} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Preparation</h3>
            <p className="text-slate-400 leading-relaxed">
              Bible, Personal Items, <br/>
              Sleeping Bag & Water Bottle
            </p>
         </div>
      </section>

      {/* Announcements */}
      {notices.length > 0 && (
        <section className="px-6 max-w-7xl mx-auto w-full space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black tracking-tighter">ANNOUNCEMENTS</h2>
            <Link href="/notice" className="text-primary font-bold flex items-center gap-2 hover:underline">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {notices.map((notice, i) => (
              <div key={i} className="bg-surface-lowest p-8 rounded-3xl scripture-card flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span>{notice.author || "Admin"}</span>
                  <span>{notice.time?.toString().slice(0, 10)}</span>
                </div>
                <p className="text-xl font-medium leading-relaxed text-slate-700">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ministry Team Section */}
      <section className="px-6 max-w-7xl mx-auto w-full space-y-12">
         <h2 className="text-4xl font-black tracking-tighter">MINISTRY TEAM</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "유명종", role: "Main Speaker (Fri)" },
              { name: "조준목", role: "Main Speaker (Sat)" },
              { name: "양진우", role: "Main Speaker (Sun)" },
              { name: "박성광", role: "Planning Lead" },
            ].map((staff, i) => (
              <div key={i} className="staff-card group">
                <div className="w-24 h-24 bg-slate-100 rounded-full mb-6 relative overflow-hidden group-hover:scale-110 transition-transform">
                   {/* Placeholder for Staff Photo */}
                   <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary/20 font-black text-2xl">PAV</div>
                </div>
                <h4 className="text-lg font-black">{staff.name}</h4>
                <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1">{staff.role}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
}
