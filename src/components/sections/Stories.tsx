import { Quote } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal, SectionTitle } from '@/components/ui/Section';
import type { Story } from '@/schemas';

export function Stories({ stories, loading }: { stories?: Story[]; loading: boolean }) {
  if (!loading && !stories?.length) return null;
  return (
    <section aria-labelledby="finais-felizes" className="container-page mt-24">
      <div className="rounded-block bg-peach px-5 py-12 md:px-12">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionTitle id="finais-felizes" script="Cada adoção muda duas vidas">
            Finais felizes
          </SectionTitle>
          <p className="max-w-sm text-sm text-text">
            Histórias enviadas por famílias que adotaram pelo PetLink. A sua pode ser a próxima.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {loading || !stories
            ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-80" />)
            : stories.slice(0, 3).map((s, i) => (
                <Reveal key={s.id} delay={i * 0.08}>
                  <figure className="flex h-full flex-col overflow-hidden rounded-card bg-white shadow-warm">
                    <img src={s.image} alt={`${s.petName} no novo lar`} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-semibold text-primary">{s.title}</h3>
                      <blockquote className="mt-2 flex-1 text-sm text-text">
                        <Quote aria-hidden className="mb-1 size-4 text-orange" />
                        {s.quote}
                      </blockquote>
                      <figcaption className="mt-4 text-xs font-medium text-text-muted">
                        {s.adopterName}, tutor(a) de {s.petName}
                      </figcaption>
                    </div>
                  </figure>
                </Reveal>
              ))}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink to="/sobre#historias" variant="secondary" arrow>
            Ver mais histórias
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
