import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from './cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'light';
type Size = 'sm' | 'md' | 'lg';

interface Common {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

const base =
  'group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-[background,color,box-shadow,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none whitespace-nowrap';
const variants: Record<Variant, string> = {
  primary: 'bg-primary text-cream shadow-soft hover:bg-primary-hover',
  secondary: 'border-[1.5px] border-primary text-primary bg-transparent hover:bg-peach-soft',
  ghost: 'text-primary hover:underline underline-offset-4',
  danger: 'bg-danger text-white hover:brightness-110',
  light: 'bg-cream text-primary shadow-soft hover:bg-peach',
};
const sizes: Record<Size, string> = {
  sm: 'min-h-9 px-4 text-sm',
  md: 'min-h-11 px-5 text-[0.95rem]',
  lg: 'min-h-13 px-6 text-base',
};

function Content({ arrow, icon, loading, children, variant }: Common & { loading?: boolean }) {
  return (
    <>
      {icon && !loading && <span aria-hidden>{icon}</span>}
      <span>{children}</span>
      {loading ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        arrow && (
          <span
            aria-hidden
            className={cn(
              '-mr-2 grid size-7 place-items-center rounded-full transition-transform group-hover:translate-x-0.5',
              variant === 'primary' ? 'bg-cream text-primary' : 'bg-primary text-cream',
            )}
          >
            <ArrowRight className="size-4" />
          </span>
        )
      )}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }>(
  function Button({ variant = 'primary', size = 'md', arrow, icon, loading, className, children, disabled, type = 'button', ...rest }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        <Content arrow={arrow} icon={icon} loading={loading} variant={variant}>
          {children}
        </Content>
      </button>
    );
  },
);

export function ButtonLink({ variant = 'primary', size = 'md', arrow, icon, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      <Content arrow={arrow} icon={icon} variant={variant}>
        {children}
      </Content>
    </Link>
  );
}
