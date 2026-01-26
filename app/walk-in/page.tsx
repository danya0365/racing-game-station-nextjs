import { JoinWalkInView } from '@/src/presentation/components/walk-in/JoinWalkInView';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'เข้าคิวเล่นเกม | Racing Game Station',
  description: 'ระบบรับบำดับคิวสำหรับลูกค้า Walk-in ที่ Racing Game Station',
};

export default function WalkInPage() {
  return <JoinWalkInView />;
}
