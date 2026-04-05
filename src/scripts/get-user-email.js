import { google } from "googleapis";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function getEmail() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

  try {
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const res = await oauth2.userinfo.get();
    console.log("✅ Authenticated User Email:", res.data.email);
    console.log("Please make sure SHEET ID 14sEfiQb... is shared with this email.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error fetching user info:", err.message);
    process.exit(1);
  }
}

getEmail();
