import type { ReactNode } from 'react';
import { HouseFrame } from '@/components/ui/HouseFrame';
import { PawBackground } from '@/components/ui/PawBackground';

const IMG = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&h=900&q=75&fm=webp';

export function AuthLayout({ title, script, children, wide }: { title: string; script?: string; children: ReactNode; wide?: boolean }) {
  return (
    <section className="relative overflow-hidden">
      <PawBackground />
      <div className={`container-page relative grid items-start gap-10 py-10 md:py-16 ${wide ? '' : 'lg:grid-cols-[1fr_0.8fr]'}`}>
        <div className={`rounded-block bg-white/80 p-6 shadow-warm sm:p-10 ${wide ? 'mx-auto w-full max-w-3xl' : ''}`}>
          <h1 className="text-h1">{title}</h1>
          {script && (
            <p aria-hidden className="script-note mt-2 text-xl">
              {script}
            </p>
          )}
          <div className="mt-8">{children}</div>
        </div>
        {!wide && (
          <HouseFrame src={IMG} alt="Filhote dourado segurando uma flor na boca" tone="yellow" className="hidden aspect-[8/9] w-full lg:block" />
        )}
      </div>
    </section>
  );
}
