"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User, Bell } from "lucide-react";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Schedule", href: "/schedule" },
  { label: "Attendance", href: "/attendance" },
  { label: "Notice", href: "/notice" },
  { label: "Scripture", href: "/scripture" },
];

interface NavbarProps {
  logoUrl?: string;
  appTitle?: string;
}

export default function Navbar({ logoUrl, appTitle }: NavbarProps) {
  const pathname = usePathname();
  const displayTitle = appTitle || "PAV 2026";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center active:scale-95 transition-transform duration-200">
          <div className="logo-container group">
            <div className="logo-box">
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt="PAV 2026 Logo" 
                  width={34} 
                  height={34} 
                  className="object-contain"
                />
              ) : (
                <span className="font-display font-black text-xl italic text-primary">P</span>
              )}
            </div>
            <div className="flex flex-col -space-y-1">
               <span className="logo-text">{displayTitle}</span>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] ml-1">Youth Retreat</span>
            </div>
          </div>
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

        {/* Action Icons - Clean State */}
        <div className="flex items-center gap-4">
          <div className="w-10 md:hidden" /> {/* Spacer for balanced mobile view */}
        </div>
      </div>
    </nav>
  );
}
