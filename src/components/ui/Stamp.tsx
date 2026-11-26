import { cn } from './cn';

/** Selo laranja inclinado sobre os títulos (assinatura visual da marca). */
export function Stamp({ children, className, tilt = -6 }: { children: string; className?: string; tilt?: number }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full bg-orange px-3 py-1.5 font-sans text-[0.7rem] font-semibold uppercase leading-none tracking-wider text-primary shadow-soft',
        className,
      )}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      {children}
    </span>
  );
}
