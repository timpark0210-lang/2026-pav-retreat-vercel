import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth2 Client Singleton for Sheets API
 */
let oauth2Client: OAuth2Client | null = null;

export function getOAuth2Client() {
  // Use existing client if available to prevent multiple re-authentications
  if (oauth2Client) return oauth2Client;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  // SYSTEMATIC DEBUGGING (S-71): Instrumentation for Vercel Runtime
  console.log("[DEBUG] getOAuth2Client Initialization Attempt");
  console.log(`[DEBUG] CLIENT_ID: ${clientId ? "PRESENT (" + clientId.substring(0, 5) + "...)" : "MISSING"}`);
  console.log(`[DEBUG] CLIENT_SECRET: ${clientSecret ? "PRESENT (" + clientSecret.substring(0, 3) + "...)" : "MISSING"}`);
  console.log(`[DEBUG] REFRESH_TOKEN: ${refreshToken ? "PRESENT (len:" + refreshToken.length + ")" : "MISSING"}`);

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("[CRITICAL] Missing Google OAuth2 credentials in Vercel Runtime.");
    throw new Error(
      "Missing Google OAuth2 credentials in environment variables."
    );
  }

  // Initialize OAuth2 client
  oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  return oauth2Client;
}

/**
 * Get Google Sheets Instance
 */
export function getSheetsInstance() {
  const auth = getOAuth2Client();
  return google.sheets({ version: "v4", auth });
}

/**
 * Read data from a specific sheet range
 */
export async function getSheetValues(range: string) {
  const sheets = getSheetsInstance();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    return response.data.values || [];
  } catch (error: any) {
    console.error(`[CRITICAL] Error fetching sheet values for range ${range}`);
    console.error(`[DEBUG] Error Status: ${error.status || error.code}`);
    console.error(`[DEBUG] Error Message: ${error.message}`);
    if (error.response?.data) {
      console.error("[DEBUG] Full Error Data:", JSON.stringify(error.response.data));
    }
    throw error;
  }
}

/**
 * Update data in a specific sheet range
 */
export async function updateSheetValues(range: string, values: any[][]) {
  const sheets = getSheetsInstance();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating sheet values for range ${range}:`, error);
    throw error;
  }
}

/**
 * Append data to a sheet
 */
export async function appendSheetValues(range: string, values: any[][]) {
  const sheets = getSheetsInstance();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error appending sheet values for range ${range}:`, error);
    throw error;
  }
}

/**
 * Fetch Key-Value configuration from MainData sheet
 */
