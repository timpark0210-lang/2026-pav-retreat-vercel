import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Serif_KR, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";
import "@/app/globals.css";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const mainData = await getMainData();
  const logoUrl = getGoogleDriveUrl(mainData?.app_icon) || "/favicon.ico";
  const appTitle = mainData?.app_title || "2026 PAV Retreat";

  return {
    title: {
      template: `%s | ${appTitle}`,
      default: appTitle,
    },
    description: mainData?.hero_subtext || "Watch & Follow - 2026 PAV Youth Retreat",
    icons: {
      icon: [
        { url: logoUrl },
        { url: logoUrl, sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: logoUrl, sizes: "180x180", type: "image/png" },
      ],
    },
    appleWebApp: {
      title: appTitle,
      capable: true,
      statusBarStyle: "black-translucent",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb", // PAV Primary Blue
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainData = await getMainData();
  const logoUrl = getGoogleDriveUrl(mainData?.app_icon);
  const appTitle = mainData?.app_title;

  return (
    <html lang="ko" className={`${plusJakarta.variable} ${notoSerif.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans text-slate-900 bg-[#f5f7f9] min-h-screen">
        <Navbar logoUrl={logoUrl} appTitle={appTitle} />
        <main className="pt-20 pb-24 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
