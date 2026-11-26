import { Bell, ClipboardList, Heart, HomeIcon, LogOut, UserCog } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { TabPanel, Tabs, useTab } from '@/components/ui/Tabs';
import { AccountSecurity } from '@/components/forms/AccountSecurity';
import { formatDateTime } from '@/lib/dates';
import { firstName } from '@/lib/format';
import { useDocumentMeta } from '@/lib/seo';
import { logout } from '@/services/auth';
import { useAuth } from '@/features/auth/AuthContext';
import { AdoptionsTab } from './AdoptionsTab';
import { FavoritesTab } from './FavoritesTab';
import { FosterTab } from './FosterTab';
import { useMarkRead, useNotifications } from './hooks';

export function AccountPage() {
  useDocumentMeta({ title: 'Minha conta' });
  const { profile } = useAuth();
  const notes = useNotifications();
  const markRead = useMarkRead();
  const unread = notes.data?.filter((n) => !n.read) ?? [];
  const tabs = [
    { id: 'adocoes', label: 'Minhas adoções', icon: <ClipboardList aria-hidden className="size-4" /> },
    { id: 'favoritos', label: 'Favoritos', icon: <Heart aria-hidden className="size-4" /> },
    { id: 'lar-temporario', label: 'Lar temporário', icon: <HomeIcon aria-hidden className="size-4" /> },
    { id: 'dados', label: 'Dados e segurança', icon: <UserCog aria-hidden className="size-4" /> },
  ];
  const [tab, setTab] = useTab(tabs);
  if (!profile) return null;

  return (
    <>
      <PageHeader title={`Olá, ${firstName(profile.name)}`} script="Que bom ter você por aqui">
        Acompanhe seus pedidos, seus favoritos e os relatos de resgate que você enviou.
      </PageHeader>
      <div className="container-page">
        {unread.length > 0 && (
          <section aria-labelledby="avisos" className="mb-8 rounded-block bg-yellow-soft p-5">
            <h2 id="avisos" className="flex items-center gap-2 font-sans text-base font-semibold text-primary">
              <Bell aria-hidden className="size-5" /> Avisos novos ({unread.length})
            </h2>
            <ul className="mt-3 grid gap-2" aria-live="polite">
              {unread.map((n) => (
                <li key={n.id} className="flex flex-wrap items-start justify-between gap-3 rounded-card bg-white p-4">
                  <div>
                    <p className="font-semibold text-primary">{n.title}</p>
                    <p className="text-sm">{n.message}</p>
                    <p className="mt-1 text-xs text-text-muted">{formatDateTime(n.createdAt)}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => markRead.mutate(n.id)}>
                    Marcar como lido
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs tabs={tabs} current={tab} onSelect={setTab} label="Seções da conta" />
          <Button variant="ghost" size="sm" icon={<LogOut className="size-4" />} onClick={() => logout()}>
            Sair
          </Button>
        </div>
        <TabPanel id={tab}>
          {tab === 'adocoes' && <AdoptionsTab />}
          {tab === 'favoritos' && <FavoritesTab />}
          {tab === 'lar-temporario' && <FosterTab />}
          {tab === 'dados' && <AccountSecurity profile={profile} />}
        </TabPanel>
      </div>
    </>
  );
}
