import React from "react";
import { Metadata } from "next";
import { getScheduleData } from "@/lib/google-sheets";
import ScheduleClient from "@/components/schedule/ScheduleClient";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

export const metadata: Metadata = {
  title: "Schedule | PAV 2026",
  description: "2026 PAV Youth Retreat Detailed Timetable",
};

export default async function SchedulePage() {
  const scheduleData = await getScheduleData();

  // Integrated mapping fallback if sheet is empty or failing
  const fallbackData = {
    day1: [],
    day2: [],
    day3: [],
    integrated: [
      { day: "Day 1", date: "4/17 (Fri)", theme: "Opening & Vision" },
      { day: "Day 2", date: "4/18 (Sat)", theme: "Community & Growth" },
      { day: "Day 3", date: "4/19 (Sun)", theme: "Sending & Mission" },
    ]
  };

  return <ScheduleClient initialData={scheduleData || (fallbackData as any)} />;
}
