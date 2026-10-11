import { ForgotPasswordView } from '@/src/presentation/components/auth/ForgotPasswordView';
import type { Metadata } from 'next';
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("ลืมรหัสผ่าน"),
  description: `รีเซ็ตรหัสผ่านสำหรับบัญชี ${SHOP_NAME}`,
};

/**
 * Forgot Password Page - Server Component for SEO optimization
 */
export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
