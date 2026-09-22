import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // pdfkit reads its font metrics from disk at runtime; keep it out of the bundle.
  serverExternalPackages: ["pdfkit"],
  // The application PDF embeds the logo from disk at request time.
  outputFileTracingIncludes: { "/api/apply": ["./public/logo-print.png"] },
  // One preferred host: www → apex (301). Vercel serves both; search engines should see one.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.321swipe.com" }],
        destination: "https://321swipe.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Never let a browser or proxy cache the application page or its API.
        source: "/(apply|api/apply)",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default nextConfig;
