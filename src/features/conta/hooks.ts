import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { listMyFosterRequests } from '@/services/foster';
import { listNotifications, markNotificationRead } from '@/services/notifications';
import { cancelSolicitation } from '@/services/solicitations';
import { changeEmail, changePassword } from '@/services/auth';
import { updateOwnProfile } from '@/services/users';
import { friendlyError } from '@/services/helpers';
import { useAuth } from '@/features/auth/AuthContext';
import type { Solicitation } from '@/schemas';

export function useMyFoster() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['foster', 'mine', user?.uid], queryFn: () => listMyFosterRequests(user!.uid), enabled: !!user });
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({ queryKey: ['notifications', user?.uid], queryFn: () => listNotifications(user!.uid), enabled: !!user });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: markNotificationRead, onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }) });
}

export function useCancelSolicitation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (s: Solicitation) => cancelSolicitation(s),
    onSuccess: () => {
      toast.success('Pedido cancelado.');
      qc.invalidateQueries({ queryKey: ['solicitations'] });
    },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useUpdateProfile() {
  const { user, refresh } = useAuth();
  return useMutation({
    mutationFn: (d: { name: string; phone: string }) => updateOwnProfile(user!.uid, d),
    onSuccess: async () => {
      await refresh();
      toast.success('Dados atualizados.');
    },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export const useChangePassword = () =>
  useMutation({ mutationFn: ({ current, next }: { current: string; next: string }) => changePassword(current, next) });

export const useChangeEmail = () =>
  useMutation({ mutationFn: ({ current, email }: { current: string; email: string }) => changeEmail(current, email) });
