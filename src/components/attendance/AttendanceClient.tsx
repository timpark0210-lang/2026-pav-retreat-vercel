"use client";

import React, { useState } from "react";
import { Users, UserCheck, AlertCircle, CircleDashed, Lock, Save, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateAttendanceAction, addStudentAction, deleteStudentAction } from "@/app/actions/attendance";

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
  const [dirtyStudents, setDirtyStudents] = useState<Record<string, string>>({}); // name_group: attendance
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: "", group: "7B" });

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
      const groupData = { ...next[className] };
      const students = [...groupData.students];
      const studentIdx = students.findIndex(s => s.name === studentName);

      if (studentIdx !== -1) {
        const current = students[studentIdx].attendance;
        const statusMap: Record<string, string> = {
          "미정": "참가",
          "참가": "불참",
          "불참": "미정"
        };
        const nextStatus = statusMap[current] || "참가";
        students[studentIdx] = { ...students[studentIdx], attendance: nextStatus };
        groupData.students = students;
        next[className] = groupData;

        // Track dirty state
        setDirtyStudents(d => ({ ...d, [`${studentName}_${className}`]: nextStatus }));
      }
      return next;
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.group) return;
    setIsSaving(true);
    const result = await addStudentAction({ ...newStudent, attendance: "미정" });
    if (result.success) {
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to add student" });
      setIsSaving(false);
    }
  };

  const handleDeleteStudent = async (className: string, studentName: string) => {
    if (!confirm(`Delete ${studentName}?`)) return;
    setIsSaving(true);
    const result = await deleteStudentAction(className, studentName);
    if (result.success) {
      window.location.reload();
    } else {
      setMessage({ type: "error", text: result.error || "Failed to delete student" });
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: "success", text: "Saving changes..." });

    const updates = Object.entries(dirtyStudents).map(([key, attendance]) => {
      const [name, ...groupParts] = key.split("_");
      return { name, group: groupParts.join("_"), attendance };
    });

    if (updates.length === 0) {
      setIsEditMode(false);
      setIsSaving(false);
      return;
    }

    const result = await updateAttendanceAction(updates);

    if (result.success) {
      setMessage({ type: "success", text: "Saved successfully!" });
      setDirtyStudents({});
      setIsEditMode(false);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: "error", text: result.error || "Error saving" });
    }
    setIsSaving(false);
  };

  const studentsList = Object.values(grouped).flatMap(g => g.students);
  const total = studentsList.length;
  const attending = studentsList.filter(s => s.attendance === "참가").length;
  const absent = studentsList.filter(s => s.attendance === "불참").length;
  const undecided = total - attending - absent;
  const attendanceRate = total > 0 ? Math.round((attending / total) * 100) : 0;

  return (
    <div className="space-y-16">
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
         <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary text-[10px] font-black tracking-[0.3em] uppercase px-5 py-2 rounded-full border border-primary/10">
               Dashboard
            </div>
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter uppercase leading-[0.85]">
              STUDENT <br/> <span className="text-primary">ROSTER</span>
            </h1>
            <p className="font-serif text-slate-400 text-xl leading-relaxed italic opacity-80">
              "함께하는 우리 아이들의 소중한 명단"
            </p>
         </div>

         <div className="flex flex-col gap-6 w-full xl:w-auto">
            <div className="flex items-center justify-between xl:justify-end gap-3">
              {isEditMode ? (
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => setIsEditMode(false)} className="flex-1 md:flex-none h-14 px-8 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs tracking-widest uppercase hover:bg-slate-200 transition-all">
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="flex-1 md:flex-none h-14 px-10 rounded-2xl bg-primary text-white font-black text-xs tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {isSaving ? "Saving..." : "Save Now"}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowLogin(true)} className="h-14 px-8 rounded-2xl bg-white border border-slate-200 text-slate-400 font-black text-xs tracking-widest uppercase hover:border-primary hover:text-primary transition-all shadow-sm">
                   Teacher Mode
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 md:flex md:items-center gap-y-6 gap-x-2 md:gap-12 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-50">
               <div className="flex flex-col items-center md:items-start group">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2 transition-colors group-hover:text-primary">Total</span>
                 <span className="text-4xl font-display font-black text-slate-900 leading-none">{total}</span>
               </div>
               <div className="hidden md:block w-px h-10 bg-slate-100" />
               <div className="flex flex-col items-center md:items-start">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Attending</span>
                 <span className="text-4xl font-display font-black text-emerald-500 leading-none">{attending}</span>
               </div>
               <div className="hidden md:block w-px h-10 bg-slate-100" />
               <div className="flex flex-col items-center md:items-start">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Absent</span>
                 <span className="text-4xl font-display font-black text-rose-400 leading-none">{absent}</span>
               </div>
               <div className="hidden md:block w-px h-10 bg-slate-100" />
               <div className="flex flex-col items-center md:items-start col-span-1">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Pending</span>
                 <span className="text-4xl font-display font-black text-slate-200 leading-none">{undecided}</span>
               </div>
               <div className="hidden md:block w-px h-10 bg-primary/20" />
               <div className="flex flex-col items-center md:items-start col-span-2 md:col-span-1">
                 <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Attendance %</span>
                 <span className="text-4xl font-display font-black text-primary leading-none">{attendanceRate}%</span>
               </div>
            </div>
         </div>
      </header>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {Object.entries(grouped || {}).map(([className, data]: [string, any], i) => (
            <motion.div 
              key={className}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`
                flex flex-col gap-6 p-8 rounded-[3rem] bg-white border transition-all duration-500 group
                ${isEditMode ? 'border-primary/20 ring-8 ring-primary/[0.03]' : 'border-slate-50 hover:shadow-2xl hover:border-primary/10 hover:-translate-y-1'}
              `}
            >
               <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-2xl font-display font-black tracking-tighter text-primary uppercase">
                      {className || "Unassigned"}
                    </h3>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none">
                      Teacher: {data?.teacher || "TBA"}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white transition-all">
                    <Users size={18} />
                  </div>
               </div>

               <div className="space-y-2.5">
                  {data?.students?.map((student: any, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => toggleAttendance(className, student.name)}
                      className={`
                        flex items-center justify-between p-3.5 rounded-2xl transition-all border
                        ${isEditMode ? 'cursor-pointer hover:bg-primary/[0.03] border-primary/10 active:scale-95' : 'bg-surface border-transparent font-medium'}
                      `}
                    >
                       <div className="flex items-center gap-3">
                         {isEditMode && (
                           <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(className, student.name); }} className="text-rose-200 hover:text-rose-500 transition-colors">
                             <X size={14} />
                           </button>
                         )}
                         <span className="text-sm font-bold text-slate-800 tracking-tight">{student?.name || "Unknown"}</span>
                       </div>
                       <div className="pointer-events-none scale-90 origin-right font-black">
                          {student?.attendance === "참가" ? (
                            <div className="badge bg-emerald-50 text-emerald-600 px-3 py-1.5 text-[9px] tracking-widest uppercase rounded-lg">참가</div>
                          ) : student?.attendance === "불참" ? (
                            <div className="badge bg-rose-50 text-rose-400 px-3 py-1.5 text-[9px] tracking-widest uppercase rounded-lg">불참</div>
                          ) : (
                            <div className="badge bg-slate-100 text-slate-300 px-3 py-1.5 text-[9px] tracking-widest uppercase rounded-lg">미정</div>
                          )}
                       </div>
                    </div>
                  ))}
                  {isEditMode && (
                    <button 
                      onClick={() => { setShowAddModal(true); setNewStudent({ ...newStudent, group: className }); }}
                      className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 hover:border-primary/20 hover:text-primary transition-all mt-2"
                    >
                      + Register Student
                    </button>
                  )}
               </div>

               <div className="mt-4 pt-6 border-t border-slate-50 flex items-center justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Count</span>
                  <span className="text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                    {data?.students?.filter((s: any) => s.attendance === "참가").length || 0} / {data?.students?.length || 0}
                  </span>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {showLogin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full space-y-10 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center text-primary mx-auto">
                <Lock size={36} />
              </div>
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase">Lock System</h2>
              <p className="text-slate-400 font-serif italic text-lg leading-snug opacity-80">Authorized teachers only.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                autoFocus type="password" placeholder="······" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-8 py-5 rounded-2xl bg-surface border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-black text-center text-3xl tracking-[1em]"
              />
              <button type="submit" className="w-full h-16 rounded-2xl bg-primary text-white font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Enter System
              </button>
              <button type="button" onClick={() => setShowLogin(false)} className="text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-slate-500">Back</button>
            </form>
          </motion.div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-md w-full space-y-10 text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mx-auto">
                <Users size={36} />
              </div>
              <h2 className="text-4xl font-display font-black tracking-tighter uppercase">New Entry</h2>
              <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Registering to {newStudent.group}</p>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <input 
                autoFocus type="text" placeholder="Name" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                className="w-full px-8 py-5 rounded-2xl bg-surface border-2 border-transparent focus:border-primary/10 focus:bg-white outline-none transition-all font-bold text-center"
              />
              <button type="submit" disabled={isSaving} className="w-full h-16 rounded-2xl bg-primary text-white font-black tracking-widest uppercase shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                {isSaving ? "Saving..." : "Add Member"}
              </button>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-slate-300 text-[10px] font-black uppercase tracking-widest hover:text-slate-500">Cancel</button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
