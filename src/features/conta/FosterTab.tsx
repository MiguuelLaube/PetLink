import { Mail, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { EmptyState, ErrorState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/dates';
import { FOSTER_LABEL } from '@/lib/status';
import { useMyFoster } from './hooks';

export function FosterTab() {
  const q = useMyFoster();
  if (q.isLoading) return <Skeleton className="h-40" />;
  if (q.isError) return <ErrorState onRetry={() => q.refetch()} />;
  if (!q.data?.length)
    return <EmptyState title="Nenhum relato enviado" text="Encontrou um animal precisando de ajuda? Avise as ONGs parceiras." action={<ButtonLink to="/lar-temporario" arrow>Relatar um resgate</ButtonLink>} />;
  return (
    <ul className="grid gap-4">
      {q.data.map((f) => {
        const st = FOSTER_LABEL[f.status];
        return (
          <li key={f.id} className="rounded-card bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold text-primary">{f.petName}</p>
              <Badge tone={st.tone}>{st.label}</Badge>
              {f.promotedToPetId && <Badge tone="primary">Já está no catálogo</Badge>}
            </div>
            <p className="text-sm text-text-muted">
              {f.species} · {f.size} · {f.city}/{f.state} · enviado em {formatDate(f.createdAt.slice(0, 10))}
            </p>
            <p className="mt-2 text-sm">{f.reason}</p>
            {f.status === 'declined' && f.rejectionReason && (
              <p className="mt-3 rounded-card bg-danger-soft p-3 text-sm text-danger">
                <strong>{f.handledByOngName}:</strong> {f.rejectionReason}
              </p>
            )}
            {f.status === 'accepted' && f.ongContact && (
              <div className="mt-3 rounded-card bg-success-soft p-4 text-sm">
                <p className="font-semibold text-success">{f.handledByOngName} vai acolher. Combine a entrega:</p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                  <li className="flex items-center gap-2"><Phone aria-hidden className="size-4" /> {f.ongContact.phone}</li>
                  <li className="flex items-center gap-2"><Mail aria-hidden className="size-4" /> {f.ongContact.email}</li>
                  <li className="flex items-center gap-2 sm:col-span-2"><MapPin aria-hidden className="size-4" /> {f.ongContact.address}</li>
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
