import AuthInitializerWrapper from "@/src/presentation/components/auth/AuthInitializerWrapper";
import { BranchThemeScript } from "@/src/presentation/components/branch/BranchThemeScript";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { ThemeProvider } from "@/src/presentation/providers/ThemeProvider";
import {
  SHOP_KEYWORDS,
  SHOP_NAME,
  SHOP_TEAM_NAME,
} from "@/src/config/shop.config";
import type { Metadata } from "next";
import "../public/styles/index.css";

const SITE_TITLE = `${SHOP_NAME} - ระบบจองคิว`;
const SITE_DESCRIPTION = `ระบบจองคิวสำหรับ ${SHOP_NAME} - จองคิวง่าย รวดเร็ว`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: SHOP_KEYWORDS,
  authors: [{ name: SHOP_TEAM_NAME }],
  openGraph: {
    title: SITE_TITLE,
    description: `ระบบจองคิวสำหรับ ${SHOP_NAME}`,
    type: "website",
  },
};

/**
 * Root layout — routing only.
 *
 * `data-racing` is set by BranchThemeScript rather than read from the path
 * here: `headers()` in a root layout opts every page into dynamic rendering,
 * which would cost more than the theme switch is worth. The inline script is
 * render-blocking and sits in <head>, so the accent is right on the first
 * paint either way.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <BranchThemeScript />
      </head>
      <body className="antialiased">
        <AuthInitializerWrapper />
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
