/**
 * Booking Configuration
 *
 * Single source of truth for booking-related settings.
 * Update this file to change pricing, durations, and other booking options.
 *
 * ⚠️ Changes here will affect all booking components:
 * - HomeView (การ์ดราคา)
 * - TimeBookingView (ปุ่มเลือกระยะเวลา)
 * - useControlPresenter (คิดเงินตอนจบเซสชัน)
 *
 * ⚠️ PRICING IS PER BRANCH — every function that reads a rate takes a branch
 * slug, and there is no default. That is deliberate.
 *
 * ราคาเดิมมีอยู่สองที่ที่ไม่เคยตรงกัน: `DURATION_OPTIONS` ตรงนี้ (ที่ลูกค้าเห็น)
 * กับ `machines.hourly_rate` + `rpc_end_session` (ที่คิดเงินจริงตอนจบเซสชัน)
 * ซึ่งใช้สูตร `ceil(ชั่วโมง) × hourly_rate` — ลูกค้าเห็น 1 ชม = 100 บาท แต่ถูก
 * คิด 200 เมื่อ hourly_rate = 200 ทำให้ "ส่งต่อ rate เดียวไม่ต้องส่งสาขา" เป็น
 * กับดักที่เงียบสิบ ๆ ตอนนี้ rate อยู่ในตารางต่อสาขา และ migration
 * `branch_rate_tiers` เก็บชุดเดียวกันฝั่ง DB — `npm run check:pricing-sync`
 * เทียบสองฝั่งให้ ถ้าค่าหลุดจากกันต้องเห็นก่อนขายของจริง
 *
 * ฝั่ง DB เป็นเจ้าของตัวเลขเงินจริง (RPC คิดเงินเอง) ไฟล์นี้เป็นเจ้าของตัวเลขที่
 * *แสดงผล* และเป็นที่ที่ `useControlPresenter` ใช้คิดยอดก่อนส่งไปบันทึก
 */

/**
 * Duration option for booking
 */
export interface DurationOption {
  /** Duration in minutes */
  time: number;
  /** Display label (Thai) */
  label: string;
  /** Display label (English) - for codes like WARM UP, PRO RACE */
  labelEn: string;
  /** Price in THB */
  price: number;
  /** Display price string */
  priceDisplay: string;
  /** Icon emoji */
  icon: string;
  /** If true, shows "แนะนำ" badge */
  popular?: boolean;
  /** Price per minute (for value comparison) */
  pricePerMinute: number;
}

/**
 * Rate tiers per branch.
 *
 * The shape (time / label / labelEn / icon / popular) is identical for every
 * branch — only the money differs. Splitting them would mean a new branch has
 * to re-decide what a "WARM UP" card looks like, and one of the two would
 * quietly drift. So the labels live once here, and each branch declares prices.
 *
 * `pricePerMinute` is DERIVED, not stored (see buildDurationOptions): the home
 * page prints it as `toFixed(2)`, and a hand-maintained copy is exactly the kind
 * of number that goes stale the moment a price changes.
 */
export type BranchSlug = "narathiwas" | "pattani";

/** Prices in THB for one branch, keyed by duration in minutes. */
export type BranchRateTable = Record<number, number>;

/** Everything about a tier except its price — shared by all branches. */
type DurationTier = Omit<DurationOption, "price" | "pricePerMinute" | "priceDisplay">;

const DURATION_TIERS: readonly DurationTier[] = [
  { time: 30, label: "30 นาที", labelEn: "WARM UP", icon: "⏱️" },
  { time: 60, label: "1 ชั่วโมง", labelEn: "PRO RACE", icon: "🏁", popular: true },
  { time: 120, label: "2 ชั่วโมง", labelEn: "PRO RACE", icon: "🏁" },
  { time: 180, label: "3 ชั่วโมง", labelEn: "GRAND PRIX", icon: "🏆", popular: true },
];

/**
 * Narathiwat — the original shop. The rates it has always charged.
 */
const NARATHIWAS_RATES: BranchRateTable = {
  30: 60,
  60: 100,
  120: 200,
  180: 280,
};

/**
 * Pattani — set by the owner on 2026-10-12.
 *   30 นาที 79 · 1 ชม 119 · 2 ชม 200 · 3 ชม 280
 *
 * Pattani charges more for the two short tiers and the same for 2 and 3 hours,
 * so its best-value tier is GRAND PRIX by the widest margin — the same tier
 * Narathiwat leans on.
 */
const PATTANI_RATES: BranchRateTable = {
  30: 79,
  60: 119,
  120: 200,
  180: 280,
};

/**
 * Prices per branch, keyed by branch slug.
 *
 * The keys must cover `BRANCH_SLUGS` in branch.config.ts. TypeScript enforces
 * that on the type side (BranchSlug), and `npm run check:pricing-sync` enforces
 * the other direction — a branch added to one file and forgotten in the other,
 * which no type system can see.
 */
export const BRANCH_RATES: Record<BranchSlug, BranchRateTable> = {
  narathiwas: NARATHIWAS_RATES,
  pattani: PATTANI_RATES,
};

