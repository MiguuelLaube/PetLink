import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listAllOngs, setOngFeatured, setOngStatus } from '@/services/ongs';
import { listAllPets, reviewPet } from '@/services/pets';
import { listAllSolicitations } from '@/services/solicitations';
import { listUsers, setUserActive } from '@/services/users';
import { deleteContent, listContent, listInbox, saveContent } from '@/services/content';
import { friendlyError } from '@/services/helpers';
import { useAuth } from '@/features/auth/AuthContext';
import type { NewsItem, OngStatus, Partner, Story } from '@/schemas';

export const useAllOngs = () => useQuery({ queryKey: ['admin', 'ongs'], queryFn: listAllOngs });
export const useAllPets = () => useQuery({ queryKey: ['admin', 'pets'], queryFn: listAllPets });
export const useAllSolicitations = () => useQuery({ queryKey: ['admin', 'solicitations'], queryFn: listAllSolicitations });
export const useUsers = () => useQuery({ queryKey: ['admin', 'users'], queryFn: listUsers });
export const useInbox = (kind: 'donations' | 'sponsorLeads' | 'contactMessages') =>
  useQuery({ queryKey: ['admin', 'inbox', kind], queryFn: () => listInbox(kind) });
export const useContentList = <K extends 'partners' | 'news' | 'stories'>(kind: K) =>
  useQuery({ queryKey: ['public', kind], queryFn: () => listContent(kind) });

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['admin'] });
    qc.invalidateQueries({ queryKey: ['public'] });
  };
}

export function useReviewPet() {
  const { user, profile } = useAuth();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, decision, reason }: { id: string; decision: 'publicado' | 'recusado'; reason?: string }) =>
      reviewPet(id, decision, { uid: user!.uid, name: profile?.name ?? 'Equipe PetLink' }, reason),
    onSuccess: (_r, v) => { toast.success(v.decision === 'publicado' ? 'Pet publicado no catálogo.' : 'Publicação recusada; a ONG verá o motivo.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useSetOngStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: OngStatus; reason?: string }) => setOngStatus(id, status, reason),
    onSuccess: (_r, v) => { toast.success(v.status === 'aprovada' ? 'ONG aprovada.' : 'Status da ONG atualizado.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useToggleFeatured() {
  const invalidate = useInvalidate();
  return useMutation({ mutationFn: ({ id, on }: { id: string; on: boolean }) => setOngFeatured(id, on), onSuccess: invalidate, onError: (e) => toast.error(friendlyError(e)) });
}

export function useSetUserActive() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ uid, active }: { uid: string; active: boolean }) => setUserActive(uid, active),
    onSuccess: (_r, v) => { toast.success(v.active ? 'Conta reativada.' : 'Conta desativada.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

type Kind = 'partners' | 'news' | 'stories';
type Data = Omit<Partner, 'id'> | Omit<NewsItem, 'id'> | Omit<Story, 'id'>;

export function useSaveContent(kind: Kind) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ data, id }: { data: Data; id?: string }) => saveContent(kind, data as never, id),
    onSuccess: () => { toast.success('Conteúdo salvo.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useDeleteContent(kind: Kind) {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (id: string) => deleteContent(kind, id),
    onSuccess: () => { toast.success('Conteúdo removido.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}
