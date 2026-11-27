import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { ReasonModal } from '@/components/ui/ReasonModal';
import { formatDate } from '@/lib/dates';
import { SOLICITATION_LABEL } from '@/lib/status';
import { SOLICITATION_STATUS, type Solicitation } from '@/schemas';
import { ApplicantModal } from './ApplicantModal';
import { useDecideSolicitation } from './hooks';

export function CandidatesTab({ sols }: { sols: Solicitation[] }) {
  const [status, setStatus] = useState('abertos');
  const [pet, setPet] = useState('');
  const [open, setOpen] = useState<Solicitation | null>(null);
  const [rejecting, setRejecting] = useState<Solicitation | null>(null);
  const [completing, setCompleting] = useState<Solicitation | null>(null);
  const decide = useDecideSolicitation();

  const pets = useMemo(() => [...new Map(sols.map((s) => [s.petId, s.petName])).entries()], [sols]);
  const list = sols.filter(
    (s) =>
      (status === 'todos' || (status === 'abertos' ? ['pending', 'in_review', 'approved'].includes(s.status) : s.status === status)) &&
      (!pet || s.petId === pet),
  );

  const actions = (s: Solicitation) => (
    <div className="flex flex-wrap justify-end gap-2">
      {s.status === 'pending' && (
        <Button size="sm" variant="secondary" loading={decide.isPending} onClick={() => decide.mutate({ kind: 'review', sol: s }, { onSuccess: () => setOpen(null) })}>
          Colocar em análise
        </Button>
      )}
      {['pending', 'in_review', 'approved'].includes(s.status) && (
        <Button size="sm" variant="ghost" onClick={() => { setOpen(null); setRejecting(s); }}>Recusar</Button>
      )}
      {['pending', 'in_review'].includes(s.status) && (
        <Button size="sm" loading={decide.isPending} onClick={() => decide.mutate({ kind: 'approve', sol: s }, { onSuccess: () => setOpen(null) })}>
          Aprovar
        </Button>
      )}
      {s.status === 'approved' && (
        <Button size="sm" onClick={() => { setOpen(null); setCompleting(s); }}>Concluir adoção</Button>
      )}
    </div>
  );

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="mr-2 font-semibold text-primary">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3">
            <option value="abertos">Em aberto</option>
            <option value="todos">Todos</option>
            {SOLICITATION_STATUS.map((s) => <option key={s} value={s}>{SOLICITATION_LABEL[s].label}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 font-semibold text-primary">Pet</span>
          <select value={pet} onChange={(e) => setPet(e.target.value)} className="h-10 rounded-full border border-line bg-white px-3">
            <option value="">Todos</option>
            {pets.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
      </div>
      {list.length === 0 ? (
        <EmptyState title="Nenhum candidato aqui" text="Quando alguém enviar o questionário de adoção, o pedido aparece nesta lista." />
      ) : (
        <ul className="grid gap-3">
          {list.map((s) => {
            const st = SOLICITATION_LABEL[s.status];
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-4 rounded-card bg-white p-4 shadow-soft">
                <img src={s.petImage} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-40 flex-1">
                  <p className="font-semibold text-primary">{s.requesterName}</p>
                  <p className="text-xs text-text-muted">Quer adotar {s.petName} · {formatDate(s.createdAt.slice(0, 10))} · {s.housingType}</p>
                </div>
                <Badge tone={st.tone}>{st.label}</Badge>
                <Button size="sm" variant="secondary" onClick={() => setOpen(s)}>Ver ficha</Button>
              </li>
            );
          })}
        </ul>
      )}
      <ApplicantModal sol={open} onClose={() => setOpen(null)} actions={open ? actions(open) : null} />
      <ReasonModal
        open={!!rejecting}
        onClose={() => setRejecting(null)}
        title={`Recusar pedido de ${rejecting?.requesterName ?? ''}`}
        description="O motivo é enviado para a pessoa. Seja gentil e objetivo."
        confirmLabel="Recusar pedido"
        loading={decide.isPending}
        onConfirm={(reason) => rejecting && decide.mutate({ kind: 'reject', sol: rejecting, reason }, { onSuccess: () => setRejecting(null) })}
      />
      <ConfirmModal
        open={!!completing}
        onClose={() => setCompleting(null)}
        title="Concluir adoção?"
        confirmLabel="Concluir adoção"
        loading={decide.isPending}
        onConfirm={() => completing && decide.mutate({ kind: 'complete', sol: completing, all: sols }, { onSuccess: () => setCompleting(null) })}
      >
        <p>
          {completing?.petName} passa a aparecer como <strong>Adotado</strong>, o histórico registra a adoção e os outros pedidos abertos para ele(a) são encerrados com aviso.
        </p>
      </ConfirmModal>
    </>
  );
}
