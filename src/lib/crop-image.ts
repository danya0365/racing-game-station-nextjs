/**
 * Downscale an already-cropped canvas into a JPEG upload File.
 *
 * The cropper hands us the cropped region as a `<canvas>`, so all this has to do
 * is re-encode and shrink it. Phone photos here come in at 4000px+ and the upload
 * route rejects anything over 5MB, so capping both dimensions and the byte size
 * is what keeps an upload from failing on the shop's own phones.
 *
 * No `browser-image-compression` here (easy-stamp-nextjs uses it): this project
 * already caps the canvas to 1600px, which is enough on its own, and the
 * 5MB limit in `ImageUploadInput` is the backstop.
 */

/** Longest edge of the uploaded photo, in pixels. */
const MAX_EDGE = 1600;

/** JPEG quality — 0.9 keeps logos and text crisp enough to read on a card. */
const QUALITY = 0.9;

/**
 * Re-encode a cropped canvas as a JPEG File named after the original.
 *
 * @param canvas Cropped pixels from SimpleImageCropper.getCroppedCanvas()
 * @param baseName Original file name; only the stem is kept so the cropper's
 *   output still traces back to the file the staff picked
 */
export async function canvasToCompressedFile(
  canvas: HTMLCanvasElement,
  baseName: string,
): Promise<File> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (!blob) throw new Error("สร้างรูปไม่สำเร็จ");

  // Shrink again if the crop is still a long edge above the cap — getCroppedCanvas
  // caps the source rect, but rounding can still land a few pixels over.
  let outBlob = blob;
  if (Math.max(canvas.width, canvas.height) > MAX_EDGE) {
    const k = MAX_EDGE / Math.max(canvas.width, canvas.height);
    const shrunk = document.createElement("canvas");
    shrunk.width = Math.max(1, Math.round(canvas.width * k));
    shrunk.height = Math.max(1, Math.round(canvas.height * k));
    const ctx = shrunk.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(canvas, 0, 0, shrunk.width, shrunk.height);
      const reBlob = await new Promise<Blob | null>((resolve) =>
        shrunk.toBlob(resolve, "image/jpeg", QUALITY),
      );
      if (reBlob) outBlob = reBlob;
    }
  }

  const safeBase = baseName.replace(/\.[^.]+$/, "").trim() || "image";
  return new File([outBlob], `${safeBase}.jpg`, { type: "image/jpeg" });
}
