import { Metadata } from 'next';
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("คู่มือการใช้งาน"),
  description: `คู่มือการใช้งานระบบจองคิว ${SHOP_NAME} สำหรับลูกค้าและแอดมิน`,
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
