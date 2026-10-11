import { BranchPicker } from "@/src/presentation/components/branch/BranchPicker";
import {
  SHOP_KEYWORDS,
  SHOP_NAME,
  SHOP_TEAM_NAME,
} from "@/src/config/shop.config";
import type { Metadata } from "next";

const SITE_TITLE = `${SHOP_NAME} — ระบบจองคิว`;

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: `ระบบจองคิวสำหรับ ${SHOP_NAME} — จองเวลาหรือเข้าคิวได้ที่สาขาปัตตานีและนราธิวาส`,
  keywords: SHOP_KEYWORDS,
  authors: [{ name: SHOP_TEAM_NAME }],
  openGraph: {
    title: SITE_TITLE,
    description: `ระบบจองคิวสำหรับ ${SHOP_NAME}`,
    type: "website",
  },
};

/**
 * Root page — branch picker.
 *
 * On a first visit BranchGate covers this with the branch modal; picking a
 * branch there navigates straight to /narathiwas or /pattani, so this page is
 * only seen by someone who already has a choice stored and came back to `/`.
 * Staff use /backend, which shows every branch.
 */
export default function HomePage() {
  return <BranchPicker />;
}
