import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { BookingStatusView } from '@/src/presentation/components/customer/BookingStatusView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'pattani')!;

export const metadata: Metadata = {
  title: `สถานะการจอง | ปัตตานี`,
  description: `ดูสถานะการจองเวลาของคุณ — สาขาปัตตานี`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <BookingStatusView />
    </BranchScope>
  );
}
