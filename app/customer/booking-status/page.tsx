import { BookingStatusView } from '@/src/presentation/components/customer/BookingStatusView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'สถานะการจอง | Racing Game Station',
  description: 'ดูสถานะการจองเวลาของคุณ',
};

export default function BookingStatusPage() {
  return <BookingStatusView />;
}
