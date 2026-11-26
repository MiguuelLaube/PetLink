import { PawPrint } from 'lucide-react';

export function PageLoader({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="grid min-h-[50vh] place-items-center text-primary">
      <div className="flex flex-col items-center gap-3">
        <PawPrint aria-hidden className="size-10 animate-bounce" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  );
}
