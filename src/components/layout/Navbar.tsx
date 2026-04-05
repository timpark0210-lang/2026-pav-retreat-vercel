"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "Attendance", href: "/attendance" },
  { label: "Notice", href: "/notice" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform">
            <span className="font-display font-black text-xl">P</span>
          </div>
          <span className="font-display font-black text-xl tracking-tighter">PAV 2026</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${isActive ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-6 w-px bg-slate-200 mx-2" />
          
          <button className="bg-primary/10 p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all">
            <User size={20} />
          </button>
          
          <Link href="/register" className="hidden sm:block ml-2">
            <button className="btn-primary py-2 px-6 text-sm">Register</button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
