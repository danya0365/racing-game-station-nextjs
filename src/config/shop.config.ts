/**
 * Shop Configuration
 *
 * The shop's name, in one place.
 *
 * Before this file it was written out at 105 sites across 48 files, which is
 * how a find-and-replace turned "Formula 1" into "Formula Gran Turismo
 * Thailand" in three places — the brand name had no anchor, so every string
 * that merely looked like it was a candidate. One constant means the next
 * rename is one edit, and this file is where to look.
 *
 * Long-form variants are spelled out rather than composed. "… System" in the
 * footer and "… Team" in the metadata authors read as prose, and composing them
 * as `${SHOP_CONFIG.name} System` makes every future reader wonder whether the
 * space is right. Change them together here or not at all.
 */

/** Base name, used wherever the shop is named on its own */
export const SHOP_NAME = "Gran Turismo Thailand";

/** Marketing line, used under the name on cards and the QR poster */
export const SHOP_TAGLINE = "ประสบการณ์แข่งรถเสมือนจริงระดับพรีเมียม";

/** Footer: "© 2025 <systemName> v1.0.0 (<commit>)" */
export const SHOP_SYSTEM_NAME = "Gran Turismo Thailand System";

/** `authors` in the Next metadata — the byline, not the shop itself */
export const SHOP_TEAM_NAME = "Gran Turismo Thailand Team";

/**
 * SEO keywords. The old name's variants used to be here; keeping them costs
 * nothing and keeps existing search results pointed at the right page.
 */
export const SHOP_KEYWORDS = [
  "gran turismo thailand",
  "gran turismo",
  "จองเวลา",
  "จองคิว",
  "sim racing",
  "esports",
];

/**
 * Page title, as `<page> | <shop>`.
 *
 * Not `page | shop | shop` — several pages previously built
 * "… | Gran Turismo Thailand" out of a title that already ended in the brand,
 * which read as a stutter once the name was long enough to notice.
 */
export function shopPageTitle(page: string): string {
  return `${page} | ${SHOP_NAME}`;
}
