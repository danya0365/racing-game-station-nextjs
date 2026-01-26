import { QRScanView } from '@/src/presentation/components/qr-scan/QRScanView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'QR Code จองเวลา | Racing Game Station',
  description: 'สแกน QR Code เพื่อจองเวลาสำหรับเล่น Racing Game Station',
};

export default function QRScanPage() {
  return <QRScanView />;
}
