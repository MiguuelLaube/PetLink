import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReasonModal } from '@/components/ui/ReasonModal';
import { PetForm } from '@/components/forms/pet/PetForm';
import { formatDate } from '@/lib/dates';
import { FOSTER_LABEL } from '@/lib/status';
import type { FosterRequest, Ong } from '@/schemas';
import { useDecideFoster, useSavePet } from './hooks';

export function FosterRequestsTab({ items, ong }: { items: FosterRequest[]; ong: Ong }) {
  const decide = useDecideFoster();
  const save = useSavePet();
  const [accepting, setAccepting] = useState<FosterRequest | null>(null);
  const [declining, setDeclining] = useState<FosterRequest | null>(null);
  const [promoting, setPromoting] = useState<FosterRequest | null>(null);

  if (ong.status !== 'aprovada')
    return <EmptyState title="Disponível após a validação" text="Os relatos de resgate aparecem aqui assim que a equipe PetLink aprovar o cadastro da ONG." />;
  if (!items.length) return <EmptyState title="Nenhum relato no momento" text="Quando alguém relatar um animal precisando de lar temporário, ele aparece aqui." />;

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((f) => {
          const st = FOSTER_LABEL[f.status];
          return (
            <li key={f.id} className="flex flex-col rounded-card bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-semibold text-primary">{f.petName}</p>
                <Badge tone={st.tone}>{st.label}</Badge>
                {f.promotedToPetId && <Badge tone="primary">Virou ficha</Badge>}
              </div>
              <p className="text-xs text-text-muted">
                {f.species} · {f.size} · {f.city}/{f.state} · {formatDate(f.createdAt.slice(0, 10))}
              </p>
              {f.photoUrls.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {f.photoUrls.map((u) => <img key={u} src={u} alt={`Foto de ${f.petName}`} className="size-16 rounded-xl object-cover" />)}
                </div>
              )}
              <p className="mt-3 text-sm">{f.reason}</p>
              <p className="mt-2 text-xs text-text-muted">
                Relatado por {f.requesterName}{f.status !== 'pending' ? ` · ${f.phone} · ${f.requesterEmail}` : ''}
              </p>
              <div className="mt-auto flex flex-wrap justify-end gap-2 pt-4">
                {f.status === 'pending' && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setDeclining(f)}>Não posso acolher</Button>
                    <Button size="sm" onClick={() => setAccepting(f)}>Aceitar acolhimento</Button>
                  </>
                )}
                {f.status === 'accepted' && f.handledByOngId === ong.id && !f.promotedToPetId && (
                  <Button size="sm" arrow onClick={() => setPromoting(f)}>Promover a pet</Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <ConfirmModal
        open={!!accepting}
        onClose={() => setAccepting(null)}
        title={`Acolher ${accepting?.petName ?? ''}?`}
        confirmLabel="Aceitar"
        loading={decide.isPending}
        onConfirm={() => accepting && decide.mutate({ req: accepting, accept: true }, { onSuccess: () => setAccepting(null) })}
      >
        <p>A pessoa recebe o contato da {ong.name} para combinar a entrega. Depois você pode transformar o relato em uma ficha de adoção.</p>
      </ConfirmModal>
      <ReasonModal
        open={!!declining}
        onClose={() => setDeclining(null)}
        title="Recusar acolhimento"
        description="O motivo é enviado para quem relatou o resgate."
        confirmLabel="Recusar"
        loading={decide.isPending}
        onConfirm={(reason) => declining && decide.mutate({ req: declining, accept: false, reason }, { onSuccess: () => setDeclining(null) })}
      />
      {promoting && (
        <PetForm
          open
          title={`Nova ficha: ${promoting.petName}`}
          onClose={() => setPromoting(null)}
          initial={{ name: promoting.petName, species: promoting.species, size: promoting.size, city: promoting.city, state: promoting.state, description: promoting.reason }}
          initialPhotos={promoting.photoUrls}
          saving={save.isPending}
          onSave={(r) => save.mutateAsync({ ...r, originFosterId: promoting.id })}
        />
      )}
    </>
  );
}
