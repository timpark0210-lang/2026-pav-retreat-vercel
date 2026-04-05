import React from "react";
import { Metadata } from "next";
import { getSheetValues } from "@/lib/google-sheets";
import { ExternalLink, ClipboardCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register | PAV 2026",
};

async function getFormUrl() {
  try {
    const rows = await getSheetValues("MainData!A:B");
    const found = rows.find(r => r[0] === "retreat_form_url");
    return found ? found[1] : "https://forms.gle/vP7fK9aMscZ6X9N38";
  } catch (e) {
    return "https://forms.gle/vP7fK9aMscZ6X9N38";
  }
}

export default async function RegisterPage() {
  const formUrl = await getFormUrl();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 bg-surface">
      <div className="max-w-4xl w-full">
        <div className="hero-card shadow-[0_48px_96px_-24px_rgba(0,94,160,0.2)] flex flex-col items-center text-center gap-12 p-16 md:p-24 relative overflow-hidden">
          
          <div className="space-y-6 z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl">
              <ClipboardCheck size={40} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none">
              READY TO <br /> JOIN US?
            </h1>
            
            <p className="font-serif text-xl md:text-2xl text-white/70 max-w-lg mx-auto leading-relaxed italic">
              "한 번의 클릭으로 수련회의 은혜로운 여정을 시작하세요."
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full sm:w-auto">
            <a 
              href={formUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-white text-primary px-12 py-5 rounded-full font-bold shadow-2xl hover:scale-110 transition-all text-xl flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              Open Google Form <ExternalLink size={20} />
            </a>
            
            <Link href="/" className="text-white/60 font-medium flex items-center gap-2 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>

          {/* Decorative Blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-container/20 rounded-full blur-[120px] -ml-48 -mb-48" />
        </div>

        <div className="mt-12 text-center text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-4">
           <div className="h-px flex-1 bg-slate-100" />
           Registration Deadline: Coming Soon
           <div className="h-px flex-1 bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
