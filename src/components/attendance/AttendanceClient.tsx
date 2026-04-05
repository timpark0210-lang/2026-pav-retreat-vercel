"use client";

import React, { useState } from "react";
import { Users, UserCheck, AlertCircle, CircleDashed, Lock, Save, Edit3, X } from "lucide-react";
import { updateAttendanceAction } from "@/app/actions/attendance";

interface Student {
  name: string;
  attendance: string;
  group: string;
}

interface GroupData {
  teacher: string;
  year: number;
  students: Student[];
}

interface AttendanceClientProps {
  initialGrouped: Record<string, GroupData>;
}

export default function AttendanceClient({ initialGrouped }: AttendanceClientProps) {
  const [grouped, setGrouped] = useState(initialGrouped);
  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "pav2026") {
      setIsEditMode(true);
      setShowLogin(false);
      setPassword("");
      setMessage(null);
    } else {
      setMessage({ type: "error", text: "Invalid password." });
    }
  };

  const toggleAttendance = (className: string, studentName: string) => {
    if (!isEditMode) return;

    setGrouped(prev => {
      const next = { ...prev };
      const group = { ...next[className] };
      const students = [...group.students];
      const studentIdx = students.findIndex(s => s.name === studentName);

      if (studentIdx !== -1) {
        const current = students[studentIdx].attendance;
        const statusMap: Record<string, string> = {
          "미정": "참가",
          "참가": "불참",
          "불참": "미정"
        };
        students[studentIdx] = { ...students[studentIdx], attendance: statusMap[current] || "참가" };
        group.students = students;
        next[className] = group;
      }
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: "success", text: "Saving to server..." });

    const allUpdates = Object.values(grouped).flatMap(g => 
      g.students.map(s => ({ group: s.group, name: s.name, attendance: s.attendance }))
    );

    const result = await updateAttendanceAction(allUpdates);

    if (result.success) {
      setMessage({ type: "success", text: "All changes saved successfully!" });
      setIsEditMode(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: `Error: ${result.error}` });
    }
    setIsSaving(false);
  };

  const totalStudents = Object.values(grouped).reduce((acc, g) => acc + g.students.length, 0);
  const attendingStudents = Object.values(grouped).reduce((acc, g) => 
    acc + g.students.filter(s => s.attendance === "참가").length, 0
  );
  const attendanceRate = totalStudents > 0 ? Math.round((attendingStudents / totalStudents) * 100) : 0;

  return (
    <div className="space-y-20">
      <header className="flex flex-col md:flex-row items-end justify-between gap-8 max-w-7xl mx-auto w-full">
         <div className="space-y-4 max-w-2xl">
            <div className="badge badge-primary">Real-time Dashboard</div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tighter">
              STUDENT <br/> LIST
            </h1>
            <p className="font-serif text-slate-400 text-xl leading-relaxed italic">
              "함께하는 우리 아이들의 소중한 명단"
            </p>
         </div>

         <div className="flex flex-col items-end gap-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {isEditMode ? (
                <>
                  <button 
                    onClick={() => setIsEditMode(false)}
                    className="btn btn-ghost gap-2 text-slate-500"
                  >
                    <X size={18} /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/20"
                  >
                    {isSaving ? <CircleDashed className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowLogin(true)}
                  className="btn btn-outline gap-2 border-slate-200 hover:border-primary hover:text-primary"
                >
                  <Edit3 size={18} /> Teacher Mode
                </button>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-12 bg-white p-8 rounded-[2rem] shadow-sm">
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total</span>
                 <span className="text-3xl font-display font-black text-slate-800">{totalStudents}</span>
               </div>
               <div className="w-px h-10 bg-slate-100" />
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Attending</span>
                 <span className="text-3xl font-display font-black text-green-500">{attendingStudents}</span>
               </div>
               <div className="w-px h-10 bg-slate-100" />
               <div className="flex flex-col items-center">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Att. Rate</span>
                 <span className="text-3xl font-display font-black text-primary">
                   {attendanceRate}%
                 </span>
               </div>
            </div>

            {message && (
              <div className={`text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {message.type === "success" ? <UserCheck size={16} /> : <AlertCircle size={16} />}
                {message.text}
              </div>
            )}
         </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {Object.entries(grouped || {}).map(([className, data]: [string, any], i) => (
          <div key={i} className="flex flex-col gap-6 group">
             <div className={`bg-white p-8 rounded-[2.5rem] shadow-sm transition-all duration-500 border ${isEditMode ? 'border-primary/20 ring-4 ring-primary/5' : 'border-transparent hover:border-primary/5 hover:shadow-2xl'} flex flex-col h-full`}>
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-display font-black tracking-tighter text-primary">
                      {className || "Unassigned"}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                      {data?.teacher || "TBA"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:bg-primary group-hover:text-white">
                    <Users size={24} />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {data?.students?.map((student: any, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => toggleAttendance(className, student.name)}
                      className={`flex items-center justify-between p-3 rounded-2xl transition-all border ${isEditMode ? 'cursor-pointer hover:border-primary/30 bg-primary/[0.02]' : 'bg-surface hover:bg-white border-transparent hover:border-slate-100'}`}
                    >
                       <span className="font-bold text-slate-700 tracking-tight">{student?.name || "Unknown"}</span>
                       <div className="pointer-events-none">
                          {student?.attendance === "참가" ? (
                            <div className="badge badge-success gap-1">
                              <UserCheck size={10} /> 참가
                            </div>
                          ) : student?.attendance === "불참" ? (
                            <div className="badge bg-red-50 text-red-600 gap-1 opacity-60">
                              <AlertCircle size={10} /> 불참
                            </div>
                          ) : (
                            <div className="badge badge-pending gap-1">
                              <CircleDashed size={10} /> 미정
                            </div>
                          )}
                       </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{isEditMode ? "Tapping Toggle" : "Attendance"}</span>
                  <span className="text-primary">
                    {data?.students?.filter((s: any) => s.attendance === "참가").length || 0} / {data?.students?.length || 0}
                  </span>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 bg-animate-in fade-in">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full space-y-8 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto">
                <Lock size={32} />
              </div>
              <h2 className="text-3xl font-display font-black tracking-tighter">Teacher Login</h2>
              <p className="text-slate-400 font-serif italic text-lg leading-snug">
                "출석부 수정을 위해 <br/> 비밀번호를 입력해주세요."
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                autoFocus
                type="password" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-surface border-2 border-transparent focus:border-primary/20 focus:bg-white outline-none transition-all font-bold text-center tracking-widest"
              />
              <button type="submit" className="w-full btn btn-primary py-5 rounded-2xl shadow-xl shadow-primary/20 font-black tracking-widest uppercase">
                Authorize
              </button>
              <button type="button" onClick={() => setShowLogin(false)} className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600 transition-colors">
                Back to View
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
