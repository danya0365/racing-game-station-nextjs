import { AuthCallbackView } from '@/src/presentation/components/auth/AuthCallbackView';
import type { Metadata } from 'next';
import { shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("กำลังเข้าสู่ระบบ..."),
  description: 'กำลังดำเนินการเข้าสู่ระบบ',
};

/**
 * Auth Callback Page - Handles OAuth redirects
 */
export default function AuthCallbackPage() {
  return <AuthCallbackView />;
}
