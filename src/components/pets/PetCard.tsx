import { Link } from 'react-router';
import { Heart, MapPin } from 'lucide-react';
import type { Pet } from '@/schemas';
import { HouseFrame } from '@/components/ui/HouseFrame';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/components/ui/cn';

const TONES = [
  { card: 'bg-white', frame: 'yellow' },
  { card: 'bg-yellow-soft/70', frame: 'peach' },
  { card: 'bg-blue-soft', frame: 'blue' },
  { card: 'bg-peach-soft', frame: 'yellow' },
] as const;

interface Props {
  pet: Pet;
  index?: number;
  favorite: boolean;
  onToggleFavorite: (on: boolean) => void;
  layout?: 'grid' | 'list';
}

export function PetCard({ pet, index = 0, favorite, onToggleFavorite, layout = 'grid' }: Props) {
  const tone = TONES[index % TONES.length];
  return (
    <article
      className={cn(
        'group relative flex rounded-card p-4 shadow-warm transition duration-300 hover:-translate-y-1 hover:shadow-lift',
        tone.card,
        layout === 'grid' ? 'flex-col' : 'flex-row items-center gap-4',
      )}
    >
      <HouseFrame
        src={pet.mainImage}
        alt={`${pet.species === 'Gato' ? (pet.gender === 'Fêmea' ? 'Gata' : 'Gato') : pet.gender === 'Fêmea' ? 'Cadela' : 'Cão'} ${pet.name}, ${pet.color || pet.breed}`}
        tone={tone.frame}
        className={layout === 'grid' ? 'aspect-[4/3] w-full sm:aspect-[4/4.4]' : 'aspect-square w-28 shrink-0 sm:w-36'}
      />
      <div className={cn('flex flex-1 flex-col', layout === 'grid' && 'mt-4')}>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold text-primary">
            <Link to={`/adocao/${pet.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {pet.name}
            </Link>
          </h3>
          <span className="shrink-0 text-xs font-medium text-text-muted">{pet.age}</span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-text-muted">
          <MapPin aria-hidden className="size-3.5" /> {pet.city}, {pet.state}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-text">{pet.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pet.status === 'Em Processo' && <Badge tone="warning">Em processo de adoção</Badge>}
          {pet.specialNeeds && <Badge tone="info">Cuidados especiais</Badge>}
        </div>
        <div className="relative z-10 mt-auto flex items-center justify-between pt-4">
          <Link
            to={`/adocao/${pet.id}`}
            tabIndex={-1}
            aria-hidden
            className="rounded-full border-[1.5px] border-primary px-4 py-1.5 text-sm font-semibold text-primary transition group-hover:bg-primary group-hover:text-cream"
          >
            Adotar
          </Link>
          <button
            type="button"
            onClick={() => onToggleFavorite(!favorite)}
            aria-pressed={favorite}
            aria-label={favorite ? `Remover ${pet.name} dos favoritos` : `Favoritar ${pet.name}`}
            className="grid size-10 place-items-center rounded-full text-primary transition hover:bg-peach"
          >
            <Heart aria-hidden className={cn('size-5 transition', favorite && 'fill-orange text-orange')} />
          </button>
        </div>
      </div>
    </article>
  );
}
