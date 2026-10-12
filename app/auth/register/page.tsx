import { RegisterView } from '@/src/presentation/components/auth/RegisterView';
import type { Metadata } from 'next';
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("สมัครสมาชิก"),
  description: `สมัครสมาชิกเพื่อจองคิว ${SHOP_NAME} ได้ง่ายขึ้น`,
};

/**
 * Register Page - Server Component for SEO optimization
 */
export default function RegisterPage() {
  return <RegisterView />;
}
