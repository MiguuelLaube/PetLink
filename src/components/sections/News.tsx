import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/dates';
import { Skeleton } from '@/components/ui/Skeleton';
import { Reveal, SectionTitle } from '@/components/ui/Section';
import { cn } from '@/components/ui/cn';
import type { NewsItem } from '@/schemas';

const TONES = ['bg-yellow', 'bg-peach', 'bg-blue'];

export function News({ items, loading }: { items?: NewsItem[]; loading: boolean }) {
  if (!loading && !items?.length) return null;
  return (
    <section aria-labelledby="novidades" className="container-page mt-24">
      <SectionTitle id="novidades" script="Fique por dentro">
        Novidades
      </SectionTitle>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {loading || !items
          ? Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-80" />)
          : items.slice(0, 3).map((n, i) => (
              <Reveal key={n.id} delay={i * 0.08}>
                <article className={cn('group relative flex h-full flex-col overflow-hidden rounded-card shadow-warm', TONES[i % 3])}>
                  <div className="p-5">
                    <p className="text-xs font-semibold text-primary">
                      <time dateTime={n.date}>{formatDate(n.date)}</time> · {n.tag}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold leading-snug text-primary">
                      <Link to={`/noticias/${n.id}`} className="after:absolute after:inset-0 after:content-['']">
                        {n.title}
                      </Link>
                    </h3>
                  </div>
                  <img src={n.image} alt="" loading="lazy" className="mt-auto aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-cream">
                    Ler mais <ArrowRight aria-hidden className="size-3.5" />
                  </span>
                </article>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
