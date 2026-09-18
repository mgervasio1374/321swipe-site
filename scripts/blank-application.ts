/**
 * Regenerates the printable and fillable blank applications in public/
 * from the same renderer that produces submitted applications.
 *
 *   npx tsx scripts/blank-application.ts
 */
import fs from "node:fs";
import path from "node:path";
import { renderApplicationPdf } from "../app/lib/application/pdf";

const pub = path.join(process.cwd(), "public");
Promise.all([
  renderApplicationPdf({}).then((buf) => fs.writeFileSync(path.join(pub, "321-swipe-merchant-application.pdf"), buf)),
  renderApplicationPdf({ fillable: true }).then((buf) => fs.writeFileSync(path.join(pub, "321-swipe-merchant-application-fillable.pdf"), buf)),
]).then(() => console.log("wrote public/321-swipe-merchant-application.pdf and -fillable.pdf"));
