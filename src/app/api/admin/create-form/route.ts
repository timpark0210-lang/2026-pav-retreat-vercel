import { NextRequest, NextResponse } from "next/server";
import { createPAVRetreatForm } from "@/services/form-service";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  // Verify Admin Auth
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");

  if (!adminToken || adminToken.value !== "pav_retreat_admin_auth_success") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const publishedUrl = await createPAVRetreatForm();
    return NextResponse.json({ success: true, url: publishedUrl });
  } catch (error: any) {
    console.error("API create-form error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create form" },
      { status: 500 }
    );
  }
}
