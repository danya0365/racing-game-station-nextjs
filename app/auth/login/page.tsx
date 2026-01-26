import { LoginView } from '@/src/presentation/components/auth/LoginView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เข้าสู่ระบบ | Racing Game Station',
  description: 'เข้าสู่ระบบเพื่อจองคิว Racing Game Station',
};

/**
 * Login Page - Server Component for SEO optimization
 */
export default function LoginPage() {
  return <LoginView />;
}
