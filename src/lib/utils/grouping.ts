/**
 * PAV 2026 Data Grouping & Transformation Utilities
 */

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

export interface Student {
  name: string;
  group: string;
  attendance: string;
}

export interface GroupedStudents {
  [className: string]: {
    teacher: string;
    students: Student[];
  };
}

/**
 * Transforms flat student data from Sheets into grouped cards
 */
export function groupStudentsByClass(rows: any[][]): GroupedStudents {
  const grouped: GroupedStudents = {};

  // Assuming headers: [Group, Name, Status]
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header
    
    const rawGroup = row[0]?.toString().trim() || "Unassigned";
    const name = row[1]?.toString().trim();
    const attendance = row[2]?.toString().trim() || "미정";

    if (!name) return;

    // Normalize group name (match Code.gs logic)
    const normalizedGroup = rawGroup.replace('/', ',');
    const baseGroup = normalizedGroup.split('(')[0]?.trim() || normalizedGroup;
    const teacher = GROUP_MAP[baseGroup] || GROUP_MAP[normalizedGroup] || GROUP_MAP[rawGroup] || "TBA";
    const classKey = `${normalizedGroup}`;

    if (!grouped[classKey]) {
      grouped[classKey] = {
        teacher,
        students: []
      };
    }

    grouped[classKey].students.push({ name, group: rawGroup, attendance });
  });

  // Sort groups by Year (7 -> 13) and Alphabetical (B -> G -> A)
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    const getYear = (s: string) => parseInt(s.match(/\d+/)?.[0] || "99");
    const getLabel = (s: string) => s.replace(/\d+/, "");
    
    const yearA = getYear(a);
    const yearB = getYear(b);
    
    if (yearA !== yearB) return yearA - yearB;
    return getLabel(a).localeCompare(getLabel(b));
  });

  const sortedGrouped: GroupedStudents = {};
  sortedKeys.forEach(key => {
    sortedGrouped[key] = grouped[key];
  });

  return sortedGrouped;
}

/**
 * Transforms flat timetable data into day-based objects
 */
export function groupTimelineByDay(rows: any[][]) {
  const timeline: Record<string, any[]> = { '1': [], '2': [], '3': [] };

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header [Day, Time, Duration, Program, Details, Bigo]
    
    const day = row[0]?.toString().trim();
    if (timeline[day]) {
      timeline[day].push({
        time: row[1],
        duration: row[2],
        program: row[3],
        details: row[4],
        bigo: row[5]
      });
    }
  });

  return timeline;
}
