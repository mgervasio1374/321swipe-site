/**
 * Open live chat, with a real fallback when the chat widget is blocked, still
 * loading, or down: a pre-addressed email to sales@. "Talk to 321 Swipe"
 * should always lead to a person.
 */
export const CONTACT_EMAIL = "sales@321swipe.com";

export function openChat() {
  if (typeof window === "undefined") return;
  const api = window.Tawk_API;
  if (api?.maximize) {
    api.maximize();
    return;
  }
  const subject = encodeURIComponent("Question for 321 Swipe");
  const body = encodeURIComponent(`Hi 321 Swipe,\n\n(Sent from ${window.location.href})\n\n`);
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}
