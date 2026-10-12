import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { TimeBookingView } from '@/src/presentation/components/customer/TimeBookingView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'narathiwas')!;

export const metadata: Metadata = {
  title: `จองเวลา | นราธิวาส`,
  description: `จองเวลาเล่น เลือกวันเวลาที่สะดวก — สาขานราธิวาส`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <TimeBookingView />
    </BranchScope>
  );
}
