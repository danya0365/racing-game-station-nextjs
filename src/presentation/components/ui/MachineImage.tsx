"use client";

import { useState } from "react";

interface MachineImageProps {
  /** machines.image_url — may be empty, and may point at a file that is gone */
  imageUrl?: string;
  /** Machine name — alt text */
  name: string;
  /** Box sizing and rounding, e.g. "w-12 h-12 rounded-xl" */
  className?: string;
  /** Background behind the photo and behind the fallback glyph */
  fallbackClassName?: string;
}

/**
 * MachineImage — the photo of a machine, or a 🎮 when there is none.
 *
 * Every surface that shows a machine used to hard-code the glyph, so an
 * uploaded photo only ever appeared in the backend detail modal. This puts the
 * decision in one place, including the case that matters most here: admins
 * type the URL by hand, so it can 404 long after it was saved.
 *
 * A plain <img> rather than next/image: the host varies per deployment
 * (localhost:54321 locally, <project-ref>.supabase.co in prod, something else
 * for a self-hosted store) and the optimizer would need all of them allowlisted
 * in next.config. These are fixed 40–80px thumbnails, so the optimizer buys
 * nothing here.
 */
export function MachineImage({
  imageUrl,
  name,
  className = "",
  fallbackClassName = "bg-muted-light text-2xl",
}: MachineImageProps) {
  // Tracks the URL that failed rather than a boolean, so editing the field to a
  // working URL shows the photo instead of staying stuck on the glyph.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!imageUrl || failedUrl === imageUrl) {
    return (
      <div
        className={`flex items-center justify-center flex-shrink-0 ${className} ${fallbackClassName}`}
        aria-hidden
      >
        🎮
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex-shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover"
        onError={() => setFailedUrl(imageUrl)}
      />
    </div>
  );
}
