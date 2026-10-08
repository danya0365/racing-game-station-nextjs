/**
 * Backend Control Page - Game Room Control Panel
 * 
 * Full-screen focus mode for managing game room sessions.
 * Session-centric approach: tracks actual machine usage.
 * 
 * Route: /backend/control
 */

import { BranchScope } from '@/src/presentation/components/branch/BranchScope';
import { ControlView } from '@/src/presentation/components/backend/ControlView';

export default function BackendControlPage() {
  // Branch-scoped like the customer pages. This route has no branch segment in
  // its URL, so BranchScope is given no `branch` prop and follows the branch the
  // customer picked (BranchGate asks on a first visit). The panel then shows only
  // that branch's machines, sessions and queue. Drop BranchScope entirely to
  // show every branch at once.
  return (
    <BranchScope>
      <ControlView />
    </BranchScope>
  );
}
