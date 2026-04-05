import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkSheets() {
  const targetId = "1MKVrJqfyR4N0UlrVwbK6m6XPLyjl1HpdIWwd5i5s_VQ";
  console.log(`Checking sheets inside ${targetId}...`);
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  try {
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const res = await sheets.spreadsheets.get({ spreadsheetId: targetId });
    const sheetNames = res.data.sheets?.map(s => s.properties?.title);
    console.log("✅ Sheet Names Found:", sheetNames?.join(", "));
    
    // Check for SSOT required sheets
    const required = ["StudentList", "Attendance", "MainData"];
    const missing = required.filter(r => !sheetNames?.includes(r));
    
    if (missing.length === 0) {
      console.log("🎯 This looks like the CORRECT PAV Retreat sheet!");
    } else {
      console.log("⚠️ This sheet is MISSING: " + missing.join(", "));
    }
    process.exit(0);
  } catch (err) {
    console.error("❌ Error checking sheets:", err.message);
    process.exit(1);
  }
}

checkSheets();
