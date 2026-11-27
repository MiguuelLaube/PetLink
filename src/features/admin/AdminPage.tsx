import { Building2, FileText, Inbox, LayoutDashboard, LogOut, PawPrint, Users } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/EmptyState';
import { PageLoader } from '@/components/ui/PageLoader';
import { TabPanel, Tabs, useTab } from '@/components/ui/Tabs';
import { useDocumentMeta } from '@/lib/seo';
import { logout } from '@/services/auth';
import { ContentTab } from './ContentTab';
import { InboxTab } from './InboxTab';
import { OngsTab } from './OngsTab';
import { OverviewTab } from './OverviewTab';
import { PetsReviewTab } from './PetsReviewTab';
import { UsersTab } from './UsersTab';
import { useAllOngs, useAllPets, useAllSolicitations, useUsers } from './hooks';

export function AdminPage() {
  useDocumentMeta({ title: 'Administração' });
  const ongs = useAllOngs();
  const pets = useAllPets();
  const sols = useAllSolicitations();
  const users = useUsers();
  const tabs = [
    { id: 'visao-geral', label: 'Visão geral', icon: <LayoutDashboard aria-hidden className="size-4" /> },
    { id: 'pets', label: 'Pets', count: pets.data?.filter((p) => p.statusPublicacao === 'em_analise').length, icon: <PawPrint aria-hidden className="size-4" /> },
    { id: 'ongs', label: 'ONGs', count: ongs.data?.filter((o) => o.status === 'pendente').length, icon: <Building2 aria-hidden className="size-4" /> },
    { id: 'usuarios', label: 'Usuários', icon: <Users aria-hidden className="size-4" /> },
    { id: 'conteudo', label: 'Conteúdo', icon: <FileText aria-hidden className="size-4" /> },
    { id: 'mensagens', label: 'Mensagens', icon: <Inbox aria-hidden className="size-4" /> },
  ];
  const [tab, setTab] = useTab(tabs);
  const loading = ongs.isLoading || pets.isLoading || sols.isLoading || users.isLoading;
  const error = ongs.isError || pets.isError || sols.isError || users.isError;

  return (
    <>
      <PageHeader title="Administração" script="Cuidando de quem cuida">
        Aprove ONGs e fichas, acompanhe os números e mantenha o conteúdo do site em dia.
      </PageHeader>
      <div className="container-page">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs tabs={tabs} current={tab} onSelect={setTab} label="Seções da administração" />
          <Button variant="ghost" size="sm" icon={<LogOut className="size-4" />} onClick={() => logout()}>Sair</Button>
        </div>
        <TabPanel id={tab}>
          {error ? (
            <ErrorState onRetry={() => { ongs.refetch(); pets.refetch(); sols.refetch(); users.refetch(); }} />
          ) : loading ? (
            <PageLoader />
          ) : (
            <>
              {tab === 'visao-geral' && <OverviewTab ongs={ongs.data!} pets={pets.data!} sols={sols.data!} />}
              {tab === 'pets' && <PetsReviewTab pets={pets.data!} ongs={ongs.data!} />}
              {tab === 'ongs' && <OngsTab ongs={ongs.data!} />}
              {tab === 'usuarios' && <UsersTab users={users.data!} />}
              {tab === 'conteudo' && <ContentTab />}
              {tab === 'mensagens' && <InboxTab />}
            </>
          )}
        </TabPanel>
      </div>
    </>
  );
}
