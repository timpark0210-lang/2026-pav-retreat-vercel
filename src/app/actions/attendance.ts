"use server";

import { getSheetValues, updateSheetValues } from "@/lib/google-sheets";
import { revalidatePath } from "next/cache";

export async function updateAttendanceAction(updates: { group: string; name: string; attendance: string }[]) {
  try {
    const range = "Attendance!A:C";
    const rows = await getSheetValues(range);
    
    if (!rows || rows.length === 0) {
      throw new Error("Attendance sheet is empty or not found.");
    }

    // Clone the headers
    const newRows = [...rows];
    const headers = newRows[0];

    // Find and update each student
    updates.forEach(update => {
      const rowIndex = newRows.findIndex(row => 
        row[0]?.toString().trim() === update.group && 
        row[1]?.toString().trim() === update.name
      );

      if (rowIndex !== -1) {
        newRows[rowIndex][2] = update.attendance;
      }
    });

    // Write back to the entire range
    await updateSheetValues(range, newRows);
    
    revalidatePath("/attendance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update attendance:", error);
    return { success: false, error: error.message };
  }
}
