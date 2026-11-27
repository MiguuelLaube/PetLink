import { Badge } from '@/components/ui/Badge';
import { formatDateTime } from '@/lib/dates';
import { brl } from '@/lib/format';
import { useInbox } from './hooks';

function Section({ title, kind }: { title: string; kind: 'donations' | 'sponsorLeads' | 'contactMessages' }) {
  const q = useInbox(kind);
  return (
    <section className="rounded-card bg-white p-5 shadow-soft">
      <h3 className="font-semibold text-primary">{title}</h3>
      {q.isLoading ? (
        <p className="mt-2 text-sm text-text-muted">Carregando…</p>
      ) : !q.data?.length ? (
        <p className="mt-2 text-sm text-text-muted">Nada por aqui ainda.</p>
      ) : (
        <ul className="mt-3 divide-y divide-line">
          {q.data.map((i) => (
            <li key={i.id} className="py-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{i.name || 'Anônimo'}</span>
                {i.email && <a href={`mailto:${i.email}`} className="text-primary underline">{i.email}</a>}
                {i.amount !== undefined && <Badge tone="success">{brl(i.amount)} · {i.frequency === 'mensal' ? 'mensal' : 'única'} · simulada</Badge>}
                <span className="ml-auto text-xs text-text-muted">{formatDateTime(i.createdAt)}</span>
              </div>
              {i.message && <p className="mt-1 whitespace-pre-line text-text">{i.message}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function InboxTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Section title="Doações (simuladas)" kind="donations" />
      <Section title="Quero ser patrocinador" kind="sponsorLeads" />
      <Section title="Mensagens de contato" kind="contactMessages" />
    </div>
  );
}
