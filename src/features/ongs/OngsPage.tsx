import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { MapPin, ShieldCheck, Star } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDocumentMeta } from '@/lib/seo';
import { useApprovedOngs } from './hooks';

export function OngsPage() {
  useDocumentMeta({ title: 'ONGs parceiras', description: 'Conheça as ONGs verificadas que cuidam dos animais do PetLink.' });
  const ongs = useApprovedOngs();
  const [uf, setUf] = useState('');
  const states = useMemo(() => [...new Set(ongs.data?.map((o) => o.state))].sort(), [ongs.data]);
  const list = (ongs.data ?? []).filter((o) => !uf || o.state === uf);

  return (
    <>
      <PageHeader title="ONGs parceiras" stamp="Verificadas" script="Quem cuida de verdade">
        Toda ONG passa pela validação do CNPJ antes de publicar animais. Conheça o trabalho de cada uma.
      </PageHeader>
      <div className="container-page">
        {states.length > 1 && (
          <label className="mb-6 inline-flex items-center gap-2 text-sm">
            <span className="font-semibold text-primary">Estado</span>
            <select value={uf} onChange={(e) => setUf(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3">
              <option value="">Todos</option>
              {states.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        )}
        {ongs.isError ? (
          <ErrorState onRetry={() => ongs.refetch()} />
        ) : ongs.isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)}</div>
        ) : !list.length ? (
          <EmptyState title="Nenhuma ONG por aqui" action={<ButtonLink to="/cadastro-ong">Cadastrar minha ONG</ButtonLink>} />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {list.map((o, i) => (
              <li key={o.id} className={`relative flex flex-col rounded-card p-6 shadow-warm transition hover:-translate-y-1 ${['bg-white', 'bg-yellow-soft', 'bg-blue-soft'][i % 3]}`}>
                <div className="flex items-center gap-4">
                  {o.logoUrl && <img src={o.logoUrl} alt="" className="size-16 rounded-full object-cover" loading="lazy" />}
                  <div>
                    <h2 className="font-sans text-lg font-semibold text-primary">
                      <Link to={`/ongs/${o.id}`} className="after:absolute after:inset-0 after:content-['']">{o.name}</Link>
                    </h2>
                    <p className="flex items-center gap-1 text-sm text-text-muted"><MapPin aria-hidden className="size-3.5" /> {o.city}, {o.state}</p>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm">{o.description}</p>
                <p className="mt-auto flex items-center gap-3 pt-4 text-xs font-semibold text-success">
                  <span className="flex items-center gap-1"><ShieldCheck aria-hidden className="size-4" /> CNPJ verificado</span>
                  {o.featured && <span className="flex items-center gap-1 text-warning"><Star aria-hidden className="size-4" /> Destaque</span>}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12 flex flex-col items-start gap-4 rounded-block bg-peach p-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-3xl leading-none text-primary">Sua ONG também pode estar aqui</p>
          <ButtonLink to="/cadastro-ong" arrow>Cadastrar ONG</ButtonLink>
        </div>
      </div>
    </>
  );
}
