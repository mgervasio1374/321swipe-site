import type { MetadataRoute } from "next";
import { FEES } from "@/app/lib/fees";

const BASE = "https://321swipe.com";

/**
 * Only pages we want indexed on their own. The partner Decoder variants
 * (/certainpath/statement-decoder, /blue-collar-success-group/statement-decoder)
 * share most of their content with /statement-decoder and stay out of the
 * sitemap deliberately; /apply and /savingsbycaryn are reached by link, not search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const top: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                  lastModified: now, changeFrequency: "weekly",  priority: 1 },
    { url: `${BASE}/statement-decoder`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/fees`,              lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/grade-my-statement`,lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/funding`,           lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/advisory`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/software`,          lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/certainpath`,       lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blue-collar-success-group`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/privacy`,           lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/terms`,             lastModified: now, changeFrequency: "yearly",  priority: 0.2 },
  ];
  const fees: MetadataRoute.Sitemap = FEES.map((f) => ({
    url: `${BASE}/fees/${f.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7,
  }));
  return [...top, ...fees];
}
