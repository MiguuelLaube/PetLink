import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from './cn';

const control =
  'w-full rounded-field border border-line bg-white px-3.5 text-text placeholder:text-text-muted/70 transition focus:border-primary focus:shadow-soft focus:outline-none aria-[invalid=true]:border-danger disabled:bg-peach-soft';

interface FieldShell {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

function Shell({ id, label, error, hint, required, className, children }: FieldShell & { id: string; children: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-text">
        {label}
        {required && <span aria-hidden className="text-danger"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: string) =>
  [error && `${id}-error`, hint && !error && `${id}-hint`].filter(Boolean).join(' ') || undefined;

export const Input = forwardRef<HTMLInputElement, FieldShell & InputHTMLAttributes<HTMLInputElement>>(function Input(
  { label, error, hint, required, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} required={required} className={className}>
      <input
        ref={ref}
        id={fid}
        aria-invalid={!!error}
        aria-describedby={describedBy(fid, error, hint)}
        aria-required={required}
        className={cn(control, 'h-11')}
        {...rest}
      />
    </Shell>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, FieldShell & TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { label, error, hint, required, className, id, rows = 4, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} required={required} className={className}>
      <textarea
        ref={ref}
        id={fid}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={describedBy(fid, error, hint)}
        aria-required={required}
        className={cn(control, 'py-2.5')}
        {...rest}
      />
    </Shell>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  FieldShell & SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] | Array<{ value: string; label: string }>; placeholder?: string }
>(function Select({ label, error, hint, required, className, id, options, placeholder, ...rest }, ref) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <Shell id={fid} label={label} error={error} hint={hint} required={required} className={className}>
      <select
        ref={ref}
        id={fid}
        aria-invalid={!!error}
        aria-describedby={describedBy(fid, error, hint)}
        aria-required={required}
        className={cn(control, 'h-11 pr-8')}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const opt = typeof o === 'string' ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </Shell>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: ReactNode; error?: string }>(function Checkbox(
  { label, error, className, id, ...rest },
  ref,
) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <div className={className}>
      <label htmlFor={fid} className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          ref={ref}
          id={fid}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-primary"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${fid}-error`} className="mt-1 pl-8 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

/** Grupo de chips de seleção (checkbox estilizado), usado nos filtros. */
export function ChipGroup({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-primary">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter((v) => v !== o) : [...value, o])}
              className={cn(
                'min-h-9 rounded-full border px-3.5 text-sm font-medium transition',
                on ? 'border-primary bg-primary text-cream' : 'border-line bg-white text-text hover:border-primary',
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
