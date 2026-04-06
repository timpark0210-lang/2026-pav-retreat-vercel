"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, BookOpen, Bell } from "lucide-react";

const BOTTOM_NAV_ITEMS = [
  { label: "홈", href: "/", icon: Home },
  { label: "일정", href: "/schedule", icon: Calendar },
  { label: "명단", href: "/attendance", icon: Users },
  { label: "말씀", href: "/scripture", icon: BookOpen },
  { label: "공지", href: "/notice", icon: Bell },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 backdrop-blur-2xl border-t border-slate-100/50 pb-safe shadow-[0_-1px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around h-20 px-2">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 relative group"
            >
              <div className={`
                p-2 rounded-2xl transition-all duration-300
                ${isActive ? "bg-primary/10 text-primary scale-110" : "text-slate-400 group-hover:text-primary/70"}
              `}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`
                text-[10px] font-black tracking-tight leading-none transition-colors
                ${isActive ? "text-primary" : "text-slate-400"}
              `}>
                {item.label}
              </span>
              
              {/* Active Dot indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full blur-[1px]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
