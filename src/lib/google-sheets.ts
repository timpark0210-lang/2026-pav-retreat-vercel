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
