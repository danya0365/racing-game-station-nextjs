/**
 * Pricing tests — the branch rate table and the step-pricing formula.
 *
 * ทำไมต้องมี: ราคาเคยอยู่สองที่ที่ไม่ตรงกัน (หน้าเว็บกับที่คิดเงินจริงใน DB)
 * และไม่มีที่ไหนเทียบสองค่านั้น ไฟล์นี้คือที่ที่จับค่าได้ ถ้าวันหลังมีคนแก้ราคา
 * ที่นี่แต่ลืมแก้ที่ migration ก็จะเห็นตอนรัน
 *
 * Run:  npm test
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
  BRANCH_RATES,
  calculateSessionPrice,
  DURATION_OPTIONS,
  formatPrice,
  getDurationOptions,
  getPrice,
  QUICK_DURATIONS,
} from "@/src/config/booking.config";
import type { BranchSlug } from "@/src/config/booking.config";
import { BRANCH_SLUGS } from "@/src/config/branch.config";

const NARATHIWAS: BranchSlug = "narathiwas";
const PATTANI: BranchSlug = "pattani";

/**
 * The owner's stated Pattani rates (2026-10-12). Written out literally rather
 * than read from the config, so that editing the config to the wrong number
 * fails this test instead of silently redefining what "correct" means.
 */
const PATTANI_RATES_AS_OWNER_STATED = { 30: 79, 60: 119, 120: 200, 180: 280 };

// ---------------------------------------------------------------
// The rate table
// ---------------------------------------------------------------

test("Pattani rates are exactly what the owner stated", () => {
  assert.deepEqual(BRANCH_RATES[PATTANI], PATTANI_RATES_AS_OWNER_STATED);
});

test("Narathiwat rates are unchanged from before branches existed", () => {
  assert.deepEqual(BRANCH_RATES[NARATHIWAS], { 30: 60, 60: 100, 120: 200, 180: 280 });
});

test("every branch in branch.config.ts has a rate table", () => {
  // The failure this catches: a branch added to branch.config.ts and forgotten
  // in the price config — which renders ฿0 and charges nothing.
  const configured = Object.keys(BRANCH_RATES).sort();
  const known = [...BRANCH_SLUGS].sort();
  assert.deepEqual(configured, known);
});

test("every branch declares a price for every tier", () => {
  for (const slug of BRANCH_SLUGS) {
    for (const minutes of QUICK_DURATIONS) {
      assert.equal(
        typeof BRANCH_RATES[slug][minutes],
        "number",
        `branch "${slug}" is missing the ${minutes}-minute tier`,
      );
    }
  }
});

test("rates are positive and never cheaper than the tier below", () => {
  for (const slug of BRANCH_SLUGS) {
    const prices = QUICK_DURATIONS.map((m) => BRANCH_RATES[slug][m]);
    assert.ok(prices.every((p) => p > 0), `branch "${slug}" has a non-positive rate`);
    for (let i = 1; i < prices.length; i++) {
      assert.ok(
        prices[i] >= prices[i - 1],
        `branch "${slug}": the ${QUICK_DURATIONS[i]}-minute tier is cheaper than the shorter one`,
      );
    }
  }
});

test("tiers are the same lengths for every branch", () => {
  const times = getDurationOptions(PATTANI).map((o) => o.time);
  assert.deepEqual(getDurationOptions(NARATHIWAS).map((o) => o.time), times);
  assert.deepEqual(times, QUICK_DURATIONS);
});

test("labels are shared across branches, only money differs", () => {
  const shape = (slug: BranchSlug) =>
    getDurationOptions(slug).map(({ time, label, labelEn, icon, popular }) => ({
      time,
      label,
      labelEn,
      icon,
      popular: !!popular,
    }));
  assert.deepEqual(shape(PATTANI), shape(NARATHIWAS));
});

// ---------------------------------------------------------------
// Step pricing
// ---------------------------------------------------------------

