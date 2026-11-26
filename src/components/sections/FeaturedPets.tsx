import { IMAGES } from '@/lib/images';
import { ButtonLink } from '@/components/ui/Button';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/EmptyState';
import { Reveal, SectionTitle } from '@/components/ui/Section';
import { PetCard } from '@/components/pets/PetCard';
import type { Pet } from '@/schemas';

interface Props {
  pets?: Pet[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  favorites: Set<string>;
  onToggleFavorite: (petId: string, on: boolean) => void;
}

export function FeaturedPets({ pets, loading, error, onRetry, favorites, onToggleFavorite }: Props) {
  return (
    <section aria-labelledby="amigos" className="container-page mt-24">
      <div className="relative rounded-block bg-peach px-5 py-12 md:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Reveal className="md:max-w-xl">
            <SectionTitle id="amigos" script="Eles já escolheram você">
              Seus amigos esperam por você
            </SectionTitle>
            <p className="mt-4 max-w-md text-text">
              Eles esperam por um lar quentinho e uma família. Cada patinha tem uma história e todos merecem uma segunda chance.
            </p>
          </Reveal>
          <div className="relative hidden w-56 shrink-0 md:block">
            <img src={IMAGES.waiting.src} alt={IMAGES.waiting.alt} loading="lazy" className="aspect-[4/3] w-full rounded-card object-cover" />
            <span className="absolute -bottom-4 -left-6 rounded-full bg-orange px-4 py-2 text-sm font-semibold text-primary shadow-soft">
              Sonhando com um lar
            </span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {error ? (
            <div className="sm:col-span-2 lg:col-span-4">
              <ErrorState onRetry={onRetry} />
            </div>
          ) : loading || !pets ? (
            Array.from({ length: 4 }, (_, i) => <PetCardSkeleton key={i} />)
          ) : (
            pets.slice(0, 4).map((p, i) => (
              <PetCard key={p.id} pet={p} index={i} favorite={favorites.has(p.id)} onToggleFavorite={(on) => onToggleFavorite(p.id, on)} />
            ))
          )}
        </div>
        <div className="mt-10 flex justify-center">
          <ButtonLink to="/adocao" arrow>
            Ver todos os animais
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
