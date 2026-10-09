"use client";

import { BRANCHES, Branch } from "@/src/config/branch.config";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * BranchPicker — the landing screen at "/".
 *
 * Normally the BranchGate modal covers this and sends the customer straight to
 * a branch. This page is reached when someone already has a branch stored and
 * comes back to "/", so it lists both branches again — and records the choice,
 * which a plain <Link> would not do.
 *
 * Staff don't come through here: /backend shows every branch.
 */
export function BranchPicker() {
  const router = useRouter();
  const currentBranch = useBranchStore((s) => s.branch);
  const hasChosen = useBranchStore((s) => s.hasChosen);
  const selectBranch = useBranchStore((s) => s.selectBranch);

  const handleSelect = (branch: Branch) => {
    selectBranch(branch);
    router.push(`/${branch.slug}`);
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-racing-bg px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-racing-fg mb-2">เลือกสาขา</h1>
          <p className="text-racing-fg-2">
            เลือกสาขาที่ต้องการจองเวลาหรือเข้าคิว
          </p>
          {hasChosen && (
            <p className="text-sm text-racing-flag mt-2">
              สาขาปัจจุบันของคุณ: {currentBranch.shortName}
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {BRANCHES.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleSelect(branch)}
              type="button"
              className="group relative overflow-hidden rounded-2xl border border-racing-line bg-racing-panel p-6 text-left transition-all duration-200 hover:border-racing-flag hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-4">
                {/* The logo already says "Racing Game Station <branch>", so the
                    branch name is not repeated beside it. */}
                <Image
                  src={branch.logo}
                  alt={`${branch.name} — เลือกสาขานี้`}
                  width={280}
                  height={80}
                  className="h-14 w-auto max-w-70 object-contain object-left"
                />
                {hasChosen && branch.id === currentBranch.id && (
                  <span className="self-start text-xs px-2 py-1 rounded-lg bg-racing-flag-dim text-racing-flag font-medium">
                    สาขาปัจจุบัน
                  </span>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg bg-racing-flag-dim text-racing-flag font-medium">
                  จองเวลา
                </span>
                <span className="text-xs px-3 py-1.5 rounded-lg bg-racing-panel-2 border border-racing-line text-racing-fg-2 font-medium">
                  เข้าคิว
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