/**
 * Join the shared tier labels with one branch's prices.
 *
 * `pricePerMinute` is rounded to 2dp here rather than stored, because the home
 * page prints it as `toFixed(2)` and a stored float drifts from what is shown.
 */
function buildDurationOptions(slug: BranchSlug): DurationOption[] {
  const rates = BRANCH_RATES[slug];
  return DURATION_TIERS.map((tier) => {
    const price = rates[tier.time];
    if (price === undefined) {
      // A missing tier would render as ฿0 and charge the customer nothing —
      // fail at module load instead, where the stack names this file.
      throw new Error(
        `Branch "${slug}" has no price for the ${tier.time}-minute tier (src/config/booking.config.ts)`,
      );
    }
    return {
      ...tier,
      price,
      priceDisplay: `฿${price}`,
      pricePerMinute: Number((price / tier.time).toFixed(2)),
    };
  });
}

/**
 * Duration options for one branch — what the home page and the booking form
 * render.
 *
 * Narathiwat is the default argument because a customer screen that has a
 * branch in scope should pass its own; only the handful of staff-side readers
 * with no branch (and the tests) rely on this, and those are documented below.
 * A pricing read that forgets its branch is the exact bug this module exists to
 * make visible — hence every customer-facing call site passes one explicitly.
 */
export function getDurationOptions(slug: BranchSlug = "narathiwas"): DurationOption[] {
  return buildDurationOptions(slug);
}

/**
 * Narathiwat's tiers, for the few places that genuinely have no branch in
 * scope (staff-side docs, tests).
 *
 * Prefer `getDurationOptions(slug)`. Reaching for this in customer-facing code
 * means the price will not follow the branch the customer picked.
 */
export const DURATION_OPTIONS: DurationOption[] = buildDurationOptions("narathiwas");

/**
 * Default duration (in minutes) when user hasn't selected one
 */
export const DEFAULT_DURATION = 30;

/**
 * Get duration option by time (minutes)
 */
export function getDurationOption(
  time: number,
  slug: BranchSlug = "narathiwas",
): DurationOption | undefined {
  return buildDurationOptions(slug).find((d) => d.time === time);
}

/**
 * Get price for a duration (in THB)
 */
export function getPrice(durationMinutes: number, slug: BranchSlug = "narathiwas"): number {
  const option = getDurationOption(durationMinutes, slug);
  return option?.price ?? 0;
}

/**
 * Format price display string
 */
export function formatPrice(durationMinutes: number, slug: BranchSlug = "narathiwas"): string {
  const option = getDurationOption(durationMinutes, slug);
  return option?.priceDisplay ?? `฿${getPrice(durationMinutes, slug)}`;
}

/**
 * Calculate price based on duration logic
 * - Step pricing: Rounds up to the nearest configured tier
 * - If exceeds max tier: Adds excess minutes * best rate
 */
export function calculateSessionPrice(
  durationMinutes: number,
  slug: BranchSlug = "narathiwas",
): number {
  if (durationMinutes <= 0) return 0;

  const sorted = buildDurationOptions(slug);

  // 1. If exact match or lower than first tier
  if (durationMinutes <= sorted[0].time) return sorted[0].price;

  // 2. Find tier that covers this duration
  const tier = sorted.find((opt) => opt.time >= durationMinutes);
  if (tier) return tier.price;

  // 3. If exceeds max tier, use max tier + per minute logic
  const maxTier = sorted[sorted.length - 1];
  const extraMinutes = durationMinutes - maxTier.time;
  // Use best rate (lowest pricePerMinute) for calculation
  const bestRate = Math.min(...sorted.map((s) => s.pricePerMinute));

  return maxTier.price + Math.ceil(extraMinutes * bestRate);
}

/**
 * Simple duration values for quick selection (in minutes)
 * Used in components that just need a list of numbers
 */
export const QUICK_DURATIONS = DURATION_TIERS.map((d) => d.time);

/**
 * Booking form validation rules
 */
export const BOOKING_VALIDATION = {
  /** Minimum phone number length (digits only) */
  minPhoneLength: 9,
  /** Maximum phone number length (digits only) */
  maxPhoneLength: 10,
  /** Minimum customer name length */
  minNameLength: 2,
  /** Maximum customer name length */
  maxNameLength: 100,
} as const;

/**
 * Operating hours for advance booking
 */
export const OPERATING_HOURS = {
  /** Opening hour (24h format) */
  open: 10,
  /** Closing hour (24h format) */
  close: 22,
  /** Duration of each time slot in minutes */
  slotDurationMinutes: 30,
  /** Whether the booking system is enabled */
  isEnabled: true,
  /** Whether to open 24 hours (overrides open/close) */
  isOpen24Hours: true,
} as const;

/**
 * Timezone metadata for display purposes
 */
export interface TimezoneInfo {
  /** IANA timezone identifier (e.g., 'Asia/Bangkok') */
  iana: string;
  /** Display name in Thai */
  displayNameTH: string;
  /** Display name in English */
  displayNameEN: string;
  /** City/Region name */
  cityName: string;
  /** Country name in Thai */
  countryTH: string;
  /** Country name in English */
  countryEN: string;
  /** Country flag emoji */
  flag: string;
  /** UTC offset description (e.g., 'UTC+7') */
  utcOffset: string;
}

