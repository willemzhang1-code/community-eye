import type { Metadata, Viewport } from "next";
import "./globals.css";
import { TopNav } from "@/components/nav/TopNav";
import { BottomTabBar } from "@/components/nav/BottomTabBar";

export const metadata: Metadata = {
  title: "Game Intel",
  description: "Daily market intelligence for the games you watch.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Game Intel",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <TopNav />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-28 sm:pb-12 pt-4 sm:pt-8">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  );
}
