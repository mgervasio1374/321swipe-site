import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/apply"] }],
    sitemap: "https://321swipe.com/sitemap.xml",
    host: "https://321swipe.com",
  };
}
