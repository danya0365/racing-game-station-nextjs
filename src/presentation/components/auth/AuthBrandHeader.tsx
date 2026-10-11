"use client";

import { SHOP_NAME } from "@/src/config/shop.config";
import Image from "next/image";
import Link from "next/link";

/**
 * AuthBrandHeader — the logo + wordmark block the four auth screens share.
 *
 * They were byte-identical apart from the heading below, which is four copies
 * of one block that has to stay in step with the shop's look.
 *
 * TODO: this hardcodes the Narathiwat mark, because /auth sits outside the
 * branch gate (EXEMPT_PREFIXES in BranchGate) and outside every BranchScope —
 * a first-time visitor can reach the login page without ever picking a branch,
 * so there is no branch to read here and useActiveBranch() would quietly fall
 * back to DEFAULT_BRANCH while looking like it knew. A Pattani customer
 * therefore sees the Narathiwat logo. That is better than the 🏎️ it replaced
 * but still wrong. The fix is a shop-wide mark in which the branch is not baked
 * into the artwork; add it to public/assets/logo/ and point both this and
 * BRANCHES at it.
 */
export function AuthBrandHeader() {
  return (
    <div className="text-center mb-8">
      <Link href="/" className="inline-flex items-center gap-3">
        {/* Wide plate, not a square tile: the mark is a ~2.4:1 lockup, so a
            56×56 box scaled it down to a smudge. Dark plate because both logo
            files carry white into their pixels, which a tinted tile does not
            guarantee to keep readable. */}
        <div className="h-12 px-2.5 rounded-xl bg-neutral-900 border border-racing-line flex items-center justify-center shadow-lg">
          <Image
            src="/assets/logo/narathiwat.webp"
            alt={SHOP_NAME}
            width={760}
            height={322}
            priority
            className="h-9 w-auto object-contain"
          />
        </div>
        <span className="text-2xl font-bold bg-linear-to-r from-racing-flag to-racing-flag-soft bg-clip-text text-transparent">
          {SHOP_NAME}
        </span>
      </Link>
    </div>
  );
}
