import { useParams } from 'react-router';
import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/PageLoader';
import { PetCardSkeleton } from '@/components/ui/Skeleton';
import { PetCard } from '@/components/pets/PetCard';
import { useDocumentMeta } from '@/lib/seo';
import { whatsappLink } from '@/lib/format';
import { useFavorites, useToggleFavorite } from '@/features/adocao/hooks';
import { useOng, useOngPublicPets } from './hooks';

export function OngProfilePage() {
  const { id } = useParams();
  const ong = useOng(id);
  const pets = useOngPublicPets(id);
  const favorites = useFavorites();
  const toggle = useToggleFavorite();
  useDocumentMeta({ title: ong.data?.name ?? 'ONG', description: ong.data?.description, image: ong.data?.logoUrl || undefined });

  if (ong.isLoading) return <PageLoader />;
  if (!ong.data || ong.isError)
    return <div className="container-page py-16"><EmptyState title="ONG não encontrada" action={<ButtonLink to="/ongs">Ver ONGs</ButtonLink>} /></div>;
  const o = ong.data;
  const available = (pets.data ?? []).filter((p) => p.status !== 'Adotado');
  const adopted = (pets.data ?? []).length - available.length;

  return (
    <>
      <PageHeader title={o.name} script={`${o.city}, ${o.state}`}>{o.description}</PageHeader>
      <div className="container-page">
        <div className="grid gap-4 rounded-block bg-white/80 p-6 shadow-soft md:grid-cols-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-success"><ShieldCheck aria-hidden className="size-5" /> CNPJ {o.cnpj}</p>
          <p className="flex items-center gap-2 text-sm"><MapPin aria-hidden className="size-4 text-primary" /> {o.address}</p>
          <a href={whatsappLink(o.phone, 'Olá! Vi a ONG no PetLink.')} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary underline"><Phone aria-hidden className="size-4" /> {o.phone}</a>
          <a href={`mailto:${o.email}`} className="flex items-center gap-2 text-sm text-primary underline"><Mail aria-hidden className="size-4" /> {o.email}</a>
        </div>
        <h2 className="text-h2 mt-12">Esperando um lar ({available.length})</h2>
        {adopted > 0 && <p className="mt-1 text-sm text-text-muted">{adopted} já {adopted === 1 ? 'foi adotado' : 'foram adotados'} pelo PetLink.</p>}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pets.isLoading
            ? [0, 1, 2, 3].map((i) => <PetCardSkeleton key={i} />)
            : available.map((p, i) => <PetCard key={p.id} pet={p} index={i} favorite={favorites.has(p.id)} onToggleFavorite={(on) => toggle.mutate({ petId: p.id, on })} />)}
        </div>
        {!pets.isLoading && !available.length && <EmptyState title="Todos já encontraram família" text="Volte em breve: novos resgatados chegam toda semana." />}
      </div>
    </>
  );
}
