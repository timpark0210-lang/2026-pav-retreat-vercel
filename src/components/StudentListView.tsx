"use client";

import React, { useState } from "react";
import { UserCheck, UserX, HelpCircle, Search, Users } from "lucide-react";
import { Student } from "@/services/data-service";

interface StudentListViewProps {
  studentData: Record<string, Student[]>;
}

export default function StudentListView({ studentData }: StudentListViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const groupNames = Object.keys(studentData);

  return (
    <div className="flex flex-col gap-8">
      {/* List Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">참가 학생 명단</h2>
            <p className="text-xs font-bold text-slate-400 italic">총 {groupNames.length}개 반 명단 로드됨</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="학생 이름 검색..." 
            className="w-full md:w-80 pl-12 pr-4 py-3 bg-slate-100/50 border border-slate-200/50 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Group Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {groupNames.map((groupName) => {
          const students = studentData[groupName].filter(s => s.name.includes(searchTerm));
          if (students.length === 0 && searchTerm) return null;

          return (
            <div key={groupName} className="flex flex-col gap-4">
              <h3 className="text-xl font-black flex items-center gap-2 px-2">
                <span className="w-2 h-6 bg-primary rounded-full" />
                {groupName}
              </h3>
              
              <div className="glass rounded-[2rem] p-3 shadow-premium overflow-hidden">
                {students.map((student, idx) => {
                  const isPresent = student.attendance === "참가";
                  const isAbsent = student.attendance === "불참";
                  
                  return (
                    <div 
                      key={`${groupName}-${student.name}-${idx}`} 
                      className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                        idx !== students.length - 1 ? "border-b border-slate-100" : ""
                      } hover:bg-slate-50/80 group`}
                    >
                      <span className="font-extrabold text-slate-700 group-hover:text-primary transition-colors">
                        {student.name}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {isPresent ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-600 rounded-full text-[10px] font-black">
                            <UserCheck size={12} strokeWidth={3} />
                            참가
                          </div>
                        ) : isAbsent ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-100 text-rose-600 rounded-full text-[10px] font-black">
                            <UserX size={12} strokeWidth={3} />
                            불참
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-black">
                            <HelpCircle size={12} strokeWidth={3} />
                            미정
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
