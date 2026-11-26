import { CheckCircle2, ClipboardList, Heart, Home, PencilLine, ShieldCheck, Stethoscope, XCircle } from 'lucide-react';
import { formatDateTime } from '@/lib/dates';
import type { HistoryEntry, HistoryType } from '@/schemas';

const ICONS: Record<HistoryType, typeof Heart> = {
  triagem_acolhimento: Stethoscope,
  cadastro_ong: ClipboardList,
  publicacao: ShieldCheck,
  solicitacao_adocao: Heart,
  adocao_aprovada: CheckCircle2,
  adocao_negada: XCircle,
  adocao_concluida: Home,
  adocao_cancelada: XCircle,
  edicao_dados: PencilLine,
};

export function PetTimeline({ entries }: { entries: HistoryEntry[] }) {
  if (!entries.length) return <p className="text-sm text-text-muted">Ainda não há registros.</p>;
  return (
    <ol className="relative ml-4 border-l-2 border-dashed border-line">
      {entries.map((e) => {
        const Icon = ICONS[e.type] ?? ClipboardList;
        return (
          <li key={e.id} className="relative mb-6 pl-8 last:mb-0">
            <span aria-hidden className="absolute -left-[17px] top-0 grid size-8 place-items-center rounded-full bg-peach text-primary ring-4 ring-bg">
              <Icon className="size-4" />
            </span>
            <p className="font-semibold text-primary">{e.title}</p>
            <p className="text-sm text-text">{e.description}</p>
            <p className="mt-1 text-xs text-text-muted">
              <time dateTime={e.date}>{formatDateTime(e.date)}</time> · {e.actorName}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
