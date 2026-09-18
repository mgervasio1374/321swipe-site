/**
 * Regenerates the printable blank application at public/321-swipe-merchant-application.pdf
 * from the same renderer that produces submitted applications.
 *
 *   npx tsx scripts/blank-application.ts
 */
import fs from "node:fs";
import path from "node:path";
import { renderApplicationPdf } from "../app/lib/application/pdf";

const out = path.join(process.cwd(), "public", "321-swipe-merchant-application.pdf");
renderApplicationPdf({}).then((buf) => {
  fs.writeFileSync(out, buf);
  console.log(`wrote ${out} (${(buf.length / 1024).toFixed(0)} KB)`);
});
