import { LoginView } from '@/src/presentation/components/auth/LoginView';
import type { Metadata } from 'next';
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("เข้าสู่ระบบ"),
  description: `เข้าสู่ระบบเพื่อจองคิว ${SHOP_NAME}`,
};

/**
 * Login Page - Server Component for SEO optimization
 */
export default function LoginPage() {
  return <LoginView />;
}
