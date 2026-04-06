import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Serif_KR, Manrope } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getMainData, getGoogleDriveUrl } from "@/lib/google-sheets";
import "@/app/globals.css";

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

export const metadata: Metadata = {
  title: "2026 PAV Retreat: Watch & Follow",
  description: "2026 PAV Youth Retreat Registration Portal - Ethereal Archive",
  appleWebApp: {
    title: "PAV 2026",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mainData = await getMainData();
  const logoUrl = getGoogleDriveUrl(mainData?.app_icon);

  return (
    <html lang="ko" className={`${plusJakarta.variable} ${notoSerif.variable} ${manrope.variable} antialiased`}>
      <body className="font-sans text-slate-900 bg-[#f5f7f9] min-h-screen">
        <Navbar logoUrl={logoUrl} />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
