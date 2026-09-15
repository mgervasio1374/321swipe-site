"use client";

import { ClosingCta } from "@/app/components/sections/ClosingCta";

/** Homepage closing section — the shared ClosingCta with homepage copy. */
export function CtaSection({ photo }: { photo: string | null }) {
  return (
    <ClosingCta
      photo={photo}
      badge="Free for any contractor"
      title={
        <>
          See what your current processing
          <br className="hidden sm:block" /> is really costing you.
        </>
      }
      body="Many contractors discover hundreds of dollars per month in avoidable fees during their first review. A free statement review gives you a clear picture of what you are paying — and what you should not be."
      primary={{ label: "Request a Free Statement Review", href: "https://upload.321swipe.com" }}
      trustPoints={["No long-term contracts", "Free statement review", "No setup fees", "Human support included"]}
    />
  );
}
