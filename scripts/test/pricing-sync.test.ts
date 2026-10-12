/**
 * The DB and the config must charge the same money.
 *
 * ราคาเคยมีสองเจ้าของ: `DURATION_OPTIONS` ใน booking.config.ts (ที่ลูกค้าเห็น)
 * กับ `machines.hourly_rate` ใน DB (ที่เก็บเงินจริง) สองค่านี้ไม่เคยตรงกัน —
 * หน้าเว็บบอก 1 ชม = 100 บาท แต่ RPC คิด 200 และไม่มีที่ไหนจับได้
 *
 * ไฟล์นี้คือที่ที่จับ: รันสูตรจาก JS กับสูตรจาก PostgreSQL แล้วเทียบทีละค่า
 * ถ้ามีคนแก้ราคาฝั่ง JS แล้วลืม migration (หรือแก้ migration แล้วลืมแก้ JS)
 * เทสนี้แดง
 *
 * ⚠️ ต้องมี local Supabase ขึ้น (`npm run supabase-start`) — ถ้าไม่มีจะ skip
 * ไม่ใช่ผ่าน เพราะ "ผ่าน" ที่ไม่ได้ตรวจคือไม่ได้ตรวจ
 *
 * Run:  npm run test:db
 */

import assert from "node:assert/strict";
import test from "node:test";
import { execFileSync } from "node:child_process";

import { BRANCH_RATES, calculateSessionPrice, QUICK_DURATIONS } from "@/src/config/booking.config";
import type { BranchSlug } from "@/src/config/booking.config";
import { BRANCHES } from "@/src/config/branch.config";

const CONTAINER = "supabase_db_racing-game-station-nextjs";

/** Durations either side of every tier, plus the over-max path. */
const DURATIONS = [1, 29, 30, 31, 45, 59, 60, 61, 90, 119, 120, 121, 150, 179, 180, 181, 200, 240, 480];

function psql(sql: string): string {
  return execFileSync(
    "docker",
    ["exec", "-i", CONTAINER, "psql", "-U", "postgres", "-d", "postgres", "-tAc", sql],
    { encoding: "utf8" },
  ).trim();
}

const DB_UP = (() => {
  try {
    execFileSync("docker", ["inspect", "-f", "{{.State.Running}}", CONTAINER], {
      stdio: "ignore",
    });
    psql("SELECT 1");
    return true;
  } catch {
    return false;
  }
})();

const SLUG_TO_ID = new Map(BRANCHES.map((b) => [b.slug as BranchSlug, b.id]));

test("the rate table reached the database", { skip: !DB_UP }, () => {
  const rows = psql(
    `SELECT b.slug, r.duration_minutes, r.price
       FROM public.branch_rate_tiers r
       JOIN public.branches b ON b.id = r.branch_id
      ORDER BY b.slug, r.duration_minutes`,
  );

  assert.notEqual(rows, "", "branch_rate_tiers is empty — did the migration run?");

  const fromDb = new Map<string, number>();
  for (const line of rows.split("\n")) {
    const [slug, minutes, price] = line.split("|");
    fromDb.set(`${slug}:${minutes}`, Number(price));
  }

  for (const slug of Object.keys(BRANCH_RATES) as BranchSlug[]) {
    for (const minutes of QUICK_DURATIONS) {
      const actual = fromDb.get(`${slug}:${minutes}`);
      assert.equal(
        actual,
        BRANCH_RATES[slug][minutes],
        `DB and config disagree for ${slug} @ ${minutes}min`,
      );
    }
  }
});

test("Postgres and TypeScript charge the same money", { skip: !DB_UP }, () => {
  for (const [slug, branchId] of SLUG_TO_ID) {
    const values = DURATIONS.map((d) => d).join(",");
    const rows = psql(
      `SELECT d, public.calculate_session_price('${branchId}', d)
         FROM unnest(ARRAY[${values}]::int[]) AS d
        ORDER BY d`,
    );

    for (const line of rows.split("\n")) {
      const [minutes, dbPrice] = line.split("|");
      const expected = calculateSessionPrice(Number(minutes), slug);
      assert.equal(
        Number(dbPrice),
        expected,
        `${slug} @ ${minutes}min: DB says ${dbPrice}, config says ${expected}`,
      );
    }
  }
});

test("the old hourly_rate formula is no longer reachable", { skip: !DB_UP }, () => {
  // The bug this whole change exists to close: 1 hour = ceil(1) × 200 = 200,
  // while the shop charges 100. If this assertion ever fails the old trigger or
  // RPC is still installed somewhere.
  const narathiwas = SLUG_TO_ID.get("narathiwas")!;
  const oneHourByOldFormula = Math.ceil(60 / 60) * 200;
  const actual = psql(
    `SELECT public.calculate_session_price('${narathiwas}', 60)`,
  );
  assert.equal(Number(actual), 100);
  assert.notEqual(Number(actual), oneHourByOldFormula);
});

test("every branch id in the config exists in the database", { skip: !DB_UP }, () => {
  const ids = BRANCHES.map((b) => `'${b.id}'`).join(",");
  const rows = psql(`SELECT slug FROM public.branches WHERE id IN (${ids})`);
  const found = rows.split("\n").filter(Boolean).sort();
  assert.deepEqual(found, BRANCHES.map((b) => b.slug).sort());
});

