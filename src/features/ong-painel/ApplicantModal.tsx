import { Mail, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/dates';
import { whatsappLink } from '@/lib/format';
import { SOLICITATION_LABEL } from '@/lib/status';
import type { Solicitation } from '@/schemas';
import type { ReactNode } from 'react';

export function ApplicantModal({ sol, onClose, actions }: { sol: Solicitation | null; onClose: () => void; actions: ReactNode }) {
  if (!sol) return null;
  const rows: Array<[string, string]> = [
    ['Moradia', sol.housingType],
    ['Telas e portões seguros', sol.housingSafe],
    ['Outros animais', sol.hasOtherPets],
    ['Crianças ou idosos', sol.hasChildrenOrElderly],
    ['Tempo sozinho por dia', sol.hoursAlone],
    ['Preferência de visita', sol.visitPreference],
    ['Observações', sol.notes || '—'],
    ['Termos e LGPD', sol.acceptTerms && sol.lgpdConsent ? 'Aceitos' : 'Pendentes'],
  ];
  const st = SOLICITATION_LABEL[sol.status];
  return (
    <Modal open onClose={onClose} title={sol.requesterName} description={`Pedido para ${sol.petName} · ${formatDateTime(sol.createdAt)}`} size="lg" footer={actions}>
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone={st.tone}>{st.label}</Badge>
        <a href={`mailto:${sol.email}`} className="flex items-center gap-1.5 text-sm font-semibold text-primary underline"><Mail aria-hidden className="size-4" /> {sol.email}</a>
        <a href={whatsappLink(sol.phone, `Olá, ${sol.requesterName}! Aqui é da ONG sobre o pedido de adoção do(a) ${sol.petName}.`)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-primary underline">
          <Phone aria-hidden className="size-4" /> {sol.phone}
        </a>
      </div>
      <dl className="mt-5 divide-y divide-line rounded-card bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[13rem_1fr]">
            <dt className="text-sm font-semibold text-primary">{k}</dt>
            <dd className="whitespace-pre-line text-sm">{v}</dd>
          </div>
        ))}
      </dl>
      {sol.rejectionReason && <p className="mt-4 rounded-card bg-danger-soft p-3 text-sm text-danger">Motivo da recusa: {sol.rejectionReason}</p>}
    </Modal>
  );
}
