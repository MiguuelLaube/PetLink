import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '@/schemas';

const userRef = (uid: string) => doc(db, 'users', uid);

export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? ({ uid, ...snap.data() } as UserProfile) : null;
}

export async function createAdopterProfile(p: Omit<UserProfile, 'role' | 'active' | 'createdAt'>) {
  const { uid, ...rest } = p;
  await setDoc(userRef(uid), { ...rest, role: 'user', active: true, createdAt: new Date().toISOString() });
}

export async function updateOwnProfile(uid: string, data: Partial<Pick<UserProfile, 'name' | 'phone' | 'email'>>) {
  await updateDoc(userRef(uid), data);
}

export async function listUsers(): Promise<UserProfile[]> {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }) as UserProfile);
}

export async function setUserActive(uid: string, active: boolean) {
  await updateDoc(userRef(uid), { active });
}
