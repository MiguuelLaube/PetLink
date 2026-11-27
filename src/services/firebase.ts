import { initializeApp, getApps } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';

const env = import.meta.env;
const usingEmulators = env.VITE_USE_EMULATORS === 'true';
const projectId = env.VITE_FIREBASE_PROJECT_ID || 'demo-petlink';

const app =
  getApps()[0] ??
  initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY || 'demo-api-key',
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
    appId: env.VITE_FIREBASE_APP_ID || 'demo-app',
  });

export const auth = getAuth(app);
auth.languageCode = 'pt-BR';
export const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

/** O Storage só é carregado quando alguém envia uma foto (deixa o bundle inicial menor). */
let storagePromise: Promise<import('firebase/storage').FirebaseStorage> | null = null;
export function getAppStorage() {
  storagePromise ??= import('firebase/storage').then(({ getStorage, connectStorageEmulator }) => {
    const storage = getStorage(app);
    // Sem isso o SDK tenta de novo por até 10 min e o formulário parece travado.
    storage.maxUploadRetryTime = 20_000;
    storage.maxOperationRetryTime = 20_000;
    if (usingEmulators) connectStorageEmulator(storage, env.VITE_EMULATOR_HOST || '127.0.0.1', 9199);
    return storage;
  });
  return storagePromise;
}

if (usingEmulators) {
  const host = env.VITE_EMULATOR_HOST || '127.0.0.1';
  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true });
  connectFirestoreEmulator(db, host, 8080);
}
