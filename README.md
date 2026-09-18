This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Merchant application (`/apply`)

Online version of the merchant application, delivered to sales as an encrypted PDF.

- Page: `app/apply/` (multi-step client form). Field model + validation: `app/lib/application/schema.ts`.
- Handler: `app/api/apply/route.ts` — validates, renders the PDF (`app/lib/application/pdf.ts`, AES-256 with `APPLICATION_PDF_PASSWORD`), emails it via Resend with masked values in the body, and sends the applicant a confirmation.
- Blank printable PDF: `public/321-swipe-merchant-application.pdf` — regenerate with `npx tsx scripts/blank-application.ts` after changing the layout.
- Env vars: see `.env.example`. The route returns 503 until `RESEND_API_KEY` and `APPLICATION_PDF_PASSWORD` are set.
- Nothing is stored server-side; the site is no longer a static export (`output: "export"` was removed so the route can run on Vercel).
