/**
 * Client-side document handling for /apply.
 *
 * Photos are downscaled to JPEG in the browser before upload so a phone
 * picture of a check (often 4–8 MB) becomes a few hundred KB. PDFs pass through
 * untouched. The whole submission must stay under MAX_TOTAL_BYTES.
 */
import { MAX_FILE_BYTES } from "@/app/lib/application/schema";

const MAX_EDGE = 1800;
const QUALITY = 0.82;

export interface Prepared {
  file: File;
  originalName: string;
  originalBytes: number;
  kind: "image" | "pdf";
}

export async function prepareFile(file: File): Promise<Prepared> {
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
    if (file.size > MAX_FILE_BYTES) throw new Error(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)} MB. PDFs must be under 4 MB — try exporting a smaller copy or a photo of the page.`);
    const pdf = file.type === "application/pdf" ? file : new File([file], file.name, { type: "application/pdf" });
    return { file: pdf, originalName: file.name, originalBytes: file.size, kind: "pdf" };
  }
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|heic|heif|webp|gif|bmp|tiff?)$/i.test(file.name)) {
    throw new Error(`"${file.name}" isn't a photo or PDF. Please upload a JPG, PNG or PDF.`);
  }
  let bitmap: ImageBitmap | HTMLImageElement;
  try {
    bitmap = await decode(file);
  } catch {
    throw new Error(`We couldn't read "${file.name}". If it's a HEIC photo from an iPhone, try Settings → Camera → Formats → "Most Compatible", or upload a screenshot of it.`);
  }
  const w = bitmap.width, h = bitmap.height;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't process the image.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  if ("close" in bitmap) bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", QUALITY));
  if (!blob) throw new Error("Your browser couldn't process the image.");
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  const out = new File([blob], name, { type: "image/jpeg" });
  if (out.size > MAX_FILE_BYTES) throw new Error(`"${file.name}" is still too large after compression.`);
  return { file: out, originalName: file.name, originalBytes: file.size, kind: "image" };
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    } catch {
      /* fall through to <img> (Safari + HEIC etc.) */
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode")); };
    img.src = url;
  });
}

export const fmtBytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
