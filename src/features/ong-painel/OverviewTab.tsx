import { ClipboardList, Clock, Heart, Home, PawPrint } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { formatDate } from '@/lib/dates';
import { SOLICITATION_LABEL } from '@/lib/status';
import type { Pet, Solicitation } from '@/schemas';

export function OverviewTab({ pets, sols, onGo }: { pets: Pet[]; sols: Solicitation[]; onGo: (tab: string) => void }) {
  const count = (s: Pet['status']) => pets.filter((p) => p.status === s).length;
  const fresh = sols.filter((s) => s.status === 'pending');
  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Disponíveis" value={count('Disponível')} tone="bg-yellow" icon={<PawPrint aria-hidden className="size-5" />} />
        <StatCard label="Em processo" value={count('Em Processo')} tone="bg-peach" icon={<Clock aria-hidden className="size-5" />} />
        <StatCard label="Adotados" value={count('Adotado')} tone="bg-blue" icon={<Home aria-hidden className="size-5" />} />
        <StatCard label="Em análise" value={pets.filter((p) => p.statusPublicacao === 'em_analise').length} icon={<ClipboardList aria-hidden className="size-5" />} />
        <StatCard label="Pedidos novos" value={fresh.length} tone="bg-white" icon={<Heart aria-hidden className="size-5" />} />
      </div>
      <section aria-labelledby="novos-pedidos">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="novos-pedidos" className="text-h2">Pedidos novos</h2>
          <Button variant="secondary" size="sm" arrow onClick={() => onGo('candidatos')}>Ver candidatos</Button>
        </div>
        {fresh.length === 0 ? (
          <p className="rounded-card bg-white/70 p-5 text-text-muted">Nenhum pedido novo por enquanto.</p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {fresh.slice(0, 6).map((s) => (
              <li key={s.id} className="flex items-center gap-3 rounded-card bg-white p-4 shadow-soft">
                <img src={s.petImage} alt="" className="size-14 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-primary">{s.requesterName} → {s.petName}</p>
                  <p className="text-xs text-text-muted">{formatDate(s.createdAt.slice(0, 10))} · {s.housingType}</p>
                </div>
                <Badge tone={SOLICITATION_LABEL[s.status].tone}>{SOLICITATION_LABEL[s.status].label}</Badge>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
