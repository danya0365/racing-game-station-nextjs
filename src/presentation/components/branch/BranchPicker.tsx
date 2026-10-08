"use client";

import { BRANCHES, Branch } from "@/src/config/branch.config";
import { useBranchStore } from "@/src/presentation/stores/useBranchStore";
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
    <div className="min-h-full flex items-center justify-center bg-racing-gradient px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏎️</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">เลือกสาขา</h1>
          <p className="text-muted">เลือกสาขาที่ต้องการจองเวลาหรือเข้าคิว</p>
          {hasChosen && (
            <p className="text-sm text-accent-cyan mt-2">
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
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-lg p-6 text-left transition-all duration-200 hover:border-accent-cyan hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
                  📍
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground transition-colors group-hover:text-accent-cyan">
                    สาขา{branch.shortName}
                  </h2>
                  <p className="text-sm text-muted mt-1">{branch.name}</p>
                  {hasChosen && branch.id === currentBranch.id && (
                    <p className="text-xs text-accent-cyan mt-1">
                      สาขาปัจจุบัน
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/15 text-accent-cyan font-medium">
                  จองเวลา
                </span>
                <span className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/15 text-accent-purple font-medium">
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
