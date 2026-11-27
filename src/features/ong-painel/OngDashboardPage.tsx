import { AlertTriangle, ClipboardList, Home, LayoutDashboard, LogOut, PawPrint, Settings, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/PageLoader';
import { TabPanel, Tabs, useTab } from '@/components/ui/Tabs';
import { AccountSecurity } from '@/components/forms/AccountSecurity';
import { ONG_STATUS_LABEL } from '@/lib/status';
import { useDocumentMeta } from '@/lib/seo';
import { logout } from '@/services/auth';
import { useAuth } from '@/features/auth/AuthContext';
import { CandidatesTab } from './CandidatesTab';
import { FosterRequestsTab } from './FosterRequestsTab';
import { OverviewTab } from './OverviewTab';
import { PetsTab } from './PetsTab';
import { ProfileTab } from './ProfileTab';
import { useOngFoster, useOngPets, useOngSolicitations } from './hooks';

export function OngDashboardPage() {
  useDocumentMeta({ title: 'Painel da ONG' });
  const { ong, profile } = useAuth();
  const pets = useOngPets();
  const sols = useOngSolicitations();
  const foster = useOngFoster();
  const pendingSols = sols.data?.filter((s) => s.status === 'pending').length;
  const pendingFoster = foster.data?.filter((f) => f.status === 'pending').length;
  const tabs = [
    { id: 'visao-geral', label: 'Visão geral', icon: <LayoutDashboard aria-hidden className="size-4" /> },
    { id: 'pets', label: 'Pets', icon: <PawPrint aria-hidden className="size-4" /> },
    { id: 'candidatos', label: 'Candidatos', count: pendingSols, icon: <ClipboardList aria-hidden className="size-4" /> },
    { id: 'lar-temporario', label: 'Lar temporário', count: pendingFoster, icon: <Home aria-hidden className="size-4" /> },
    { id: 'perfil', label: 'Perfil da ONG', icon: <Settings aria-hidden className="size-4" /> },
    { id: 'conta', label: 'Conta', icon: <UserCog aria-hidden className="size-4" /> },
  ];
  const [tab, setTab] = useTab(tabs);

  if (!ong || !profile) return <PageLoader />;
  const st = ONG_STATUS_LABEL[ong.status];

  return (
    <>
      <PageHeader title={ong.name} script="Painel da ONG">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone={st.tone}>{st.label}</Badge>
          <span className="text-sm text-text-muted">{ong.city}/{ong.state} · CNPJ {ong.cnpj}</span>
        </div>
      </PageHeader>
      <div className="container-page">
        {ong.status !== 'aprovada' && (
          <p role="status" className="mb-6 flex gap-3 rounded-card bg-warning-soft p-4 text-sm text-warning">
            <AlertTriangle aria-hidden className="size-5 shrink-0" />
            {ong.status === 'pendente'
              ? 'Seu cadastro está em validação. Você já pode cadastrar pets; eles serão publicados depois da aprovação da ONG.'
              : `Cadastro recusado${ong.motivoRecusa ? `: ${ong.motivoRecusa}` : ''}. Fale com a equipe PetLink pelo contato.`}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs tabs={tabs} current={tab} onSelect={setTab} label="Seções do painel" />
          <Button variant="ghost" size="sm" icon={<LogOut className="size-4" />} onClick={() => logout()}>Sair</Button>
        </div>
        <TabPanel id={tab}>
          {pets.isError || sols.isError ? (
            <ErrorState onRetry={() => { pets.refetch(); sols.refetch(); }} />
          ) : pets.isLoading || sols.isLoading ? (
            <PageLoader />
          ) : (
            <>
              {tab === 'visao-geral' && <OverviewTab pets={pets.data ?? []} sols={sols.data ?? []} onGo={setTab} />}
              {tab === 'pets' && <PetsTab pets={pets.data ?? []} ong={ong} />}
              {tab === 'candidatos' && <CandidatesTab sols={sols.data ?? []} />}
              {tab === 'lar-temporario' && <FosterRequestsTab items={foster.data ?? []} ong={ong} />}
              {tab === 'perfil' && <ProfileTab ong={ong} />}
              {tab === 'conta' && <AccountSecurity profile={profile} />}
            </>
          )}
        </TabPanel>
      </div>
    </>
  );
}
