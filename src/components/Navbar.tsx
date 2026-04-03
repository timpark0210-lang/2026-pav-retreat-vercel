"use client";

import React, { useState, useEffect } from "react";
import { Home, Users, Bell, Calendar, Lock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "홈", href: "/", icon: Home },
  { name: "명단", href: "/students", icon: Users },
  { name: "공지", href: "/notices", icon: Bell },
  { name: "일정", href: "/schedule", icon: Calendar },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:flex items-center justify-between px-8 py-4 ${
          isScrolled ? "glass shadow-md" : "bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Home size={22} fill="currentColor" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            PAV 2026
          </span>
        </Link>

        <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  isActive
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400 hover:text-primary">
          <Lock size={20} />
        </button>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-slate-200/50 px-4 py-2 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1.5 py-2 px-4 rounded-2xl transition-all ${
                  isActive ? "text-primary bg-primary/5" : "text-slate-400"
                }`}
              >
                <Icon size={24} className={isActive ? "scale-110" : ""} />
                <span className="text-[10px] font-bold">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
