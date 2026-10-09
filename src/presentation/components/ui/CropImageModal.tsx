"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedButton } from "@/src/presentation/components/ui/AnimatedButton";
import { Portal } from "@/src/presentation/components/ui/Portal";
import {
  SimpleImageCropper,
  type SimpleCropperHandle,
} from "@/src/presentation/components/ui/SimpleImageCropper";
import { canvasToCompressedFile } from "@/src/lib/crop-image";

const ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Ratio presets. `null` is free crop — the window then matches the photo's own
 * ratio instead of being forced into a shape.
 */
const RATIO_PRESETS: { label: string; value: number | null }[] = [
  { label: "อิสระ", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:4", value: 3 / 4 },
  { label: "16:9", value: 16 / 9 },
];

/** Longest edge of the cropped result — matches canvasToCompressedFile. */
const MAX_EDGE = 1600;

/**
 * CropImageModal — pick a photo, frame it, get back a cropped File.
 *
 * Staff pick a 12MP phone photo, crop it to what actually shows the machine,
 * and hand a ~100KB JPEG to the existing upload path instead of a 4MB frame
 * with the cockpit in one corner.
 *
 * Returns the cropped File through `onCrop`; the caller still owns the upload
 * (`ImageUploadInput`'s onUpload), so nothing here knows about buckets or URLs.
 */
export function CropImageModal({
  open,
  onClose,
  onCrop,
  initialAspect = null,
}: {
  open: boolean;
  onClose: () => void;
  onCrop: (file: File) => Promise<void> | void;
  /** Starting crop ratio. null = free (matches the photo). */
  initialAspect?: number | null;
}) {
  const cropperRef = useRef<SimpleCropperHandle>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [src, setSrc] = useState<string | null>(null);
  const [baseName, setBaseName] = useState("machine");
  const [aspect, setAspect] = useState<number | null>(initialAspect);
  const [isCropping, setIsCropping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Drop the photo and reset ratio every time the modal opens.
  useEffect(() => {
    if (open) {
      setAspect(initialAspect);
      setError(null);
    } else {
      setSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    }
  }, [open, initialAspect]);

  // A 56px-tall crop window would be unusable for a landscape photo; the cropper
  // itself caps at 55vh, this only decides whether a fixed ratio is worth offering.
  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so re-picking the same file still fires onChange.
    if (fileRef.current) fileRef.current.value = "";
    if (!file) return;
    setError(null);
    setBaseName(file.name);
    setSrc(URL.createObjectURL(file));
  };

  const handleConfirm = async () => {
    const canvas = cropperRef.current?.getCroppedCanvas({
      maxWidth: MAX_EDGE,
      maxHeight: MAX_EDGE,
    });
    if (!canvas) {
      setError("ยังโหลดรูปไม่เสร็จ ลองอีกครั้ง");
      return;
    }

    setIsCropping(true);
    try {
      const file = await canvasToCompressedFile(canvas, baseName);
      setIsUploading(true);
      await onCrop(file);
      setSrc((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
      );
    } finally {
      setIsCropping(false);
      setIsUploading(false);
    }
  };

  if (!open) return null;

  const busy = isCropping || isUploading;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="ปรับแต่งรูปเครื่อง"
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={busy ? undefined : onClose}
        />
        <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
          <div className="p-4 bg-racing-flag-dim border-b border-border flex justify-between items-center">
            <h3 className="font-bold text-lg text-foreground">
              ✂️ ปรับแต่งรูปภาพ
            </h3>
            <button
              onClick={onClose}
              disabled={busy}
              className="text-muted hover:text-foreground transition-colors disabled:opacity-50"
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              onChange={handlePick}
              className="hidden"
            />

            {!src ? (
              <div className="py-8 text-center space-y-3">
                <div className="text-5xl">🖼️</div>
                <p className="text-sm text-muted">
                  เลือกรูปเครื่องที่ต้องการ แล้วลากเพื่อเลือกส่วนที่จะแสดง
                </p>
                <AnimatedButton
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                  disabled={busy}
                >
                  📁 เลือกรูป
                </AnimatedButton>
              </div>
            ) : (
              <>
                {/* Ratio presets — a machine reads best as 4:3 or 1:1, and the
                    cards that show it are square, so both are one tap away. */}
                <div className="flex flex-wrap gap-1.5">
                  {RATIO_PRESETS.map((r) => {
                    const active = aspect === r.value;
                    return (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => setAspect(r.value)}
                        disabled={busy}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
                          active
                            ? "bg-racing-flag text-racing-on-flag"
                            : "bg-background text-muted border border-border hover:border-racing-flag"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>

                <SimpleImageCropper
                  ref={cropperRef}
                  src={src}
                  aspect={aspect}
                />
              </>
            )}

            {error && <p className="text-sm text-racing-led-stop">{error}</p>}
          </div>

          <div className="p-4 border-t border-border flex gap-3">
            <AnimatedButton
              variant="ghost"
              onClick={onClose}
              className="flex-1"
              disabled={busy}
            >
              ยกเลิก
            </AnimatedButton>
            <AnimatedButton
              variant="primary"
              onClick={handleConfirm}
              className="flex-1"
              disabled={!src || busy}
            >
              {isCropping
                ? "✂️ กำลังตัด..."
                : isUploading
                  ? "⏳ กำลังอัปโหลด..."
                  : "💾 ใช้รูปนี้"}
            </AnimatedButton>
          </div>
        </div>
      </div>
    </Portal>
  );
}
