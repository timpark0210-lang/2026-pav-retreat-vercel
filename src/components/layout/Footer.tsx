import React from "react";
import { Globe, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white py-20 px-6 border-t border-slate-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="font-display font-black text-sm">P</span>
            </div>
            <span className="font-display font-black text-lg tracking-tighter">PAV 2026</span>
          </div>
          <p className="text-slate-400 text-sm max-w-xs text-center md:text-left">
            © 2026 PAV Youth Ministry. All rights reserved. <br/>
            Growing together in "Watch and Follow".
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-slate-300 hover:text-primary transition-colors"><Globe size={20} /></button>
          <button className="text-slate-300 hover:text-primary transition-colors"><Globe size={20} /></button>
          <button className="text-slate-300 hover:text-primary transition-colors"><Globe size={20} /></button>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <p className="text-slate-500 font-bold flex items-center gap-2">
            <Mail size={16} /> Contact: info@pav2026.com
          </p>
          <p className="text-slate-400 text-xs text-center md:text-right font-mono">
            Moirs Point Rd, Mangawhai 0505
          </p>
        </div>
      </div>
    </footer>
  );
}
