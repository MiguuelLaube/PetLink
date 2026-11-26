import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { logout, watchAuth } from '@/services/auth';
import { getProfile, updateOwnProfile } from '@/services/users';
import { getOng } from '@/services/ongs';
import { mergeLocalFavorites } from '@/services/favorites';
import type { Ong, UserProfile } from '@/schemas';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ong, setOng] = useState<Ong | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(
    async (u: User | null) => {
      if (!u) {
        setProfile(null);
        setOng(null);
        return;
      }
      // O perfil pode demorar alguns ms para existir logo após o cadastro.
      let p = await getProfile(u.uid);
      for (let i = 0; !p && i < 5; i++) {
        await new Promise((r) => setTimeout(r, 300));
        p = await getProfile(u.uid);
      }
      if (p && !p.active) {
        toast.error('Sua conta está desativada. Fale com a equipe PetLink.');
        await logout();
        return;
      }
      if (p && u.email && p.email !== u.email) {
        await updateOwnProfile(u.uid, { email: u.email }).catch(() => undefined);
      }
      setProfile(p);
      setOng(p?.role === 'ong' && p.ongId ? await getOng(p.ongId) : null);
      if (p?.role === 'user') {
        await mergeLocalFavorites(u.uid).catch(() => undefined);
        qc.invalidateQueries({ queryKey: ['favorites'] });
      }
    },
    [qc],
  );

  useEffect(
    () =>
      watchAuth(async (u) => {
        setLoading(true);
        setUser(u);
        try {
          await load(u);
        } finally {
          setLoading(false);
          if (!u) qc.removeQueries({ predicate: (q) => q.queryKey[0] !== 'public' });
        }
      }),
    [load, qc],
  );

  const refresh = useCallback(() => load(user), [load, user]);
  const value = useMemo(() => ({ user, profile, ong, loading, refresh }), [user, profile, ong, loading, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
