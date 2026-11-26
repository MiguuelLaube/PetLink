import { collection, doc, getDocs, query, updateDoc, where, type WriteBatch } from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import type { AppNotification } from '@/schemas';

const col = collection(db, 'notifications');

export function addNotificationToBatch(batch: WriteBatch, n: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) {
  batch.set(doc(col), { ...n, read: false, createdAt: new Date().toISOString() });
}

export async function listNotifications(uid: string): Promise<AppNotification[]> {
  const snap = await getDocs(query(col, where('recipientUid', '==', uid)));
  return snap.docs.map((d) => withId<AppNotification>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(db, 'notifications', id), { read: true });
}
