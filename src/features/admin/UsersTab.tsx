import { useState } from 'react';
import type { UserProfile } from '@/schemas';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { formatDate } from '@/lib/dates';
import { useAuth } from '@/features/auth/AuthContext';
import { useSetUserActive } from './hooks';

const ROLE = { user: 'Adotante', ong: 'ONG', admin: 'Admin' } as const;

export function UsersTab({ users }: { users: UserProfile[] }) {
  const { user: me } = useAuth();
  const toggle = useSetUserActive();
  const [q, setQ] = useState('');
  const [target, setTarget] = useState<UserProfile | null>(null);
  const list = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <label className="mb-4 block max-w-sm text-sm">
        <span className="sr-only">Buscar usuário</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome ou e-mail" className="h-11 w-full rounded-full border border-line bg-white px-4" />
      </label>
      <div className="overflow-x-auto rounded-card bg-white shadow-soft">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Usuários cadastrados</caption>
          <thead className="bg-peach-soft text-xs uppercase tracking-wider text-primary">
            <tr>
              <th scope="col" className="px-4 py-3">Nome</th>
              <th scope="col" className="px-4 py-3">E-mail</th>
              <th scope="col" className="px-4 py-3">Perfil</th>
              <th scope="col" className="px-4 py-3">Desde</th>
              <th scope="col" className="px-4 py-3">Situação</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Ações</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((u) => (
              <tr key={u.uid}>
                <th scope="row" className="px-4 py-3 font-medium">{u.name}</th>
                <td className="px-4 py-3 text-text-muted">{u.email}</td>
                <td className="px-4 py-3"><Badge tone={u.role === 'admin' ? 'primary' : u.role === 'ong' ? 'info' : 'neutral'}>{ROLE[u.role]}</Badge></td>
                <td className="px-4 py-3 text-text-muted">{formatDate(u.createdAt?.slice(0, 10))}</td>
                <td className="px-4 py-3"><Badge tone={u.active ? 'success' : 'danger'}>{u.active ? 'Ativa' : 'Desativada'}</Badge></td>
                <td className="px-4 py-3 text-right">
                  {u.uid !== me?.uid && (
                    <Button size="sm" variant={u.active ? 'ghost' : 'secondary'} onClick={() => (u.active ? setTarget(u) : toggle.mutate({ uid: u.uid, active: true }))}>
                      {u.active ? 'Desativar' : 'Reativar'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        open={!!target}
        onClose={() => setTarget(null)}
        title={`Desativar ${target?.name ?? ''}?`}
        confirmLabel="Desativar conta"
        danger
        loading={toggle.isPending}
        onConfirm={() => target && toggle.mutate({ uid: target.uid, active: false }, { onSuccess: () => setTarget(null) })}
      >
        <p>A pessoa não consegue mais entrar nem agir na plataforma até ser reativada. Os dados continuam guardados.</p>
      </ConfirmModal>
    </>
  );
}
