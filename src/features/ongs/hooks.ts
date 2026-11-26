import { useQuery } from '@tanstack/react-query';
import { getOng, listApprovedOngs } from '@/services/ongs';
import { listPetsByOng } from '@/services/pets';

export function useApprovedOngs() {
  return useQuery({ queryKey: ['public', 'ongs'], queryFn: listApprovedOngs, staleTime: 5 * 60_000 });
}

export function useOng(id: string | undefined) {
  return useQuery({ queryKey: ['public', 'ong', id], queryFn: () => getOng(id!), enabled: !!id });
}

export function useOngPublicPets(id: string | undefined) {
  return useQuery({ queryKey: ['public', 'ong', id, 'pets'], queryFn: () => listPetsByOng(id!, true), enabled: !!id });
}
