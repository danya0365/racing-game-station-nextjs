import { BranchScope } from "@/src/presentation/components/branch/BranchScope";
import { BackendView } from "@/src/presentation/components/backend/BackendView";
import { createServerBackendPresenter } from "@/src/presentation/presenters/backend/BackendPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = await createServerBackendPresenter();

  try {
    return presenter.generateMetadata();
  } catch (error) {
    console.error("Error generating metadata:", error);

    return {
      title: "แอดมิน | Racing Game Station",
      description: "ระบบจัดการคิวและเครื่องเล่น Racing Game Station",
    };
  }
}

/**
 * Backend/Admin page — staff dashboard for the selected branch.
 *
 * No server-side view model: the chosen branch lives in localStorage, which the
 * server cannot read, so fetching here would show every branch's numbers for a
 * frame before the client refetched the selected one. BackendView loads it on
 * the client instead, scoped by BranchScope.
 */
export default function BackendPage() {
  return (
    <BranchScope>
      <BackendView />
    </BranchScope>
  );
}
