import { track as vercelTrack } from "@vercel/analytics";

/**
 * Custom events for Vercel Web Analytics. Names are stable strings — the
 * dashboard groups by them — so change with care.
 *
 * Property values must be primitives (string | number | boolean).
 */
export type AnalyticsEvent =
  | { name: "decoder_line"; fee: string; verdict: string; variant: string; via: "hover" | "tap" }
  | { name: "decoder_flag_toggle"; on: boolean; variant: string }
  | { name: "decoder_cta"; variant: string }
  | { name: "fee_page_to_decoder"; fee: string }
  | { name: "grader_start" }
  | { name: "grader_complete"; grade: string; score: number }
  | { name: "grader_share"; grade: string }
  | { name: "grader_cta"; grade: string }
  | { name: "rep_form_submit"; rep: string; mode: "statement" | "message"; attachment: boolean }
  | { name: "lead_modal_submit"; page: string }
  | { name: "software_open"; tool: string; status: string }
  | { name: "review_cta"; page: string; placement: string }
  | { name: "funding_cta"; placement: string }
  | { name: "apply_step"; step: string }
  | { name: "apply_submit"; files: number };

export function track(event: AnalyticsEvent) {
  try {
    const { name, ...props } = event;
    vercelTrack(name, props as Record<string, string | number | boolean>);
  } catch {
    /* analytics must never break the page */
  }
}
