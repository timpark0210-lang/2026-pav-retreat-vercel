import React from "react";
import { Metadata } from "next";
import { getScriptureData } from "@/lib/google-sheets";
import ScriptureCards from "@/components/scripture/ScriptureCards";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

export const metadata: Metadata = {
  title: "Scripture Messages | PAV 2026",
  description: "Spiritual anchors for the PAV 2026 journey.",
};

export default async function ScripturePage() {
  const scriptureItems = await getScriptureData();

  // Fallback for empty sheet
  const fallback = [
    {
      category: "FOUNDATION",
      verse: "Matthew 26:41",
      text: "Watch and pray so that you will not fall into temptation. The spirit is willing, but the flesh is weak.",
      theme: "VIGILANCE",
      metadata: "Scripture Seed"
    }
  ];

  return (
    <div className="min-h-screen pt-24 bg-surface-lowest">
      <ScriptureCards items={scriptureItems.length > 0 ? scriptureItems : fallback} />
    </div>
  );
}
