"use client";

import { Machine } from "@/src/application/repositories/IMachineRepository";
import { useActiveBranch } from "@/src/presentation/components/branch/BranchScope";
import { DURATION_OPTIONS } from "@/src/config/booking.config";
import { BRANCHES } from "@/src/config/branch.config";
import { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { useHomePresenter } from "@/src/presentation/presenters/home/useHomePresenter";
import Image from "next/image";
import Link from "next/link";

/**
 * HomeView — หน้าแรกลูกค้า
 *
 * โครงแบบ "pit wall": เลขสถานะสามค่าเท่ากันเป็นอันดับแรก (คิวรอ / เครื่องว่าง /
 * เข้าเล่นวันนี้) เพราะคำถามแรกของคนที่มาร้านคือ "ต้องรอนานไหม" แล้วค่อยเป็น
 * ปุ่มหลักสองปุ่มที่ครอบคลุมการใช้งานเกือบทั้งหมด
 *
 * สีมาจากธีม racing (public/styles/racing-theme.css) ซึ่งสลับ accent
 * ตาม data-racing — ค่าใน component นี้ไม่ผูกสีแบรนด์ไว้เลย
 */
export function HomeView({
  initialViewModel,
}: {
  initialViewModel?: HomeViewModel;
}) {
  // Links carry the branch prefix so a customer stays on the branch they picked
  const branch = useActiveBranch();
  const branchSlug = branch.slug;
  const branchHref = (path: string) => `/${branchSlug}${path}`;

  const [{ viewModel, loading: isLoading }] = useHomePresenter(
    initialViewModel,
    undefined,
    branch.id,
  );

  const machines = viewModel?.machines || [];
  const stats = {
    totalMachines: machines.length,
    availableMachines: machines.filter((m) => m.status === "available").length,
    todayBookings: viewModel?.todayBookings || 0,
    walkInQueueCount: viewModel?.walkInQueueCount || 0,
    generalCustomers: viewModel?.generalCustomers || 0,
    totalPlayers: viewModel?.totalPlayers || 0,
    waitingInQueue: viewModel?.queueStats.waitingCount || 0,
    averageWaitTime: viewModel?.queueStats.averageWaitMinutes || 0,
  };

  const loading = isLoading && !viewModel;

  return (
    <div className="bg-racing-bg text-racing-fg overflow-auto scrollbar-thin">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8">
        {/* ---------- Pit board: สามค่าที่ตอบคำถามแรก ---------- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-racing-line border border-racing-line rounded-xl overflow-hidden">
          <StatCell
            label="คิวรอตอนนี้"
            value={loading ? null : stats.waitingInQueue}
            unit="คน"
            sub={
              stats.waitingInQueue > 0 && stats.averageWaitTime > 0
                ? `รอประมาณ ${stats.averageWaitTime} นาที`
                : "ยังไม่มีคิวรอ"
            }
            emphasis
          />
          <StatCell
            label="เครื่องว่าง"
            value={loading ? null : stats.availableMachines}
            total={stats.totalMachines}
            tone="go"
            sub={
              stats.totalMachines - stats.availableMachines > 0
                ? `กำลังเล่น/ปิด ${stats.totalMachines - stats.availableMachines} เครื่อง`
                : "เครื่องว่างทั้งหมด"
            }
          />
          <StatCell
            label="เข้าเล่นวันนี้"
            value={loading ? null : stats.totalPlayers}
            unit="คน"
            sub={`จองล่วงหน้า ${stats.todayBookings} รายการ`}
          />
        </section>

        {/* ---------- ปุ่มหลักสองปุ่ม ---------- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ActionButton
            href={branchHref("/walk-in")}
            icon="🏁"
            title="เข้าคิวเล่นเลย"
            description="ไม่ต้องจอง เข้าคิวหน้าร้านได้เลย"
            primary
          />
          <ActionButton
            href={branchHref("/time-booking")}
            icon="📅"
            title="จองล่วงหน้า"
            description="ล็อกเวลาที่ต้องการ ราคาเหมือนกัน"
          />
        </section>

        {/* ---------- สถานะเครื่อง ---------- */}
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <h2 className="font-bold text-[15px] tracking-tight">
              เครื่องที่ใช้ได้ตอนนี้
            </h2>
            <div className="flex gap-3">
              <LegendDot color="var(--racing-led-go)" label="ว่าง" />
              <LegendDot color="var(--racing-flag)" label="กำลังเล่น" />
              <LegendDot color="var(--racing-led-off)" label="ปิด" />
            </div>
          </div>

          {loading ? (
            <div className="racing-card p-10 text-center text-racing-fg-3 text-sm">
              กำลังโหลดสถานะเครื่อง…
            </div>
          ) : machines.length === 0 ? (
            <div className="racing-card p-10 text-center">
              <p className="text-racing-fg-2 text-sm">
                ยังไม่มีเครื่องที่เปิดให้เล่นในสาขานี้
              </p>
              <p className="text-racing-fg-3 text-xs mt-1">
                ลองสลับไปดูอีกสาขา หรือโทรสอบถามทางร้าน
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {machines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          )}
        </section>

        {/* ---------- ราคา ---------- */}
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <h2 className="font-bold text-[15px] tracking-tight">ราคา</h2>
            <Link
              href={branchHref("/time-booking")}
              className="text-[13px] text-racing-fg-2 hover:text-racing-fg transition-colors"
            >
              ดูตารางเวลาว่าง →
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {DURATION_OPTIONS.map((d) => (
              <RateCard key={d.time} rate={d} />
            ))}
          </div>
        </section>

        {/* ---------- สาขา ---------- */}
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <h2 className="font-bold text-[15px] tracking-tight">สาขา</h2>
            <span className="text-[13px] text-racing-fg-3">
              สลับได้จากปุ่มชื่อสาขาที่มุมขวาบน
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {BRANCHES.map((b) => (
              <BranchCard
                key={b.id}
                slug={b.slug}
                name={b.shortName}
                logo={b.logo}
                active={b.slug === branchSlug}
              />
            ))}
          </div>
        </section>

        <div className="racing-checker h-2 rounded-sm opacity-50" />
      </div>
    </div>
  );
}

// ============================================
// Sub-components
// ============================================

interface StatCellProps {
  label: string;
  value: number | null;
  unit?: string;
  total?: number;
  sub?: string;
  /** ใหญ่กว่าอีกสองช่อง — คือคำตอบของคำถามแรก */
  emphasis?: boolean;
  /** สี LED ตามสถานะ ไม่ใช่สีแบรนด์ */
  tone?: "go";
}

function StatCell({
  label,
  value,
  unit,
  total,
  sub,
  emphasis,
  tone,
}: StatCellProps) {
  return (
    <div className="bg-racing-panel px-4 py-3.5">
      <div className="racing-label">{label}</div>
      <div
        className={`racing-figure mt-1.5 ${
          emphasis ? "text-[38px]" : "text-[32px]"
        } ${tone === "go" ? "text-racing-led-go" : ""}`}
      >
        {value === null ? (
          "–"
        ) : (
          <>
            {value}
            {unit ? (
              <span className="text-[15px] font-medium text-racing-fg-3 ml-1">
                {unit}
              </span>
            ) : null}
            {total !== undefined ? (
              <span className="text-[15px] font-medium text-racing-fg-3 ml-0.5">
                / {total}
              </span>
            ) : null}
          </>
        )}
      </div>
      {sub ? (
        <div
          className={`text-xs mt-1.5 ${
            emphasis ? "text-racing-fg font-medium" : "text-racing-fg-2"
          }`}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

interface ActionButtonProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  primary?: boolean;
}

function ActionButton({
  href,
  icon,
  title,
  description,
  primary,
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-4 rounded-xl border transition-all duration-200 ${
        primary
          ? "bg-linear-to-b from-racing-flag-soft to-racing-flag border-transparent shadow-[0_10px_26px_-12px_var(--racing-flag)] hover:brightness-110"
          : "bg-racing-panel border-racing-line hover:border-racing-fg-3"
      }`}
    >
      <span
        className={`w-10 h-10 shrink-0 grid place-items-center rounded-[10px] text-[17px] border ${
          primary
            ? "bg-racing-on-flag/10 border-racing-on-flag/25"
            : "bg-racing-panel-2 border-racing-line"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0">
        {/* on-flag, not white: Pattani's gold puts white text at 3.84:1, under
            the 4.5:1 AA threshold. The token carries whichever colour passes for
            that branch and mode. */}
        <span
          className={`block font-bold text-[17px] tracking-tight ${
            primary ? "text-racing-on-flag" : "text-racing-fg"
          }`}
        >
          {title}
        </span>
        <span
          className={`block text-xs mt-0.5 ${
            primary ? "text-racing-on-flag/80" : "text-racing-fg-2"
          }`}
        >
          {description}
        </span>
      </span>
      <span
        className={`ml-auto text-[16px] shrink-0 ${
          primary ? "text-racing-on-flag/85" : "text-racing-fg-3"
        }`}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11.5px] text-racing-fg-2">
      <span
        className="w-[7px] h-[7px] rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </span>
  );
}

const STATUS_META = {
  available: { label: "ว่าง", tone: "go" },
  occupied: { label: "กำลังเล่น", tone: "busy" },
  maintenance: { label: "ปิด", tone: "off" },
} as const;

function MachineCard({ machine }: { machine: Machine }) {
  const meta = STATUS_META[machine.status] ?? STATUS_META.maintenance;

  return (
    <div
      className={`relative pl-4 pr-3.5 py-3 rounded-xl bg-racing-panel border border-racing-line overflow-hidden ${
        meta.tone === "off" ? "opacity-60" : ""
      }`}
    >
      {/* แถบสถานะด้านซ้าย — อ่านได้โดยไม่ต้องอ่านตัวอักษร */}
      <span
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{
          backgroundColor:
            meta.tone === "go"
              ? "var(--racing-led-go)"
              : meta.tone === "busy"
                ? "var(--racing-flag)"
                : "var(--racing-led-off)",
        }}
        aria-hidden
      />
      <div className="flex items-center justify-between gap-2">
        <span className="racing-label !text-[9.5px]">
          RIG {String(machine.position).padStart(2, "0")}
        </span>
        <span
          className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-racing-panel-2 ${
            meta.tone === "go"
              ? "text-racing-led-go"
              : meta.tone === "busy"
                ? "text-racing-flag"
                : "text-racing-fg-2"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              meta.tone === "go"
                ? "bg-racing-led-go animate-pulse"
                : meta.tone === "busy"
                  ? "bg-racing-flag"
                  : "bg-racing-led-off"
            }`}
            aria-hidden
          />
          {meta.label}
        </span>
      </div>
      <h3 className="font-bold text-[14.5px] tracking-tight mt-2 truncate">
        {machine.name}
      </h3>
      {machine.description ? (
        <p className="text-xs text-racing-fg-2 leading-relaxed mt-0.5 line-clamp-2">
          {machine.description}
        </p>
      ) : null}
    </div>
  );
}

function RateCard({ rate }: { rate: (typeof DURATION_OPTIONS)[number] }) {
  return (
    <div
      className={`px-3.5 py-3 rounded-xl border ${
        rate.popular
          ? "border-racing-flag bg-linear-to-b from-[var(--racing-flag-dim)] to-racing-panel"
          : "bg-racing-panel border-racing-line"
      }`}
    >
      <div
        className={`racing-label !text-[9.5px] ${
          rate.popular ? "!text-racing-flag" : ""
        }`}
      >
        {rate.labelEn}
        {rate.popular ? " · คุ้มสุด" : ""}
      </div>
      <div className="racing-figure !text-[22px] mt-1.5">
        <span className="sr-only">{rate.label}</span>
        {rate.priceDisplay}
      </div>
      <div className="text-[11.5px] text-racing-fg-2 mt-1">
        {rate.label} · {rate.pricePerMinute.toFixed(2)} บาท/นาที
      </div>
    </div>
  );
}

function BranchCard({
  slug,
  name,
  logo,
  active,
}: {
  slug: string;
  name: string;
  logo: string;
  active: boolean;
}) {
  return (
    <Link
      href={`/${slug}`}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl border transition-colors ${
        active
          ? "border-racing-flag bg-racing-panel"
          : "bg-racing-panel border-racing-line hover:border-racing-fg-3"
      }`}
    >
      <Image
        src={logo}
        alt={`โลโก้สาขา${name}`}
        width={128}
        height={36}
        className="h-9 w-auto max-w-[128px] object-contain object-left shrink-0"
      />
      <span className="min-w-0">
        <span className="block font-bold text-[14px] tracking-tight">
          {name}
        </span>
        <span className="block text-[11.5px] text-racing-fg-2">
          {active ? "สาขาที่คุณอยู่ตอนนี้" : "ดูสถานะและจองได้ที่นี่"}
        </span>
      </span>
      {active ? (
        <span className="ml-auto shrink-0 text-[10px] font-semibold tracking-wider uppercase text-racing-flag px-2 py-0.5 rounded-full border border-racing-flag">
          ปัจจุบัน
        </span>
      ) : (
        <span
          className="ml-auto shrink-0 text-racing-fg-3 text-[16px]"
          aria-hidden
        >
          →
        </span>
      )}
    </Link>
  );
}
