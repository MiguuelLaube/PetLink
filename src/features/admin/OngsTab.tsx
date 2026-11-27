import { useState } from 'react';
import { CheckCircle2, Star, XCircle } from 'lucide-react';
import type { Ong } from '@/schemas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReasonModal } from '@/components/ui/ReasonModal';
import { isValidCnpj } from '@/lib/cnpj';
import { formatDate } from '@/lib/dates';
import { ONG_STATUS_LABEL } from '@/lib/status';
import { cn } from '@/components/ui/cn';
import { useSetOngStatus, useToggleFeatured } from './hooks';

export function OngsTab({ ongs }: { ongs: Ong[] }) {
  const setStatus = useSetOngStatus();
  const feature = useToggleFeatured();
  const [refusing, setRefusing] = useState<Ong | null>(null);
  const sorted = [...ongs].sort((a, b) => Number(b.status === 'pendente') - Number(a.status === 'pendente'));
  return (
    <>
      <ul className="grid gap-3">
        {sorted.map((o) => {
          const st = ONG_STATUS_LABEL[o.status];
          const cnpjOk = isValidCnpj(o.cnpj);
          return (
            <li key={o.id} className="flex flex-wrap items-center gap-4 rounded-card bg-white p-4 shadow-soft">
              {o.logoUrl ? <img src={o.logoUrl} alt="" className="size-14 rounded-full object-cover" /> : <span className="size-14 rounded-full bg-peach" />}
              <div className="min-w-56 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-primary">{o.name}</p>
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
                <p className="text-xs text-text-muted">{o.city}/{o.state} · {o.email} · desde {formatDate(o.createdAt.slice(0, 10))}</p>
                <p className={cn('mt-1 flex items-center gap-1 text-xs font-medium', cnpjOk ? 'text-success' : 'text-danger')}>
                  {cnpjOk ? <CheckCircle2 aria-hidden className="size-3.5" /> : <XCircle aria-hidden className="size-3.5" />}
                  CNPJ {o.cnpj} {cnpjOk ? '(dígitos válidos)' : '(dígitos inválidos)'}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {o.status === 'aprovada' && (
                  <Button size="sm" variant="secondary" aria-pressed={o.featured} icon={<Star className={cn('size-4', o.featured && 'fill-orange text-orange')} />} onClick={() => feature.mutate({ id: o.id, on: !o.featured })}>
                    {o.featured ? 'Em destaque' : 'Destacar'}
                  </Button>
                )}
                {o.status !== 'recusada' && <Button size="sm" variant="ghost" onClick={() => setRefusing(o)}>{o.status === 'aprovada' ? 'Suspender' : 'Recusar'}</Button>}
                {o.status !== 'aprovada' && (
                  <Button size="sm" disabled={!cnpjOk} loading={setStatus.isPending && setStatus.variables?.id === o.id} onClick={() => setStatus.mutate({ id: o.id, status: 'aprovada' })}>
                    Aprovar
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <ReasonModal
        open={!!refusing}
        onClose={() => setRefusing(null)}
        title={`Recusar ${refusing?.name ?? ''}`}
        description="A ONG vê o motivo no painel."
        confirmLabel="Confirmar"
        loading={setStatus.isPending}
        onConfirm={(reason) => refusing && setStatus.mutate({ id: refusing.id, status: 'recusada', reason }, { onSuccess: () => setRefusing(null) })}
      />
    </>
  );
}
