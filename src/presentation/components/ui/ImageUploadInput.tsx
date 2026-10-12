import { useRef, useState } from "react";
import { CropImageModal } from "@/src/presentation/components/ui/CropImageModal";

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onUpload?: (file: File) => Promise<string>;
  /** Starting crop ratio. null = free (matches the photo). */
  cropAspect?: number | null;
}

export function ImageUploadInput({
  value,
  onChange,
  placeholder = "https://...",
  disabled,
  onUpload,
  cropAspect = null,
}: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("ขนาดไฟล์ต้องไม่เกิน 5MB");
    }
    if (!onUpload) {
      throw new Error("ยังไม่ได้ตั้งค่าการอัปโหลดรูปภาพ");
    }
    const url = await onUpload(file);
    onChange(url);
  };

  /**
   * Upload straight from the picker — kept for callers that pass a file some
   * other way. The button opens the cropper instead, so a phone photo is
   * framed before it is ever sent.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      await uploadFile(file);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
      }
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCrop = async (file: File) => {
    setIsUploading(true);
    setError(null);
    try {
      await uploadFile(file);
      setIsCropOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
      }
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-racing-flag text-foreground"
          placeholder={placeholder}
          disabled={disabled || isUploading}
        />
        <button
          type="button"
          onClick={() => setIsCropOpen(true)}
          disabled={disabled || isUploading}
          className="px-4 py-3 bg-racing-flag/10 text-racing-flag-text border border-racing-flag/30 rounded-xl hover:bg-racing-flag/20 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {isUploading ? "⏳ กำลังอัปโหลด..." : "📁 อัปโหลด"}
        </button>
      </div>

      {/* Hidden picker kept for the direct-upload path; the button opens the cropper. */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {value && !error && (
        <div className="mt-2 text-xs text-muted flex items-center gap-2">
          <span className="text-emerald-500">✅</span> มีรูปภาพแล้ว
        </div>
      )}

      <CropImageModal
        open={isCropOpen}
        onClose={() => setIsCropOpen(false)}
        onCrop={handleCrop}
        initialAspect={cropAspect}
      />
    </div>
  );
}
