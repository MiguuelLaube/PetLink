import { useMemo } from 'react';
import { useDocumentMeta } from '@/lib/seo';
import { useAvailablePets, useFavorites, useToggleFavorite } from '@/features/adocao/hooks';
import { useNews, useStories } from '@/features/institucional/hooks';
import { Hero } from '@/components/sections/Hero';
import { Mission } from '@/components/sections/Mission';
import { FeaturedPets } from '@/components/sections/FeaturedPets';
import { HelpCards } from '@/components/sections/HelpCards';
import { Banner } from '@/components/sections/Banner';
import { Stories } from '@/components/sections/Stories';
import { GetInvolved } from '@/components/sections/GetInvolved';
import { News } from '@/components/sections/News';
import { FinalCta } from '@/components/sections/FinalCta';

export default function HomePage() {
  useDocumentMeta({
    title: 'PetLink · Conexão e amor animal',
    description: 'Adote um cão ou gato de ONGs verificadas, ofereça lar temporário ou doe para quem cuida de animais resgatados.',
  });
  const pets = useAvailablePets();
  const stories = useStories();
  const news = useNews();
  const favorites = useFavorites();
  const toggle = useToggleFavorite();

  const available = useMemo(() => pets.data?.filter((p) => p.status === 'Disponível') ?? [], [pets.data]);
  const featured = useMemo(() => [...available].sort((a, b) => b.entryDate.localeCompare(a.entryDate)), [available]);

  return (
    <>
      <Hero featured={featured.find((p) => p.species === 'Gato') ?? featured[0]} stories={stories.data} availableCount={available.length || undefined} />
      <Mission />
      <FeaturedPets
        pets={featured}
        loading={pets.isLoading}
        error={pets.isError}
        onRetry={() => pets.refetch()}
        favorites={favorites}
        onToggleFavorite={(petId, on) => toggle.mutate({ petId, on })}
      />
      <HelpCards />
      <Banner />
      <Stories stories={stories.data} loading={stories.isLoading} />
      <GetInvolved />
      <News items={news.data} loading={news.isLoading} />
      <FinalCta />
    </>
  );
}
