import { useState } from 'react';
import { Link } from 'react-router';
import { AlertTriangle } from 'lucide-react';
import { PUBLICATION_STATUS, type Ong, type Pet } from '@/schemas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReasonModal } from '@/components/ui/ReasonModal';
import { formatDate } from '@/lib/dates';
import { PUBLICATION_LABEL } from '@/lib/status';
import { useReviewPet } from './hooks';

export function PetsReviewTab({ pets, ongs }: { pets: Pet[]; ongs: Ong[] }) {
  const [filter, setFilter] = useState<string>('em_analise');
  const [refusing, setRefusing] = useState<Pet | null>(null);
  const review = useReviewPet();
  const ongStatus = new Map(ongs.map((o) => [o.id, o.status]));
  const list = pets.filter((p) => filter === 'todos' || p.statusPublicacao === filter);

  return (
    <>
      <label className="mb-5 inline-flex items-center gap-2 text-sm">
        <span className="font-semibold text-primary">Mostrar</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3">
          {PUBLICATION_STATUS.map((s) => <option key={s} value={s}>{PUBLICATION_LABEL[s].label}</option>)}
          <option value="todos">Todos</option>
        </select>
      </label>
      {list.length === 0 ? (
        <EmptyState title="Fila vazia" text="Nenhum pet com esse status agora." />
      ) : (
        <ul className="grid gap-3">
          {list.map((p) => {
            const pub = PUBLICATION_LABEL[p.statusPublicacao];
            const ongOk = ongStatus.get(p.ongId) === 'aprovada';
            return (
              <li key={p.id} className="flex flex-wrap items-center gap-4 rounded-card bg-white p-4 shadow-soft">
                <img src={p.mainImage} alt="" className="size-16 rounded-xl object-cover" />
                <div className="min-w-48 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/adocao/${p.id}`} target="_blank" className="font-semibold text-primary hover:underline">{p.name}</Link>
                    <Badge tone={pub.tone}>{pub.label}</Badge>
                  </div>
                  <p className="text-xs text-text-muted">{p.ongName} · {p.species} · atualizado em {formatDate(p.updatedAt.slice(0, 10))}</p>
                  {!ongOk && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-warning">
                      <AlertTriangle aria-hidden className="size-3.5" /> A ONG ainda não foi aprovada.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {p.statusPublicacao !== 'recusado' && <Button size="sm" variant="ghost" onClick={() => setRefusing(p)}>Recusar</Button>}
                  {p.statusPublicacao !== 'publicado' && (
                    <Button size="sm" disabled={!ongOk} loading={review.isPending && review.variables?.id === p.id} onClick={() => review.mutate({ id: p.id, decision: 'publicado' })}>
                      Publicar
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <ReasonModal
        open={!!refusing}
        onClose={() => setRefusing(null)}
        title={`Recusar publicação de ${refusing?.name ?? ''}`}
        description="A ONG vê o motivo e pode corrigir a ficha."
        confirmLabel="Recusar publicação"
        loading={review.isPending}
        onConfirm={(reason) => refusing && review.mutate({ id: refusing.id, decision: 'recusado', reason }, { onSuccess: () => setRefusing(null) })}
      />
    </>
  );
}
