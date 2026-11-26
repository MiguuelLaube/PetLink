import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPet, listHistory, listPublishedPets } from '@/services/pets';
import { listFavorites, readLocalFavorites, setFavorite, writeLocalFavorites } from '@/services/favorites';
import { createSolicitation, listMySolicitations } from '@/services/solicitations';
import { friendlyError } from '@/services/helpers';
import { useAuth } from '@/features/auth/AuthContext';
import type { AdoptionQuestionnaire, Pet } from '@/schemas';

export function usePublishedPets() {
  return useQuery({ queryKey: ['public', 'pets'], queryFn: listPublishedPets, staleTime: 60_000 });
}

/** Pets disponíveis para adoção (sem os já adotados). */
export function useAvailablePets() {
  const q = usePublishedPets();
  const data = useMemo(() => q.data?.filter((p) => p.status !== 'Adotado'), [q.data]);
  return { ...q, data };
}

export function usePet(id: string | undefined) {
  return useQuery({ queryKey: ['public', 'pet', id], queryFn: () => getPet(id!), enabled: !!id });
}

export function usePetHistory(id: string | undefined, enabled = true) {
  return useQuery({ queryKey: ['public', 'pet', id, 'history'], queryFn: () => listHistory(id!), enabled: !!id && enabled });
}

/** Favoritos: Firestore quando logado como adotante; localStorage caso contrário. */
export function useFavorites() {
  const { user, profile } = useAuth();
  const remote = user && profile?.role === 'user';
  const q = useQuery({
    queryKey: ['favorites', remote ? user.uid : 'local'],
    queryFn: () => (remote ? listFavorites(user.uid) : Promise.resolve(readLocalFavorites())),
  });
  return useMemo(() => new Set(q.data ?? []), [q.data]);
}

export function useToggleFavorite() {
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const remote = user && profile?.role === 'user';
  const key = ['favorites', remote ? user.uid : 'local'];
  return useMutation({
    mutationFn: async ({ petId, on }: { petId: string; on: boolean }) => {
      if (remote) return setFavorite(user.uid, petId, on);
      const cur = new Set(readLocalFavorites());
      if (on) cur.add(petId);
      else cur.delete(petId);
      writeLocalFavorites([...cur]);
    },
    onMutate: async ({ petId, on }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key) ?? [];
      qc.setQueryData(key, on ? [...new Set([...prev, petId])] : prev.filter((x) => x !== petId));
      return { prev };
    },
    onError: (err, _v, ctx) => {
      qc.setQueryData(key, ctx?.prev);
      toast.error(friendlyError(err));
    },
    onSuccess: (_d, { on }) => toast.success(on ? 'Adicionado aos favoritos' : 'Removido dos favoritos'),
  });
}

export function useMySolicitations() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['solicitations', 'mine', user?.uid], queryFn: () => listMySolicitations(user!.uid), enabled: !!user });
}

export function useCreateSolicitation(pet: Pet) {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: AdoptionQuestionnaire) => createSolicitation(pet, form, user!.uid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['solicitations'] });
      qc.invalidateQueries({ queryKey: ['public', 'pet', pet.id, 'history'] });
    },
  });
}
