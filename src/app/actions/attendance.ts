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

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Merge only the dirty state (updates) into the existing data
    const updatedRows = dataRows.map(row => {
      const match = updates.find(u => 
        u.group === row[0]?.toString().trim() && 
        u.name === row[1]?.toString().trim()
      );
      if (match) {
        return [row[0], row[1], match.attendance];
      }
      return row;
    });

    const finalResult = [headers, ...updatedRows];
    await updateSheetValues(range, finalResult);
    
    revalidatePath("/attendance");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update attendance:", error);
    return { success: false, error: error.message };
  }
}

export async function addStudentAction(student: { group: string; name: string; attendance: string }) {
  try {
    const range = "Attendance!A:C";
    const rows = await getSheetValues(range) || [];
    
    // Check if student already exists
    const exists = rows.some(row => 
      row[0]?.toString().trim() === student.group && 
      row[1]?.toString().trim() === student.name
    );

    if (exists) {
      throw new Error("Student already exists in this class.");
    }

    const newRows = [...rows, [student.group, student.name, student.attendance]];
    
    // Sort by group (Class) as per blueprint requirement
    const headers = newRows[0];
    const data = newRows.slice(1).sort((a, b) => a[0].localeCompare(b[0]));
    
    await updateSheetValues(range, [headers, ...data]);
    revalidatePath("/attendance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteStudentAction(group: string, name: string) {
  try {
    const range = "Attendance!A:C";
    const rows = await getSheetValues(range);
    if (!rows) return { success: false, error: "No data found" };

    const headers = rows[0];
    const newRows = rows.slice(1).filter(row => 
      !(row[0]?.toString().trim() === group && row[1]?.toString().trim() === name)
    );

    await updateSheetValues(range, [headers, ...newRows]);
    revalidatePath("/attendance");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
