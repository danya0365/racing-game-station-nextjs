/**
 * Branch Configuration
 *
 * Single source of truth for branch routing.
 * Branch IDs are seeded in migration 20261008000000_multi_branch.sql —
 * if you change the IDs there, change them here too.
 *
 * URL structure:
 *   /pattani/time-booking      → สาขาปัตตานี
 *   /narathiwas/time-booking  → สาขานราธิวาส
 *
 * A URL segment (not a route group) is required — `(pattani)` would produce
 * `/time-booking` and lose the branch.
 */

export interface Branch {
  /** UUID from public.branches */
  id: string;
  /** URL segment — must match branches.slug */
  slug: string;
  /** Display name (Thai) */
  name: string;
  /** Short label for header/footer */
  shortName: string;
}

/**
 * Stable UUIDs — must match the seed INSERT in the migration.
 */
export const BRANCH_IDS = {
  PATTANI: "00000000-0000-0000-0000-000000000b01",
  NARATHIWAS: "00000000-0000-0000-0000-000000000b02",
} as const;

/**
 * Ordered by how the shop presents them. Narathiwat is the original location
 * (see the "Pro Racer Rates — Gran Turismo Narathiwat" note in
 * booking.config.ts) so it is first and is also DEFAULT_BRANCH.
 */
export const BRANCHES: Branch[] = [
  {
    id: BRANCH_IDS.NARATHIWAS,
    slug: "narathiwas",
    name: "Racing Game Station นราธิวาส",
    shortName: "นราธิวาส",
  },
  {
    id: BRANCH_IDS.PATTANI,
    slug: "pattani",
    name: "Racing Game Station ปัตตานี",
    shortName: "ปัตตานี",
  },
];

/**
 * Default branch when no slug in the URL.
 * Narathiwat is the original shop — existing machines and bookings live there.
 */
export const DEFAULT_BRANCH = BRANCHES[0];

/** All known slugs — used by middleware to detect the branch prefix */
export const BRANCH_SLUGS = BRANCHES.map((b) => b.slug);

/**
 * Look up branch by slug
 */
export function getBranchBySlug(slug: string): Branch | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}

/**
 * Look up branch by ID
 */
export function getBranchById(id: string): Branch | undefined {
  return BRANCHES.find((b) => b.id === id);
}

/**
 * Build a branch-scoped URL: /pattani/time-booking
 */
export function branchPath(slug: string, path = ""): string {
  const clean = path.replace(/^\//, "");
  return clean ? `/${slug}/${clean}` : `/${slug}`;
}