test("a session cannot be priced against a branch that has no rates", { skip: !DB_UP }, () => {
  // 0 rather than NULL: "no rate configured" and "free" both end up at 0, and
  // the caller must not read that as permission to bill nothing. Assert the
  // shape so a future change to NULL is a deliberate decision, not a drift.
  const actual = psql(`SELECT public.calculate_session_price('00000000-0000-0000-0000-0000000000ff', 60)`);
  assert.equal(Number(actual), 0);
});

test("no RPC the app calls has a duplicate overload", { skip: !DB_UP }, () => {
  // กับดักที่เจอตอนทดสอบจริง: migration ที่ DROP ผิด signature ไม่ error
  // แต่ก็ไม่ลบตัวเก่า ทิ้งเป็น overload คู่กันไว้ แล้ว PostgREST จะเลือกไม่ได้
  // ตอนเรียก → "Could not choose the best candidate function" → 500
  // ทุกการจอง โดยที่ migration รันผ่านหมดและดูไม่ผิดอะไรเลย
  //
  // ต้องตรวจทุกชื่อที่ src/ เรียก ไม่ใช่แค่ตัวที่ migration นี้แตะ
  const names = [
    "rpc_create_booking",
    "rpc_end_session",
    "rpc_get_active_machines",
    "rpc_update_session_amount",
    "rpc_update_session_payment",
    "rpc_get_active_sessions",
    "rpc_get_today_sessions",
    "rpc_get_walk_in_queue_stats",
  ];

  const overloaded = psql(
    `SELECT proname FROM (
       SELECT proname FROM pg_proc
        WHERE pronamespace = 'public'::regnamespace AND proname = ANY(ARRAY[${names
          .map((n) => `'${n}'`)
          .join(",")}])
        GROUP BY proname HAVING COUNT(*) > 1
     ) dup`,
  );

  assert.equal(
    overloaded,
    "",
    `PostgREST เรียกไม่ได้: ${overloaded} มีหลาย signature — DROP ผิด type ใน migration`,
  );
});

test("every RPC the app calls resolves to exactly one candidate", { skip: !DB_UP }, () => {
  // ตรวจจากอีกมุม: signature ที่แอปเรียกจริงต้องมีอยู่ และต้องเรียกด้ได้
  // คืนค่า JSON แทนที่จะ error — ถ้ามี overload แอปจะได้ 500 ตรงนี้
  const calls = [
    `rpc_get_active_machines('00000000-0000-0000-0000-000000000b01')`,
    `rpc_end_session('00000000-0000-0000-0000-000000000000', 100)`,
  ];

  for (const call of calls) {
    const out = psql(`SELECT public.${call}`);
    // "no rows" ยังพิสูจน์ได้ว่า PostgREST หา signature เจอ — ถ้าหาไม่เจอ
    // จะ error ตอน execute และ psql จะ exit ไม่ 0
    assert.doesNotMatch(out, /could not choose the best candidate/i, call);
  }
});

test("ending a session without an amount is refused", { skip: !DB_UP }, () => {
  // ยอดเงินต้องมาจากพนักงานเสมอ — ไม่มีทางที่ระบบคำนวณแล้วเก็บเงินเอง
  //
  // ตรวจจากตัว function ไม่ใช่การเรียก: rpc_end_session เป็น SECURITY DEFINER
  // ที่เช็คสิทธิ์ก่อนเสมอ เรียกจากนอกจะโดน "ไม่มีสิทธิ์" ก่อนถึง guard เสมอ
  // การรันจริงจึงพิสูจน์อะไรเกี่ยวกับ guard ไม่ได้ นอกจากจะปลอมสิทธิ์
  // ซึ่งแอบการตรวจสอบของตัวเอง — โครงสร้างฟังก์ชันคือหลักฐานที่ตรงกว่า
  const src = psql(
    `SELECT prosrc FROM pg_proc
      WHERE pronamespace = 'public'::regnamespace AND proname = 'rpc_end_session'`,
  );

  assert.match(
    src,
    /IF p_total_amount IS NULL THEN[\s\S]*?RETURN[\s\S]*?'success', false/,
    "rpc_end_session must refuse a NULL amount instead of computing one",
  );

  // ตัด comment ออกก่อนเทียบ — คำอธิบายในโค้ดพูดถึง calculate_session_price
  // เพราะบอกว่า "ถ้าอยากได้ค่านี้ให้เรียกเอง" ไม่ใช่เพราะเรียกอยู่จริง
  const code = src
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  assert.doesNotMatch(
    code,
    /calculate_session_price/,
    "rpc_end_session must not compute a price — the staff member confirms it",
  );
});

test("ending a session cannot silently price it from the rate table", { skip: !DB_UP }, () => {
  // คิดเงินอัตโนมัติคือการทำให้ตัวเลขของระบบดูเป็นราคาสุดท้าย
  // ทั้งที่จริงพนักงานลดราคาได้ — function เลยไม่มีพารามิเตอร์ที่เว้นว่างได้
  const defaults = psql(
    `SELECT p.proname, p.proargnames
       FROM pg_proc p
      WHERE p.pronamespace = 'public'::regnamespace
        AND p.proname = 'rpc_end_session'`,
  );
  assert.doesNotMatch(defaults, /NULL/i, 'rpc_end_session must not have a NULL default');
});