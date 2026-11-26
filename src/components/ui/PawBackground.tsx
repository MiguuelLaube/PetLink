import { cn } from './cn';

function Paw({ className, rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={{ transform: `rotate(${rotate}deg)` }} fill="currentColor">
      <ellipse cx="32" cy="42" rx="14" ry="12" />
      <ellipse cx="14" cy="26" rx="6" ry="8" />
      <ellipse cx="26" cy="16" rx="6" ry="8" />
      <ellipse cx="38" cy="16" rx="6" ry="8" />
      <ellipse cx="50" cy="26" rx="6" ry="8" />
    </svg>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor">
      <path d="M30 55a22 22 0 0 1-2-44 28 28 0 0 1 52-4 20 20 0 0 1 30 18 15 15 0 0 1-5 30Z" />
    </svg>
  );
}

/** Pegadas e nuvens decorativas, bem suaves, atrás do conteúdo. */
export function PawBackground({ className, variant = 'a' }: { className?: string; variant?: 'a' | 'b' }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden text-primary', className)}>
      {variant === 'a' ? (
        <>
          <Paw className="absolute left-[4%] top-[12%] size-10 opacity-[0.07]" rotate={-20} />
          <Paw className="absolute left-[9%] top-[22%] size-8 opacity-[0.06]" rotate={-10} />
          <Paw className="absolute right-[6%] top-[60%] size-12 opacity-[0.07]" rotate={25} />
          <Paw className="absolute right-[12%] top-[72%] size-9 opacity-[0.06]" rotate={35} />
          <Cloud className="absolute -left-6 bottom-[8%] w-40 text-white opacity-70" />
          <Cloud className="absolute right-[18%] top-[6%] w-32 text-white opacity-60" />
        </>
      ) : (
        <>
          <Paw className="absolute right-[5%] top-[10%] size-10 opacity-[0.07]" rotate={15} />
          <Paw className="absolute left-[6%] bottom-[14%] size-11 opacity-[0.06]" rotate={-25} />
          <Cloud className="absolute left-[30%] -top-4 w-36 text-white opacity-60" />
        </>
      )}
    </div>
  );
}
