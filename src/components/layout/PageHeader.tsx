import type { ReactNode } from 'react';
import { PawBackground } from '@/components/ui/PawBackground';
import { Stamp } from '@/components/ui/Stamp';

/** Cabeçalho das páginas internas, no mesmo idioma visual da home. */
export function PageHeader({ title, stamp, script, children }: { title: string; stamp?: string; script?: string; children?: ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <PawBackground variant="b" />
      <div className="container-page relative pb-8 pt-10 md:pt-14">
        <h1 className="text-h1 relative inline-block max-w-[16ch]">
          {title}
          {stamp && <Stamp className="absolute -bottom-3 -right-4 whitespace-nowrap sm:-right-10">{stamp}</Stamp>}
        </h1>
        {script && (
          <p aria-hidden className="script-note mt-3 text-xl sm:text-2xl">
            {script}
          </p>
        )}
        {children && <div className="mt-5 max-w-2xl text-text">{children}</div>}
      </div>
    </div>
  );
}
