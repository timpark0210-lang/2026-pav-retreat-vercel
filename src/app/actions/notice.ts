"use server";

import { appendSheetValues } from "@/lib/google-sheets";
import { revalidatePath } from "next/cache";

export async function addNoticeAction(formData: {
  title: string;
  content: string;
  author: string;
  password?: string;
}) {
  try {
    // 1. 비밀번호 확인 (관리자 보호)
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (formData.password !== adminPassword) {
      throw new Error("관리자 비밀번호가 일치하지 않습니다.");
    }

    // 2. 데이터 준비
    // Notice 시트 컬럼: A:Title, B:Content, C:Author, D:Time, E:Type
    const now = new Date();
    const timeStr = now.toLocaleString("ko-KR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }); // 예: 4월 10일 13:30

    const newRow = [
      formData.title,
      formData.content,
      formData.author || "운영팀",
      timeStr,
      "general", // 기본 유형
    ];

    // 3. Google Sheets에 추가
    await appendSheetValues("Notice!A:E", [newRow]);

    // 4. 페이지 캐시 갱신
    revalidatePath("/notice");

    return { success: true };
  } catch (error: any) {
    console.error("[ERROR] addNoticeAction failed:", error);
    return { success: false, error: error.message };
  }
}
