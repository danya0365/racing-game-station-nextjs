import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { BookingHistoryView } from '@/src/presentation/components/customer/BookingHistoryView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'narathiwas')!;

export const metadata: Metadata = {
  title: `ตารางการจอง | นราธิวาส`,
  description: `ดูตารางและประวัติการจองเวลาทั้งหมด — สาขานราธิวาส`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <BookingHistoryView />
    </BranchScope>
  );
}
