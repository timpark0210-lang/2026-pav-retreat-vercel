import React from "react";
export const dynamic = "force-dynamic";
import Navbar from "@/components/Navbar";
import StudentListView from "@/components/StudentListView";
import { getStudentData } from "@/services/data-service";

export default async function StudentsPage() {
  // Fetch data on the server
  const studentData = await getStudentData();

  return (
    <main className="min-h-screen pb-24 md:pb-0 md:pt-20 bg-slate-50 selection:bg-primary/30 selection:text-primary">
      <Navbar />

      <section className="px-6 py-12 max-w-7xl mx-auto">
        <StudentListView studentData={studentData} />
      </section>

      {/* Footer Branding */}
      <footer className="py-20 text-center opacity-40">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">P</div>
            <span className="font-black tracking-tight">PAV SPIRITUAL RETREAT 2026</span>
          </div>
          <p className="text-xs font-bold">© 2026 PAV Youth. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
