import fs from "node:fs";
import path from "node:path";

/**
 * Resolves the homepage photography at build time (static export).
 *
 * Drop finished images into /public/photos using these names and rebuild.
 * Any photo that is missing renders as an art-directed placeholder with its
 * shot brief, so the layout always reads correctly.
 */
export const PHOTO_NAMES = [
  "hero",
  "problem",
  "analyst",
  "statement",
  "advisor",
  "van-tailgate",
  "roofing-crew",
  "porch-payment",
  "van-dusk",
  // Savings by Caryn (/savingsbycaryn) — see photo-prompts-caryn.md
  "caryn-hero",
  "caryn-farm-market",
  "caryn-sheds",
  "caryn-machine-shop",
  "caryn-equipment",
  "caryn-country-store",
  "caryn-ministry",
] as const;

export type PhotoName = (typeof PHOTO_NAMES)[number];
export type PhotoMap = Record<PhotoName, string | null>;

function resolve(name: string): string | null {
  const dir = path.join(process.cwd(), "public", "photos");
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (fs.existsSync(path.join(dir, `${name}.${ext}`))) return `/photos/${name}.${ext}`;
  }
  return null;
}

export function loadPhotos(): PhotoMap {
  return Object.fromEntries(PHOTO_NAMES.map((n) => [n, resolve(n)])) as PhotoMap;
}

/** Screenshots for /software live in public/software/<slug>.{jpg,png,webp}. */
export function loadSoftwareShots(slugs: readonly string[]): Record<string, string | null> {
  const dir = path.join(process.cwd(), "public", "software");
  return Object.fromEntries(
    slugs.map((slug) => {
      for (const ext of ["jpg", "jpeg", "webp", "png"]) {
        if (fs.existsSync(path.join(dir, `${slug}.${ext}`))) return [slug, `/software/${slug}.${ext}`];
      }
      return [slug, null];
    }),
  );
}
