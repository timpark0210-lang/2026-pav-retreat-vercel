import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const interIndices = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoIndices = Noto_Sans_KR({
  variable: "--font-noto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "2026 PAV Retreat: Watch & Follow",
  description: "2026 PAV Youth Retreat Registration Portal",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    title: "PAV 2026",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${interIndices.variable} ${notoIndices.variable}`}>
      <body className="antialiased font-sans text-slate-900 bg-surface">
        {children}
      </body>
    </html>
  );
}
