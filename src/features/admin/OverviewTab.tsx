import { useMemo } from 'react';
import { Building2, ClipboardList, Home, PawPrint } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { BarList, ColumnChart } from '@/components/ui/Charts';
import type { Ong, Pet, Solicitation } from '@/schemas';

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function OverviewTab({ ongs, pets, sols }: { ongs: Ong[]; pets: Pet[]; sols: Solicitation[] }) {
  const byMonth = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      return { label: MONTHS[d.getMonth()], value: sols.filter((s) => s.status === 'completed' && s.updatedAt.startsWith(key)).length };
    });
  }, [sols]);
  const byStatus = (['Disponível', 'Em Processo', 'Adotado'] as const).map((s) => ({ label: s, value: pets.filter((p) => p.status === s).length }));
  const review = pets.filter((p) => p.statusPublicacao === 'em_analise').length;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="ONGs ativas" value={ongs.filter((o) => o.status === 'aprovada').length} tone="bg-yellow" icon={<Building2 aria-hidden className="size-5" />} />
        <StatCard label="Pets publicados" value={pets.filter((p) => p.statusPublicacao === 'publicado').length} tone="bg-peach" icon={<PawPrint aria-hidden className="size-5" />} />
        <StatCard label="Aguardando análise" value={review + ongs.filter((o) => o.status === 'pendente').length} tone="bg-blue" icon={<ClipboardList aria-hidden className="size-5" />} />
        <StatCard label="Adoções concluídas" value={sols.filter((s) => s.status === 'completed').length} icon={<Home aria-hidden className="size-5" />} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ColumnChart title="Adoções concluídas por mês (últimos 6 meses)" data={byMonth} unit="adoções" />
        <BarList title="Pets por status de adoção" data={byStatus} unit="pets" />
      </div>
    </div>
  );
}
