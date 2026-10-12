import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { BookingStatusView } from '@/src/presentation/components/customer/BookingStatusView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'narathiwas')!;

export const metadata: Metadata = {
  title: `สถานะการจอง | นราธิวาส`,
  description: `ดูสถานะการจองเวลาของคุณ — สาขานราธิวาส`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <BookingStatusView />
    </BranchScope>
  );
}
