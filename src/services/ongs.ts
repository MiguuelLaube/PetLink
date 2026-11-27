import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import type { Ong, OngProfileInput, OngStatus } from '@/schemas';

const ongsCol = collection(db, 'ongs');

export async function listApprovedOngs(): Promise<Ong[]> {
  const snap = await getDocs(query(ongsCol, where('status', '==', 'aprovada')));
  return snap.docs.map((d) => withId<Ong>(d)).sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
}

export async function listAllOngs(): Promise<Ong[]> {
  const snap = await getDocs(ongsCol);
  return snap.docs.map((d) => withId<Ong>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOng(id: string): Promise<Ong | null> {
  try {
    const snap = await getDoc(doc(db, 'ongs', id));
    return snap.exists() ? withId<Ong>(snap) : null;
  } catch (err) {
    if ((err as { code?: string }).code === 'permission-denied') return null;
    throw err;
  }
}

/** A ONG edita o próprio perfil (CNPJ e status não mudam por aqui). */
export async function updateOngProfile(id: string, data: Omit<OngProfileInput, 'cnpj'>) {
  await updateDoc(doc(db, 'ongs', id), data);
}

export async function setOngStatus(id: string, status: OngStatus, motivoRecusa?: string) {
  await updateDoc(doc(db, 'ongs', id), { status, motivoRecusa: status === 'recusada' ? motivoRecusa ?? '' : null });
}

export async function setOngFeatured(id: string, featured: boolean) {
  await updateDoc(doc(db, 'ongs', id), { featured });
}
