"use client";

import { useId, useState } from "react";

/** Shared form primitives for the merchant application. */

export const INPUT =
  "w-full min-w-0 rounded-lg bg-white border border-slate-200 px-3.5 py-2.5 text-[15px] sm:text-[14px] text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-colors disabled:bg-slate-50 disabled:text-slate-400";
const INPUT_ERR = "border-red-400 focus:border-red-500 focus:ring-red-500/20";
export const LABEL = "block text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1.5";

export function Field({
  label,
  error,
  hint,
  htmlFor,
  className = "",
  optional,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`min-w-0 ${className}`} data-error={error ? "true" : undefined}>
      <label className={LABEL} htmlFor={htmlFor}>
        {label}
        {optional && <span className="ml-1 normal-case tracking-normal font-normal text-slate-400">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-[12.5px] text-red-600" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[12px] text-slate-400 leading-snug">{hint}</p>
      ) : null}
    </div>
  );
}

type TextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Formatter applied on every keystroke (phone, SSN, EIN…). */
  format?: (v: string) => string;
  prefix?: string;
  suffix?: string;
};

export function TextInput({ label, value, onChange, error, hint, optional, className, format, prefix, suffix, id, ...rest }: TextProps) {
  const auto = useId();
  const fid = id ?? auto;
  const input = (
    <input
      id={fid}
      value={value}
      onChange={(e) => onChange(format ? format(e.target.value) : e.target.value)}
      aria-invalid={error ? true : undefined}
      className={`${INPUT} ${error ? INPUT_ERR : ""} ${prefix ? "pl-7" : ""} ${suffix ? "pr-8" : ""}`}
      {...rest}
    />
  );
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fid} optional={optional} className={className}>
      {prefix || suffix ? (
        <div className="relative">
          {prefix && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">{prefix}</span>}
          {input}
          {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[14px] text-slate-400">{suffix}</span>}
        </div>
      ) : (
        input
      )}
    </Field>
  );
}

/** Masked input for SSN / account numbers with a show-hide toggle. */
export function SecretInput({ label, value, onChange, error, hint, optional, className, format, id, ...rest }: TextProps) {
  const auto = useId();
  const fid = id ?? auto;
  const [show, setShow] = useState(false);
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fid} optional={optional} className={className}>
      <div className="relative">
        <input
          id={fid}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(format ? format(e.target.value) : e.target.value)}
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          data-lpignore="true"
          data-1p-ignore
          className={`${INPUT} ${error ? INPUT_ERR : ""} pr-16 tracking-wider`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11.5px] font-semibold text-slate-500 hover:text-navy-900 hover:bg-slate-100"
          aria-label={show ? "Hide" : "Show"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </Field>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  optional,
  className,
  placeholder = "Select…",
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  placeholder?: string;
  id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fid} optional={optional} className={className}>
      <div className="relative">
        <select
          id={fid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          className={`${INPUT} ${error ? INPUT_ERR : ""} appearance-none pr-9 ${value ? "" : "text-slate-400"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400">
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </Field>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  className,
  rows = 3,
  placeholder,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  rows?: number;
  placeholder?: string;
  id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Field label={label} error={error} hint={hint} htmlFor={fid} optional={optional} className={className}>
      <textarea id={fid} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={error ? true : undefined} className={`${INPUT} ${error ? INPUT_ERR : ""} resize-y`} />
    </Field>
  );
}

/** Segmented yes / no (or any short option set). */
export function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
  error,
  hint,
  className,
}: {
  label: string;
  value: T | "";
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  error?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <Field label={label} error={error} hint={hint} className={className}>
      <div role="radiogroup" aria-label={label} className="inline-flex rounded-lg border border-slate-200 bg-white p-1 gap-1">
        {options.map((o) => {
          const on = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`rounded-md px-4 py-1.5 text-[13.5px] font-semibold transition-colors ${on ? "bg-navy-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

export function Checkbox({ checked, onChange, error, children, id }: { checked: boolean; onChange: (v: boolean) => void; error?: string; children: React.ReactNode; id?: string }) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div data-error={error ? "true" : undefined}>
      <label htmlFor={fid} className={`flex items-start gap-3 rounded-lg border p-3.5 cursor-pointer transition-colors ${error ? "border-red-300 bg-red-50/40" : checked ? "border-accent-500/50 bg-accent-50/40" : "border-slate-200 hover:bg-slate-50"}`}>
        <input id={fid} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-accent-600 focus:ring-accent-500" />
        <span className="text-[13.5px] text-navy-900 leading-relaxed">{children}</span>
      </label>
      {error && (
        <p className="mt-1.5 text-[12.5px] text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SectionTitle({ title, body }: { title: string; body?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-[20px] sm:text-[22px] font-bold text-navy-900 tracking-tight">{title}</h2>
      {body && <p className="mt-1.5 text-[14px] text-slate-500 leading-relaxed max-w-xl">{body}</p>}
    </div>
  );
}

export function SubTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mt-6 mb-3 pb-2 border-b border-slate-100">
      <h3 className="text-[12px] font-bold uppercase tracking-[0.1em] text-accent-600">{children}</h3>
      {right}
    </div>
  );
}
