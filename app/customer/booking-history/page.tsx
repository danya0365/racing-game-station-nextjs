import { BookingHistoryView } from '@/src/presentation/components/customer/BookingHistoryView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตารางการจอง | Racing Game Station',
  description: 'ดูตารางและประวัติการจองเวลาทั้งหมด',
};

export default function BookingHistoryPage() {
  return <BookingHistoryView />;
}
