import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPet, deletePet, listPetsByOng, setPetStatus, updatePet } from '@/services/pets';
import { approveSolicitation, completeAdoption, listOngSolicitations, markInReview, rejectSolicitation } from '@/services/solicitations';
import { acceptFoster, declineFoster, listFosterForOng } from '@/services/foster';
import { updateOngProfile } from '@/services/ongs';
import { uploadImage } from '@/services/storage';
import { friendlyError } from '@/services/helpers';
import { useAuth } from '@/features/auth/AuthContext';
import type { FosterRequest, OngProfileInput, PetInput, PetStatus, Solicitation } from '@/schemas';

function useOngCtx() {
  const { ong, user, profile, refresh } = useAuth();
  if (!ong || !user || !profile) throw new Error('Sessão da ONG indisponível');
  return { ong, uid: user.uid, profile, refresh };
}

export function useOngPets() {
  const { ong } = useAuth();
  return useQuery({ queryKey: ['ong', ong?.id, 'pets'], queryFn: () => listPetsByOng(ong!.id, false), enabled: !!ong });
}

export function useOngSolicitations() {
  const { ong } = useAuth();
  return useQuery({ queryKey: ['ong', ong?.id, 'solicitations'], queryFn: () => listOngSolicitations(ong!.id), enabled: !!ong });
}

export function useOngFoster() {
  const { ong } = useAuth();
  return useQuery({ queryKey: ['ong', ong?.id, 'foster'], queryFn: () => listFosterForOng(ong!.id), enabled: ong?.status === 'aprovada' });
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['ong'] });
    qc.invalidateQueries({ queryKey: ['public'] });
  };
}

export interface PetFormSubmit {
  input: Omit<PetInput, 'mainImage' | 'galleryImages'>;
  existing: string[];
  files: File[];
  petId?: string;
  originFosterId?: string;
}

/** Envia as fotos novas e cria/atualiza o pet (sempre volta para "em análise"). */
export function useSavePet() {
  const ctx = useOngCtx();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async ({ input, existing, files, petId, originFosterId }: PetFormSubmit) => {
      const uploaded = await Promise.all(files.map((f) => uploadImage(`pets/${ctx.uid}`, f)));
      const images = [...existing, ...uploaded];
      if (!images.length) throw new Error('Envie ao menos uma foto.');
      const full: PetInput = { ...input, mainImage: images[0], galleryImages: images.slice(1, 6) };
      const actor = { uid: ctx.uid, name: ctx.ong.name };
      if (petId) await updatePet(petId, full, ctx.ong.name, actor);
      else await createPet(full, ctx.ong, actor, { originFosterId });
    },
    onSuccess: (_d, v) => {
      toast.success(v.petId ? 'Alterações enviadas para análise.' : 'Pet cadastrado! Ele aparece no catálogo depois da aprovação da equipe PetLink.');
      invalidate();
    },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useSetPetStatus() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: PetStatus }) => setPetStatus(id, status),
    onSuccess: () => { toast.success('Status atualizado.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useDeletePet() {
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: deletePet,
    onSuccess: () => { toast.success('Pet removido.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

type Decision =
  | { kind: 'review'; sol: Solicitation }
  | { kind: 'approve'; sol: Solicitation }
  | { kind: 'reject'; sol: Solicitation; reason: string }
  | { kind: 'complete'; sol: Solicitation; all: Solicitation[] };

export function useDecideSolicitation() {
  const ctx = useOngCtx();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: async (d: Decision) => {
      const actor = { ong: ctx.ong, uid: ctx.uid };
      if (d.kind === 'review') return markInReview(d.sol);
      if (d.kind === 'approve') return approveSolicitation(d.sol, actor);
      if (d.kind === 'reject') return rejectSolicitation(d.sol, d.reason, actor);
      return completeAdoption(d.sol, d.all, actor);
    },
    onSuccess: (_r, d) => {
      const msg = { review: 'Pedido marcado como em análise.', approve: 'Pedido aprovado. O adotante já vê o contato da ONG.', reject: 'Pedido recusado e adotante avisado.', complete: 'Adoção concluída! O pet agora aparece como adotado.' };
      toast.success(msg[d.kind]);
      invalidate();
    },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useDecideFoster() {
  const ctx = useOngCtx();
  const invalidate = useInvalidate();
  return useMutation({
    mutationFn: (d: { req: FosterRequest; accept: boolean; reason?: string }) =>
      d.accept ? acceptFoster(d.req, ctx.ong) : declineFoster(d.req, ctx.ong, d.reason ?? ''),
    onSuccess: (_r, d) => { toast.success(d.accept ? 'Acolhimento aceito. A pessoa já vê o contato da ONG.' : 'Relato recusado e pessoa avisada.'); invalidate(); },
    onError: (e) => toast.error(friendlyError(e)),
  });
}

export function useUpdateOngProfile() {
  const ctx = useOngCtx();
  return useMutation({
    mutationFn: async ({ data, logo }: { data: Omit<OngProfileInput, 'cnpj'>; logo?: File }) => {
      const logoUrl = logo ? await uploadImage(`ongs/${ctx.uid}`, logo) : data.logoUrl;
      await updateOngProfile(ctx.ong.id, { ...data, logoUrl });
      await ctx.refresh();
    },
    onSuccess: () => toast.success('Perfil da ONG atualizado.'),
    onError: (e) => toast.error(friendlyError(e)),
  });
}
