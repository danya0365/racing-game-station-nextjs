import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { JoinWalkInView } from '@/src/presentation/components/walk-in/JoinWalkInView';
import { BRANCHES } from '@/src/config/branch.config';
import type { Metadata } from 'next';

const BRANCH = BRANCHES.find((b) => b.slug === 'pattani')!;

export const metadata: Metadata = {
  title: `เข้าคิวเล่นเกม | ปัตตานี`,
  description: `ระบบรับบำดับคิวสำหรับลูกค้า Walk-in — สาขาปัตตานี`,
};

export default function Page() {
  return (
    <BranchScope branch={BRANCH}>
      <JoinWalkInView />
    </BranchScope>
  );
}
