import { useRef, useState } from 'react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onUpload?: (file: File) => Promise<string>;
}

export function ImageUploadInput({ value, onChange, placeholder = 'https://...', disabled, onUpload }: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      if (!onUpload) {
          throw new Error('OnUpload handler not provided');
      }
      const url = await onUpload(file);
      onChange(url);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      }
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-cyan-500 text-foreground"
          placeholder={placeholder}
          disabled={disabled || isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="px-4 py-3 bg-cyan-500/10 text-cyan-500 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {isUploading ? '⏳ กำลังอัปโหลด...' : '📁 อัปโหลด'}
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
      
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      
      {value && !error && (
        <div className="mt-2 text-xs text-muted flex items-center gap-2">
          <span className="text-emerald-500">✅</span> มีรูปภาพแล้ว
        </div>
      )}
    </div>
  );
}
