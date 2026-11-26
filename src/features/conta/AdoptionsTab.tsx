import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button, ButtonLink } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/dates';
import { whatsappLink } from '@/lib/format';
import { SOLICITATION_LABEL } from '@/lib/status';
import { useMySolicitations } from '@/features/adocao/hooks';
import type { Solicitation } from '@/schemas';
import { useCancelSolicitation } from './hooks';

const PROGRESS = ['pending', 'in_review', 'approved', 'completed'] as const;

function Progress({ status }: { status: Solicitation['status'] }) {
  const idx = PROGRESS.indexOf(status as (typeof PROGRESS)[number]);
  if (idx < 0) return null;
  return (
    <ol className="mt-4 grid grid-cols-4 gap-1" aria-label="Andamento do pedido">
      {PROGRESS.map((s, i) => (
        <li key={s} className="text-center">
          <span className={`block h-1.5 rounded-full ${i <= idx ? 'bg-primary' : 'bg-line'}`} />
          <span className={`mt-1 block text-[0.7rem] ${i <= idx ? 'font-semibold text-primary' : 'text-text-muted'}`}>{SOLICITATION_LABEL[s].label}</span>
        </li>
      ))}
    </ol>
  );
}

export function AdoptionsTab() {
  const q = useMySolicitations();
  const cancel = useCancelSolicitation();
  const [confirm, setConfirm] = useState<Solicitation | null>(null);

  if (q.isLoading) return <div className="grid gap-4">{[0, 1].map((i) => <Skeleton key={i} className="h-40" />)}</div>;
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (!q.data?.length)
    return <EmptyState title="Nenhum pedido ainda" text="Quando você enviar um questionário de adoção, o andamento aparece aqui." action={<ButtonLink to="/adocao" arrow>Ver animais</ButtonLink>} />;

  return (
    <>
      <ul className="grid gap-4">
        {q.data.map((s) => {
          const st = SOLICITATION_LABEL[s.status];
          return (
            <li key={s.id} className="rounded-card bg-white p-5 shadow-soft">
              <div className="flex flex-wrap items-start gap-4">
                <img src={s.petImage} alt="" className="size-20 rounded-card object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/adocao/${s.petId}`} className="text-lg font-semibold text-primary hover:underline">
                      {s.petName}
                    </Link>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <p className="text-sm text-text-muted">
                    {s.ongName} · enviado em {formatDate(s.createdAt.slice(0, 10))}
                  </p>
                </div>
                {['pending', 'in_review', 'approved'].includes(s.status) && (
                  <Button variant="ghost" size="sm" onClick={() => setConfirm(s)}>
                    Cancelar pedido
                  </Button>
                )}
              </div>
              <Progress status={s.status} />
              {s.status === 'rejected' && s.rejectionReason && (
                <p className="mt-4 rounded-card bg-danger-soft p-3 text-sm text-danger">
                  <strong>Motivo informado pela ONG:</strong> {s.rejectionReason}
                </p>
              )}
              {(s.status === 'approved' || s.status === 'completed') && s.ongContact && (
                <div className="mt-4 rounded-card bg-success-soft p-4 text-sm text-success">
                  <p className="font-semibold">Contato da {s.ongName}</p>
                  <ul className="mt-2 grid gap-1.5 text-text sm:grid-cols-2">
                    <li className="flex items-center gap-2"><Phone aria-hidden className="size-4" /> {s.ongContact.phone}</li>
                    <li className="flex items-center gap-2"><Mail aria-hidden className="size-4" /> <a className="underline" href={`mailto:${s.ongContact.email}`}>{s.ongContact.email}</a></li>
                    <li className="flex items-center gap-2 sm:col-span-2"><MapPin aria-hidden className="size-4" /> {s.ongContact.address}</li>
                  </ul>
                  <a
                    href={whatsappLink(s.ongContact.phone, `Olá! Meu pedido de adoção do(a) ${s.petName} foi aprovado pelo PetLink. Podemos combinar a visita?`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 font-semibold text-white"
                  >
                    <MessageCircle aria-hidden className="size-4" /> Conversar no WhatsApp
                  </a>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Cancelar pedido?"
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setConfirm(null)}>Voltar</Button>
            <Button variant="danger" loading={cancel.isPending} onClick={() => confirm && cancel.mutate(confirm, { onSuccess: () => setConfirm(null) })}>
              Sim, cancelar
            </Button>
          </div>
        }
      >
        <p>O pedido de adoção de {confirm?.petName} será encerrado e a ONG será avisada. Essa ação não pode ser desfeita.</p>
      </Modal>
    </>
  );
}
