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
  try {
    const rows = await getSheetValues("MainData!A2:B20");
    const data: Record<string, string> = {};
    rows.forEach(row => {
      if (row[0] && row[1]) {
        data[row[0].trim()] = row[1].trim();
      }
    });
    return data;
  } catch (error) {
    console.warn("[WARN] Failed to fetch MainData, using empty config.");
    return {} as Record<string, string>;
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
