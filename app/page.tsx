import { BranchPicker } from "@/src/presentation/components/branch/BranchPicker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Racing Game Station — ระบบจองคิว Racing Game Station",
  description:
    "ระบบจองคิวสำหรับ Racing Game Station — จองเวลาหรือเข้าคิวได้ที่สาขาปัตตานีและนราธิวาส",
  keywords: [
    "racing game station",
    "จองคิว",
    "racing game",
    "esports",
    "driving",
  ],
  authors: [{ name: "Racing Game Station Team" }],
  openGraph: {
    title: "Racing Game Station — ระบบจองคิว Racing Game Station",
    description: "ระบบจองคิวสำหรับ Racing Game Station",
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
