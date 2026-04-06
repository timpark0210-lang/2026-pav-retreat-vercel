"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Users, BookOpen, Bell } from "lucide-react";
import { motion } from "framer-motion";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/60 backdrop-blur-3xl border-t border-slate-100/30 pb-safe shadow-[0_-1px_30px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around h-20 px-2 relative">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full gap-1 transition-all relative z-10"
            >
              <motion.div 
                whileTap={{ scale: 0.8 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`
                  p-1.5 rounded-2xl transition-all relative
                  ${isActive ? "text-primary" : "text-slate-300"}
                `}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-primary/10 rounded-2xl blur-sm"
                  />
                )}
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className="relative z-20" />
              </motion.div>
              
              <span className={`
                text-[9px] font-black tracking-widest leading-none transition-colors uppercase
                ${isActive ? "text-primary" : "text-slate-300"}
              `}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(0,94,146,0.5)]"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
