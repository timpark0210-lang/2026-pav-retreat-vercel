import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function verify() {
  console.log("Starting Google API Verification...");
  console.log("Client ID:", process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + "...");
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  try {
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    console.log("✅ Verification SUCCESS!");
    console.log("Spreadsheet Title:", response.data.properties?.title);
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Verification FAILED!");
    console.error("Status:", error.response?.status);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    process.exit(1);
  }
}

verify();
