import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { BookingHistoryView } from '@/src/presentation/components/customer/BookingHistoryView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'pattani')!;

export const metadata: Metadata = {
  title: `ตารางการจอง | ปัตตานี`,
  description: `ดูตารางและประวัติการจองเวลาทั้งหมด — สาขาปัตตานี`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <BookingHistoryView />
    </BranchScope>
  );
}
