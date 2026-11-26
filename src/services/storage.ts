import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

const MAX = 5 * 1024 * 1024;

/** Envia uma imagem para o Storage e devolve a URL pública. */
export async function uploadImage(folder: string, file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Envie apenas imagens (JPG, PNG ou WebP).');
  if (file.size > MAX) throw new Error('Cada foto pode ter no máximo 5 MB.');
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const snap = await uploadBytes(ref(storage, path), file, { contentType: file.type });
  return getDownloadURL(snap.ref);
}
