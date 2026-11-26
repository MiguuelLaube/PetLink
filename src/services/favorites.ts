import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { readLocal, writeLocal } from '@/lib/storage';

const LOCAL_KEY = 'petlink:favoritos';
const favCol = (uid: string) => collection(db, 'users', uid, 'favorites');

export function readLocalFavorites(): string[] {
  return readLocal<string[]>(LOCAL_KEY, []);
}

export function writeLocalFavorites(ids: string[]) {
  writeLocal(LOCAL_KEY, ids);
}

export async function listFavorites(uid: string): Promise<string[]> {
  const snap = await getDocs(favCol(uid));
  return snap.docs.map((d) => d.id);
}

export async function setFavorite(uid: string, petId: string, on: boolean) {
  const ref = doc(db, 'users', uid, 'favorites', petId);
  if (on) await setDoc(ref, { createdAt: new Date().toISOString() });
  else await deleteDoc(ref);
}

/** Ao entrar, copia os favoritos feitos sem login para a conta. */
export async function mergeLocalFavorites(uid: string) {
  const local = readLocalFavorites();
  if (!local.length) return;
  const batch = writeBatch(db);
  local.forEach((id) => batch.set(doc(db, 'users', uid, 'favorites', id), { createdAt: new Date().toISOString() }));
  await batch.commit();
  writeLocalFavorites([]);
}
