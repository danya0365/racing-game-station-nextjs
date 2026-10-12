"use client";

import { Machine } from "@/src/application/repositories/IMachineRepository";
import { useActiveBranch } from "@/src/presentation/components/branch/BranchScope";
import { DurationOption, getDurationOptions } from "@/src/config/booking.config";
import { BRANCHES } from "@/src/config/branch.config";
import { HomeViewModel } from "@/src/presentation/presenters/home/HomePresenter";
import { MachineImage } from "@/src/presentation/components/ui/MachineImage";
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

  // ราคาเปลี่ยนตามสาขา — อ่านจาก branch ที่ลูกค้าเลือก ไม่ใช่ค่าคงที่
  const rateCards = getDurationOptions(branchSlug);

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
      {/* Mobile ถูกบีบให้จบในจอเดียว: padding และระยะห่างลดลง แต่จำนวน
          column เท่ากับ desktop — จุดนี้คือของแลกเปลี่ยน ถ้า stack เป็น
          column เดียวสิ่งที่ต้องเห็นก่อนเล่น (รอนานไหม / ว่างไหม) จะถูก
          ดันไปนอกจอทั้งที่มันคือคำถามแรกของคนที่ยืนหน้าร้าน */}
      <div className="max-w-6xl mx-auto px-3 py-2 md:px-4 md:py-8 space-y-2 md:space-y-8">
        {/* ---------- Pit board: สามค่าที่ตอบคำถามแรก ---------- */}
        <section className="grid grid-cols-3 gap-px bg-racing-line border border-racing-line rounded-xl overflow-hidden">
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

        {/* ---------- ปุ่มหลัก ----------
            One way in, on purpose: walk-in is entered by staff at the counter,
            so offering "เข้าคิวเล่นเลย" beside "จองล่วงหน้า" told customers
            there were two ways to start a session when there is one.

            Capped rather than full-bleed: this sat in a two-column grid, and a
            single button stretched across max-w-6xl reads as a broken layout
            rather than a deliberate choice. */}
        <section>
          <div className="max-w-md">
            <ActionButton
              href={branchHref("/time-booking")}
              icon="📅"
              title="จองล่วงหน้า"
              description="ล็อกเวลาที่ต้องการ ราคาเหมือนกัน"
              primary
            />
          </div>
        </section>

        {/* ---------- สถานะเครื่อง ----------
            สามคอลัมน์ตั้งแต่มือถือ ไม่ใช่สอง — จำนวนเครื่องที่เห็นในจอเดียวคือ
            ข้อมูลที่คนยืนหน้าร้านใช้ตัดสินใจจะรอหรือกลับมาทีหลัง การ์ดจึง
            บีบขนาดแทนที่จะเพิ่มความสูง */}
        <section>
          <div className="flex items-center justify-between gap-2 flex-nowrap mb-1 md:gap-3 md:mb-3 md:flex-wrap">
            <h2 className="font-bold text-[13px] md:text-[15px] tracking-tight">
              เครื่องที่ใช้ได้ตอนนี้
            </h2>
            <div className="flex gap-2 shrink-0 md:gap-3">
              <LegendDot color="var(--racing-led-go)" label="ว่าง" />
              <LegendDot color="var(--racing-flag)" label="กำลังเล่น" />
              <LegendDot color="var(--racing-led-off)" label="ปิด" />
            </div>
          </div>

          {loading ? (
            <div className="racing-card p-6 md:p-10 text-center text-racing-fg-3 text-sm">
              กำลังโหลดสถานะเครื่อง…
            </div>
          ) : machines.length === 0 ? (
            <div className="racing-card p-6 md:p-10 text-center">
              <p className="text-racing-fg-2 text-sm">
                ยังไม่มีเครื่องที่เปิดให้เล่นในสาขานี้
              </p>
              <p className="text-racing-fg-3 text-xs mt-1">
                ลองสลับไปดูอีกสาขา หรือโทรสอบถามทางร้าน
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5 md:gap-2.5">
              {machines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          )}
        </section>

        {/* ---------- ราคา ---------- */}
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1 md:mb-3">
            <h2 className="font-bold text-[13px] md:text-[15px] tracking-tight">
              ราคา
            </h2>
            <Link
              href={branchHref("/time-booking")}
              className="text-[12px] md:text-[13px] text-racing-fg-2 hover:text-racing-fg transition-colors"
            >
              ดูตารางเวลาว่าง →
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-1.5 md:gap-2.5">
            {rateCards.map((d) => (
              <RateCard key={d.time} rate={d} />
            ))}
          </div>
        </section>

        {/* ---------- สาขา ---------- */}
        <section>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1 md:mb-3">
            <h2 className="font-bold text-[13px] md:text-[15px] tracking-tight">
              สาขา
            </h2>
            {/* บนมือถือปุ่มสลับสาขาอยู่ใน header แล้ว ข้อความนี้กินความสูง
                โดยไม่บอกอะไรใหม่ */}
            <span className="hidden md:inline text-[13px] text-racing-fg-3">
              สลับได้จากปุ่มชื่อสาขาที่มุมขวาบน
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 md:gap-2.5">
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

        {/* แถบลายธง — ตัดบนมือถือ เป็นของตกแต่งที่ดันเนื้อหาจริงลงจอถัดไป */}
        <div className="hidden md:block bg-racing-checker h-2 rounded-sm opacity-50" />
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
    /* px-4 py-3.5 เต็มเลยไม่พอดีมือถือ — สามช่องเหลือราว 110px ต่อช่อง ต้องลด
       padding ลงมาก ไม่งั้นตัวเลขจะตัดทางขวา */
    <div className="bg-racing-panel px-2 py-2 md:px-4 md:py-3.5">
      <div className="racing-label !text-[9px] md:!text-[10px] truncate">
        {label}
      </div>
      <div
        className={`racing-figure mt-1 !text-[26px] md:mt-1.5 md:!text-[34px] ${
          emphasis ? "md:text-[38px]" : "md:text-[32px]"
        } ${tone === "go" ? "text-racing-led-go" : ""}`}
      >
        {value === null ? (
          "–"
        ) : (
          <>
            {value}
            {unit ? (
              <span className="!text-[11px] md:!text-[15px] font-medium text-racing-fg-3 ml-0.5 md:ml-1">
                {unit}
              </span>
            ) : null}
            {total !== undefined ? (
              <span className="!text-[11px] md:!text-[15px] font-medium text-racing-fg-3 ml-0.5">
                / {total}
              </span>
            ) : null}
          </>
        )}
      </div>
      {sub ? (
        <div
          className={`text-[10px] md:text-xs mt-0.5 md:mt-1.5 leading-tight line-clamp-2 ${
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
      className={`group flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-4 rounded-xl border transition-all duration-200 ${
        primary
          ? "bg-linear-to-b from-racing-flag-soft to-racing-flag border-transparent shadow-[0_10px_26px_-12px_var(--racing-flag)] hover:brightness-110"
          : "bg-racing-panel border-racing-line hover:border-racing-fg-3"
      }`}
    >
      <span
        className={`w-9 h-9 md:w-10 md:h-10 shrink-0 grid place-items-center rounded-[10px] text-[16px] md:text-[17px] border ${
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
          className={`block font-bold text-[16px] md:text-[17px] tracking-tight ${
            primary ? "text-racing-on-flag" : "text-racing-fg"
          }`}
        >
          {title}
        </span>
        <span
          className={`block text-[11px] md:text-xs mt-0.5 ${
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
    <span className="flex items-center gap-1.5 text-[10.5px] md:text-[11.5px] text-racing-fg-2">
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
    /* การ์ดสามคอลัมน์บนมือถือกว้างราว 110px — โครงเดิม (padding 16px ซ้าย +
       รูป 40px) กินไปครึ่งการ์ด ชื่อเครื่องจึงถูกตัดเหลือสองตัวอักษร */
    <div
      className={`relative pl-2 pr-1.5 py-2 md:pl-4 md:pr-3.5 md:py-3 rounded-xl bg-racing-panel border border-racing-line overflow-hidden ${
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
      <div className="flex items-center justify-between gap-1">
        <span className="racing-label !text-[9px]">
          RIG {String(machine.position).padStart(2, "0")}
        </span>
        <span
          className={`flex items-center gap-1 text-[9.5px] md:text-[11px] font-semibold px-1 md:px-2 py-0.5 rounded-full bg-racing-panel-2 ${
            meta.tone === "go"
              ? "text-racing-led-go"
              : meta.tone === "busy"
                ? "text-racing-flag-text"
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
      {/* รูปถูกตัดออกใต้ sm: คอลัมน์แคบกว่า 34px พอดี รูปจะกินพื้นที่ทั้ง
          แถวและดันชื่อเครื่องให้เหลือสามตัวอักษร — RIG 01 กับจุดสีบอก
          เครื่องนั้นว่าง/กำลังเล่นอยู่แล้ว */}
      <MachineImage
        imageUrl={machine.imageUrl}
        name={machine.name}
        className="hidden sm:block w-7 h-7 md:w-10 md:h-10 rounded-lg"
        fallbackClassName="bg-racing-panel-2 text-base md:text-xl"
      />
      <h3 className="font-bold text-[11.5px] sm:text-[13px] md:text-[14.5px] tracking-tight truncate mt-0.5 md:mt-2">
        {machine.name}
      </h3>
      {/* คำอธิบายยาว ~60 ตัวอักษร พอดีกับการ์ดสามคอลัมน์บนมือถือคือห้าบรรทัด
          ที่ตัดกลางคัน — ซ่อนไว้ใต้ lg ดีกว่า ให้ผู้ใช้เห็นสถานะเครื่องครบ
          ทุกตัวก่อน */}
      {machine.description ? (
        <p className="hidden lg:block text-xs text-racing-fg-2 leading-relaxed mt-0.5 line-clamp-2">
          {machine.description}
        </p>
      ) : null}
    </div>
  );
}

function RateCard({ rate }: { rate: DurationOption }) {
  return (
    <div
      className={`px-2 py-2 md:px-3.5 md:py-3 rounded-xl border ${
        rate.popular
          ? "border-racing-flag bg-linear-to-b from-[var(--racing-flag-dim)] to-racing-panel"
          : "bg-racing-panel border-racing-line"
      }`}
    >
      {/* "GRAND PRIX" ต้อง 73px แต่การ์ดสี่คอลัมน์บนมือถือเหลือ 62px —
          racing-label มี letter-spacing 0.16em กินไปเกือบ 13px จึงต้อง
          บังคับ tracking แคบลงเฉพาะบรรทัดนี้ คืนค่าเดิมตั้งแต่ md ขึ้นไป

          ไม่มีป้าย "คุ้มสุด" ที่นี่ — การ์ดบรรทัดเดียวกันนี้เคยโชว์สองคำนี้
          ตอนนั้นมันแยกบรรทัดกัน แล้วการ์ดจะดูรกลงไปเปล่าๆ ทางเลือกคือ
          อาศัยเส้นขอบสีของ popular เป็นสัญญาณให้เห็นแทน ไม่ต้องเขียนคำ */}
      <div
        className={`racing-label !text-[8.5px] !tracking-[0.06em] md:!text-[9px] md:!tracking-[0.16em] truncate ${
          rate.popular ? "!text-racing-flag-text" : ""
        }`}
      >
        {rate.labelEn}
      </div>
      <div className="racing-figure !text-[18px] md:!text-[22px] mt-0.5 md:mt-1.5">
        <span className="sr-only">{rate.label}</span>
        {rate.priceDisplay}
      </div>
      {/* ราคาต่อนาทีซ้ำกับที่คิดได้จากราคารวม หน้าจองมีอยู่แล้ว — ซ่อนไว้
          ใต้ lg ดีกว่า แล้วป้าย WARM UP / PRO RACE ต้องตัดทิ้งด้วย เพราะ
          การ์ดสี่คอลัมน์บนมือถือกว้างราว 85px และ "GRAND PRIX" ตัด
          กลางคันเหลือ "GRA…" ซึ่งอ่านไม่ออก */}
      <div className="hidden lg:block text-[11.5px] text-racing-fg-2 mt-0.5 md:mt-1">
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
      className={`flex items-center gap-2 md:gap-3.5 px-2.5 md:px-3.5 py-2.5 md:py-3 rounded-xl border transition-colors ${
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
        /* max-w ไม่ลดความกว้างจริงถ้ายังเหลือช่องว่างในบรรทัด — ต้องบังคับ
           ด้วย w-8 ด้วย ไม่งั้นโลโก้จะกินและดันชื่อสาขาให้เหลือสองตัวอักษร */
        className="h-6 md:h-9 w-8 md:w-auto max-w-8 md:max-w-32 object-contain object-left shrink-0"
      />
      <span className="min-w-0">
        <span className="block font-bold text-[13px] md:text-[14px] tracking-tight">
          {name}
        </span>
        {/* คำอธิบายยาวเกินพื้นที่การ์ดสองคอลัมน์บนมือถือ — เก็บไว้ฝั่ง desktop */}
        <span className="hidden md:block text-[11.5px] text-racing-fg-2">
          {active ? "สาขาที่คุณอยู่ตอนนี้" : "ดูสถานะและจองได้ที่นี่"}
        </span>
      </span>
      {active ? (
        <span className="ml-auto shrink-0 text-[9.5px] md:text-[10px] font-semibold tracking-wider uppercase text-racing-flag-text px-1.5 md:px-2 py-0.5 rounded-full border border-racing-flag">
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
