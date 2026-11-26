import { useState } from 'react';
import { Link } from 'react-router';
import { Play } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';
import { HouseFrame } from '@/components/ui/HouseFrame';
import { PawBackground } from '@/components/ui/PawBackground';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Pet, Story } from '@/schemas';
import { HowItWorksModal } from './HowItWorksModal';

interface Props {
  featured?: Pet;
  stories?: Story[];
  availableCount?: number;
}

export function Hero({ featured, stories = [], availableCount }: Props) {
  const [howOpen, setHowOpen] = useState(false);
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-10 pt-6 md:pt-10">
      <PawBackground />
      <div className="container-page relative grid items-end gap-6 lg:grid-cols-[0.8fr_1.1fr_1.3fr]">
        {/* Card flutuante do pet em destaque */}
        <div className="order-2 flex items-end gap-4 lg:order-1 lg:flex-col lg:items-start">
          {featured ? (
            <Link
              to={`/adocao/${featured.id}`}
              className="w-40 rotate-[-3deg] rounded-card bg-white p-3 shadow-warm transition hover:rotate-0 sm:w-44"
            >
              <HouseFrame src={featured.mainImage} alt={`${featured.name}, em destaque para adoção`} tone="yellow" className="aspect-square w-full" eager />
              <p className="mt-2 font-semibold text-primary">{featured.name}</p>
              <p className="text-xs text-text-muted">{featured.age}</p>
            </Link>
          ) : (
            <Skeleton className="h-56 w-40" />
          )}
          {stories.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {stories.slice(0, 3).map((s) => (
                  <img key={s.id} src={s.image} alt="" className="size-10 rounded-full border-2 border-bg object-cover" loading="lazy" />
                ))}
              </div>
              <p className="text-xs font-medium leading-tight text-text">
                Histórias de
                <br />
                quem já adotou
              </p>
            </div>
          )}
        </div>

        {/* Gato saindo da moldura */}
        <div className="relative order-1 mx-auto w-full max-w-sm lg:order-2 lg:-mb-16 lg:max-w-none">
          <HouseFrame src={IMAGES.heroCat.src} alt={IMAGES.heroCat.alt} tone="peach" className="aspect-[9/10] w-full" eager />
        </div>

        {/* Título gigante */}
        <div className="order-0 lg:order-3 lg:pb-16">
          <h1 id="hero-title" className="text-display">
            Pet
            <br />
            Link
          </h1>
          <p className="mt-4 max-w-sm text-text">
            Cada cão e gato aqui tem uma história e espera uma segunda chance. Conectamos você a ONGs verificadas para uma adoção
            responsável, do primeiro clique ao acompanhamento.
          </p>
        </div>
      </div>

      {/* Barra amarela */}
      <div className="container-page relative mt-8 lg:mt-0">
        <div className="grid items-center gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col items-start gap-4 rounded-block bg-yellow px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[16rem] font-semibold leading-snug text-primary">
              Os olhos dele procuram um lar.
              {availableCount ? <span className="block text-sm font-medium">{availableCount} animais esperando agora</span> : null}
            </p>
            <button
              type="button"
              onClick={() => setHowOpen(true)}
              className="group flex items-center gap-3 font-semibold text-primary"
            >
              <span className="grid size-12 place-items-center rounded-full bg-primary text-cream transition group-hover:scale-105">
                <Play aria-hidden className="size-5 fill-cream" />
              </span>
              Como funciona
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-3xl leading-none text-primary sm:text-4xl">
              Encontre seu
              <br />
              match perfeito
            </p>
            <ButtonLink to="/adocao" arrow>
              Encontrar meu pet
            </ButtonLink>
          </div>
        </div>
      </div>
      <HowItWorksModal open={howOpen} onClose={() => setHowOpen(false)} />
    </section>
  );
}
