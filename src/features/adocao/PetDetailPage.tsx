import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Heart, MapPin, ShieldCheck } from 'lucide-react';
import { useDocumentMeta } from '@/lib/seo';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/PageLoader';
import { cn } from '@/components/ui/cn';
import { PetGallery } from '@/components/pets/PetGallery';
import { PetFacts } from '@/components/pets/PetFacts';
import { PetHealth } from '@/components/pets/PetHealth';
import { PetTimeline } from '@/components/pets/PetTimeline';
import { AdoptionSteps, ADOPTION_TERMS } from '@/components/pets/AdoptionSteps';
import { AdoptionQuestionnaire } from '@/components/forms/AdoptionQuestionnaire';
import { useAuth } from '@/features/auth/AuthContext';
import { OPEN_STATUSES } from '@/services/solicitations';
import { useCreateSolicitation, useFavorites, useMySolicitations, usePet, usePetHistory, useToggleFavorite } from './hooks';
import type { Pet } from '@/schemas';

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="text-h2 mb-5">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function PetDetailPage() {
  const { id } = useParams();
  const pet = usePet(id);
  if (pet.isLoading) return <PageLoader />;
  if (pet.isError) return <div className="container-page py-16"><ErrorState onRetry={() => pet.refetch()} text="Não foi possível carregar esta ficha." /></div>;
  if (!pet.data)
    return (
      <div className="container-page py-16">
        <EmptyState title="Animal não encontrado" text="A ficha pode ter sido removida ou ainda está em análise." action={<ButtonLink to="/adocao">Ver catálogo</ButtonLink>} />
      </div>
    );
  return <PetDetail pet={pet.data} />;
}

function PetDetail({ pet }: { pet: Pet }) {
  useDocumentMeta({
    title: `${pet.name} para adoção`,
    description: `${pet.name}, ${pet.species.toLowerCase()} ${pet.gender.toLowerCase()} de ${pet.age}, em ${pet.city}/${pet.state}. ${pet.description.slice(0, 110)}`,
    image: pet.mainImage,
    type: 'article',
  });
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const history = usePetHistory(pet.id);
  const favorites = useFavorites();
  const toggle = useToggleFavorite();
  const mine = useMySolicitations();
  const create = useCreateSolicitation(pet);
  const [open, setOpen] = useState(false);

  const fav = favorites.has(pet.id);
  const openRequest = mine.data?.find((s) => s.petId === pet.id && OPEN_STATUSES.includes(s.status));
  const isAdopter = profile?.role === 'user';

  const startAdoption = () => {
    if (!user) return navigate(`/entrar?voltar=${encodeURIComponent(location.pathname)}`);
    setOpen(true);
  };

  return (
    <article className="container-page pt-6">
      <Link to="/adocao" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft aria-hidden className="size-4" /> Voltar para o catálogo
      </Link>

      {pet.statusPublicacao !== 'publicado' && (
        <p role="status" className="mt-4 rounded-card bg-warning-soft p-4 text-sm font-medium text-warning">
          {pet.statusPublicacao === 'em_analise' ? 'Esta ficha está em análise e ainda não aparece no catálogo.' : `Publicação recusada: ${pet.motivoRecusa ?? ''}`}
        </p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        <PetGallery images={[pet.mainImage, ...(pet.galleryImages ?? [])]} name={pet.name} />
        <div>
          <div className="flex flex-wrap gap-2">
            {pet.status === 'Disponível' && <Badge tone="success">Disponível</Badge>}
            {pet.status === 'Em Processo' && <Badge tone="warning">Em processo de adoção</Badge>}
            {pet.status === 'Adotado' && <Badge tone="primary">Adotado</Badge>}
            <Badge>{pet.species}</Badge>
            <Badge>{pet.gender}</Badge>
            <Badge>Porte {pet.size.toLowerCase()}</Badge>
            <Badge>{pet.ageGroup}</Badge>
          </div>
          <h1 className="text-h1 mt-4">{pet.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-text-muted">
            <MapPin aria-hidden className="size-4" /> {pet.city}, {pet.state} · {pet.age} · {pet.breed || 'SRD'}
            {pet.color ? ` · ${pet.color}` : ''}
          </p>
          <p className="mt-5 text-lg text-text">{pet.description}</p>

          <Link to={`/ongs/${pet.ongId}`} className="mt-6 flex items-center gap-3 rounded-card bg-white p-4 shadow-soft transition hover:shadow-warm">
            <ShieldCheck aria-hidden className="size-6 text-success" />
            <span>
              <span className="block text-xs text-text-muted">ONG responsável (verificada)</span>
              <span className="font-semibold text-primary">{pet.ongName}</span>
            </span>
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {pet.status === 'Adotado' ? (
              <p className="font-semibold text-primary">{pet.name} já encontrou uma família.</p>
            ) : openRequest ? (
              <ButtonLink to="/minha-conta?aba=adocoes" variant="secondary" arrow>
                Você já enviou um pedido · acompanhar
              </ButtonLink>
            ) : (
              <Button size="lg" arrow onClick={startAdoption} disabled={!!user && !isAdopter} title={user && !isAdopter ? 'Entre com uma conta de adotante' : undefined}>
                Quero adotar
              </Button>
            )}
            <Button variant="secondary" size="lg" aria-pressed={fav} onClick={() => toggle.mutate({ petId: pet.id, on: !fav })} icon={<Heart className={cn('size-4', fav && 'fill-orange text-orange')} />}>
              {fav ? 'Favoritado' : 'Favoritar'}
            </Button>
          </div>
          {pet.status === 'Em Processo' && !openRequest && (
            <p className="mt-3 text-sm text-text-muted">Já existe uma adoção em andamento, mas você ainda pode enviar seu pedido.</p>
          )}
          {user && !isAdopter && <p className="mt-3 text-sm text-text-muted">Contas de ONG e de administração não enviam pedidos de adoção.</p>}
        </div>
      </div>

      <Block title="Jeito e cuidados" id="jeito">
        <PetFacts pet={pet} />
      </Block>
      <Block title="Saúde" id="saude">
        <PetHealth pet={pet} />
      </Block>
      <Block title="Linha do tempo" id="historico">
        {history.isLoading ? <p className="text-sm text-text-muted">Carregando…</p> : <PetTimeline entries={history.data ?? []} />}
      </Block>
      <Block title="Como é a adoção" id="etapas">
        <AdoptionSteps />
      </Block>
      <Block title="Adoção responsável" id="termos">
        <ul className="grid gap-2 rounded-block bg-peach p-6 text-sm text-text md:grid-cols-2 md:p-8">
          {ADOPTION_TERMS.map((t) => (
            <li key={t} className="flex gap-2">
              <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-orange" />
              {t}
            </li>
          ))}
        </ul>
      </Block>

      {profile && isAdopter && (
        <AdoptionQuestionnaire open={open} onClose={() => setOpen(false)} pet={pet} profile={profile} onSubmit={(d) => create.mutateAsync(d)} />
      )}
    </article>
  );
}