test("both branches price the same duration differently", () => {
  // The whole point of the change — if this ever fails the branches are
  // indistinguishable and the split exists for nothing.
  assert.equal(calculateSessionPrice(30, PATTANI), 79);
  assert.equal(calculateSessionPrice(30, NARATHIWAS), 60);
  assert.equal(calculateSessionPrice(60, PATTANI), 119);
  assert.equal(calculateSessionPrice(60, NARATHIWAS), 100);
});

test("identical prices where both branches agree", () => {
  for (const minutes of [120, 180]) {
    assert.equal(calculateSessionPrice(minutes, PATTANI), calculateSessionPrice(minutes, NARATHIWAS));
  }
});

test("a session under the first tier is charged the first tier", () => {
  assert.equal(calculateSessionPrice(5, PATTANI), 79);
  assert.equal(calculateSessionPrice(29, NARATHIWAS), 60);
  assert.equal(calculateSessionPrice(30, NARATHIWAS), 60);
});

test("a session between tiers rounds up to the tier that covers it", () => {
  assert.equal(calculateSessionPrice(45, PATTANI), 119);
  assert.equal(calculateSessionPrice(61, PATTANI), 200);
  assert.equal(calculateSessionPrice(91, PATTANI), 200);
  assert.equal(calculateSessionPrice(121, PATTANI), 280);
});

test("an exact tier price is not rounded up to the next one", () => {
  for (const slug of BRANCH_SLUGS) {
    for (const minutes of QUICK_DURATIONS) {
      assert.equal(
        calculateSessionPrice(minutes, slug),
        BRANCH_RATES[slug][minutes],
        `${slug} @ ${minutes}min`,
      );
    }
  }
});

test("past the longest tier it charges the best per-minute rate for the excess", () => {
  // Both branches: 180min = 280, best rate = 280/180 = 1.5556 → 1.56
  // 200 min → 280 + ceil(20 × 1.5556) = 280 + 32 = 312
  for (const slug of BRANCH_SLUGS) {
    assert.equal(calculateSessionPrice(200, slug), 312, `${slug} @ 200min`);
    assert.equal(calculateSessionPrice(240, slug), 374, `${slug} @ 240min`);
  }
});

test("zero and negative durations are free, not negative", () => {
  for (const slug of BRANCH_SLUGS) {
    assert.equal(calculateSessionPrice(0, slug), 0);
    assert.equal(calculateSessionPrice(-30, slug), 0);
  }
});

// ---------------------------------------------------------------
// Read helpers agree with the formula
// ---------------------------------------------------------------

test("getPrice and calculateSessionPrice never disagree", () => {
  for (const slug of BRANCH_SLUGS) {
    for (const minutes of QUICK_DURATIONS) {
      assert.equal(getPrice(minutes, slug), calculateSessionPrice(minutes, slug));
    }
  }
});

test("display strings carry the branch's own price", () => {
  assert.equal(formatPrice(30, PATTANI), "฿79");
  assert.equal(formatPrice(30, NARATHIWAS), "฿60");
  assert.equal(
    getDurationOptions(PATTANI)[0].priceDisplay,
    "฿79",
    "the booking form renders priceDisplay, not the number",
  );
});

test("an unknown duration renders no price rather than ฿undefined", () => {
  for (const slug of BRANCH_SLUGS) {
    assert.doesNotMatch(formatPrice(7, slug), /undefined|NaN/);
    assert.equal(getPrice(7, slug), 0);
  }
});

test("pricePerMinute is derived from the price, not stored next to it", () => {
  for (const slug of BRANCH_SLUGS) {
    for (const option of getDurationOptions(slug)) {
      const expected = Number((option.price / option.time).toFixed(2));
      assert.equal(option.pricePerMinute, expected, `${slug} @ ${option.time}min`);
    }
  }
});

test("the module-level DURATION_OPTIONS is Narathiwat, and says so", () => {
  // Kept for staff-side readers that have no branch in scope. If a new branch
  // ever became the default this test is the thing that notices.
  assert.deepEqual(
    DURATION_OPTIONS.map((o) => o.price),
    QUICK_DURATIONS.map((m) => BRANCH_RATES[NARATHIWAS][m]),
  );
});