import React from "react";
import { Metadata } from "next";
import { getSheetValues } from "@/lib/google-sheets";
import { groupStudentsByClass } from "@/lib/utils/grouping";
import AttendanceClient from "@/components/attendance/AttendanceClient";

export const metadata: Metadata = {
  title: "Attendance | PAV 2026",
};

export default async function AttendancePage() {
  let grouped: any = {};

  try {
    const rows = await getSheetValues("Attendance!A:C");
    if (rows && Array.isArray(rows)) {
      grouped = groupStudentsByClass(rows);
    }
  } catch (error) {
    console.error("Failed to fetch attendance for SSR:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <AttendanceClient initialGrouped={grouped} />
      
      {/* Footer Disclaimer */}
      <section className="bg-surface-lowest p-12 rounded-[2.5rem] border-2 border-primary/5 text-center mt-20">
         <p className="text-2xl font-serif text-slate-500 leading-relaxed max-w-3xl mx-auto">
            "실시간 명단 공유를 통해 서로의 필요를 <br/> 함께 기도로 채워가는 공동체가 됩시다."
         </p>
      </section>
    </div>
  );
}