/**
 * Predefined timezone configurations
 * Add more as needed for different countries
 */
export const TIMEZONE_DATABASE: Record<string, TimezoneInfo> = {
  'Asia/Bangkok': {
    iana: 'Asia/Bangkok',
    displayNameTH: 'เวลากรุงเทพฯ',
    displayNameEN: 'Bangkok Time',
    cityName: 'กรุงเทพฯ',
    countryTH: 'ประเทศไทย',
    countryEN: 'Thailand',
    flag: '🇹🇭',
    utcOffset: 'UTC+7',
  },
  'Asia/Tokyo': {
    iana: 'Asia/Tokyo',
    displayNameTH: 'เวลาโตเกียว',
    displayNameEN: 'Tokyo Time',
    cityName: 'โตเกียว',
    countryTH: 'ญี่ปุ่น',
    countryEN: 'Japan',
    flag: '🇯🇵',
    utcOffset: 'UTC+9',
  },
  'Asia/Singapore': {
    iana: 'Asia/Singapore',
    displayNameTH: 'เวลาสิงคโปร์',
    displayNameEN: 'Singapore Time',
    cityName: 'สิงคโปร์',
    countryTH: 'สิงคโปร์',
    countryEN: 'Singapore',
    flag: '🇸🇬',
    utcOffset: 'UTC+8',
  },
  'Asia/Hong_Kong': {
    iana: 'Asia/Hong_Kong',
    displayNameTH: 'เวลาฮ่องกง',
    displayNameEN: 'Hong Kong Time',
    cityName: 'ฮ่องกง',
    countryTH: 'ฮ่องกง',
    countryEN: 'Hong Kong',
    flag: '🇭🇰',
    utcOffset: 'UTC+8',
  },
  'Asia/Seoul': {
    iana: 'Asia/Seoul',
    displayNameTH: 'เวลาโซล',
    displayNameEN: 'Seoul Time',
    cityName: 'โซล',
    countryTH: 'เกาหลีใต้',
    countryEN: 'South Korea',
    flag: '🇰🇷',
    utcOffset: 'UTC+9',
  },
  'America/Los_Angeles': {
    iana: 'America/Los_Angeles',
    displayNameTH: 'เวลาแปซิฟิก',
    displayNameEN: 'Pacific Time',
    cityName: 'ลอสแองเจลิส',
    countryTH: 'สหรัฐอเมริกา',
    countryEN: 'United States',
    flag: '🇺🇸',
    utcOffset: 'UTC-8',
  },
  'America/New_York': {
    iana: 'America/New_York',
    displayNameTH: 'เวลาตะวันออก',
    displayNameEN: 'Eastern Time',
    cityName: 'นิวยอร์ก',
    countryTH: 'สหรัฐอเมริกา',
    countryEN: 'United States',
    flag: '🇺🇸',
    utcOffset: 'UTC-5',
  },
  'Europe/London': {
    iana: 'Europe/London',
    displayNameTH: 'เวลาลอนดอน',
    displayNameEN: 'London Time',
    cityName: 'ลอนดอน',
    countryTH: 'สหราชอาณาจักร',
    countryEN: 'United Kingdom',
    flag: '🇬🇧',
    utcOffset: 'UTC+0',
  },
  'Australia/Sydney': {
    iana: 'Australia/Sydney',
    displayNameTH: 'เวลาซิดนีย์',
    displayNameEN: 'Sydney Time',
    cityName: 'ซิดนีย์',
    countryTH: 'ออสเตรเลีย',
    countryEN: 'Australia',
    flag: '🇦🇺',
    utcOffset: 'UTC+10',
  },
};

/**
 * Timezone configuration for booking system
 * 
 * ⚠️ SINGLE SOURCE OF TRUTH for shop timezone
 * Change `defaultBusinessTimezone` to switch the shop's timezone
 */
export const TIMEZONE_CONFIG = {
  /** 
   * Default business timezone for the shop
   * This is the timezone where the physical shop is located
   * Change this when deploying to a different country
   */
  defaultBusinessTimezone: 'Asia/Bangkok' as keyof typeof TIMEZONE_DATABASE,
  
  /** Fallback timezone if something goes wrong */
  fallbackTimezone: 'Asia/Bangkok' as keyof typeof TIMEZONE_DATABASE,
  
  /** Get the shop's timezone info */
  get shopTimezoneInfo(): TimezoneInfo {
    return TIMEZONE_DATABASE[this.defaultBusinessTimezone] || TIMEZONE_DATABASE[this.fallbackTimezone];
  },
  
  /** Get supported timezones list */
  supportedTimezones: Object.keys(TIMEZONE_DATABASE),
} as const;

/**
 * Export type for readonly config
 */
export type BookingConfig = {
  durations: typeof DURATION_OPTIONS;
  defaultDuration: typeof DEFAULT_DURATION;
  validation: typeof BOOKING_VALIDATION;
  operatingHours: typeof OPERATING_HOURS;
  timezone: typeof TIMEZONE_CONFIG;
};
