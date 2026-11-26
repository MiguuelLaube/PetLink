import { Check } from 'lucide-react';
import { cn } from '@/components/ui/cn';

/** Indicador de etapas para formulários longos. */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="mb-6 flex items-center gap-2" aria-label="Etapas">
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s} className="flex flex-1 items-center gap-2" aria-current={now ? 'step' : undefined}>
            <span
              className={cn(
                'grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold',
                done ? 'bg-success text-white' : now ? 'bg-primary text-cream' : 'bg-peach text-primary',
              )}
            >
              {done ? <Check aria-hidden className="size-4" /> : i + 1}
            </span>
            <span className={cn('hidden text-xs font-medium sm:block', now ? 'text-primary' : 'text-text-muted')}>{s}</span>
            {i < steps.length - 1 && <span aria-hidden className="h-0.5 flex-1 rounded bg-line" />}
          </li>
        );
      })}
    </ol>
  );
}
