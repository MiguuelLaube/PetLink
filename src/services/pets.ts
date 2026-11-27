import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import { slugId } from '@/lib/id';
import { todayIso } from '@/lib/dates';
import type { HistoryEntry, Pet, PetInput, PetStatus } from '@/schemas';

const petsCol = collection(db, 'pets');
export const petRef = (id: string) => doc(db, 'pets', id);
const historyCol = (petId: string) => collection(db, 'pets', petId, 'history');

export type NewHistory = Omit<HistoryEntry, 'id' | 'date'>;

export function historyDoc(petId: string) {
  return doc(historyCol(petId));
}

export function historyData(entry: NewHistory) {
  return { ...entry, date: new Date().toISOString() };
}

export async function listPublishedPets(): Promise<Pet[]> {
  const snap = await getDocs(query(petsCol, where('statusPublicacao', '==', 'publicado')));
  return snap.docs.map((d) => withId<Pet>(d));
}

export async function listPetsByOng(ongId: string, onlyPublished: boolean): Promise<Pet[]> {
  const q = onlyPublished
    ? query(petsCol, where('ongId', '==', ongId), where('statusPublicacao', '==', 'publicado'))
    : query(petsCol, where('ongId', '==', ongId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => withId<Pet>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAllPets(): Promise<Pet[]> {
  const snap = await getDocs(petsCol);
  return snap.docs.map((d) => withId<Pet>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPet(id: string): Promise<Pet | null> {
  try {
    const snap = await getDoc(petRef(id));
    return snap.exists() ? withId<Pet>(snap) : null;
  } catch (err) {
    // Pet em análise/recusado é invisível para quem não é dono: tratamos como "não encontrado".
    if ((err as { code?: string }).code === 'permission-denied') return null;
    throw err;
  }
}

export async function listHistory(petId: string): Promise<HistoryEntry[]> {
  const snap = await getDocs(query(historyCol(petId), orderBy('date', 'desc')));
  return snap.docs.map((d) => withId<HistoryEntry>(d));
}

interface Actor {
  name: string;
  uid: string;
}

/** Cadastra um pet da ONG. Sempre entra "em análise" até o admin aprovar. */
export async function createPet(
  input: PetInput,
  ong: { id: string; name: string },
  actor: Actor,
  extra?: { originFosterId?: string },
): Promise<string> {
  const id = slugId(input.name);
  const now = new Date().toISOString();
  const batch = writeBatch(db);
  batch.set(petRef(id), {
    ...input,
    ongId: ong.id,
    ongName: ong.name,
    status: 'Disponível',
    statusPublicacao: 'em_analise',
    motivoRecusa: null,
    entryDate: todayIso(),
    createdAt: now,
    updatedAt: now,
    ...(extra?.originFosterId ? { originFosterId: extra.originFosterId } : {}),
  });
  batch.set(
    historyDoc(id),
    historyData({
      type: extra?.originFosterId ? 'triagem_acolhimento' : 'cadastro_ong',
      title: extra?.originFosterId ? 'Resgatado e acolhido' : 'Cadastrado pela ONG',
      description: extra?.originFosterId
        ? `${input.name} chegou por um pedido de lar temporário e foi acolhido(a) pela ${ong.name}.`
        : `${input.name} foi cadastrado(a) pela ${ong.name} e aguarda análise.`,
      actorName: ong.name,
      actorRole: 'ong',
      actorUid: actor.uid,
    }),
  );
  if (extra?.originFosterId) {
    batch.update(doc(db, 'fosterRequests', extra.originFosterId), { promotedToPetId: id, updatedAt: now });
  }
  await batch.commit();
  return id;
}

/** Edição pela ONG: volta para "em análise". */
export async function updatePet(id: string, input: PetInput, ongName: string, actor: Actor) {
  const batch = writeBatch(db);
  batch.update(petRef(id), {
    ...input,
    statusPublicacao: 'em_analise',
    motivoRecusa: null,
    updatedAt: new Date().toISOString(),
  });
  batch.set(
    historyDoc(id),
    historyData({
      type: 'edicao_dados',
      title: 'Dados atualizados',
      description: 'A ONG atualizou a ficha. As mudanças passam por nova análise antes de aparecer no catálogo.',
      actorName: ongName,
      actorRole: 'ong',
      actorUid: actor.uid,
    }),
  );
  await batch.commit();
}

export async function setPetStatus(id: string, status: PetStatus) {
  await updateDoc(petRef(id), { status, updatedAt: new Date().toISOString() });
}

export async function deletePet(id: string) {
  await deleteDoc(petRef(id));
}

/** Admin publica ou recusa um pet. */
export async function reviewPet(id: string, decision: 'publicado' | 'recusado', actor: Actor, reason?: string) {
  const batch = writeBatch(db);
  batch.update(petRef(id), {
    statusPublicacao: decision,
    motivoRecusa: decision === 'recusado' ? reason ?? '' : null,
    updatedAt: new Date().toISOString(),
  });
  batch.set(
    historyDoc(id),
    historyData({
      type: 'publicacao',
      title: decision === 'publicado' ? 'Publicado no catálogo' : 'Publicação recusada',
      description:
        decision === 'publicado'
          ? 'A ficha foi revisada pela equipe PetLink e está visível para adoção.'
          : `A ficha precisa de ajustes antes de ser publicada. Motivo: ${reason ?? '—'}`,
      actorName: actor.name,
      actorRole: 'admin',
      actorUid: actor.uid,
    }),
  );
  await batch.commit();
}
