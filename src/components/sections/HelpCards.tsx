import { HeartHandshake } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal, SectionTitle } from '@/components/ui/Section';
import { cn } from '@/components/ui/cn';

const CARDS = [
  { value: 10, text: 'Uma semana de ração para um filhote resgatado', bg: 'bg-yellow', img: IMAGES.help10 },
  { value: 25, text: 'Check-up veterinário e uma dose de vacina', bg: 'bg-peach', img: IMAGES.help25 },
  { value: 50, text: 'Um mês de lar temporário para um animal', bg: 'bg-blue', img: IMAGES.help50 },
];

export function HelpCards() {
  return (
    <section aria-labelledby="ajudar" className="container-page mt-24">
      <SectionTitle id="ajudar" stamp="Ajude-os" align="center" className="mx-auto">
        Você também pode ajudar
      </SectionTitle>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <Reveal key={c.value} delay={i * 0.08}>
            <article className={cn('flex h-full flex-col overflow-hidden rounded-card p-6 pb-0 shadow-warm', c.bg)}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Ajude</span>
                <HeartHandshake aria-hidden className="size-5 text-primary" />
              </div>
              <p className="mt-2 font-display text-6xl leading-none text-primary">
                <span className="align-top text-3xl">R$</span>
                {c.value}
              </p>
              <p className="mt-2 text-sm font-medium text-primary">{c.text}</p>
              <div className="mt-auto flex items-end justify-between gap-3 pt-4">
                <img src={c.img.src} alt={c.img.alt} loading="lazy" className="-ml-2 h-32 w-32 rounded-t-full object-cover" />
                <ButtonLink to={`/doar?valor=${c.value}`} size="sm" arrow className="mb-6" aria-label={`Doar R$ ${c.value}`}>
                  Doar agora
                </ButtonLink>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
