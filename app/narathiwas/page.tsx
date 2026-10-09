import { BRANCHES } from "@/src/config/branch.config";
import { BranchScope } from "@/src/presentation/components/branch/BranchScope";
import { HomeView } from "@/src/presentation/components/home/HomeView";
import { createServerHomePresenter } from "@/src/presentation/presenters/home/HomePresenterServerFactory";
import { getShopNow, getShopTodayString } from "@/src/lib/date";
import type { Metadata } from "next";
import Link from "next/link";

const BRANCH = BRANCHES.find((b) => b.slug === "narathiwas")!;

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Racing Game Station นราธิวาส — ระบบจองคิว Racing Game Station",
    description: "ระบบจองคิวสำหรับ Racing Game Station สาขานราธิวาส",
  };
}

/**
 * Home page for Pattani branch.
 *
 * The branch is a real URL segment (app/narathiwas/), not a route group —
 * (narathiwas)/ would collapse to / and lose the branch.
 */
export default async function NarathiwatHomePage() {
  const presenter = await createServerHomePresenter();
  let viewModel: Awaited<ReturnType<typeof presenter.getViewModel>> | null = null;
  try {
    const todayStr = getShopTodayString();
    const nowStr = getShopNow().toISOString();
    viewModel = await presenter.getViewModel(todayStr, nowStr, BRANCH.id);
  } catch (error) {
    // Only the data fetch is guarded here — JSX rendering errors are not
    // caught by try/catch (react-hooks/error-boundaries)
    console.error('Error fetching home data:', error);
  }

  if (!viewModel) {
    return (
      <div className="h-full flex items-center justify-center bg-racing-gradient">
        <div className="text-center">
          <div className="text-6xl mb-4">🏎️</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">เกิดข้อผิดพลาด</h1>
          <p className="text-muted mb-4">ไม่สามารถโหลดข้อมูลได้</p>
          <Link
            href="/narathiwas"
            className="inline-block bg-gradient-to-r from-racing-flag to-racing-flag-soft text-racing-on-flag px-6 py-3 rounded-xl hover:from-racing-flag-soft hover:to-racing-flag transition-all"
          >
            ลองใหม่อีกครั้ง
          </Link>
        </div>
      </div>
    );
  }

  return (
    <BranchScope branch={BRANCH}>
      <HomeView initialViewModel={viewModel} />
    </BranchScope>
  );
}
