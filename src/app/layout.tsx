import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Serif_KR, Geist } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import { getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";
import "@/app/globals.css";

export const revalidate = 60; // Auto-sync spreadsheet changes every 60 seconds

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const notoSerif = Noto_Serif_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
    <html lang="ko" className={`${spaceGrotesk.variable} ${notoSerif.variable} ${geist.variable} antialiased`}>
      <body className="font-geist text-slate-900 bg-[#f8f9fb] min-h-screen relative overflow-x-hidden selection:bg-primary/10 selection:text-primary">
        {/* Premium Grain Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Subtle Glow Backgrounds */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />

        <Navbar logoUrl={logoUrl} appTitle={appTitle} />
        <main className="pt-20 pb-24 md:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
