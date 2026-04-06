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
    <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
      <AttendanceClient initialGrouped={grouped} />
    </div>
  );
}
