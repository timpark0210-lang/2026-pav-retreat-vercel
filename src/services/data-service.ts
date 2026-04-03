import { getSheetValues, updateSheetValues, appendSheetValues } from "@/lib/google-sheets";

// Group-Teacher mapping (from SSOT/Code.gs)
export const GROUP_MAP: Record<string, string> = {
  '7B': '유주형/문서영',
  '7G': '이수연',
  '8A': '한은종',
  '8B': '조은비',
  '9': '박성광',
  '10': '김경희/차준호',
  '11A': '원진',
  '11B': '김대헌',
  '12,13': '권희운'
};

/**
 * Interface for Student and Group Data
 */
export interface Student {
  name: string;
  attendance: string;
}

export interface GroupData {
  [groupName: string]: Student[]; // Using teachers in the groupName key for legacy compatibility
}

export interface Announcement {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  timeStr: string;
}

/**
 * Fetch student data and merge it with attendance information.
 */
export async function getStudentData(): Promise<any> {
  try {
    const studentListValues = await getSheetValues("StudentList!A2:B");
    const attendanceValues = await getSheetValues("Attendance!A2:C");

    const studentList: Record<string, { name: string }[]> = {};

    // 1. Process StudentList
    studentListValues.forEach((row) => {
      const rawGroup = row[0]?.toString().trim() || "";
      const studentName = row[1]?.toString().trim() || "";
      if (rawGroup && studentName) {
        const normalizedGroup = rawGroup.replace("/", ",");
        const teacher = GROUP_MAP[normalizedGroup] || GROUP_MAP[rawGroup] || "";
        const groupName = teacher ? `${normalizedGroup} (${teacher})` : normalizedGroup;
        if (!studentList[groupName]) {
          studentList[groupName] = [];
        }
        studentList[groupName].push({ name: studentName });
      }
    });

    // 2. Process Attendance
    const attendanceData: Record<string, string> = {};
    attendanceValues.forEach((row) => {
      const gName = row[0]?.toString().trim() || "";
      const sName = row[1]?.toString().trim() || "";
      if (sName && sName !== "총합") {
        const key = `${gName}|${sName}`;
        attendanceData[key] = row[2] || "미정";
      }
    });

    // 3. Merge Information
    const result: Record<string, Student[]> = {};
    for (const groupName in studentList) {
      result[groupName] = studentList[groupName].map((studentObj) => {
        const pureGroup = groupName.split(" ")[0];
        const keyLong = `${groupName}|${studentObj.name}`;
        const keyShort = `${pureGroup}|${studentObj.name}`;

        const status = attendanceData[keyLong] || attendanceData[keyShort] || "미정";
        return { name: studentObj.name, attendance: status };
      });
    }

    return result;
  } catch (error) {
    console.error("Error in getStudentData service:", error);
    throw error;
  }
}

/**
 * Fetch announcement data.
 */
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const values = await getSheetValues("Notice!A2:G");
    if (!values || values.length === 0) return [];

    return values
      .filter((row) => row[1] && row[3])
      .map((row, index) => {
        const ts = new Date(row[3]).getTime();
        return {
          id: row[0]?.toString() || ts.toString(),
          content: row[1]?.toString() || "",
          author: row[2]?.toString() || "Unknown",
          timestamp: ts,
          fileUrl: row[4]?.toString() || undefined,
          fileName: row[5]?.toString() || undefined,
          fileType: row[6]?.toString() || undefined,
          timeStr: new Intl.DateTimeFormat("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(row[3])),
        };
      })
      .reverse();
  } catch (error) {
    console.error("Error in getAnnouncements service:", error);
    return [];
  }
}

/**
 * Batch update attendance.
 */
export async function updateAttendanceBatch(dirtyState: Record<string, string>) {
  // Note: Implementation for batch update on server-side is complex due to row mapping.
  // Legacy GAS approach used row indices, but for REST API we need to be careful.
  // Usually, we'd read all, update in memory, and write all or use specific range updates.
  // Implementing a basic version for now.
  
  // Implementation will continue in Phase 2
}
