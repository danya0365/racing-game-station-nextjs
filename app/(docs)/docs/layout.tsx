import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'คู่มือการใช้งาน | Racing Game Station',
  description: 'คู่มือการใช้งานระบบจองคิว Racing Game Station สำหรับลูกค้าและแอดมิน',
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
