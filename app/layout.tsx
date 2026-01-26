import AuthInitializerWrapper from "@/src/presentation/components/auth/AuthInitializerWrapper";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import type { Metadata } from "next";
import "../public/styles/index.css";

export const metadata: Metadata = {
  title: "Racing Game Station - ระบบจองคิว Racing Game Station",
  description: "ระบบจองคิวสำหรับ Racing Game Station - จองคิวง่าย รวดเร็ว",
  keywords: ["racing game station", "จองคิว", "racing game", "esports", "driving"],
  authors: [{ name: "Racing Game Station Team" }],
  openGraph: {
    title: "Racing Game Station - ระบบจองคิว Racing Game Station",
    description: "ระบบจองคิวสำหรับ Racing Game Station",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className="antialiased">
        <AuthInitializerWrapper />
        <ThemeProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
