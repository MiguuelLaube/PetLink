import { collection, doc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';
import { withId } from './helpers';
import { uploadImage } from './storage';
import { addNotificationToBatch } from './notifications';
import type { FosterInput, FosterRequest, Ong } from '@/schemas';

const col = collection(db, 'fosterRequests');
const fosterRef = (id: string) => doc(db, 'fosterRequests', id);
const now = () => new Date().toISOString();

export async function createFosterRequest(
  input: FosterInput,
  photos: File[],
  requester: { uid: string; name: string; email: string },
): Promise<string> {
  const photoUrls = await Promise.all(photos.slice(0, 4).map((f) => uploadImage(`foster/${requester.uid}`, f)));
  const ref = doc(col);
  const { consent: _c, ...data } = input;
  void _c;
  const ts = now();
  await setDoc(ref, {
    ...data,
    photoUrls,
    requesterUid: requester.uid,
    requesterName: requester.name,
    requesterEmail: requester.email,
    status: 'pending',
    createdAt: ts,
    updatedAt: ts,
  });
  return ref.id;
}

export async function listMyFosterRequests(uid: string): Promise<FosterRequest[]> {
  const snap = await getDocs(query(col, where('requesterUid', '==', uid)));
  return snap.docs.map((d) => withId<FosterRequest>(d)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Para a ONG: pedidos pendentes (de todos) + os que ela já tratou. */
export async function listFosterForOng(ongId: string): Promise<FosterRequest[]> {
  const [pending, mine] = await Promise.all([
    getDocs(query(col, where('status', '==', 'pending'))),
    getDocs(query(col, where('handledByOngId', '==', ongId))),
  ]);
  const map = new Map<string, FosterRequest>();
  [...pending.docs, ...mine.docs].forEach((d) => map.set(d.id, withId<FosterRequest>(d)));
  return [...map.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function acceptFoster(req: FosterRequest, ong: Ong) {
  const batch = writeBatch(db);
  batch.update(fosterRef(req.id), {
    status: 'accepted',
    handledByOngId: ong.id,
    handledByOngName: ong.name,
    ongContact: { phone: ong.phone, email: ong.email, address: `${ong.address}, ${ong.city} - ${ong.state}` },
    updatedAt: now(),
  });
  addNotificationToBatch(batch, {
    recipientUid: req.requesterUid,
    type: 'foster_accepted',
    title: `Acolhimento aceito: ${req.petName}`,
    message: `A ${ong.name} vai acolher ${req.petName}. O contato da ONG está em Minha conta › Lar temporário.`,
    relatedId: req.id,
  });
  await batch.commit();
}

export async function declineFoster(req: FosterRequest, ong: Ong, reason: string) {
  const batch = writeBatch(db);
  batch.update(fosterRef(req.id), {
    status: 'declined',
    handledByOngId: ong.id,
    handledByOngName: ong.name,
    rejectionReason: reason,
    updatedAt: now(),
  });
  addNotificationToBatch(batch, {
    recipientUid: req.requesterUid,
    type: 'foster_declined',
    title: `Acolhimento não disponível: ${req.petName}`,
    message: `A ${ong.name} não conseguiu acolher ${req.petName} agora. Motivo: ${reason}`,
    relatedId: req.id,
  });
  await batch.commit();
}
