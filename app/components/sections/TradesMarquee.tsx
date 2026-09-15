const trades = [
  "Built for HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Garage doors",
  "Landscaping",
  "Pest control",
  "Restoration",
];

export function TradesMarquee() {
  const items = [...trades, ...trades]; // duplicated so the loop is seamless
  return (
    <div className="relative overflow-hidden border-y border-slate-100 bg-white py-5" aria-label="Trades we serve">
      <div aria-hidden className="absolute inset-y-0 left-0 w-32 z-10" style={{ background: "linear-gradient(90deg, #fff, transparent)" }} />
      <div aria-hidden className="absolute inset-y-0 right-0 w-32 z-10" style={{ background: "linear-gradient(270deg, #fff, transparent)" }} />
      <div className="marquee items-center gap-14 text-[13px] font-semibold uppercase tracking-[0.06em] text-slate-400">
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-14 whitespace-nowrap">
            {t}
            <span aria-hidden className="text-slate-300">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
