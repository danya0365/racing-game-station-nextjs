import { QRScanView } from '@/src/presentation/components/qr-scan/QRScanView';
import { Metadata } from 'next';
import { SHOP_NAME, shopPageTitle } from "@/src/config/shop.config";

export const metadata: Metadata = {
  title: shopPageTitle("QR Code จองเวลา"),
  description: `สแกน QR Code เพื่อจองเวลาสำหรับเล่น ${SHOP_NAME}`,
};

export default function QRScanPage() {
  return <QRScanView />;
}