export async function getMainData() {
  const defaults: Record<string, string> = {
    app_title: "2026 PAV 파워웨이브 수련회",
    hero_title_top: "ANNUAL RETREAT",
    hero_title_main: "Watch and Follow",
    hero_subtext: "그들이 주를 보며 배우고 따라가는 수련회",
    info_date_label: "날짜",
    info_date_value: "2026년 4월 17일(금) - 19일(주일)",
    info_date_sub: "3일간의 믿음의 여정",
    info_location_label: "장소",
    info_location_value: "Moirs Point Christian Centre",
    info_location_sub: "Mangawhai, Northland",
    core_message_title: "Core Message",
    core_message_quote: "예수님께서 가신 길을 바라보고(Watch), 그분의 발자취를 온전히 따라가는(Follow) PAV 청소년이 되기를 소망합니다.",
    core_message_ref: "히브리서 12:2 - \"믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자\"",
    section_notice_title: "공지사항",
    section_staff_title: "섬기는 분들",
    btn_action_label: "일정 확인하기",
    btn_action_link: "/schedule",
    // Ministry Team Defaults
    staff_1_name: "조준목 목사님",
    staff_1_role: "교육목사",
    staff_1_img: "1hU2e_6uV0l7O6t8x_hW3i_tT4e_5s6R7", // Placeholder or existing ID if known
    staff_2_name: "유명종 목사님",
    staff_2_role: "담임목사",
    staff_2_img: "",
    staff_3_name: "양진우 전도사님",
    staff_3_role: "청소년부 담당",
    staff_3_img: "",
    staff_4_name: "부장/회계",
    staff_4_role: "서준호 & 이진희 선생님",
    staff_4_img: "",
    // New Sections
    section_contacts_title: "주요 담당자",
    section_programs_title: "프로그램",
    // Contacts (5)
    contact_1_label: "총괄 기획", contact_1_value: "박성광 선생님",
    contact_2_label: "시설 및 예약", contact_2_value: "차준호 선생님",
    contact_3_label: "차량 이동", contact_3_value: "박상태 선생님",
    contact_4_label: "찬양 인도", contact_4_value: "홀임 찬양팀",
    contact_5_label: "주방 봉사", contact_5_value: "이경희 선생님",
    // Programs (4)
    program_1_label: "조편성 진행", program_1_value: "6~7개 연합조 · 유주형 선생님",
    program_2_label: "공동체 게임", program_2_value: "7~8개 코너 운영 · 권희운 선생님",
    program_3_label: "도전! 골든벨", program_3_value: "성경 지식/QT · 김경희 선생님",
    program_4_label: "Celebration", program_4_value: "경배와 찬양 · 졸업생 찬양팀",
  };

  try {
    const rows = await getSheetValues("MainData!A2:B100");
    const data: Record<string, string> = { ...defaults };
    rows.forEach(row => {
      if (row[0] && row[1]) {
        data[row[0].trim()] = row[1].trim();
      }
    });
    return data;
  } catch (error) {
    console.warn("[WARN] Failed to fetch MainData, using defaults.");
    return defaults;
  }
}

/**
 * Universal Google Drive Image URL Converter
 * Returns a high-fidelity direct link for Next.js Image component
 */
export function getGoogleDriveUrl(docId: string) {
  if (!docId) return "";
  // High-fidelity thumbnail/direct link format (lh3)
  return `https://lh3.googleusercontent.com/u/0/d/${docId}`;
}

/**
 * Fetch detailed timetable from Timetable_Detailed sheet
 */
export async function getScheduleData() {
  try {
    const rows = await getSheetValues("Timetable_Detailed!A2:F100");
    if (!rows || rows.length === 0) return null;
    
    const schedule: Record<string, any[]> = {
      day1: [],
      day2: [],
      day3: [],
      integrated: [
        { day: "Day 1", date: "4/17 (Fri)", theme: "Opening & Vision" },
        { day: "Day 2", date: "4/18 (Sat)", theme: "Community & Growth" },
        { day: "Day 3", date: "4/19 (Sun)", theme: "Sending & Mission" },
      ]
    };
    
    rows.forEach((row, i) => {
      const day = row[0]?.toString().trim().toLowerCase().replace(" ", "") || "";
      const item = {
        time: row[1] || "",
        duration: row[2] || "",
        program: row[3] || "",
        detail: row[4] || "",
        location: row[5] || ""
      };
      
      if (day === "day1") schedule.day1.push(item);
      else if (day === "day2") schedule.day2.push(item);
      else if (day === "day3") schedule.day3.push(item);
    });
    
    return schedule;
  } catch (error) {
    console.warn("[WARN] Failed to fetch ScheduleData, using null.");
    return null;
  }
}

/**
 * Fetch spiritual guidance from Scripture sheet
 */
export async function getScriptureData() {
  try {
    const rows = await getSheetValues("Scripture!A2:G50");
    if (!rows || rows.length === 0) return [];
    
    return rows.map((row) => ({
      category: row[0] || "",
      verse: row[1] || "",
      text: row[2] || "",
      theme: row[3] || "",
      actionLabel: row[4] || "",
      actionLink: row[5] || "",
      metadata: row[6] || ""
    }));
  } catch (error) {
    console.error("Failed to fetch ScriptureData:", error);
    return [];
  }
}
