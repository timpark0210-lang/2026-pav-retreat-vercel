import React from "react";
import { Metadata } from "next";
import { getMainData, getGoogleDriveUrl, getNoticeData } from "@/lib/google-sheets";
import HomeClient from "@/components/home/HomeClient";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

export const metadata: Metadata = {
  title: "Home | PAV Power Wave 2026",
  description: "WATCH & FOLLOW - 2026 PAV Power Wave Youth Retreat",
};

export default async function HomePage() {
  const notices = await getNoticeData();
  const mainData = await getMainData();
  
  // Dynamic Assets & Strings
  const heroUrl = getGoogleDriveUrl(mainData?.hero_image_id) || "/pav_2026_retreat_poster_1775388297277.png";

  return (
    <HomeClient 
      notices={notices} 
      mainData={mainData} 
      heroUrl={heroUrl} 
    />
  );
}
