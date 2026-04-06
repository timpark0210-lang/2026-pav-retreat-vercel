import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticeData, getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";
import { ArrowLeft, Calendar, User, Megaphone, Share2 } from "lucide-react";
import Image from "next/image";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notices = await getNoticeData();
  const notice = notices.find((n) => n.id.toString() === id);

  return {
    title: notice ? `${notice.title} | Notice` : "Notice Detail",
  };
}

export default async function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const notices = await getNoticeData();
  const notice = notices.find((n) => n.id.toString() === id);
  const mainData = await getMainData();
  const logoUrl = getGoogleDriveUrl(mainData?.app_icon);

  if (!notice) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24">
      {/* Top Header Navigation */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 h-16 flex items-center justify-between">
        <Link 
          href="/notice" 
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-black text-sm uppercase tracking-tighter"
        >
          <ArrowLeft size={18} />
          <span>Back to Board</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* Notice Header */}
        <header className="space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <Megaphone size={14} strokeWidth={3} />
            Important Notice
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter leading-[1.1]">
            {notice.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Author" width={24} height={24} className="opacity-50" />
                ) : (
                  <User size={20} className="text-slate-400" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Written by</span>
                <span className="text-sm font-black text-slate-800 leading-none">{notice.author || "PAV Admin"}</span>
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-100 hidden md:block" />

            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date Posted</span>
              <span className="text-sm font-black text-slate-600 flex items-center gap-1.5 leading-none">
                <Calendar size={14} className="text-primary/40" />
                {notice.time}
              </span>
            </div>
          </div>
        </header>

        {/* Notice Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-50 relative group">
          <div className="prose prose-slate prose-xl max-w-none">
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap font-serif text-xl md:text-2xl font-medium italic opacity-90">
              "{notice.content}"
            </p>
          </div>
          
          {/* Subtle Branded Footer */}
          <div className="mt-16 pt-8 border-t border-dashed border-slate-100 flex items-center justify-between opacity-40">
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">2026 PAV Retreat</span>
             {logoUrl && <Image src={logoUrl} alt="Branding" width={20} height={20} className="grayscale" />}
          </div>
        </div>

        {/* Next/Prev Navigation would go here */}
        <div className="pt-12 text-center">
           <Link href="/notice" className="btn-primary inline-flex">
              전체 공지사항 목록으로 돌아가기
           </Link>
        </div>
      </article>
    </div>
  );
}
