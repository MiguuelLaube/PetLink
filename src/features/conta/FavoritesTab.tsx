import { PetCard } from '@/components/pets/PetCard';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { useFavorites, usePublishedPets, useToggleFavorite } from '@/features/adocao/hooks';

export function FavoritesTab() {
  const pets = usePublishedPets();
  const favorites = useFavorites();
  const toggle = useToggleFavorite();
  if (pets.isLoading) return <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <PetCardSkeleton key={i} />)}</div>;
  const list = (pets.data ?? []).filter((p) => favorites.has(p.id));
  if (!list.length)
    return <EmptyState title="Nenhum favorito ainda" text="Toque no coração dos animais que chamarem sua atenção para encontrá-los aqui." action={<ButtonLink to="/adocao" arrow>Ver animais</ButtonLink>} />;
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p, i) => (
        <PetCard key={p.id} pet={p} index={i} favorite onToggleFavorite={(on) => toggle.mutate({ petId: p.id, on })} />
      ))}
    </div>
  );
}
