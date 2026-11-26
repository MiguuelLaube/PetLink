import type { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-block border-2 border-dashed border-line bg-white/50 px-6 py-12 text-center">
      <span aria-hidden className="mb-4 grid size-14 place-items-center rounded-full bg-peach text-primary">
        {icon ?? <PawPrint className="size-7" />}
      </span>
      <h3 className="text-lg font-semibold text-primary">{title}</h3>
      {text && <p className="mt-1 max-w-md text-text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry, text = 'Não foi possível carregar agora.' }: { onRetry?: () => void; text?: string }) {
  return (
    <div role="alert" className="rounded-block bg-danger-soft px-6 py-8 text-center text-danger">
      <p className="font-semibold">{text}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-3 rounded-full border border-danger px-4 py-2 text-sm font-semibold">
          Tentar de novo
        </button>
      )}
    </div>
  );
}
