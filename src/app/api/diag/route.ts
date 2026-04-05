import { NextResponse } from "next/server";
import { getSheetValues } from "@/lib/google-sheets";

export async function GET() {
  // SYSTEMATIC DEBUGGING (S-71): Final Diagnostic check
  const envStatus = {
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? "PRESENT" : "MISSING",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? "PRESENT" : "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "PRESENT" : "MISSING",
    GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN ? "PRESENT" : "MISSING",
    NODE_ENV: process.env.NODE_ENV,
  };

  let apiTest: any = null;
  let apiError: any = null;

  try {
    // Attempt to fetch 5 cells to verify data retrieval
    apiTest = await getSheetValues("MainData!A1:E1");
  } catch (error: any) {
    apiError = {
      message: error.message,
      status: error.status || error.code || "unknown",
      errorStack: error.stack,
      data: error.response?.data || null,
    };
  }

  return NextResponse.json({
    envStatus,
    apiTest,
    apiError,
    timestamp: new Date().toISOString()
  });
}
