import { AlertTriangle, CheckCircle2, Clock, Minus } from 'lucide-react';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { formatDate } from '@/lib/dates';
import { DOSE_STATUS_LABEL, doseStatus, type DoseStatus } from '@/lib/vaccineStatus';

const TONE: Record<DoseStatus, BadgeTone> = { em_dia: 'success', vence_em_breve: 'warning', atrasada: 'danger', sem_reforco: 'neutral' };
const ICON: Record<DoseStatus, typeof CheckCircle2> = { em_dia: CheckCircle2, vence_em_breve: Clock, atrasada: AlertTriangle, sem_reforco: Minus };

export function DoseBadge({ next }: { next?: string }) {
  const s = doseStatus(next);
  const Icon = ICON[s];
  return (
    <Badge tone={TONE[s]} icon={<Icon aria-hidden className="size-3.5" />}>
      {DOSE_STATUS_LABEL[s]}
    </Badge>
  );
}

interface Row {
  nome: string;
  aplicada: string;
  proximo?: string;
}

/** Tabela de vacinas ou vermifugações com status calculado pela data de hoje. */
export function DoseTable({ caption, rows, emptyText }: { caption: string; rows: Row[]; emptyText: string }) {
  if (!rows.length) return <p className="rounded-card bg-white/60 p-4 text-sm text-text-muted">{emptyText}</p>;
  return (
    <div className="overflow-x-auto rounded-card bg-white shadow-soft">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-peach-soft text-xs uppercase tracking-wider text-primary">
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold">Nome</th>
            <th scope="col" className="px-4 py-3 font-semibold">Aplicada em</th>
            <th scope="col" className="px-4 py-3 font-semibold">Próximo reforço</th>
            <th scope="col" className="px-4 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={`${r.nome}-${r.aplicada}`}>
              <th scope="row" className="px-4 py-3 font-medium text-text">{r.nome}</th>
              <td className="px-4 py-3 text-text-muted">{formatDate(r.aplicada)}</td>
              <td className="px-4 py-3 text-text-muted">{r.proximo ? formatDate(r.proximo) : '—'}</td>
              <td className="px-4 py-3"><DoseBadge next={r.proximo} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
