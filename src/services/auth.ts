import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
  type User,
} from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase';
import { createAdopterProfile } from './users';
import { slugId } from '@/lib/id';
import type { OngProfileInput } from '@/schemas';

export const watchAuth = (cb: (u: User | null) => void) => onAuthStateChanged(auth, cb);

export async function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export const logout = () => signOut(auth);

export async function signUpAdopter(input: { name: string; email: string; phone: string; password: string }) {
  const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
  await updateProfile(cred.user, { displayName: input.name });
  await createAdopterProfile({ uid: cred.user.uid, name: input.name, email: input.email, phone: input.phone });
  return cred.user;
}

/** Cria a conta da ONG: usuário com role 'ong' + ONG pendente, no mesmo batch. */
export async function signUpOng(input: OngProfileInput & { responsible: string; password: string }) {
  const cred = await createUserWithEmailAndPassword(auth, input.email, input.password);
  const uid = cred.user.uid;
  const ongId = slugId(input.name);
  const now = new Date().toISOString();
  const { responsible, password: _pw, ...ong } = input;
  void _pw;
  const batch = writeBatch(db);
  batch.set(doc(db, 'ongs', ongId), { ...ong, ownerUid: uid, status: 'pendente', featured: false, createdAt: now });
  batch.set(doc(db, 'users', uid), {
    name: responsible,
    email: input.email,
    phone: input.phone,
    role: 'ong',
    ongId,
    active: true,
    createdAt: now,
  });
  await batch.commit();
  await updateProfile(cred.user, { displayName: input.name });
  return { uid, ongId };
}

export const requestPasswordReset = (email: string) => sendPasswordResetEmail(auth, email);

async function reauth(currentPassword: string) {
  const user = auth.currentUser;
  if (!user?.email) throw new Error('Entre na sua conta de novo.');
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  return user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const user = await reauth(currentPassword);
  await updatePassword(user, newPassword);
}

/** Envia verificação ao novo e-mail; a troca só vale depois do clique no link. */
export async function changeEmail(currentPassword: string, newEmail: string) {
  const user = await reauth(currentPassword);
  await verifyBeforeUpdateEmail(user, newEmail);
  // O perfil é sincronizado no próximo login, quando o e-mail do Auth já tiver mudado.
}
