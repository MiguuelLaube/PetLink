import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import type { Partner } from '@/schemas';

export function PartnersCarousel({ partners }: { partners: Partner[] }) {
  const track = useRef<HTMLUListElement>(null);
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  if (!partners.length) return null;
  return (
    <div className="relative">
      <div className="mb-4 flex justify-end gap-2">
        <button type="button" onClick={() => scroll(-1)} aria-label="Parceiros anteriores" className="grid size-10 place-items-center rounded-full bg-white text-primary shadow-soft hover:bg-peach"><ChevronLeft className="size-5" /></button>
        <button type="button" onClick={() => scroll(1)} aria-label="Próximos parceiros" className="grid size-10 place-items-center rounded-full bg-white text-primary shadow-soft hover:bg-peach"><ChevronRight className="size-5" /></button>
      </div>
      <ul ref={track} aria-label="Parceiros" className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4">
        {partners.map((p) => (
          <li key={p.id} className="w-72 shrink-0 snap-start overflow-hidden rounded-card bg-white shadow-warm">
            <img src={p.image} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">{p.category}</p>
              <p className="mt-1 font-semibold text-primary">{p.name}</p>
              <p className="mt-1 text-sm">{p.tagline}</p>
              {p.benefit && <p className="mt-3 rounded-full bg-yellow-soft px-3 py-1 text-xs font-semibold text-primary">{p.benefit}</p>}
              <a href={p.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline">
                Visitar site <ExternalLink aria-hidden className="size-3.5" /><span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
